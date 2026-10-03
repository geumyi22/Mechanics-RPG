# Project Status

기준일: 2026-10-03

## 정식 기준

**main / latest Release: v1.4.20 — Bedrock release-gate E2E PASS**

- Repository: `geumyi22/Mechanics-RPG`
- Default branch: `main`
- Development integration: `dev`
- v1.4.20 GitHub Release: published
- release asset SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`

정식 기준선은 개발 스냅샷과 분리합니다.

## 현재 개발 스냅샷

**v1.4.46 SUBSPACE_NATIVE_STORAGE_PROOF_TEST**

목표:
- 기존 ActionForm 상자형 UI의 닫힘→재오픈 깜빡임을 피할 수 있는 네이티브 storage item 방식 검증
- 기존 `geumyi:subspace`와 v3 저장 데이터는 변경하지 않고 별도 `geumyi:subspace_native_test` 아이템으로 격리 테스트

Local static validation:

```text
Files: 304
JSON: 93 PASS
JavaScript: 10 PASS
Item texture entries: 57 PASS
Particle JSON: 3 PASS
PNG: 105 PASS
BP/RP/world linkage: PASS
SOURCE-MANIFEST aggregate: 304 files
ZIP CRC / re-extracted file hashes: PASS
ZIP / MCWORLD: BYTE-IDENTICAL
Bedrock v1.4.46 native proof: NOT RUN
```

## 아공간 device evidence

- **v1.4.37 partial PASS**: 본체 native renderer 표시 성공, 넣기 ActionForm 아이콘 실패
- **v1.4.40 FAIL**: 72-button fake combined UI 실패
- **v1.4.41 partial PASS**: 외형 성공, 실제 inventory binding 실패
- **v1.4.42 PASS 범위**: 9×3 아공간 + 실제 inventory/hotbar item rendering
- **v1.4.43 PASS 범위**: 확대 상자 UI + 스택 수량, 단 ActionForm 깜빡임
- **v1.4.44 PASS 범위**: DDUI에서 조약돌 ×64 넣기/빼기 무깜빡임
- **v1.4.45 NOT FULL E2E**: 두 UI 모드 공존
- **v1.4.46 NOT RUN**: native storage proof

PASS는 각 항목에 한정하며 전체 RPG 회귀 PASS를 뜻하지 않습니다.

## Release blocker

v1.4.46 또는 이후 버전을 `main`/tag/Release로 올리기 전:

1. native storage proof 실기기 동작 확인
2. 재접속/월드 재시작 후 저장 유지 확인
3. 기존 v3 아공간 저장 영향 없음 확인
4. Sheriff 회귀
5. Reaper 승인된 1인칭 대낫 보존 확인
6. quest/shop/NPC 회귀
7. package artifact 자체로 Bedrock release-gate E2E

상세 아공간 이력: [docs/SUBSPACE-DEVELOPMENT.md](docs/SUBSPACE-DEVELOPMENT.md)
