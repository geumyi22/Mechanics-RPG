# Development Handoff

기준일: 2026-10-04

## 현재 고정 기준

- `main`: **v1.4.48 SAFE GUARD stable**
- source baseline: `source/world/`
- source manifest: `SOURCE-MANIFEST.json`
- baseline file count: **294**
- CI: static/package 검증
- Release: manifest version과 릴리즈 버전 정합성 유지
- v1.4.48 exact-package full Bedrock E2E: **NOT RUN**

## 절대 보존

- `geumyi:subspace_v3_head`
- `geumyi:subspace_v3_stage`
- `geumyi:subspace_v3_journal`
- 사신 대낫 승인 1인칭
- 보안관 리볼버 정상 1인칭
- 기존 정상 직업/퀘스트/상점/햇빛 로직

## Subspace stable behavior

- 9×3 / 27칸
- historical 36-slot save array 유지
- unsafe metadata-bearing item 저장 차단
- Shulker/Bundle 저장 차단
- SAFE GUARD 변경 범위는 v1.4.48 원본 대비 `scripts/subspace.js` 1개

## Weapon 3P

- TEST1~5: attachable/geometry/pivot 계열 실패 실험
- TEST6: 원본 1인칭을 유지하고 player third-person/rightItem만 건드리는 구조 확인
- TEST7: 3인칭 수치 조정 중
- **어떤 TEST도 v1.4.48 stable release에 포함하지 않음**

## 다음 개발 흐름

`feature → static/package CI → 실제 Bedrock E2E → main → matching tag/Release`

CI PASS ≠ Bedrock E2E PASS입니다.
