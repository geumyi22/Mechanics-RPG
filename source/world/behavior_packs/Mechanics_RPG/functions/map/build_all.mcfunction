gamerule doDaylightCycle false
gamerule doWeatherCycle false
gamerule mobGriefing false
gamerule keepInventory true
time set day
weather clear
fill ~-24 ~-1 ~-24 ~24 ~-1 ~24 smooth_stone
fill ~-24 ~-1 ~-24 ~24 ~-1 ~-24 polished_andesite
fill ~-24 ~-1 ~24 ~24 ~-1 ~24 polished_andesite
fill ~-24 ~-1 ~-24 ~-24 ~-1 ~24 polished_andesite
fill ~24 ~-1 ~-24 ~24 ~-1 ~24 polished_andesite
setblock ~ ~-1 ~ sea_lantern
spawnpoint @s ~ ~ ~
summon armor_stand ~ ~-2 ~
tag @e[type=armor_stand,r=2,c=1,tag=!geumyi_test_platform_v054_ready] add geumyi_test_platform_v054_ready
effect @e[type=armor_stand,tag=geumyi_test_platform_v054_ready,r=3] invisibility infinite 0 true
tag @s add geumyi_test_spawned_v054
