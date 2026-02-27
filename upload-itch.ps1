# Note: itch.io butler needs to be installed for this script to work.
# It requires authentication so the script is only usable by admins ;)

# Build Windows
npm ci
npx tauri build

# Build Linux
wsl -- bash -ic "npm ci && npx tauri build"

# Upload to itch
butler push src-tauri\target\release\calligro.exe voycawojka/calligro:win-64 --userversion-file version.txt
butler push src-tauri\target\release\calligro voycawojka/calligro:linux --userversion-file version.txt

Write-Host "Upload done"
