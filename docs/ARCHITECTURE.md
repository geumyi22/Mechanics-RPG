# Architecture — Mechanics RPG

현재 main은 **v1.4.48 SAFE GUARD** source 기준입니다. exact-package Bedrock 전체 E2E는 NOT RUN입니다.

## 패키지 트리
- source/world/ : .mcworld로 압축되는 루트
- source/world/behavior_packs/Mechanics_RPG/ : manifest.json, scripts/, items/, entities/, functions/, recipes/
- source/world/resource_packs/Mechanics_RPG_Resources/ : textures/, models/, animations/, particles/, render_controllers/, texts/
- source/world/level.dat, level.dat_old, levelname.txt
- source/world/world_behavior_packs.json, world_resource_packs.json

스크립트 진입점은 behavior pack의 scripts/main.js 입니다.

## 기준/무결성
- BP/RP version: 1.4.48; min engine: 1.26.50
- @minecraft/server 2.9.0, @minecraft/server-ui 2.1.0
- BP/RP manifest의 UUID/version과 world pack linkage가 일치해야 합니다.
- SOURCE-MANIFEST.json: source/world **294개 파일** 경로/크기/SHA256 추적.
- 마지막 full release-gate E2E PASS: **v1.4.20**.

## 별도 월드 시험
채팅에서 만든 자연 지형 v2.4 + RPG v1.4.100, 중세 마을 STAGE 1/2, Side Nature v1~v4는 정식 repo source/Release에 포함되지 않았습니다. 최신 월드 작업 현황: [CURRENT-WORLD-WORK.md](CURRENT-WORLD-WORK.md).
