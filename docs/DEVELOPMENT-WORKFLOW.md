# Development Workflow

## 브랜치

```text
main
└─ dev
   ├─ feature/<name>
   └─ fix/<name>
```

- `main`: 승인된 기준 버전
- `dev`: 다음 버전 통합
- `feature/*`: 신규 기능
- `fix/*`: 재현 가능한 버그 수정

## 새 버전 작업

### 1. 시작점

항상 최신 `dev` 기준으로 시작합니다.

### 2. 수정

게임 변경은 `source/world/` 안에서 수행합니다.

버전 변경이 필요한 경우:
- BP manifest
- RP manifest
- world pack linkage
- VERSION-MATRIX
- CHANGELOG

를 함께 확인합니다.

### 3. 로컬/정적 검사

```bash
python tools/validate.py
python tools/package.py
python tools/verify_package.py
```

### 4. GitHub CI

push/PR 시 CI가 다음을 검사합니다.

- source baseline 존재
- JSON
- JavaScript syntax
- BP/RP/world 연결
- item/particle texture
- PNG signature
- SOURCE-MANIFEST
- deterministic package
- archive CRC/hash
- SHA256SUMS

source가 빠지면 CI는 skip하지 않고 실패합니다.

### 5. E2E

실제 Bedrock에서:
- import/부팅
- BP/RP/script
- 변경 기능
- 기존 직업/시스템 회귀
- 저장/재접속

을 확인합니다.

### 6. Release

정식 tag는 manifest version과 반드시 같아야 합니다.

예:
```text
manifest = 1.4.21
tag      = v1.4.21
```

다르면 Release workflow가 실패합니다.

정식 Release는 실제 Bedrock E2E 이후에만 사용합니다.
