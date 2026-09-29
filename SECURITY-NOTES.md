# Security Notes

이 저장소는 Public입니다.

## 업로드 금지

- 비밀번호 / 토큰 / API key
- Discord 인증 정보
- 개인 PC 절대경로가 들어간 로그
- 실제 서버 운영 비밀번호/주소/내부 설정
- 개인 식별 정보
- 불필요한 crash dump/runtime dump

## 프로젝트 경계

`Mechanics-RPG`:
- Bedrock RPG world/BP/RP/scripts/docs

`Geumyi-Minecraft-System`:
- GSC/GSCM/GST/GDS
- Java 서버 운영/배포/상태 시스템

두 저장소의 운영 secret/설정을 섞지 않습니다.

## Public 내용 점검

2026-09-29 초기 구축 마감 시 default branch의 파일 내용에 대해 common secret/password/token/API-key 표현과 Windows 사용자 절대경로를 검색했고 일치 항목이 없었습니다.

이 검사는 GitHub 파일 내용 검색 기준이며, 모든 과거 Git commit metadata까지 삭제/재작성했다는 의미는 아닙니다. 이후에도 새 파일을 올리기 전에 동일 원칙으로 점검합니다.

## 배포 파일

완성 `.mcworld` / `.zip`은 source tree에 반복 누적하지 않고 Actions artifact / GitHub Release를 사용합니다.

## 외부 리소스

Mojang sample/외부 에셋을 포함할 경우 재배포 가능 범위와 출처를 별도 확인합니다.
