# Testing Policy

메크닉스 RPG는 **정적 검사 통과와 실제 Bedrock 정상 작동을 같은 의미로 사용하지 않습니다.**

## 검증 단계

### 1. Static

자동화 가능한 기본 검사:
- JSON parse
- JavaScript syntax
- manifest 형식/의존성
- BP/RP/world UUID 및 version 연결
- item texture key → PNG 존재
- particle texture 존재
- 주요 리소스/스크립트 누락 확인
- ZIP CRC
- 재추출 후 파일 수 및 SHA-256 비교

Static 통과만으로 “게임에서 정상 작동”이라고 기록하지 않습니다.

### 2. Mock / Logic

Minecraft API를 실제 게임 대신 최소 mock으로 대체해:
- module import
- 주요 함수 호출 가능 여부
- 탄약/쿨다운/상태 전이
- 반복 타격/스케줄링
등을 확인할 수 있습니다.

Mock은 실제 엔티티 물리, 카메라, 파티클 렌더링, Script API 런타임 차이를 보증하지 않습니다.

### 3. Bedrock E2E

실제 Minecraft Bedrock 월드에서 확인해야 하는 항목:
- 월드 import/부팅
- BP/RP 활성화
- 스크립트 로드 오류 없음
- 직업 선택/레벨/스킬 지급
- 실제 엔티티 피해/헤드샷
- 파티클/카메라/VFX
- 인벤토리/재장전/탄약 소비
- 상점/퀘스트/NPC
- 멀티플레이 영향
- 저장 후 재접속/월드 재시작

## 회귀 테스트 원칙

보안관 수정 시에도 다음 항목은 최소한 회귀 대상으로 취급합니다:
- 다른 직업 선택/스킬
- 사신 대낫
- 레벨 테스트 함수
- 상태 HUD
- 상점
- 주민 고정/보호
- 햇빛 관련 시스템

## 완료 표기

문서/릴리스 노트에는 가능한 한 아래처럼 표기합니다.

```text
Static: PASS
Mock: PASS
Bedrock E2E: NOT RUN
```

사용자가 실제 게임에서 확인한 경우에는 어떤 항목을 확인했는지 별도로 기록합니다.
