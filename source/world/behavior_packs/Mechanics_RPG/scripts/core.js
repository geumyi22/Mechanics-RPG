import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const nextPrompt = new Map();
const uiBusy = new Set();

function safe(fn) { try { return fn(); } catch (e) { return undefined; } }
function now() { return system.currentTick; }
function level(p) { return safe(() => p.level) ?? 0; }
function cls(p) {
  if (safe(() => p.hasTag("geumyi_class_sword"))) return "sword";
  if (safe(() => p.hasTag("geumyi_class_archer"))) return "archer";
  if (safe(() => p.hasTag("geumyi_class_mage"))) return "mage";
  if (safe(() => p.hasTag("geumyi_class_cleric"))) return "cleric";
  if (safe(() => p.hasTag("geumyi_class_berserker"))) return "berserker";
  if (safe(() => p.hasTag("geumyi_class_assassin"))) return "assassin";
  if (safe(() => p.hasTag("geumyi_class_fighter"))) return "fighter";
  if (safe(() => p.hasTag("geumyi_class_hero"))) return "hero";
  if (safe(() => p.hasTag("geumyi_class_reaper"))) return "reaper";
  if (safe(() => p.hasTag("geumyi_class_sheriff"))) return "sheriff";
  if (safe(() => p.hasTag("geumyi_class_hacker"))) return "hacker";
  return "none";
}
function className(c) {
  if (c === "sword") return "검사";
  if (c === "archer") return "궁수";
  if (c === "mage") return "마법사";
  if (c === "cleric") return "성직자";
  if (c === "berserker") return "광전사";
  if (c === "assassin") return "암살자";
  if (c === "fighter") return "격투가";
  if (c === "hero") return "용사";
  if (c === "reaper") return "사신";
  if (c === "sheriff") return "보안관";
  if (c === "hacker") return "해커";
  return "미전직";
}
function msg(p,t){ safe(()=>p.sendMessage(t)); }

function ensureObjectives(){
  safe(()=>{ if(!world.scoreboard.getObjective("rpg_gold")) world.scoreboard.addObjective("rpg_gold","골드"); });
  safe(()=>{ if(!world.scoreboard.getObjective("rpg_crystal")) world.scoreboard.addObjective("rpg_crystal","크리스탈"); });
}
function score(p,id){
  const obj=safe(()=>world.scoreboard.getObjective(id));
  const ident=safe(()=>p.scoreboardIdentity);
  if(!obj || !ident) return 0;
  return safe(()=>obj.getScore(ident)) ?? 0;
}
function titleName(p){
  if(safe(()=>p.hasTag("geumyi_title_master"))) return "숙련된 영웅";
  if(safe(()=>p.hasTag("geumyi_title_elite"))) return "정예 모험가";
  if(safe(()=>p.hasTag("geumyi_title_beginner"))) return "초보 모험가";
  return "없음";
}
function showHud(p){
  if(safe(()=>p.hasTag("geumyi_skill_ui_lock")) || safe(()=>p.hasTag("geumyi_quest_ui_lock"))) return;
  safe(()=>p.onScreenDisplay.setActionBar(`§e직업: §f${className(cls(p))} §7| §a레벨: §f${level(p)} §7| §6골드: §f${score(p,"rpg_gold")} §7| §b크리스탈: §f${score(p,"rpg_crystal")} §7| §d칭호: §f${titleName(p)}`));
}

function clearClassTags(p){
  safe(()=>p.removeTag("geumyi_class_sword"));
  safe(()=>p.removeTag("geumyi_class_archer"));
  safe(()=>p.removeTag("geumyi_class_mage"));
  safe(()=>p.removeTag("geumyi_class_cleric"));
  safe(()=>p.removeTag("geumyi_class_berserker"));
  safe(()=>p.removeTag("geumyi_class_assassin"));
  safe(()=>p.removeTag("geumyi_class_fighter"));
  safe(()=>p.removeTag("geumyi_class_hero"));
  safe(()=>p.removeTag("geumyi_class_reaper"));
  safe(()=>p.removeTag("geumyi_class_sheriff"));
  safe(()=>p.removeTag("geumyi_class_hacker"));
}
function setClass(p,c,admin=false){
  clearClassTags(p);
  if(c==="sword") safe(()=>p.addTag("geumyi_class_sword"));
  if(c==="archer") safe(()=>p.addTag("geumyi_class_archer"));
  if(c==="mage") safe(()=>p.addTag("geumyi_class_mage"));
  if(c==="cleric") safe(()=>p.addTag("geumyi_class_cleric"));
  if(c==="berserker") safe(()=>p.addTag("geumyi_class_berserker"));
  if(c==="assassin") safe(()=>p.addTag("geumyi_class_assassin"));
  if(c==="fighter") safe(()=>p.addTag("geumyi_class_fighter"));
  if(c==="hero") safe(()=>p.addTag("geumyi_class_hero"));
  if(c==="reaper") safe(()=>p.addTag("geumyi_class_reaper"));
  if(c==="sheriff") safe(()=>p.addTag("geumyi_class_sheriff"));
  if(c==="hacker") safe(()=>p.addTag("geumyi_class_hacker"));
  if(!safe(()=>p.hasTag("geumyi_title_beginner"))) safe(()=>p.addTag("geumyi_title_beginner"));
  nextPrompt.set(p.id,now()+100);
  msg(p,`§6[전직] §f${className(c)}로 전직했습니다.${admin?" §7(테스트)":""}`);
  safe(()=>p.onScreenDisplay.setTitle(`§6${className(c)} 전직 완료!`,{subtitle:"§7전용 장비와 스킬이 곧 지급됩니다.",fadeInDuration:5,stayDuration:35,fadeOutDuration:10}));
}
function resetClass(p){
  clearClassTags(p);
  nextPrompt.set(p.id,now()+20);
  msg(p,"§e[TEST] §f직업 초기화 완료");
}
function setVanillaLevel(p,n){
  try{
    p.resetLevel();
    p.addLevels(n);
    msg(p,`§e[TEST] §f경험치 레벨을 §a${n}§f으로 설정했습니다.`);
    nextPrompt.set(p.id,now()+10);
  }catch(e){
    msg(p,"§c[TEST] Script API 레벨 변경 실패");
  }
}
function classBody(c){
  if(c==="sword") return `§l검사 §r§7<전방 딜러/공격수>§r\n\n검을 사용해 적을 처치 할수있는 직업입니다.\n\n§eLv.10 발도술§r\n전방 2칸을 베어 8데미지 + 공격력 증가 I 15초\n쿨타임 20초\n\n§eLv.40 풍찰만리§r\n전방 약 8칸 돌진하며 적에게 20데미지\n쿨타임 25초\n\n§eLv.70 풍운승천§r\n전방 넓은 범위에 40데미지, 띄우기 + 1초 스턴\n쿨타임 30초\n\n§eLv.100 풍흔만리§r\n10초간 고속 이동·무적, 주변에 매초 20데미지\n쿨타임 50초`;
  if(c==="archer") return `§l궁수 §r§7<후방 딜러/공격수>§r\n\n활과 화살로 적을 처치 할수있는 직업 입니다.\n속도 증가 I이 지속됩니다.\n\n§eLv.10 트리플 샷§r\n3발씩 7회 발사, 화살 1발당 6데미지\n쿨타임 30초\n\n§eLv.40 폭발 화살§r\n30초간 직접 쏜 화살이 적/블록에 닿으면 10데미지 폭발\n효과 종료 뒤 30초 쿨타임\n\n§eLv.70 와이어 화살§r\n최대 20칸, 적 명중 시 35데미지 후 명중 지점으로 빠르게 이동\n쿨타임 25초\n\n§eLv.100 백발백중§r\n강한 적을 우선 추적하는 화살 100발, 1발당 2데미지\n쿨타임 50초`;
  if(c==="mage") return `§l마법사 §r§7<중방 딜러/공격수>§r\n\n마법을 사용해 적을 처치할수 있는 직업입니다. 레벨이 증가 할수록 마법 연산 시간과 쿨타임이 감소 합니다.\n\n§eLv.10 파이어볼§r\n연산 후 가스트형 파이어볼 5발, 1발당 10데미지\n기본 쿨타임 30초 / 연산 2초\n\n§eLv.40 물의 방패§r\n보호막·피해감소·회복·버프 + 주변 적 10데미지 넉백\n기본 쿨타임 40초 / 연산 3초\n\n§eLv.70 가시덩쿨§r\n강한 적 최대 3마리 속박, 10데미지 × 5회\n기본 쿨타임 40초 / 연산 5초\n\n§eLv.100 천둥번개§r\n강한 적 최대 5마리를 대상으로 40데미지 번개 × 5회, 일정 확률 마비\n기본 쿨타임 60초 / 연산 10초`;
  if(c==="cleric") return `§l성직자 §r§7<후방 버퍼/지원수>§r\n\n성경과 빛의 힘으로 아군을 회복·보호하고 모든 몹을 공격합니다.\n\n§f성경책 패시브§r\n반지름 2.5칸 아군 8HP 회복 / 모든 몹 4데미지 / 범위 테두리 파티클\n쿨타임 5초\n\n§eLv.10 빛의 회복§r\n반지름 4칸 아군 24HP 회복 / 모든 몹 8데미지 / 범위 테두리 파티클\n쿨타임 25초\n\n§eLv.30 빛의 방패§r\n자신 포함 최대 3명: 저항 II·속도 I·12HP 회복·황금 체력 14HP\n쿨타임 40초\n\n§eLv.70 빛의 창§r\n빛의 창 3발, 1발당 20데미지 + 20초 이동 방해\n쿨타임 40초\n\n§eLv.100 성스러운 기도§r\n반지름 15칸 고정 성역 10초. 아군 강화/회복 + 파란 Trial 임팩트, 모든 몹은 2초마다 10데미지\n쿨타임 60초`;
  if(c==="berserker") return `§l광전사 §r§7<근접 돌격/폭딜>§r\n\n손도끼로 파고들어 짧은 시간에 큰 피해를 주는 근접 공격수입니다.\n\n§f손도끼 패시브§r\n방패 무력화 + 전방 6칸 초고속 돌진, 피해 없이 적을 약간 밀침\n쿨타임 5초\n\n§eLv.10 광전사의 분노§r\n속도 II·공격력 II 10초 / 최대체력 +8HP 30초 + 즉시 8HP 회복 / 주황 Trial 임팩트\n쿨타임 35초\n\n§eLv.30 내려찍기§r\n3~4칸 도약 후 착지. 스킬 도약 낙하피해 면역 / 반지름 3칸 20데미지 + 띄우기\n쿨타임 30초\n\n§eLv.70 토네이도§r\n5초간 5회전(1초마다 1회). 반지름 3.5칸, 회전당 25데미지\n쿨타임 30초\n\n§eLv.100 미쳐 날뛰기§r\n가장 강한 적에게 돌진해 10초간 난타, 총 200데미지\n쿨타임 50초`;
  if(c==="assassin") return `§l암살자 §r§7<후방 딜러/공격수>§r

아무도 모르게 뒤로 돌아가 적을 뒤에서 처리합니다. 다들 뒤를 조심하세요!

§f단검 패시브§r
적의 뒤를 공격하면 피해 2배

§f은신 침투 패시브§r
투명화 상태일 때 몬스터의 공격을 받지 않음. 공격하면 암살 준비의 은신이 즉시 해제됨

§eLv.10 암살 준비§r
완전 은신 10초 + 공격력 증가 II 20초
쿨타임 40초

§eLv.30 암살 이동§r
가장 가까운 적의 뒤로 순간 이동 + 20데미지 + 이동 중 무적 + 대상 1초 방향 봉쇄 + 이동속도 I 10초
쿨타임 10초

§eLv.70 독기체 암살§r
반경 12칸 구형 독구름을 10초간 유지. 범위 안 적에게 초당 4데미지 + 둔화 II·채굴 피로 III 20초
쿨타임 40초

§eLv.100 단체 암살§r
강한 적부터 순간 이동하며 총 400데미지를 분배. 적이 죽으면 다음 적으로 이동, 최대 5대상
쿨타임 50초`;
  if(c==="fighter") return `§l격투가 §r§7<전방 근접 딜러/지속전>§r

건틀릿과 투지로 빠르게 파고들어 연속 공격을 이어가는 근접 전투가입니다.
레벨 10/30/50/70/100마다 최대 체력 +2. 자연 체력 회복 속도 2배.

§f철권·투지 패시브§r
건틀릿 적중 시 투지 +1(최대 10). 스택당 이동속도가 증가하며, 10스택에서 일반공격 피해 1.5배. 5초간 공격하지 않으면 투지가 1씩 감소합니다. Shift로 현재 투지를 확인할 수 있습니다.

§eLv.10 순보§r
바라보는 방향으로 약 7칸 돌진. 적 충돌 시 15데미지 + 넉백 + 투지 2스택
쿨타임 8초

§eLv.30 붕권§r
0.7초 충전 후 정면 단일 적 강타. 순보 적중 직후에는 즉시 발동. 투지를 전부 소모해 45~80데미지
쿨타임 20초

§eLv.70 난타§r
가까운 적을 고정하고 8연타 후 마무리 일격. 붕권 적중 후에는 탐색/추적 범위 강화. 총 100데미지, 완주 시 순보 쿨타임 초기화
쿨타임 30초

§eLv.100 한계돌파§r
15초간 투지 10스택 고정·속도 II·공격력 II·받는 피해 30% 감소. 순보/붕권/난타 쿨타임 단축 + 연계 유효시간 증가. 종료 시 반경 5칸 30데미지
쿨타임 75초`;
  if(c==="hero") return `§l용사 §r§7<전방 탱커/공방수>§r

용맹한 마음으로 적에게 돌진하여 팀원의 사기를 북돋아 줍니다. 가끔 너무 과하지만요!

§f용사의 검 패시브§r
6초간 방패를 꺼내 든 시각 모션으로 방어합니다. 플레이어 인벤토리/보조손 아이템은 건드리지 않으며, 이동속도가 느려지고 전방 원거리 공격 반사·근거리 피해 차단·밀치기 효과는 그대로 유지됩니다.
쿨타임 20초

§eLv.10 용맹한 전사의 마음§r
반경 6칸 아군에게 이동속도 I·공격력 I 20초 + 용맹 3
쿨타임 40초

§eLv.40 강타§r
넓은 전방을 베어 30데미지 + 넉백 + 적중한 적 1마리당 용맹 3
쿨타임 40초

§eLv.70 패링§r
20초간 원거리 공격 전부 반사. 근거리 공격은 75% 확률로 피해를 무효화하고 공격자에게 45데미지. 사용 시 용맹 5
쿨타임 50초

§eLv.100 용맹한 기사의 용기§r
용맹은 최대 30이며 0/6/12/18/24/30 단계로 강화됩니다. 현재 스택에 따라 30초 버프를 얻고 스택을 0으로 초기화. 최대 8칸 내 적에게 접근하고 5칸 내에서는 1초마다 전방 160°를 20데미지로 반자동 베기. Shift로 현재 용맹 확인
쿨타임 65초`;

  if(c==="reaper") return `§l사신 §r§7<중반 딜러/공격수>§r

죽인 생명체의 영혼을 흡수하여 적을 공격하고 회복하며 적을 처리합니다.

§f사신의 대낫 <0렙>§r
대낫 평타 적중 시 75% 확률로 실제 피해량의 10%를 회복합니다. 사용 시 정면 140°를 붉은 참격으로 베어 20데미지를 줍니다.
무기 스킬 쿨타임 5초

§f영혼 방출·영혼 저장§r
사신이 생명체를 처치하면 영혼이 100% 생성됩니다. 처치 대상의 최대 체력 20당 영혼 1개(20 미만은 최소 1개)가 20초간 남으며, 가까이 가서 흡수할 수 있습니다. 최대 100개까지 보관합니다.

§eLv.10 영혼 흡수§r
영혼 3개를 소비해 반지름 10칸의 영혼을 즉시 흡수하고 공격력·이동속도·점프력을 I로 10초간 강화합니다.
쿨타임 20초

§eLv.40 사신의 복병§r
최대 8칸을 빠르게 돌진하며 궤도상의 적에게 25데미지. 입힌 피해의 30% 회복.
영혼 5 / 쿨타임 20초

§eLv.70 사신의 학살§r
대낫이 손잡이 끝을 축으로 360° 회전하며 전방으로 날아갑니다. 명중 또는 도달 지점에서 붉은 원 둘레 연출을 유지하며 4바퀴 회전하고, 매 바퀴마다 반지름 9칸 내부의 각 적에게 55데미지(대상당 최대 220). 입힌 피해의 40% 회복.
영혼 10 / 쿨타임 30초

§eLv.100 사신의 심판§r
시전자의 영혼 기운이 솟은 뒤 붉은 파동이 반지름 14칸까지 빠르게 확장됩니다. 체력 40 이하 적은 즉시 영혼으로 변환, 그보다 높은 적은 40데미지 + 5데미지 × 5회 지속 피해·실명·이동속도 증가. 이후 가장 강한 생존 적 앞으로 이동해 긴 대낫 참격으로 100데미지 + 출혈 10초 총 70데미지. 입힌 피해의 20%를 회복하고 초과 회복은 최대 한 줄의 추가 체력으로 30초 유지.
영혼 15 / 쿨타임 45초`;

  if(c==="sheriff") return `§l보안관 §r§7<중반 딜러/공격수>§r

서부 시대에 활동했던 보안관입니다. 강한 탄환을 가지고 있지만 잔탄 수가 한정되어 있어 신중하게 적을 처치합니다.

§f리볼버 <0렙>§r
6발 장전. 철 조각으로 리볼버 탄환을 제작하며 빈 탄환만 재장전합니다. 한 발당 20데미지 / 헤드샷 1.75배 / 일반 발사 간격 0.5초. 공격력 증가 효과는 탄환에도 적용됩니다. 가만히 조준할수록 사거리가 늘어나 최대 50칸. 벽은 관통하지 않습니다. Shift로 수동 재장전하며 0발이면 강제 재장전됩니다.

§f현상 수배 <0렙>§r
주변 적 하나가 노란 표식의 수배범으로 지정됩니다. 직접 처치하면 적의 강함에 따른 골드 또는 랜덤 버프를 획득합니다. 처치 후 20초 뒤 새 수배범이 등장하며, 40초 동안 처치하지 못하면 대상이 변경됩니다.

§eLv.10 속사§r
2초 안에 현재 리볼버에 남은 탄환을 모두 빠르게 발사하고 잠시 재장전 속도가 크게 증가합니다.
쿨타임 30초

§eLv.40 끈§r
Shift로 올가미/채찍/와이어 모드를 변경합니다. 모드 변경 쿨타임 20초.
- 올가미: 10칸, 대상을 2칸 앞까지 끌어와 5초간 공격·이동·회복 봉쇄 / 쿨타임 35초
- 채찍: 전방 160°·5칸에 20데미지 / 쿨타임 40초
- 와이어: 바라보는 방향으로 빠르게 이동 / 쿨타임 20초

§eLv.70 리볼버 강화§r
즉시 6/6 장전. 10초간 리볼버 피해 2배(기본 40), 헤드샷 배율 추가 ×1.5, 재장전 속도 대폭 증가. 강화탄은 작은 노란 탄도 궤적.
쿨타임 55초

§eLv.100 데드 아이§r
2초간 가장 강한 적을 추적하고 1초간 카메라로 보여준 뒤, 10초간 받는 모든 피해 +50% 디버프를 부여합니다. 현재 잔탄을 모두 소비해 1발당 20데미지의 보라색 유도탄으로 집중 공격합니다.
쿨타임 65초`;
  if(c==="hacker") return `§l해커 §r§7<중간 디버퍼/전술가>§r

적의 정보를 파악하고 약점을 분석해 아군의 치명적인 공격을 돕는 전술 직업입니다.
가끔 심취했을 때 건드리면 무사하지 못하니 조심하세요… 아 그리고 서¥%£%#£%£^

§f컴퓨터 <0렙>§r
반지름 10칸으로 파란 탐지 파동을 방출합니다. 적 위치를 10초간 파란 마커로 표시하고 실제 공격 피해량 -20%를 10초간 적용합니다. 해킹 스택 +1은 20초간 유지됩니다.
쿨타임 25초

§eLv.10 취약점 스캔§r
2초 해킹 후 반지름 20칸 파동. 적의 실제 공격 피해량 -35%, 이동속도 -20%를 적용하고 해킹 스택 +2를 50초간 부여합니다.
쿨타임 30초 / 해킹시간 2초

§eLv.40 XXS§r
3.5초 해킹 후 반지름 30칸 안에서 해킹 스택 5 이상인 모든 적에게 20데미지 + 5초 행동 금지. 스택은 소비하지 않고 각 스택의 시간 만료로만 사라집니다.
쿨타임 40초 / 해킹시간 3.5초

§eLv.70 Impair Defenses§r
5초 해킹 후 반지름 30칸 안에서 해킹 스택 7 이상인 적의 체력 증가를 제외한 주요 버프와 모든 회복을 25초간 차단합니다. 기존 버프는 잠시 보관했다가 종료 후 복원합니다. 해킹 스택 +5는 60초간 유지되고 25데미지를 줍니다.
쿨타임 50초 / 해킹시간 5초

§eLv.100 랜섬 웨어&DDoS§r
7초 해킹 후 반지름 20칸에서 해킹 스택 20 이상인 가장 강한 적 1명을 선택합니다. 10초 행동 금지 후 3초 동안 총 50타·300데미지의 트래픽 공격을 퍼붓습니다.
쿨타임 70초 / 해킹시간 7초`;
  return "직업 정보가 없습니다.";
}

async function confirmClass(p,c){
  let r;
  try{
    r=await new ActionFormData()
      .title(`전직 - ${className(c)}`)
      .body(classBody(c))
      .button("§a이 직업 선택")
      .button("§7돌아가기")
      .show(p);
  }catch(e){ nextPrompt.set(p.id,now()+40); return; }
  if(r.canceled){ nextPrompt.set(p.id,now()+100); return; }
  if(r.selection===1){ system.runTimeout(()=>showClassMenu(p,true),2); return; }
  let q;
  try{
    q=await new ActionFormData()
      .title("최종 확인")
      .body(`정말 §e${className(c)}§r 직업으로 전직하시겠습니까?\n\n§c선택한 뒤에는 쉽게 바꿀 수 없습니다.`)
      .button("§a전직하기")
      .button("§7취소")
      .show(p);
  }catch(e){ nextPrompt.set(p.id,now()+40); return; }
  if(!q.canceled && q.selection===0) setClass(p,c,false);
  else nextPrompt.set(p.id,now()+100);
}

async function showClassMenu(p,manual=false){
  if(uiBusy.has(p.id)) return;
  if(cls(p)!=="none") { if(manual) msg(p,"§7이미 전직 상태입니다. class_reset 후 다시 열어주세요."); return; }
  if(level(p)<10 && !manual){ return; }
  uiBusy.add(p.id);
  try{
    const r=await new ActionFormData()
      .title("§6전직 선택")
      .body(`§f현재 마인크래프트 경험치 Lv.${level(p)}\n직업을 선택해주세요.`)
      .button("§c검사\n§7전방 딜러/공격수")
      .button("§a궁수\n§7후방 딜러/공격수")
      .button("§d마법사\n§7중방 딜러/공격수")
      .button("§e성직자\n§7후방 버퍼/지원수")
      .button("§4광전사\n§7근접 돌격/폭딜")
      .button("§8암살자\n§7후방 딜러/공격수")
      .button("§6격투가\n§7전방 근접 딜러/지속전")
      .button("§b용사\n§7전방 탱커/공방수")
      .button("§4사신\n§7중반 딜러/공격수")
      .button("§6보안관\n§7중반 딜러/공격수")
      .button("§3해커\n§7중간 디버퍼/전술가")
      .show(p);
    if(r.canceled){ nextPrompt.set(p.id,now()+100); return; }
    const c=r.selection===0?"sword":r.selection===1?"archer":r.selection===2?"mage":r.selection===3?"cleric":r.selection===4?"berserker":r.selection===5?"assassin":r.selection===6?"fighter":r.selection===7?"hero":r.selection===8?"reaper":r.selection===9?"sheriff":r.selection===10?"hacker":null;
    if(c) system.runTimeout(()=>confirmClass(p,c),2);
  }catch(e){
    nextPrompt.set(p.id,now()+40);
    if(manual) msg(p,"§c직업창을 열지 못했습니다. 채팅/다른 화면을 닫고 잠시 후 다시 시도해주세요.");
  }finally{ uiBusy.delete(p.id); }
}

system.run(()=>{
  ensureObjectives();
  world.sendMessage("§a[CORE] §fMechanics RPG v1.2.0 코어 시작");
});

system.runInterval(()=>{
  for(const p of world.getAllPlayers()){
    try{
      if(p.hasTag("geumyi_diag_status")){
        p.removeTag("geumyi_diag_status");
        msg(p,`§a[CORE OK] §fLv.${level(p)} / 직업: ${className(cls(p))}`);
      }
      for(const n of [10,30,40,50,70,100]){
        const t=`geumyi_set_level_${n}`;
        if(p.hasTag(t)){ p.removeTag(t); setVanillaLevel(p,n); }
      }
      if(p.hasTag("geumyi_force_sword")){p.removeTag("geumyi_force_sword");setClass(p,"sword",true);}
      if(p.hasTag("geumyi_force_archer")){p.removeTag("geumyi_force_archer");setClass(p,"archer",true);}
      if(p.hasTag("geumyi_force_mage")){p.removeTag("geumyi_force_mage");setClass(p,"mage",true);}
      if(p.hasTag("geumyi_force_cleric")){p.removeTag("geumyi_force_cleric");setClass(p,"cleric",true);}
      if(p.hasTag("geumyi_force_berserker")){p.removeTag("geumyi_force_berserker");setClass(p,"berserker",true);}
      if(p.hasTag("geumyi_force_assassin")){p.removeTag("geumyi_force_assassin");setClass(p,"assassin",true);}
      if(p.hasTag("geumyi_force_fighter")){p.removeTag("geumyi_force_fighter");setClass(p,"fighter",true);}
      if(p.hasTag("geumyi_force_hero")){p.removeTag("geumyi_force_hero");setClass(p,"hero",true);}
      if(p.hasTag("geumyi_force_reaper")){p.removeTag("geumyi_force_reaper");setClass(p,"reaper",true);}
      if(p.hasTag("geumyi_force_sheriff")){p.removeTag("geumyi_force_sheriff");setClass(p,"sheriff",true);}
      if(p.hasTag("geumyi_force_hacker")){p.removeTag("geumyi_force_hacker");setClass(p,"hacker",true);}
      if(p.hasTag("geumyi_reset_class")){p.removeTag("geumyi_reset_class");resetClass(p);}
      if(p.hasTag("geumyi_open_class")){
        p.removeTag("geumyi_open_class");
        nextPrompt.set(p.id,now()+10);
        system.runTimeout(()=>showClassMenu(p,true),10);
      }
      showHud(p);
      if(level(p)>=10 && cls(p)==="none" && now()>=(nextPrompt.get(p.id)??0)){
        nextPrompt.set(p.id,now()+100);
        system.runTimeout(()=>showClassMenu(p,false),10);
      }
    }catch(e){}
  }
},5);
