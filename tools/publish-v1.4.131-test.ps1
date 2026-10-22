# Mechanics RPG v1.4.131 TEST release helper (Windows PowerShell 5.1+)
param([Parameter(Mandatory=$true)][string]$BundlePath)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$Repo = 'geumyi22/Mechanics-RPG'
$Branch = 'candidate/v1.4.131-source-20261022'
$Tag = 'test/v1.4.131'
foreach ($cmd in @('git','gh')) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "Install prerequisite: $cmd" }
}
function Run([string]$exe, [string[]]$argv) {
  & $exe @argv
  if ($LASTEXITCODE -ne 0) { throw "Failed ($LASTEXITCODE): $exe $($argv -join ' ')" }
}
$BundlePath = (Resolve-Path -LiteralPath $BundlePath).Path
$Scratch = Join-Path $env:TEMP ('mechanics-release-' + [guid]::NewGuid().ToString('N'))
$InputDir = Join-Path $Scratch 'input'
$RepoDir = Join-Path $Scratch 'repo'
New-Item -ItemType Directory -Path $InputDir -Force | Out-Null
try {
  Expand-Archive -LiteralPath $BundlePath -DestinationPath $InputDir -Force
  $checks = Join-Path $InputDir 'Mechanics_RPG_v1.4.131_SHA256SUMS.txt'
  $world = 'Mechanics_RPG_UserMap_CardMagician_v1.4.131_VIBRANT_VISUALS_COMPAT_TEST.mcworld'
  $addon = 'Mechanics_RPG_v1.4.131_Integrated_Packs_RC.mcaddon'
  $source = 'Mechanics_RPG_v1.4.131_ALL_PACKS_SOURCE_NO_DB.zip'
  $audit = 'Mechanics_RPG_v1.4.131_INDEPENDENT_INTEGRITY_AUDIT.json'
  $notes = Join-Path $InputDir 'Mechanics_RPG_v1.4.131_PRE_RELEASE_NOTES_KO.md'
  $hashes = @{}
  foreach ($line in (Get-Content -LiteralPath $checks -Encoding UTF8)) {
    if ($line -notmatch '^([A-Fa-f0-9]{64})\s+(.+)$') { throw "Invalid checksum line: $line" }
    $want = $Matches[1].ToLowerInvariant()
    $name = $Matches[2].Trim()
    if ($name -match '[\\/]') { throw "Unsafe checksum file name: $name" }
    $path = Join-Path $InputDir $name
    if (-not (Test-Path -LiteralPath $path -PathType Leaf)) { throw "Missing: $name" }
    $got = (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($got -ne $want) { throw "SHA-256 mismatch: $name" }
    $hashes[$name] = $want
    Write-Host "[PASS] $name" -ForegroundColor Green
  }
  foreach ($name in @($world,$addon,$source,$audit)) {
    if (-not $hashes.ContainsKey($name)) { throw "Missing verified asset: $name" }
  }
  if (-not (Test-Path -LiteralPath $notes)) { throw 'Release notes absent.' }
  $SourceDir = Join-Path $Scratch 'source'
  Expand-Archive -LiteralPath (Join-Path $InputDir $source) -DestinationPath $SourceDir -Force
  $manifests = @(Get-ChildItem -LiteralPath $SourceDir -Recurse -File -Filter manifest.json)
  if ($manifests.Count -ne 7) { throw "Expected seven packs; got $($manifests.Count)" }
  foreach ($f in $manifests) {
    Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json | Out-Null
  }
  Write-Warning 'P3.5 armor stand protection failed. Bedrock E2E/P4/Vibrant Visuals remain unverified.'
  Write-Warning 'External references to 1 BP and 3 RPs are NOT bundled.'
  Write-Warning 'Publishing .mcworld may reveal original LevelDB and player information.'
  $worldAnswer = Read-Host 'Type PUBLIC-WORLD to attach user .mcworld; press Enter to omit it'
  $includeWorld = ($worldAnswer -ceq 'PUBLIC-WORLD')
  $approve = Read-Host 'Type PUBLISH TEST to push candidate source and publish public GitHub Pre-release'
  if ($approve -cne 'PUBLISH TEST') { Write-Host 'Canceled with no GitHub changes.'; return }

  Run 'gh' @('auth','status')
  Run 'gh' @('repo','clone',$Repo,$RepoDir,'--','--quiet')
  $existingBranch = & git -C $RepoDir ls-remote --heads origin $Branch
  if ($LASTEXITCODE -ne 0) { throw 'Cannot check GitHub remote branch.' }
  if ($existingBranch) { throw "Branch exists: $Branch. Refusing overwrite." }
  $existingTag = & git -C $RepoDir ls-remote --tags origin "refs/tags/$Tag"
  if ($LASTEXITCODE -ne 0) { throw 'Cannot check GitHub release tag.' }
  if ($existingTag) { throw "Tag exists: $Tag. Refusing overwrite." }
  Run 'git' @('-C',$RepoDir,'switch','-c',$Branch)
  $dest = Join-Path $RepoDir 'candidates\v1.4.131'
  New-Item -ItemType Directory -Path $dest -Force | Out-Null
  Get-ChildItem -LiteralPath $SourceDir | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $dest -Recurse -Force
  }
  Copy-Item -LiteralPath $notes -Destination (Join-Path $dest 'RELEASE-NOTES.md')
  Run 'git' @('-C',$RepoDir,'add','--','candidates/v1.4.131')
  $login = (& gh api user --jq '.login').Trim()
  $userId = (& gh api user --jq '.id').Trim()
  if ($LASTEXITCODE -ne 0 -or -not $login -or -not $userId) { throw 'GitHub identity not available.' }
  Run 'git' @('-C',$RepoDir,'-c',"user.name=$login",'-c',"user.email=$userId+$login@users.noreply.github.com",'commit','-m','candidate: v1.4.131 seven-pack source (no world DB)')
  Run 'git' @('-C',$RepoDir,'push','-u','origin',$Branch)
  $commit = (& git -C $RepoDir rev-parse HEAD).Trim()
  if ($LASTEXITCODE -ne 0) { throw 'Cannot resolve pushed commit.' }

  $releaseNotes = Join-Path $InputDir 'PUBLISH_NOTES.md'
  $body = Get-Content -LiteralPath $notes -Raw -Encoding UTF8
  if (-not $includeWorld) {
    $body += [Environment]::NewLine + [Environment]::NewLine +
      'NOTICE: Full .mcworld deliberately omitted due to potential LevelDB/player privacy. The included addon and seven-pack source remain experimental.'
  }
  [IO.File]::WriteAllText($releaseNotes,$body,(New-Object System.Text.UTF8Encoding($false)))
  $assets = @($addon,$source,$audit,'Mechanics_RPG_v1.4.131_SHA256SUMS.txt')
  if ($includeWorld) { $assets += $world }
  $publishArgs = @('release','create',$Tag)
  foreach ($name in $assets) { $args += (Join-Path $InputDir $name) }
  $publishArgs += @('--repo',$Repo,'--target',$commit,'--prerelease',
    '--title','Mechanics RPG v1.4.131 TEST - Card Magician + Vibrant Visuals candidate',
    '--notes-file',$releaseNotes)
  Run 'gh' $publishArgs
  Run 'gh' @('release','view',$Tag,'--repo',$Repo)
  Write-Host 'TEST release published. Stable/main remain untouched.' -ForegroundColor Green
  Write-Host "https://github.com/$Repo/releases/tag/test/v1.4.131"
}
finally {
  if (Test-Path -LiteralPath $Scratch) {
    Remove-Item -LiteralPath $Scratch -Recurse -Force -ErrorAction SilentlyContinue
  }
}
