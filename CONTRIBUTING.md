# Contributing / 작업 규칙

## 변경 전

1. 현재 `main` 기준 확인
2. 관련 기능의 baseline 확인
3. 수정 대상/비대상 파일 구분
4. 재현 조건과 rollback 지점 기록

## 브랜치

- `main`: 기준 소스
- `dev`: 통합 개발
- `feature/<name>`: 기능
- `fix/<name>`: 버그

예:
- `feature/bounty-marker`
- `feature/deadeye-homing`
- `feature/sheriff-ammo`

## 커밋

한 기능/버그를 가능한 한 한 커밋 단위로 분리합니다.

예:
- `feat(sheriff): add bounty target marker`
- `fix(sheriff): make dead eye bullets track target`
- `docs: update sheriff specification`

## 완료 선언

Static/Mock만 통과했으면 Bedrock E2E가 끝난 것처럼 표현하지 않습니다.
