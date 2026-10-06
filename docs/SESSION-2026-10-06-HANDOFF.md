# Mechanics RPG — Session Handoff 2026-10-06

## Current baseline

- Formal main release: v1.4.48 SAFE GUARD — full Bedrock E2E NOT RUN
- Last full release-gate E2E PASS: v1.4.20
- Current working snapshot: v1.4.62_REVOLVER_BACK2_MORE
- Working branch: handoff/2026-10-06-v1.4.62
- Exact local v1.4.62 artifact SHA-256: a08717a4cfe0b9790dbf979554b7e04226bcd704588c53c0fd2c5518b2f1a132
- v1.4.62 package static result: JSON 92 PASS / ZIP CRC PASS / Bedrock runtime E2E NOT RUN

## Weapon state

Reaper scythe third person:
- rotation X=260°
- position [0,-4,-10]

Sheriff revolver third person:
- rotation X=355°
- position [0,-8,2]

Both custom transforms apply to third person only. First-person paths must not be changed.

User decision on 2026-10-06:
- Scythe position tuning is finished.
- Revolver position tuning is finished.
- Do not modify either transform unless explicitly requested again.

## Discarded prototype

The experimental class prototype added after v1.4.62 was discarded by user request.
It is not part of the current working baseline and must not be resumed, packaged, released, or treated as an active version unless the user explicitly requests it again.

## Preserve

- Existing Reaper mechanics and skills
- Existing Sheriff mechanics
- quest / shop / status / sunlight systems
- Subspace v3 save system and SAFE GUARD
- Existing first-person weapon behavior
- No completion or stability claims without real Bedrock E2E

## Validation boundary

Current working target is v1.4.62.
Static/package evidence from the original v1.4.62 artifact remains recorded above.
Bedrock runtime E2E for the current working snapshot is NOT RUN.

## Next start point

Continue only from v1.4.62_REVOLVER_BACK2_MORE.
Do not resume the discarded experimental class prototype unless the user explicitly asks for it again.
