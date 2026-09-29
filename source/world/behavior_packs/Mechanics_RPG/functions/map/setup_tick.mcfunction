execute unless entity @e[type=armor_stand,tag=geumyi_test_platform_v054_ready] as @a[tag=!geumyi_test_spawned_v054,c=1] at @s run function map/build_all
execute as @a[tag=!geumyi_test_spawned_v054] at @e[type=armor_stand,tag=geumyi_test_platform_v054_ready,c=1] run tp @s ~ ~2 ~
execute as @a[tag=!geumyi_test_spawned_v054] at @e[type=armor_stand,tag=geumyi_test_platform_v054_ready,c=1] run spawnpoint @s ~ ~2 ~
execute as @a[tag=!geumyi_test_spawned_v054] if entity @e[type=armor_stand,tag=geumyi_test_platform_v054_ready] run tag @s add geumyi_test_spawned_v054
