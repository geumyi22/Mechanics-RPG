# Development Handoff

기준일: 2026-10-03

## 현재 기준

### 정식
- `main`: **v1.4.20**
- GitHub Release: **v1.4.20**
- Bedrock release-gate E2E: **PASS**

### 개발
- 최신 source snapshot: **v1.4.46 SUBSPACE_NATIVE_STORAGE_PROOF_TEST**
- source files: **304**
- Static: **PASS (local artifact/source)**
- Bedrock v1.4.46 native proof: **NOT RUN**
- `main` 승격/Release: **금지 상태**

## 아공간 핵심 상태

- 활성 목표 용량: 27칸
- v3 역사 저장 배열은 36칸 유지
- `geumyi:subspace_v3_head`
- `geumyi:subspace_v3_stage`
- `geumyi:subspace_v3_journal`
- 위 키는 임의 삭제/초기화 금지
- v1.4.44 DDUI 무깜빡임은 실제 기기에서 확인
- v1.4.43 상자형 UI는 실제 기기에서 확인했으나 ActionForm 재오픈 깜빡임 존재
- v1.4.46 native storage test는 기존 v3 저장과 **격리**

상세: [docs/SUBSPACE-DEVELOPMENT.md](docs/SUBSPACE-DEVELOPMENT.md)

## 다음 작업자가 해야 할 순서

1. v1.4.46 CI Static 결과 확인
2. GitHub-generated package artifact 사용
3. 실제 Bedrock에서 native storage proof 테스트
4. 재접속/월드 재시작 저장 확인
5. 기존 v3 아공간 불변 확인
6. Sheriff/Reaper/quest/shop 회귀
7. 실패하면 rollback 문서에 따라 v1.4.45로 복귀
8. 모든 gate 통과 후에만 `main`/tag/Release

## 금지

- E2E 없이 “완성/정상 작동” 선언
- 기존 v3 저장 키 삭제
- 승인된 Reaper 1인칭 대낫 임의 변경
- Sheriff/다른 RPG 시스템을 아공간 작업 때문에 재작성
- dev snapshot을 검증 없이 main/tag/Release로 올리기

## 기본 흐름

1. 요구사항 확정
2. feature/fix branch
3. source 수정
4. version/linkage 정합성
5. CHANGELOG / VERSION-MATRIX / 문서
6. `python tools/validate.py`
7. `python tools/package.py`
8. `python tools/verify_package.py`
9. CI
10. dev 통합
11. Bedrock E2E
12. 검증 버전만 main/tag/Release
