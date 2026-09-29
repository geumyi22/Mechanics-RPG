# Rollback Guide

## 코드 롤백

문제가 있는 변경은 해당 기능 커밋/PR 단위로 되돌립니다.

권장:
```bash
git revert <commit>
```

히스토리를 강제로 덮는 `reset --hard` + force push는 기본 절차로 사용하지 않습니다.

## 기준 소스 복구

현재 기준 source는:
- `main:source/world/`
- `SOURCE-MANIFEST.json`

에 보존됩니다.

필요하면 마지막 승인 commit에서 source를 복구한 뒤:

```bash
python tools/validate.py
python tools/package.py
python tools/verify_package.py
```

를 다시 수행합니다.

## Release 롤백

새 버전에 문제가 있으면:
1. 문제 버전을 안정 버전으로 표시하지 않음
2. 이전 승인 source로 revert
3. 새 patch version으로 수정
4. CI + Bedrock E2E 재검증
5. 새 tag/Release

기존 Release asset을 조용히 교체해서 같은 버전 번호의 내용을 바꾸지 않습니다.
