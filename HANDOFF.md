# Development Handoff

기준일: 2026-09-29

## 현재 고정 기준

GitHub 초기 구축은 완료 상태입니다.

- `main`: v1.4.20 기준 source + 검증 인프라
- `dev`: 다음 개발 통합 브랜치
- source baseline: `source/world/`
- source manifest: `SOURCE-MANIFEST.json`
- 현재 baseline 파일 수: 257
- CI: source/static/package 검증
- Release: tag/manifest version 일치 검사 후 package/checksum/release
- Bedrock E2E: 아직 미실행

현재 게임 소스는 **v1.4.20 기준으로 동결**합니다. 신규 아이디어/밸런스/스킬 수정은 별도 개발 단계가 시작되기 전까지 진행하지 않습니다.

## 다음 개발부터 적용할 기본 흐름

1. 아이디어/버그 요구사항 확정
2. 관련 Issue 확인 또는 생성
3. `dev`에서 기능 브랜치 생성
4. source 수정
5. BP/RP/world version 정합성 확인
6. CHANGELOG / VERSION-MATRIX / 관련 문서 갱신
7. `python tools/validate.py`
8. `python tools/package.py`
9. `python tools/verify_package.py`
10. GitHub push + CI
11. 검토 후 `dev` 통합
12. 실제 Bedrock E2E
13. 검증된 버전만 `main` 및 tag/Release

## 중요 경계

- CI PASS ≠ Bedrock E2E PASS
- 실제 실행하지 않은 기능은 정상 작동으로 단정하지 않음
- 사신 대낫 등 기존 승인 기준은 요청 없이 변경하지 않음
- 새 버전이 만들어지면 게임 파일과 GitHub 문서/버전/소스를 같은 작업에서 함께 갱신
