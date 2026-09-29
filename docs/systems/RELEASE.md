# Release Process

1. source version 확인
2. `python tools/validate.py`
3. `python tools/package.py`
4. `python tools/verify_package.py`
5. 실제 Bedrock E2E
6. version bump
7. CHANGELOG
8. tag
9. GitHub Release
10. SHA-256 확인

Bedrock E2E 미실행 상태를 안정 릴리스로 표현하지 않습니다.
