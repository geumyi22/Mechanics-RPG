# Project Status

기준일: 2026-09-29

## GitHub

- Repository: `geumyi22/Mechanics-RPG`
- Visibility: Public
- Default branch: `main`
- Development branch: `dev`
- Documentation baseline: configured
- CI workflow: configured
- Release workflow: configured
- Issue / PR templates: configured

## v1.4.20 local baseline evidence

```text
Files: 257
JSON: 84 PASS
JavaScript: 7 PASS
Item texture entries: 52
Particle JSON: 3
PNG: 93
ZIP CRC: PASS
Re-extracted file hashes: 257/257 MATCH
Generated .zip/.mcworld: BYTE-IDENTICAL
Bedrock E2E: NOT RUN
```

## GitHub source state

`source/world/` actual baseline import is still pending.

Tracking:
- #1 v1.4.20 source baseline import
- #2 bounty target marker
- #3 Dead Eye homing bullets
- #4 sheriff ammo UX
- #5 first full Bedrock E2E

## Important

CI/Release code existing in the repository does not imply the game source or Bedrock runtime has been validated. The validation job is designed to skip while the baseline source is absent.
