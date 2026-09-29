# GitHub Runbook

## 1. 기준 패키지 import

```bash
python tools/import_baseline.py /path/to/Mechanics_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX.zip
```

동일하게 `.mcworld`도 ZIP 포맷이므로 입력할 수 있습니다.

결과:
- `source/world/` 생성
- `SOURCE-MANIFEST.json` 생성

## 2. 정적 검사

```bash
python tools/validate.py
```

Node.js가 있으면 모든 JS에 `node --check`도 실행합니다.

## 3. 패키징

```bash
python tools/package.py
python tools/verify_package.py
```

출력:
- `dist/Mechanics_RPG_vX.Y.Z.zip`
- `dist/Mechanics_RPG_vX.Y.Z.mcworld`

## 4. GitHub

```bash
git checkout -b dev
git add .
git commit -m "chore: import v1.4.20 source baseline"
git push -u origin dev
```

검증 후 `main`으로 병합합니다.

## 5. Release

실제 Bedrock E2E 후 version/CHANGELOG를 갱신하고 tag를 push합니다.

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

Release workflow가 패키지/checksum을 만들도록 설계합니다.
