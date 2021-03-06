# Note: itch.io butler needs to be installed for this script to work.
# It requires authentication so the script is only usable by admins ;)

# Build
npm run electron:build

# Upload to itch
butler push electron_build\calligro-win32-x64 voycawojka/calligro win-64
butler push electron_build\calligro-linux-x64 voycawojka/calligro linux

Write-Host "Upload done"
