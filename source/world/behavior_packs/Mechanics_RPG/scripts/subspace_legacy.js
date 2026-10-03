import {world,system,ItemStack} from "@minecraft/server";
import {ActionFormData} from "@minecraft/server-ui";
const KEY="geumyi:subspace_v1",SIZE=27;
const busy=new Set();
function container(p){return p.getComponent("minecraft:inventory")?.container;}
function read(p){try{const a=JSON.parse(p.getDynamicProperty(KEY)||"[]");return Array.isArray(a)?a.slice(0,SIZE):[];}catch{return [];}}
function write(p,a){p.setDynamicProperty(KEY,JSON.stringify(a));}
function notice(p,s){try{p.sendMessage(s);}catch{}}
function canStore(it){
 if(!it||it.amount<1||it.amount>64||it.maxAmount===1||it.typeId==="geumyi:subspace")return false;
 if(it.typeId.includes("shulker_box")||it.typeId.includes("bundle"))return false;
 if(it.nameTag||it.getLore?.()?.length)return false;
 // Restrict to ordinary stackable items. Metadata/enchanted/durability items are excluded
 // to avoid silently losing custom item data during JSON persistence.
 try{if(it.getComponent("minecraft:enchantable")?.getEnchantments?.()?.length)return false;}catch{return false;}
 try{if(it.getComponent("minecraft:durability"))return false;}catch{return false;}
 return true;
}
function label(it){return it?`${it.id.replace("minecraft:","").replace("geumyi:","")} ×${it.n}`:"빈 슬롯";}
function slots(p){const c=container(p),a=[];if(!c)return a;for(let i=0;i<c.size;i++){const it=c.getItem(i);if(canStore(it))a.push({i,id:it.typeId,n:it.amount});}return a;}
async function home(p){if(!p.isValid)return;const a=read(p);const f=new ActionFormData().title("§5아공간 §7(27칸)").body("§7내 아이템을 안전하게 보관하는 개인 창고");
 for(let i=0;i<SIZE;i++)f.button(`§d${i+1}. §f${label(a[i])}`);
 f.button("§a인벤토리에서 넣기");const r=await f.show(p);if(r.canceled)return;
 if(r.selection===SIZE)return depositMenu(p);
 if(r.selection>=0&&r.selection<SIZE)return withdraw(p,r.selection);
}
async function depositMenu(p){const available=slots(p);const f=new ActionFormData().title("§5아공간 · 넣기").body("§7일반 중첩 아이템만 보관 가능");
 for(const it of available)f.button(`${it.id} ×${it.n}`);
 f.button("§7뒤로");const r=await f.show(p);if(r.canceled)return;
 if(r.selection===available.length)return home(p);
 const selected=available[r.selection];if(!selected)return;
 if(busy.has(p.id))return;busy.add(p.id);
 try{const c=container(p),it=c?.getItem(selected.i),a=read(p);if(!it||it.typeId!==selected.id||!canStore(it))return;
 let dest=a.findIndex(x=>x?.id===it.typeId&&x.n+it.amount<=64);
 if(dest<0)dest=Array.from({length:SIZE},(_,i)=>i).find(i=>!a[i]);
 if(dest===undefined){notice(p,"§c아공간이 가득 찼어.");return;}
 const old=it.clone(),n=it.amount;
 c.setItem(selected.i,undefined);
 try{a[dest]={id:it.typeId,n:(a[dest]?.n||0)+n};write(p,a);}
 catch(e){c.setItem(selected.i,old);throw e;}
 notice(p,`§a보관 완료: ${it.typeId} ×${n}`);
 }catch(e){notice(p,`§c보관 실패: ${String(e)}`);}finally{busy.delete(p.id);}
 return home(p);
}
async function withdraw(p,i){if(busy.has(p.id))return;busy.add(p.id);
 try{const a=read(p),saved=a[i],c=container(p);if(!saved||!c)return home(p);
 const item=new ItemStack(saved.id,saved.n);
 // Container.addItem returns leftover, which must never be silently discarded.
 const old={...saved};a[i]=null;
 write(p,a);
 try{const leftover=c.addItem(item);
  if(leftover){a[i]={id:saved.id,n:leftover.amount};write(p,a);notice(p,`§e일부만 꺼냈어. 남은 ${leftover.amount}개는 아공간에 보관됨.`);}
  else notice(p,`§a꺼내기 완료: ${saved.id} ×${saved.n}`);
 }catch(e){a[i]=old;write(p,a);throw e;}
 }catch(e){notice(p,`§c꺼내기 실패: ${String(e)}`);}finally{busy.delete(p.id);}
 return home(p);
}

export function openLegacySubspace(player) { return home(player); }
