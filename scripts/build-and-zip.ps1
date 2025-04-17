# scripts/build-and-zip.ps1
$ErrorActionPreference = 'Stop'

# pega o nome da branch atual
$branch = (git rev-parse --abbrev-ref HEAD).Trim()

# sanitiza: transforma "/" e "#" em "-"
$safeBranch = $branch -replace '/', '-' -replace '#', '-'

# limpa builds anteriores
rimraf "dist\$safeBranch.zip" 2>$null
rimraf "dist\$safeBranch"    2>$null

# build do Angular em modo production em dist\<safeBranch>
ng build --configuration production --output-path "dist\$safeBranch"

# zipa em dist\<safeBranch>.zip
Compress-Archive -Path "dist\$safeBranch\*" -DestinationPath "dist\$safeBranch.zip" -Force

Write-Host "Build e ZIP gerados em dist\$safeBranch.zip  (branch original: $branch)"
