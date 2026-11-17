# Mechanics RPG — 역사 패치 기록 보존 아카이브

> 2026-11-18 사용자 승인으로 `source/world/`의 **과거 패치·변경 기록 55개**를 원문 바이트를 변경하지 않고 이곳으로 이동했습니다. 파일별 원래 Git blob SHA를 그대로 재사용했으므로 **내용 및 이력 보존**이 가능합니다. 이 폴더는 RPG 월드에 포함되지 않는 참고 문서입니다.

## 원칙

- 원본 경로는 `source/world/<파일명>`, 이관 위치는 `docs/archive/<파일명>`입니다.
- 이동한 55개 파일의 Git blob SHA 및 크기를 아래 표에 보존했습니다. 이관 전 파일 수 **294**, 이관 후 `source/world` 파일 수 **239**, 이동된 크기 총 **48,609바이트**입니다.
- `source/world/levelname.txt`, `source/world/THIRD_PARTY_NOTICES.txt`, `source/world/ROLLBACK_v1.4.48_TO_v1.4.43.txt`는 **원래 자리에 유지**합니다.
- 다른 BP/RP/LevelDB 파일과 `level.dat`, 스크립트, 텍스처, 설정, `.github/workflows/`, 릴리스 태그·자산을 변경하지 않습니다.
- `SOURCE-MANIFEST.json`은 **현재 브랜치의 239개 소스 파일**과 일치하도록 갱신되었습니다. 이관 후 새로 생성한 `v1.4.48` 패키지는 같은 버전의 **기존 2026-10-03 공개 Stable 배포 파일과 바이트가 동일하지 않습니다**. Stable 재게시·자산 교체 금지.
- 다음 릴리스는 실제 소스/메니페스트와 배포 파일의 동일성을 별도로 검증해야 합니다. Bedrock 실게임 검증이 이루어진 것으로 간주하지 않습니다.
- 복원할 때는 해당 Git blob을 같은 이름의 `source/world/` 루트로 되돌리고 `SOURCE-MANIFEST.json`을 다시 갱신한 다음 정적/패키징 검사를 실행합니다. 기존 `v1.4.48` 릴리스/태그도 원본 스냅샷으로 보존됩니다.

## 이관 파일 전체 목록

| 보존 파일 | 원본 경로 | 동일한 Git blob SHA | 크기 (bytes) |
|---|---|---|---:|
| [`BALANCE_ONLY_PATCH.txt`](BALANCE_ONLY_PATCH.txt) | `source/world/BALANCE_ONLY_PATCH.txt` | `7a503b83580894e6aa7c3d10678238998e96d803` | 757 |
| [`MECHANICS_RPG_v1.0.0_PATCH.txt`](MECHANICS_RPG_v1.0.0_PATCH.txt) | `source/world/MECHANICS_RPG_v1.0.0_PATCH.txt` | `9ab033131b66abc1cdbed10d362f1f93c0bdab34` | 1,605 |
| [`MECHANICS_RPG_v1.1.0_PATCH.txt`](MECHANICS_RPG_v1.1.0_PATCH.txt) | `source/world/MECHANICS_RPG_v1.1.0_PATCH.txt` | `522cb87b7d45848022beb91366b59daf0ff12662` | 1,139 |
| [`MECHANICS_RPG_v1.2.0_PATCH.txt`](MECHANICS_RPG_v1.2.0_PATCH.txt) | `source/world/MECHANICS_RPG_v1.2.0_PATCH.txt` | `1bfbcbaff7de2b5b9ed5f4ae0d55ff98dccc0737` | 1,591 |
| [`MECHANICS_RPG_v1.2.1_PATCH.txt`](MECHANICS_RPG_v1.2.1_PATCH.txt) | `source/world/MECHANICS_RPG_v1.2.1_PATCH.txt` | `c6ee8ce3f00fcc93f827c5dba5420ff9f2ee161f` | 2,028 |
| [`MECHANICS_RPG_v1.2.2_PATCH.txt`](MECHANICS_RPG_v1.2.2_PATCH.txt) | `source/world/MECHANICS_RPG_v1.2.2_PATCH.txt` | `16fe0070fa4533a9e195f2760c7bc7c62e55598f` | 1,258 |
| [`MECHANICS_RPG_v1.2.3_PATCH.txt`](MECHANICS_RPG_v1.2.3_PATCH.txt) | `source/world/MECHANICS_RPG_v1.2.3_PATCH.txt` | `6461fc43681668358a5cf8fe463b88de55417238` | 1,615 |
| [`MECHANICS_RPG_v1.2.4_PATCH.txt`](MECHANICS_RPG_v1.2.4_PATCH.txt) | `source/world/MECHANICS_RPG_v1.2.4_PATCH.txt` | `a5ce83b3b8cb2369b9f86413c9f87082aec628a7` | 1,149 |
| [`MECHANICS_RPG_v1.4.10_PATCH.txt`](MECHANICS_RPG_v1.4.10_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.10_PATCH.txt` | `91cb28439b748cdd0a6e6bf58335b10b461732aa` | 1,046 |
| [`MECHANICS_RPG_v1.4.11_PATCH.txt`](MECHANICS_RPG_v1.4.11_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.11_PATCH.txt` | `e9e6b68c81407ce713bcf045f85d26296de43b0b` | 480 |
| [`MECHANICS_RPG_v1.4.12_PATCH.txt`](MECHANICS_RPG_v1.4.12_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.12_PATCH.txt` | `f2626414a764de1674ee25d030781991c8525ab6` | 535 |
| [`MECHANICS_RPG_v1.4.13_PATCH.txt`](MECHANICS_RPG_v1.4.13_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.13_PATCH.txt` | `40dc270c7e78e7d0ea785b074b2ab40613bf9e46` | 978 |
| [`MECHANICS_RPG_v1.4.14_PATCH.txt`](MECHANICS_RPG_v1.4.14_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.14_PATCH.txt` | `745a102b2e765905555074fb77bb51de3ddcc04e` | 1,139 |
| [`MECHANICS_RPG_v1.4.15_PATCH.txt`](MECHANICS_RPG_v1.4.15_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.15_PATCH.txt` | `54762ab39a9cf0fa10a65c6fd8af5da927c74b3d` | 1,382 |
| [`MECHANICS_RPG_v1.4.17_SHERIFF_FIX.txt`](MECHANICS_RPG_v1.4.17_SHERIFF_FIX.txt) | `source/world/MECHANICS_RPG_v1.4.17_SHERIFF_FIX.txt` | `67a3d45e8f792d607deb7e1c3401e43a63dab902` | 918 |
| [`MECHANICS_RPG_v1.4.18_SHERIFF_FIX2.txt`](MECHANICS_RPG_v1.4.18_SHERIFF_FIX2.txt) | `source/world/MECHANICS_RPG_v1.4.18_SHERIFF_FIX2.txt` | `9ee569abe7b99a9b11d709a1968b99a61b84e76e` | 798 |
| [`MECHANICS_RPG_v1.4.19_SHERIFF_BALANCE_FIX.txt`](MECHANICS_RPG_v1.4.19_SHERIFF_BALANCE_FIX.txt) | `source/world/MECHANICS_RPG_v1.4.19_SHERIFF_BALANCE_FIX.txt` | `24ec372b976e3317316022e2a8892dfdc77cb081` | 1,493 |
| [`MECHANICS_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX.txt`](MECHANICS_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX.txt) | `source/world/MECHANICS_RPG_v1.4.20_DEAD_EYE_VFX_RELOAD_FIX.txt` | `6173e94d680c9d7101227f4dcb0f752057c0fb0d` | 1,363 |
| [`MECHANICS_RPG_v1.4.27_CHANGELOG.txt`](MECHANICS_RPG_v1.4.27_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.27_CHANGELOG.txt` | `35c0f6fcdda1ea0ebf7f946b7a12f5dfd4257a3f` | 733 |
| [`MECHANICS_RPG_v1.4.28_CHANGELOG.txt`](MECHANICS_RPG_v1.4.28_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.28_CHANGELOG.txt` | `4499de4d31036e27a67e1bf86867dcb7cd2470c1` | 808 |
| [`MECHANICS_RPG_v1.4.29_CHANGELOG.txt`](MECHANICS_RPG_v1.4.29_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.29_CHANGELOG.txt` | `5c0bc79adc7135e0e7f1bfedcd52698e9de553c1` | 461 |
| [`MECHANICS_RPG_v1.4.30_CHANGELOG.txt`](MECHANICS_RPG_v1.4.30_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.30_CHANGELOG.txt` | `c0404eeabb50f3a6bec876ed7c64bf9aa72a7fb9` | 653 |
| [`MECHANICS_RPG_v1.4.31_CHANGELOG.txt`](MECHANICS_RPG_v1.4.31_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.31_CHANGELOG.txt` | `4f7d55cedeff130f7bc26bab279aa25a26389241` | 168 |
| [`MECHANICS_RPG_v1.4.32_CHANGELOG.txt`](MECHANICS_RPG_v1.4.32_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.32_CHANGELOG.txt` | `a5e9fa36f6e7bce3afeed20311c1cdb10a88e6a1` | 871 |
| [`MECHANICS_RPG_v1.4.33_CHANGELOG.txt`](MECHANICS_RPG_v1.4.33_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.33_CHANGELOG.txt` | `11183644f776c716a9bcf3b6154609a9b4537ce6` | 923 |
| [`MECHANICS_RPG_v1.4.34_CHANGELOG.txt`](MECHANICS_RPG_v1.4.34_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.34_CHANGELOG.txt` | `fdf7a7f6b5cf1a8fbd48b3b545daabc502b4db39` | 604 |
| [`MECHANICS_RPG_v1.4.35_CHANGELOG.txt`](MECHANICS_RPG_v1.4.35_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.35_CHANGELOG.txt` | `641857a8f3876918d3f1acc2c061a1d7e6a8f9ee` | 712 |
| [`MECHANICS_RPG_v1.4.36_CHANGELOG.txt`](MECHANICS_RPG_v1.4.36_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.36_CHANGELOG.txt` | `e660e62aef142b867a521d63c70e35ee52a66a45` | 1,033 |
| [`MECHANICS_RPG_v1.4.37_CHANGELOG.txt`](MECHANICS_RPG_v1.4.37_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.37_CHANGELOG.txt` | `01f2a45683ca30818fd2f8a0a4ee64e74ed677b4` | 982 |
| [`MECHANICS_RPG_v1.4.38_CHANGELOG.txt`](MECHANICS_RPG_v1.4.38_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.38_CHANGELOG.txt` | `4222a84108104ba0b6833131e6ed550fa5881aae` | 834 |
| [`MECHANICS_RPG_v1.4.39_CHANGELOG.txt`](MECHANICS_RPG_v1.4.39_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.39_CHANGELOG.txt` | `2f167c01be2b29daf8c866eb5156dbc02590f1e1` | 1,454 |
| [`MECHANICS_RPG_v1.4.40_CHANGELOG.txt`](MECHANICS_RPG_v1.4.40_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.40_CHANGELOG.txt` | `c2dc0d5ba4e2920176babbc3694200b73186abbf` | 977 |
| [`MECHANICS_RPG_v1.4.41_CHANGELOG.txt`](MECHANICS_RPG_v1.4.41_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.41_CHANGELOG.txt` | `0beb03774bf475be7e1b984c1b506861b52ac939` | 709 |
| [`MECHANICS_RPG_v1.4.42_CHANGELOG.txt`](MECHANICS_RPG_v1.4.42_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.42_CHANGELOG.txt` | `1fb0ae88402767b8095bec1ec172276dc1f60095` | 775 |
| [`MECHANICS_RPG_v1.4.43_CHANGELOG.txt`](MECHANICS_RPG_v1.4.43_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.43_CHANGELOG.txt` | `a172c4bdc5ca5eebdd907aa083d53cfcf5c51774` | 1,100 |
| [`MECHANICS_RPG_v1.4.48_CHANGELOG.txt`](MECHANICS_RPG_v1.4.48_CHANGELOG.txt) | `source/world/MECHANICS_RPG_v1.4.48_CHANGELOG.txt` | `32da450bf5c93bb17f8d14e1f8fe564709b8c075` | 1,177 |
| [`MECHANICS_RPG_v1.4.6_PATCH.txt`](MECHANICS_RPG_v1.4.6_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.6_PATCH.txt` | `b48f3997daea6cabe2a9baf9c99e8eac1cdffa39` | 212 |
| [`MECHANICS_RPG_v1.4.7_PATCH.txt`](MECHANICS_RPG_v1.4.7_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.7_PATCH.txt` | `321b48abdf80a8310dbaaad943e3975ebd38d800` | 178 |
| [`MECHANICS_RPG_v1.4.9_PATCH.txt`](MECHANICS_RPG_v1.4.9_PATCH.txt) | `source/world/MECHANICS_RPG_v1.4.9_PATCH.txt` | `5ff6ffcf34f10a438f3d201c98edb238e7e22df0` | 1,520 |
| [`V0.4.5_README.txt`](V0.4.5_README.txt) | `source/world/V0.4.5_README.txt` | `76d134e767f5a4bb6e78cbb5def410cfdb4756b3` | 269 |
| [`V0.4.6_PATCH.txt`](V0.4.6_PATCH.txt) | `source/world/V0.4.6_PATCH.txt` | `12f3a00207305fdaef8c81ee80cb332909b8d0b2` | 524 |
| [`V0.5.0_PATCH.txt`](V0.5.0_PATCH.txt) | `source/world/V0.5.0_PATCH.txt` | `566d5acc2252428035dc74cea3b439010664d796` | 1,569 |
| [`V0.5.1_TEST_PATCH.txt`](V0.5.1_TEST_PATCH.txt) | `source/world/V0.5.1_TEST_PATCH.txt` | `82c487023a9e69b7a650ca438ccd9fa30ed52065` | 395 |
| [`V0.5.2_CLERIC_FIX.txt`](V0.5.2_CLERIC_FIX.txt) | `source/world/V0.5.2_CLERIC_FIX.txt` | `88c847ec70de6e1827cf3a518a85f69058030a83` | 501 |
| [`V0.5.3_PATCH.txt`](V0.5.3_PATCH.txt) | `source/world/V0.5.3_PATCH.txt` | `76f864188135c88fd9cdcd81e59655eb37a5c0f6` | 729 |
| [`V0.5.4_FLOOR_HOTFIX.txt`](V0.5.4_FLOOR_HOTFIX.txt) | `source/world/V0.5.4_FLOOR_HOTFIX.txt` | `2202e48e71fc4bbf8e6e9da7faf987fd247da88e` | 328 |
| [`V0.5.5_CLERIC_COLOR.txt`](V0.5.5_CLERIC_COLOR.txt) | `source/world/V0.5.5_CLERIC_COLOR.txt` | `ebca4754390529c4a75002ac6334ad20f1d84b00` | 411 |
| [`V0.6.0_ASSASSIN_ALPHA.txt`](V0.6.0_ASSASSIN_ALPHA.txt) | `source/world/V0.6.0_ASSASSIN_ALPHA.txt` | `a9f66318a02555dec42018c55bf79f5b30137718` | 661 |
| [`V0.6.1_GAS_HOTFIX.txt`](V0.6.1_GAS_HOTFIX.txt) | `source/world/V0.6.1_GAS_HOTFIX.txt` | `06697b828bd6b4383f46c4af1550a8038dbebf83` | 501 |
| [`V0.6.2_CAST_LOCK_STEALTH_FIX.txt`](V0.6.2_CAST_LOCK_STEALTH_FIX.txt) | `source/world/V0.6.2_CAST_LOCK_STEALTH_FIX.txt` | `38659b3bf0bb9cfc01155868e9f673324dffc1b7` | 880 |
| [`V0.6.3_BALANCE_PATCH.txt`](V0.6.3_BALANCE_PATCH.txt) | `source/world/V0.6.3_BALANCE_PATCH.txt` | `fc170807da8ffa201dcaa47180c2b9f5a1d5b7f2` | 762 |
| [`V0.7.0_QUEST_EDITOR.txt`](V0.7.0_QUEST_EDITOR.txt) | `source/world/V0.7.0_QUEST_EDITOR.txt` | `246939984dac101a14091fdb55846b598b198537` | 1,072 |
| [`V0.7.1_NPC_LOCK_PATCH.txt`](V0.7.1_NPC_LOCK_PATCH.txt) | `source/world/V0.7.1_NPC_LOCK_PATCH.txt` | `815490b0f1b729bb1d2f5d85967ce49953e3f841` | 411 |
| [`V0.7.2_NPC_INVINCIBLE_PATCH.txt`](V0.7.2_NPC_INVINCIBLE_PATCH.txt) | `source/world/V0.7.2_NPC_INVINCIBLE_PATCH.txt` | `9ee672902c409519038ec43bc79df202d6a7c6fe` | 528 |
| [`V0.8.0_FIGHTER_ALPHA.txt`](V0.8.0_FIGHTER_ALPHA.txt) | `source/world/V0.8.0_FIGHTER_ALPHA.txt` | `0a6af6526f8f42258375224e7151c1719e6371fd` | 910 |

[저장소 전체 정리 보고서](../REPOSITORY-MAINTENANCE-20261118.md) · [기존 릴리스 채널](../RELEASE-CHANNELS.md)
