# Changelog

## 2026-10-03 — v1.4.46 development snapshot synchronized

- v1.4.27~v1.4.46 아공간 개발 이력과 rollback 문서 정리
- v1.4.42 상자형 9×3 + 실제 인벤토리/핫바 렌더링 실기기 확인 이력 기록
- v1.4.43 상자 UI/스택 수량 표시 실기기 확인, ActionForm 깜빡임 제한 기록
- v1.4.44 DDUI CustomForm 무깜빡임 넣기/빼기 실기기 PASS 범위 기록
- v1.4.45 dual UI는 상자형+DDUI를 하나로 합친 버전이 아니라 별도 모드임을 명시
- v1.4.46 `minecraft:storage_item + bundle_interaction` 기반 네이티브 저장 격리 proof 추가
- 기존 `geumyi:subspace` 및 v3 저장 데이터는 v1.4.46 native proof와 분리
- source integrity manifest를 304개 파일 aggregate SHA-256 방식으로 정리
- **v1.4.46은 개발 스냅샷이며 Bedrock native-storage E2E 전. main/tag/Release 승격 금지**

### v1.4.46 local static validation

```text
JSON: 93 PASS
JavaScript: 10 PASS
BP/RP/world linkage: PASS
Item texture entries: 57 PASS
Particle JSON: 3 PASS
PNG: 105 PASS
Source files: 304
ZIP CRC / re-extracted hashes: PASS
ZIP == MCWORLD bytes: PASS
Bedrock E2E: NOT RUN for v1.4.46 native storage proof
```

상세: [docs/SUBSPACE-DEVELOPMENT.md](docs/SUBSPACE-DEVELOPMENT.md)

## 2026-09-29 — v1.4.20 first GitHub Release

- 실제 Bedrock release-gate E2E 8개 핵심 항목 PASS
- E2E 대상은 GitHub CI #31이 생성한 정확한 `.mcworld`
- release candidate SHA-256: `a4d099cb419cdda1da68ed734406a7a2885a6c72565ba10e6d2d9741fe0ced70`
- main commit `69b742384fb28a14680b087000f0b76563cb38d0` 기준 release
- tag `v1.4.20` 생성
- Release workflow validate / package / verify / tag-version guard / checksum / publish PASS
- GitHub Release에 `.mcworld`, `.zip`, `SHA256SUMS.txt` 게시

## 2026-09-29 — v1.4.20 GitHub baseline import complete

- v1.4.20 원본 월드 257개 파일을 `source/world/`에 import
- 상세 파일 SHA-256 manifest로 baseline 추적
- JSON 84 / JS 7 / item texture 52 / particle 3 / PNG 93 검증
- deterministic `.zip` / `.mcworld` 패키징 및 재추출 hash 검증

## v1.4.20 — DEAD EYE VFX / RELOAD FIX

- 데드아이 보라색 총알/탄도 연출
- 준비시간 6/6 자동 재장전
- 궁극기 준비 재장전은 일반 탄약 미소비
- 데드아이 30 피해/발 기준
- **첫 GitHub 정식 Release**

## v1.4.19 — SHERIFF BALANCE FIX

- 일반 리볼버 기본 피해 10
- 최소 사거리 30 / 정지 조준 최대 70
- 데드아이 30 피해/발
- 파티클 및 연속 명중 로직 보강

## v1.4.18 — SHERIFF FIX2

- 리볼버/헤드샷/탄약/스킬 연동 보강
- 일반 사격속도와 속사 분리
- 스킬 아이콘/파티클 개선

## v1.4.17 — SHERIFF FIX

- v1.4.15 clean baseline에서 보안관 직업 통합
- 기존 레벨/스킬/다른 직업 구조 유지 원칙 확립

아공간 세부 버전별 변경은 `source/world/MECHANICS_RPG_v1.4.27_CHANGELOG.txt` ~ `v1.4.46_CHANGELOG.txt`에 보존합니다.
