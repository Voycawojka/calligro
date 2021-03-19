# Clean previous builds
Remove-Item electron_resources\src\* -Recurse -ErrorAction Ignore -Exclude .gitkeep
Remove-Item electron_build\* -Recurse -ErrorAction Ignore -Exclude .gitkeep

# Copy electron scripts to resources 
Copy-Item -Path "src\electron\*" -Destination "electron_resources\src" -Recurse -Include "*.js"

# Build react app and copy it to resources
npm run build
Copy-Item -Path "build\*" -Destination "electron_resources\src\app" -Recurse

# Package electron app for Windows and Linux from resources
node_modules\.bin\electron-packager electron_resources\ calligro `
    --platform="win32,linux" `
    --arch=x64 `
    --out electron_build\ `
    --asar `
    --icon electron_resources\icon.ico `
    --win32metadata.FileDescription="Bitmap font generator" `
    --win32metadata.ProductName="Calligro"

Write-Host "Build done"
