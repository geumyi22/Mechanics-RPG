# Security Notes

이 저장소는 Public으로 운영될 수 있으므로 게임 소스 외의 개인정보/운영 정보가 섞이지 않도록 합니다.

## 업로드 금지

- 계정 비밀번호/토큰/API key
- 개인 PC 경로가 포함된 로그
- Discord/서버 인증 정보
- 개인 식별 정보
- 불필요한 crash dump / runtime log
- 다른 Geumyi Minecraft System 프로젝트의 운영 설정

## 바이너리/릴리스

완성 `.mcworld`, 대형 `.zip`, 기타 배포 산출물은 소스 트리에 반복적으로 누적하지 않고 GitHub Releases를 우선 사용합니다.

## 소스 업로드 전 확인

- 텍스트 파일의 개인 경로/닉네임/토큰 검색
- 불필요한 캐시/임시 파일 제거
- 원본 이미지/리소스 라이선스 및 출처 확인
- 외부에서 가져온 Minecraft 샘플/리소스는 재배포 가능 범위를 확인

## 저장소 분리

`Mechanics-RPG`는 게임 프로젝트 전용입니다. GSC/GSCM/GST/GDS, 실제 서버 설정, 서버 자동 배포 시스템은 `Geumyi-Minecraft-System`에서 별도로 관리합니다.
