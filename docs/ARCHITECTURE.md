# Architecture

## 패키지 루트

`source/world/`가 실제 `.mcworld` 압축 루트가 됩니다.

### Behavior Pack

예정 경로:
`source/world/behavior_packs/Mechanics_RPG/`

주요 영역:
- `manifest.json`
- `scripts/`
- `items/`
- `entities/`
- `functions/`
- `recipes/`

v1.4.20 script entry는 `scripts/main.js`입니다.

주요 모듈:
- `core.js`
- `skills.js`
- `quest.js`
- `shop.js`
- `sunlight.js`
- `sheriff.js`

### Resource Pack

예정 경로:
`source/world/resource_packs/Mechanics_RPG_Resources/`

주요 영역:
- item/entity textures
- models
- animations
- particles
- render controllers
- texts

### World linkage

- `world_behavior_packs.json`
- `world_resource_packs.json`

두 파일의 UUID/version은 BP/RP manifest와 일치해야 합니다.
