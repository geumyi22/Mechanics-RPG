> **중요 / 2026-10-10:** 이 문서는 당시 중세 마을 자동 건축 계획의 과거 스냅샷입니다. 현재 계획으로 사용하지 마세요. **최신 결정은 [CURRENT-WORLD-WORK.md](CURRENT-WORLD-WORK.md)**: 후지가 직접 마을 제작, Side Nature v4 미승인, 현 작업은 GitHub 문서 정리뿐입니다.

# Mechanics RPG — Medieval Village v3 / Next-Chat Handoff
**Recorded:** 2026-10-10  
**Project:** `geumyi22/Mechanics-RPG` (Minecraft Bedrock RPG)  
**Status:** DESIGN REVIEW / PRE-BUILD. Do **not** begin rebuilding the world until the user explicitly says **시작** in the new chat.

> IMPORTANT: This document is a *handoff snapshot of user decisions*, **not a claim that the listed test binaries were pushed or that the repository's source tree was updated**. The repository's main README presently describes v1.4.48 as the source/release baseline. Conversation-generated v1.4.100 / v2.4 / city v0.1 assets are **separate local test artifacts**, not promoted to main/source or Release, with in-game Bedrock E2E NOT RUN.

## 1. User's actual goal / latest decisions

The user wants a **beautiful, walkable, authentic MEDIEVAL settlement on additional terrain next to the existing adventure wilderness**. The current layout of a small single "home" at the starting clearing was a misunderstanding; reject it. A sprawling 768×768 first-generation city was built as a TEST, but the user judged the houses boxy, repetitive, too large, structurally sloppy, with straight roads, ugly fountain and unknown/unrendered blocks. **This old city is NOT APPROVED.** Do not just add more copies of those buildings.

Requirements for the re-design:
1. **Choose quality over area.** New village need not be 768×768. Scale down to a village that feels lived-in if necessary (tentative around 400–500 blocks, not a hard requirement; user explicitly allowed scaling).
2. **Traditional medieval**, NO magic towers, enchanted architecture, futuristic/cyber elements; magic will be used elsewhere later.
3. **Approved reference selections:** ordinary houses **B, C, D**; important one-off buildings **E, F, G, H**. **Reference images themselves are not confirmed accessible from this GitHub doc**. Before implementing, reacquire/inspect actual B–H visuals; do NOT invent their shapes or functions from letter labels.
4. Houses small and detailed, e.g. typical ~7×9 to 11×13 blocks (only initial sizing guideline), variants that read as individual buildings, 1–2 levels; timber, stone foundations, windows, proper roofs/overhangs, chimney/entrance/interiors. Distinct footprints, heights, spacing and orientation.
5. Organic winding roads, narrow alleys, gradual elevation transitions. No giant orthogonal grid or uniformly arranged cloned houses. Compact village center with a small stone well (instead of the previous unnatural giant fountain).
6. Enclose village with a **medieval defensive wall** and believable gates/towers, **but leave real walkable landscape OUTSIDE the wall** (foothills, rural fields, natural wandering/exploration trails).
7. **Mountains on the side(s)** of the added region, blended with terrain. **Connect wilderness and village by an open road / natural mountain pass, NOT the old tunnel through the mountain.** Preserve most of original adventure terrain.
8. **Guild + training grounds: RESERVED EMPTY LAND**, no buildings/decor/NPC yet. Previously proposed NE village location; keep it clearly reserved for future construction, exact plot to finalize during new layout.
9. Use **vanilla Bedrock-recognized block IDs/states**; test palette and actual block rendering. Avoid mystery blocks, broken structures, oversized houses, impossible doors/stairs.
10. Do not alter the completed RPG class/reaper, sheriff revolver, swordsman katana/combat, or subspace systems without new request. They were explicitly confirmed **DONE** by user.
11. Maintain original adventure biome/river/mountains/forests, gameplay packs, time cycle, spawn system, items and positions. Keep mob spawn bounds for adventure separate from protected town; check night-specific sanctuary rules.
12. The user asked the assistant to **study Minecraft medieval construction and Bedrock world/block validity first**. Research and establish an agreed house prototype + validation plan before new build. No new world modification since the latest redesign conversation.

## 2. Previous test baselines (not promoted to GitHub main)

**Last working test gameplay world to derive NEW village from:**
- `Mechanics_RPG_Nature_v2.4_DAYNIGHT_SPAWN_v0.1.2_RPG_v1.4.100_DEADEYE_DAYLIGHT_TEST.mcworld`
- SHA256 `25ea13dbf8845cf087c0db746f7c3254046f165c6e192d19c8c5830e6f198c93`
- 754416 bytes, from prior chat attachment / generated runtime, not necessarily persisted in this repository.
- Adventure terrain v2.4 is approximately X,Z = -176..175 (352×352). RPG v1.4.100 with day-night spawn v0.1.2, sheriff Deadeye target allocation, hacker starting-level buffs/icon distinctness; day/night cycle enabled. Live E2E unverified.
- Original player spawn around `(48,80,-31)`; another central coordinate `(11.46,85.02,-102.26)`.

**Rejected / reference-only large city prototype:**
- `Mechanics_RPG_v1.4.100_MEDIEVAL_CITY_768x768_v0.1_TEST.mcworld` (also same bytes as .zip)
- SHA256 `628bd3485f37501495f8a9b843649745c08618708d8fb7c01088ee265888d959`
- 1,178,481 bytes; adjacent region X176..943, Z-384..383; wall X253..873, Z-320..320; 115 generic buildings, market stalls 20, farms 12, wall towers 36. This generated city does NOT meet user aesthetic criteria.
- `Mechanics_RPG_Medieval_Grand_City_v0.1_SOURCE_AND_REPORTS.zip` SHA256 `bef6a8e0b45e6a3e294ec6a8ee960ef2c92e41749cfff42a5d5952159c8f8504`; prior prototype Python builder/report and layout.
- Initial bad prototype connecting wilderness via long/narrow mountain tunnel must be abandoned.
- The prior city test had only static/ZIP checks, not genuine Bedrock runtime E2E.

## 3. Important gameplay invariants from user conversation

- **Adventure RPG spawn control only inside X/Z roughly -167..167**, min spawn Y60, check ground and headroom, never inside blocks or outside the bounds. Day animal spawn more frequent, at night no new animal spawn and hostile spawning expands to the usual daytime animal zones.
- **Night-only 15-block-radius sanctuary** around each of `(11.46,85.02,-102.26)` and `(48.01,80.82,-33.41)`; daytime normal spawning allowed. Sanctuary prevents new hostile spawns, not physical mob entry.
- Spider hostile web ability ~10-sec cooldown; self-hit avoidance. Daylight progression must stay enabled.
- Sheriff Deadeye: 6 total shots; weak nearby mobs => distribute among up to 6 targets (one shot each if 6+); strong mob => concentration. Do not unintentionally rebalance damage/cooldowns.
- Hacker: early computer attacks deal Lv0-9 7HP, Lv10-19 8HP, Lv20+ 9HP; computer cooldown 6s; vulnerability scan 6HP to up to 5 targets, cooldown 25s, with existing debuffs, high-level skills untouched. Skill icons made visually distinct. **These are prior test implementations, not verified full production release.**

## 4. Next-chat build process / acceptance gates

1. Verify GitHub source status and obtain actual latest LOCAL test world files from the user/accessible attachments. **Do not confuse the GitHub v1.4.48 main source with uncommitted 1.4.100 chat artifacts.**
2. Verify actual B/C/D/E/F/G/H chosen reference images and map adjacency; study current Bedrock-supported block names/states & medieval house building examples.
3. Present a smaller top-down simple planning schematic with irregular street network, blank NE guild/training plot, mountainsides, open pass to the old wilderness, complete wall and external walking loop. Get user approval. User prefers schematic map, not a decorative generated map illustration, for reviewing plans.
4. Produce/validate **one quality prototype house** in a test clone before mass replication. Show actual world/block-derived preview; do not represent concept art as screenshot.
5. Build distinct small houses and important structures with intentional details, acceptable scale, sensible roof/door/stair orientations; not identical repeated blocks. Keep road winding and fountain/well small.
6. Keep a separate untouched original `.mcworld`. Use unique world ID/name so imports do not collide. Never overwrite user's world or existing repo release.
7. Static checks: recognized Bedrock block palette, door/stair orientation, entrance walkability, save/reload chunk readback, town/guild reserve clearance, adventure world data diff, pack checksums, ZIP CRC. **State actual in-game E2E as NOT RUN until user confirms it.**
8. New artifact and changelog, and GitHub commit only after reviewing approval/testing rules.

## 5. GitHub state / checkpoint semantics

- Repository: https://github.com/geumyi22/Mechanics-RPG
- Do not treat this planning document as production implementation.
- The user's current request on 2026-10-10: **save a handoff to GitHub before opening a new ChatGPT conversation**, not build or redo the village right now.
- Generated `.mcworld` / `.zip` binaries were previously supplied as ChatGPT attachments in this conversation. **They were not uploaded by this checkpoint.** New chat may require user to attach the correct original test `.mcworld`, or retrieval from their saved local copy, before edits.
