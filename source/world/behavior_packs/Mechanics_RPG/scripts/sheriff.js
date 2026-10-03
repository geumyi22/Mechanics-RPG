import { world, system, EquipmentSlot, EntityDamageCause } from "@minecraft/server";

const AMMO_KEY="geumyi:sheriff_ammo_v1";
const BUNDLE_ID="geumyi:sheriff_bullet_bundle";
const MAX_AMMO=6;
const BASE_DAMAGE=10;
const BASE_HEADSHOT=1.75;
const REVOLVER_FIRE_TICKS=10; // 0.5s - 일반 사격만 감속 (속사는 별도 간격 유지)
const NORMAL_RELOAD_TICKS=48; // 2.4s
const FAST_RELOAD_TICKS=16; // 0.8s

const cooldowns=new Map();
const reloading=new Map();
const lastShot=new Map();
const stationary=new Map();
const quickReloadUntil=new Map();
const enhancedUntil=new Map();
const sheriffBusyUntil=new Map();
const sheriffClassSeen=new Map();
const ropeMode=new Map();
const ropeSneakPrev=new Map();
const revolverSneakPrev=new Map();
const bountyState=new Map();
const lassoLocks=new Map();
const deadEyeDebuffs=new Map();
const uiSeq=new Map();

function safe(fn,fallback=undefined){try{const v=fn();return v===undefined?fallback:v;}catch{return fallback;}}
function now(){return system.currentTick;}
function isSheriff(p){return !!safe(()=>p.hasTag("geumyi_class_sheriff"),false);}
function level(p){return safe(()=>p.level,0)??0;}
function msg(p,t){safe(()=>p.sendMessage(t));}
function bar(p,t,duration=45){const seq=(uiSeq.get(p.id)??0)+1;uiSeq.set(p.id,seq);safe(()=>{p.addTag("geumyi_skill_ui_lock");p.onScreenDisplay.setActionBar(t);});system.runTimeout(()=>{if(uiSeq.get(p.id)!==seq)return;safe(()=>p.removeTag("geumyi_skill_ui_lock"));},duration);}
function sound(p,id,pitch=1,volume=1){safe(()=>p.playSound(id,{pitch,volume}));}
function areaSound(p,id,pitch=1,volume=1,r=40,loc){const c=loc??p.location;for(const q of world.getAllPlayers()){try{if(q.dimension.id!==p.dimension.id)continue;const dx=q.location.x-c.x,dy=q.location.y-c.y,dz=q.location.z-c.z;if(Math.hypot(dx,dy,dz)>r)continue;q.playSound(id,{pitch,volume});}catch{}}}
function particle(dim,id,loc){safe(()=>dim.runCommand(`particle ${id} ${loc.x.toFixed(2)} ${loc.y.toFixed(2)} ${loc.z.toFixed(2)}`));}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function targetable(e){try{if(!e||e.typeId==="minecraft:player")return false;const x=["minecraft:armor_stand","minecraft:villager","minecraft:villager_v2","minecraft:wandering_trader","minecraft:npc","minecraft:item","minecraft:xp_orb","minecraft:painting","geumyi:reaper_soul","geumyi:reaper_scythe_projectile","geumyi:reaper_massacre_orbit"];if(x.includes(e.typeId)||e.typeId.includes("arrow")||e.typeId.includes("projectile"))return false;return!!e.getComponent("minecraft:health");}catch{return false;}}
function health(e){return safe(()=>e.getComponent("minecraft:health")?.currentValue,-1)??-1;}
function maxHealth(e){const h=safe(()=>e.getComponent("minecraft:health"));return Math.max(1,Number(h?.effectiveMax??h?.defaultValue??h?.currentValue??20));}
function targetPoint(e){const h=safe(()=>e.getHeadLocation());if(h)return{x:h.x,y:h.y-.32,z:h.z};return{x:e.location.x,y:e.location.y+1,z:e.location.z};}
function mainhand(p){return safe(()=>p.getComponent("minecraft:equippable")?.getEquipment(EquipmentSlot.Mainhand));}
function ammo(p){const n=Number(safe(()=>p.getDynamicProperty(AMMO_KEY),MAX_AMMO));return Number.isFinite(n)?clamp(Math.floor(n),0,MAX_AMMO):MAX_AMMO;}
function setAmmo(p,n,show=false){const v=clamp(Math.floor(n),0,MAX_AMMO);safe(()=>p.setDynamicProperty(AMMO_KEY,v));if(show)bar(p,`§6리볼버 §f잔탄 §e${v}/${MAX_AMMO}`,35);return v;}
function key(p,id){return `${p.id}:${id}`;}
function cdLeft(p,id){return Math.max(0,Math.ceil(((cooldowns.get(key(p,id))??0)-now())/20));}
function startCd(p,id,sec){cooldowns.set(key(p,id),now()+Math.round(sec*20));}
function isBusy(p){return (sheriffBusyUntil.get(p.id)??0)>now();}
function busyLeft(p){return Math.max(0,((sheriffBusyUntil.get(p.id)??0)-now())/20);}
function beginBusy(p,sec){sheriffBusyUntil.set(p.id,now()+Math.round(sec*20));}
function clearBusy(p){sheriffBusyUntil.delete(p.id);}
function validateSkill(p,id,lv,cd,name){if(!isSheriff(p)){bar(p,"§c보안관 전용 스킬입니다.");return false;}if(level(p)<lv){bar(p,`§c${name}: Lv.${lv}에 해금됩니다.`);return false;}if(reloading.has(p.id)){bar(p,"§c재장전 중에는 사용할 수 없습니다.");return false;}if(isBusy(p)){bar(p,`§c다른 보안관 스킬 사용 중입니다. §7(${busyLeft(p).toFixed(1)}초)`);return false;}const left=cdLeft(p,id);if(left>0){bar(p,`§c${name} 쿨타임 ${left}초`);return false;}return true;}

function inventory(p){return safe(()=>p.getComponent("minecraft:inventory")?.container);}
function countItem(p,typeId){const c=inventory(p);if(!c)return 0;let n=0;for(let i=0;i<c.size;i++){const it=safe(()=>c.getItem(i));if(it?.typeId===typeId)n+=Number(it.amount??0);}return n;}
function consumeItem(p,typeId,count){const c=inventory(p);if(!c||count<=0)return 0;let remain=count,used=0;for(let i=0;i<c.size&&remain>0;i++){const it=safe(()=>c.getItem(i));if(!it||it.typeId!==typeId)continue;const take=Math.min(remain,Number(it.amount??0));if(take<=0)continue;const left=Number(it.amount??0)-take;if(left<=0)safe(()=>c.setItem(i,undefined));else{it.amount=left;safe(()=>c.setItem(i,it));}remain-=take;used+=take;}return used;}
function reloadTicks(p){return (quickReloadUntil.get(p.id)??0)>now()||(enhancedUntil.get(p.id)??0)>now()?FAST_RELOAD_TICKS:NORMAL_RELOAD_TICKS;}
function beginReload(p,forced=false){
  if(!isSheriff(p)||reloading.has(p.id))return false;
  const cur=ammo(p),missing=MAX_AMMO-cur;
  if(missing<=0){if(!forced)bar(p,"§7리볼버가 이미 6/6 장전되어 있습니다.");return false;}
  const singles=countItem(p,"geumyi:sheriff_bullet"),nuggets=countItem(p,"minecraft:iron_nugget");
  const availableSingles=singles+nuggets;
  // Single rounds always have priority. A six-pack is consumed only for an empty cylinder,
  // so it cannot silently discard its unused rounds.
  const bundle=availableSingles===0&&cur===0&&countItem(p,BUNDLE_ID)>0;
  const load=bundle?6:Math.min(missing,availableSingles);
  if(load<=0){bar(p,cur>0?"§c남은 탄을 소모한 뒤 묶음 탄약을 사용해 줘.":"§c탄환이 없어 재장전할 수 없습니다.",55);return false;}
  const ticks=Math.max(1,reloadTicks(p)-(bundle?2:0)); // 0.12 sec ≈ 2.4 ticks; round to 2 ticks (0.10 s)
  const st={end:now()+ticks,planned:load,bundle,ticks};reloading.set(p.id,st);
  safe(()=>p.addEffect("slowness",ticks+5,{amplifier:1,showParticles:false}));sound(p,"random.bow",.55,.35);
  const h=system.runInterval(()=>{try{
    if(reloading.get(p.id)!==st){system.clearRun(h);return;}
    bar(p,`§7재장전 중... §f${Math.min(100,Math.round((1-(st.end-now())/ticks)*100))}% §8| §e${ammo(p)}/6`,8);
    if(now()<st.end)return;
    system.clearRun(h);let used=0;
    if(st.bundle){if(ammo(p)===0&&consumeItem(p,BUNDLE_ID,1)===1)used=6;}
    else {used=consumeItem(p,"geumyi:sheriff_bullet",st.planned);if(used<st.planned)used+=consumeItem(p,"minecraft:iron_nugget",st.planned-used);}
    setAmmo(p,ammo(p)+used,false);reloading.delete(p.id);
    sound(p,"random.anvil_use",1.7,.32);bar(p,`§a재장전 완료! §e${ammo(p)}/6 §7(${st.bundle?"묶음 탄약":`${used}발`})`,50);
  }catch{safe(()=>system.clearRun(h));reloading.delete(p.id);}},2);
  return true;
}

function passableBlock(id){if(!id)return true;if(id==="minecraft:air"||id==="minecraft:cave_air"||id==="minecraft:void_air"||id==="minecraft:water")return true;return id.includes("grass")||id.includes("flower")||id.includes("fern")||id.includes("vine")||id.includes("sapling")||id.includes("mushroom")||id.includes("torch")||id.includes("snow_layer");}
function wallDistance(dim,origin,dir,maxRange){for(let s=.35;s<=maxRange;s+=.30){const p={x:origin.x+dir.x*s,y:origin.y+dir.y*s,z:origin.z+dir.z*s};const b=safe(()=>dim.getBlock({x:Math.floor(p.x),y:Math.floor(p.y),z:Math.floor(p.z)}));if(b&&!passableBlock(b.typeId))return Math.max(.2,s-.20);}return maxRange;}
function rayMetric(origin,dir,point){const dx=point.x-origin.x,dy=point.y-origin.y,dz=point.z-origin.z,t=dx*dir.x+dy*dir.y+dz*dir.z;if(t<=0)return{t,perp:999};const px=origin.x+dir.x*t,py=origin.y+dir.y*t,pz=origin.z+dir.z*t;return{t,perp:Math.hypot(point.x-px,point.y-py,point.z-pz)};}
function rayTarget(p,maxRange){const origin=safe(()=>p.getHeadLocation())??{x:p.location.x,y:p.location.y+1.6,z:p.location.z},dir=p.getViewDirection(),wall=wallDistance(p.dimension,origin,dir,maxRange);let best=null;const list=safe(()=>p.dimension.getEntities({location:origin,maxDistance:maxRange+2}),[])??[];for(const e of list){if(!targetable(e))continue;const head=safe(()=>e.getHeadLocation())??{x:e.location.x,y:e.location.y+1.6,z:e.location.z};const body={x:e.location.x,y:(e.location.y+head.y)*.5,z:e.location.z};const bm=rayMetric(origin,dir,body),hm=rayMetric(origin,dir,head);const bodyRadius=Math.max(.52,Math.min(.86,(head.y-e.location.y)*.36));const headRadius=Math.max(.42,Math.min(.58,(head.y-e.location.y)*.22));const bodyHit=bm.t>0&&bm.t<=wall&&bm.t<=maxRange&&bm.perp<=bodyRadius;const headHit=hm.t>0&&hm.t<=wall&&hm.t<=maxRange&&hm.perp<=headRadius;if(!bodyHit&&!headHit)continue;const hitT=headHit?hm.t:bm.t;if(!best||hitT<best.distance)best={entity:e,distance:hitT,headshot:headHit};}return{origin,dir,wall,hit:best};}
function trajectory(dim,origin,dir,end,particleId){for(let s=.8;s<=end;s+=1.05)particle(dim,particleId,{x:origin.x+dir.x*s,y:origin.y+dir.y*s,z:origin.z+dir.z*s});}
function currentRange(p){const st=stationary.get(p.id);const ticks=st?.ticks??0;return Math.round(Math.min(70,30+(ticks/20)*8));}
function gunSound(p,kind="normal"){const strong=kind==="deadeye";areaSound(p,"random.bow",strong?.82:.68,strong?.72:.58,42);areaSound(p,"random.explode",strong?1.48:1.72,strong?.26:.16,42);}
function strengthBonus(p){const e=safe(()=>p.getEffect("strength"));return e?3*(Number(e.amplifier??0)+1):0;}
function selectRevolver(p){const c=inventory(p);if(!c)return false;for(let i=0;i<Math.min(9,c.size);i++){const it=safe(()=>c.getItem(i));if(it?.typeId==="geumyi:sheriff_revolver"){safe(()=>{p.selectedSlotIndex=i;});return true;}}return false;}
function doShot(p,{damage=BASE_DAMAGE,headMult=BASE_HEADSHOT,particleId="minecraft:endrod",range=currentRange(p),deadeye=false}={}){const rt=rayTarget(p,range),end=Math.min(range,rt.hit?.distance??rt.wall);trajectory(p.dimension,rt.origin,rt.dir,end,particleId);gunSound(p,deadeye?"deadeye":"normal");if(!rt.hit)return{hit:false,headshot:false,damage:0};const final=(damage+strengthBonus(p))*(rt.hit.headshot?headMult:1);safe(()=>rt.hit.entity.applyDamage(final,{cause:EntityDamageCause.entityAttack,damagingEntity:p}));particle(p.dimension,rt.hit.headshot?"minecraft:critical_hit_emitter":"minecraft:basic_smoke_particle",targetPoint(rt.hit.entity));return{hit:true,headshot:rt.hit.headshot,damage:final,target:rt.hit.entity};}
function shootRevolver(p,ignoreCooldown=false){if(!isSheriff(p)){bar(p,"§c보안관 전용 리볼버입니다.");return false;}if(reloading.has(p.id)){bar(p,"§c재장전 중입니다.");return false;}if(isBusy(p)){bar(p,"§c보안관 스킬 사용 중에는 직접 사격할 수 없습니다.");return false;}const t=now();if(!ignoreCooldown&&t-(lastShot.get(p.id)??-999)<REVOLVER_FIRE_TICKS)return false;let a=ammo(p);if(a<=0){beginReload(p,true);return false;}lastShot.set(p.id,t);a=setAmmo(p,a-1,false);const enhanced=(enhancedUntil.get(p.id)??0)>t,damage=enhanced?BASE_DAMAGE*2:BASE_DAMAGE,headMult=enhanced?BASE_HEADSHOT*1.5:BASE_HEADSHOT,part=enhanced?"geumyi:sheriff_yellow_trail":"minecraft:endrod";const r=doShot(p,{damage,headMult,particleId:part});if(r.headshot)bar(p,`§e🎯 헤드샷! §f${r.damage.toFixed(r.damage%1?1:0)}데미지 §8| §6잔탄 ${a}/${MAX_AMMO}`,55);else bar(p,`§6리볼버 §f잔탄 §e${a}/${MAX_AMMO} §8| §7유효 사거리 ${currentRange(p)}칸`,35);if(a<=0)system.runTimeout(()=>{if(isSheriff(p)&&ammo(p)===0&&!isBusy(p))beginReload(p,true);},3);return true;}

function castQuickdraw(p){system.run(()=>selectRevolver(p));
  if(!validateSkill(p,"sheriff_quickdraw",10,30,"속사"))return;
  const rounds=ammo(p);
  if(rounds<=0){bar(p,"§c속사에 사용할 탄환이 없습니다.");beginReload(p,true);return;}
  startCd(p,"sheriff_quickdraw",30);
  beginBusy(p,2.15);
  quickReloadUntil.set(p.id,now()+160);
  safe(()=>p.onScreenDisplay.setTitle("§6§l속사",{subtitle:`§f현재 ${rounds}발 전탄 발사`,fadeInDuration:2,stayDuration:14,fadeOutDuration:6}));
  areaSound(p,"random.anvil_use",1.65,.34,36);
  const spacing=Math.max(3,Math.floor(38/Math.max(1,rounds)));
  for(let i=0;i<rounds;i++) system.runTimeout(()=>{
    try{
      if(!isSheriff(p))return;
      const cur=ammo(p);if(cur<=0)return;
      setAmmo(p,cur-1,false);
      const enhanced=(enhancedUntil.get(p.id)??0)>now();
      doShot(p,{damage:enhanced?BASE_DAMAGE*2:BASE_DAMAGE,headMult:enhanced?BASE_HEADSHOT*1.5:BASE_HEADSHOT,particleId:enhanced?"geumyi:sheriff_yellow_trail":"minecraft:endrod",range:currentRange(p)});
      bar(p,`§6속사! §f${i+1}/${rounds} §8| §e잔탄 ${ammo(p)}/${MAX_AMMO}`,18);
      if(i===rounds-1){clearBusy(p);system.runTimeout(()=>{if(ammo(p)===0)beginReload(p,true);},2);}
    }catch{}
  },i*spacing);
}

const ROPE_NAMES=["올가미","채찍","와이어"];
function currentRopeMode(p){return clamp(Number(ropeMode.get(p.id)??0),0,2);}
function cycleRopeMode(p){if(!isSheriff(p)||level(p)<40)return;const left=cdLeft(p,"sheriff_rope_mode");if(left>0){bar(p,`§6끈 모드: §f${ROPE_NAMES[currentRopeMode(p)]} §7| 변경 ${left}초`,50);return;}const next=(currentRopeMode(p)+1)%3;ropeMode.set(p.id,next);startCd(p,"sheriff_rope_mode",20);msg(p,`§6[끈] §f모드 변경 → §e${ROPE_NAMES[next]}`);bar(p,`§6끈 모드: §e${ROPE_NAMES[next]}`,55);sound(p,"random.click",1.25,.6);}
function coneTargets(p,r,deg){const d=p.getViewDirection(),hl=Math.hypot(d.x,d.z)||1,v={x:d.x/hl,z:d.z/hl},cs=Math.cos(deg*Math.PI/360),out=[];for(const e of safe(()=>p.dimension.getEntities({location:p.location,maxDistance:r+.7}),[])??[]){if(!targetable(e))continue;const dx=e.location.x-p.location.x,dz=e.location.z-p.location.z,l=Math.hypot(dx,dz)||1;if((dx/l)*v.x+(dz/l)*v.z>=cs)out.push(e);}return out;}
function whipFx(p,r=5,deg=160){const d=p.getViewDirection(),base=Math.atan2(d.z,d.x),half=deg*Math.PI/360;for(let i=0;i<23;i++){const q=i/22,a=base-half+q*half*2;particle(p.dimension,i%3===0?"minecraft:totem_particle":"minecraft:endrod",{x:p.location.x+Math.cos(a)*r,y:p.location.y+.7+Math.sin(q*Math.PI)*.5,z:p.location.z+Math.sin(a)*r});}areaSound(p,"random.sweep",.72,.75,32);}
function castLasso(p){const left=cdLeft(p,"sheriff_lasso");if(left>0){bar(p,`§c올가미 쿨타임 ${left}초`);return;}const rt=rayTarget(p,10),t=rt.hit?.entity;if(!t){bar(p,"§7올가미가 적을 붙잡지 못했습니다.");return;}startCd(p,"sheriff_lasso",35);const d=p.getViewDirection(),hl=Math.hypot(d.x,d.z)||1,anchor={x:p.location.x+d.x/hl*2,y:p.location.y,z:p.location.z+d.z/hl*2};safe(()=>t.teleport(anchor,{dimension:p.dimension,checkForBlocks:false}));safe(()=>t.clearVelocity());safe(()=>t.addTag("geumyi_sheriff_lasso_stunned"));safe(()=>t.addEffect("slowness",105,{amplifier:255,showParticles:false}));safe(()=>t.addEffect("weakness",105,{amplifier:255,showParticles:false}));const st={entity:t,anchor,until:now()+100};lassoLocks.set(t.id,st);for(let s=.6;s<=Math.min(10,rt.hit.distance);s+=.7)particle(p.dimension,"minecraft:totem_particle",{x:rt.origin.x+rt.dir.x*s,y:rt.origin.y+rt.dir.y*s,z:rt.origin.z+rt.dir.z*s});areaSound(p,"random.bow",.48,.7,32);bar(p,"§6올가미! §f대상을 2칸 앞까지 끌어와 5초간 제압",60);}
function castWhip(p){const left=cdLeft(p,"sheriff_whip");if(left>0){bar(p,`§c채찍 쿨타임 ${left}초`);return;}startCd(p,"sheriff_whip",40);let hits=0;for(const e of coneTargets(p,5,160)){if(safe(()=>e.applyDamage(20,{cause:EntityDamageCause.entityAttack,damagingEntity:p}),false)!==false)hits++;}whipFx(p,5,160);bar(p,`§6채찍! §f전방 160° · 5칸 · 20데미지 · 적중 ${hits}명`,50);}
function wirePoint(p,max=20){const o=safe(()=>p.getHeadLocation())??{x:p.location.x,y:p.location.y+1.6,z:p.location.z},d=p.getViewDirection(),w=wallDistance(p.dimension,o,d,max);const end=Math.max(2,Math.min(max,w-.65));return{x:o.x+d.x*end,y:o.y+d.y*end,z:o.z+d.z*end};}
function pullPlayer(p,to){let t=0;const h=system.runInterval(()=>{try{const dx=to.x-p.location.x,dy=to.y-(p.location.y+.7),dz=to.z-p.location.z,l=Math.hypot(dx,dy,dz);if(++t>22||l<1){system.clearRun(h);return;}p.clearVelocity();const s=Math.min(1.12,.62+l*.032);p.applyImpulse({x:dx/l*s,y:dy/l*s,z:dz/l*s});particle(p.dimension,"minecraft:endrod",{x:p.location.x,y:p.location.y+.8,z:p.location.z});}catch{safe(()=>system.clearRun(h));}},1);}
function castWire(p){const left=cdLeft(p,"sheriff_wire");if(left>0){bar(p,`§c와이어 쿨타임 ${left}초`);return;}startCd(p,"sheriff_wire",20);const to=wirePoint(p,20),o=safe(()=>p.getHeadLocation())??p.location,d=p.getViewDirection(),len=dist(o,to);for(let s=.5;s<=len;s+=.75)particle(p.dimension,"minecraft:endrod",{x:o.x+d.x*s,y:o.y+d.y*s,z:o.z+d.z*s});pullPlayer(p,to);areaSound(p,"random.bow",1.7,.65,32);bar(p,"§b와이어! §f바라보는 방향으로 이동",45);}
function castRope(p){system.run(()=>selectRevolver(p));if(!validateSkill(p,"sheriff_rope",40,0,"끈"))return;const mode=currentRopeMode(p);if(mode===0)castLasso(p);else if(mode===1)castWhip(p);else castWire(p);}

function castEnhance(p){system.run(()=>selectRevolver(p));if(!validateSkill(p,"sheriff_enhance",70,55,"리볼버 강화"))return;startCd(p,"sheriff_enhance",55);setAmmo(p,MAX_AMMO,false);enhancedUntil.set(p.id,now()+200);quickReloadUntil.set(p.id,now()+200);safe(()=>p.onScreenDisplay.setTitle("§e§l리볼버 강화",{subtitle:"§f10초 · 피해 2배 · 헤드샷 배율 추가 ×1.5 · 초고속 재장전",fadeInDuration:3,stayDuration:25,fadeOutDuration:8}));areaSound(p,"random.levelup",1.18,.8,40);bar(p,"§e리볼버 강화! §f즉시 6/6 장전 · 강화탄은 노란 궤적",65);}

function strongestTarget(p,r=35){const list=(safe(()=>p.dimension.getEntities({location:p.location,maxDistance:r}),[])??[]).filter(targetable);list.sort((a,b)=>{const m=maxHealth(b)-maxHealth(a);if(Math.abs(m)>.01)return m;const h=health(b)-health(a);if(Math.abs(h)>.01)return h;return dist(p.location,a.location)-dist(p.location,b.location);});return list[0];}
function markDeadEyeTarget(p,t){const tp=targetPoint(t);particle(p.dimension,"minecraft:dragon_breath_trail",{x:tp.x,y:tp.y+.18,z:tp.z});}
function deadEyeChargeFx(t,phase=0){try{const c=targetPoint(t);const count=8;for(let i=0;i<count;i++){const a=(Math.PI*2*i)/count+(phase*.31),r=.48+((i+phase)%3)*.28;particle(t.dimension,"minecraft:totem_particle",{x:c.x+Math.cos(a)*r,y:c.y-.22+((i+phase)%4)*.24,z:c.z+Math.sin(a)*r});}particle(t.dimension,"minecraft:totem_particle",{x:c.x,y:c.y+.22+(phase%3)*.08,z:c.z});}catch{}}
function showTargetCamera(p,t){try{const q=targetPoint(t),dx=p.location.x-t.location.x,dz=p.location.z-t.location.z,l=Math.hypot(dx,dz)||1,x=t.location.x+dx/l*4.6,z=t.location.z+dz/l*4.6,y=t.location.y+2.8;p.runCommand(`camera @s set minecraft:free ease 0.15 linear pos ${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)} facing ${q.x.toFixed(2)} ${q.y.toFixed(2)} ${q.z.toFixed(2)}`);system.runTimeout(()=>safe(()=>p.runCommand("camera @s clear")),20);}catch{}}
function pointBlocked(dim,pos){const b=safe(()=>dim.getBlock({x:Math.floor(pos.x),y:Math.floor(pos.y),z:Math.floor(pos.z)}));return !!(b&&!passableBlock(b.typeId));}
function deadEyeMarked(t){const st=deadEyeDebuffs.get(t?.id);return !!(st&&st.until>now());}
function guaranteedDeadEyeDamage(p,t,raw){const opts={cause:EntityDamageCause.entityAttack,damagingEntity:p};const accepted=safe(()=>t.applyDamage(raw,opts),false);if(accepted!==false)return true;const hc=safe(()=>t.getComponent("minecraft:health"));if(!hc||typeof hc.setCurrentValue!=="function")return false;const cur=Number(safe(()=>hc.currentValue,0)??0),mult=deadEyeMarked(t)?1.5:1,amount=raw*mult;if(cur<=0||amount<=0)return false;const min=Number(safe(()=>hc.effectiveMin,0)??0);safe(()=>hc.setCurrentValue(Math.max(min,cur-amount)));return true;}
function homingDeadEyeBullet(p,t,index){
  if(!targetable(t)||health(t)<=0)return;
  const start=safe(()=>p.getHeadLocation())??{x:p.location.x,y:p.location.y+1.6,z:p.location.z};
  let pos={...start},ticks=0;
  gunSound(p,"deadeye");
  const h=system.runInterval(()=>{try{
    if(!targetable(t)||health(t)<=0||p.dimension.id!==t.dimension.id||++ticks>90){system.clearRun(h);return;}
    const aim=targetPoint(t),dx=aim.x-pos.x,dy=aim.y-pos.y,dz=aim.z-pos.z;
    const length=Math.hypot(dx,dy,dz)||.001,step=Math.min(1.55,length);
    const dir={x:dx/length,y:dy/length,z:dz/length};
    const next={x:pos.x+dir.x*step,y:pos.y+dir.y*step,z:pos.z+dir.z*step};
    // Sample the path, not just the destination, to prevent clipping through walls.
    for(let k=.2;k<=step+.001;k+=.2){const d=Math.min(k,step),v={x:pos.x+dir.x*d,y:pos.y+dir.y*d,z:pos.z+dir.z*d};
      if(pointBlocked(p.dimension,v)){particle(p.dimension,"minecraft:basic_smoke_particle",v);system.clearRun(h);return;}}
    pos=next;
    particle(p.dimension,"minecraft:dragon_breath_trail",pos);
    if(length>1.55)return;
    system.clearRun(h);
    const raw=(30+strengthBonus(p))*BASE_HEADSHOT;
