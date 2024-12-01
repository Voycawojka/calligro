const { app, BrowserWindow } = require('electron')
const path = require('path')
const url = require('url')
const { setupIpcListeners } = require('./listeners')
const { setupMenu } = require('./menu')
const { readVersion } = require('./version')

async function createWindow() {
    const window = new BrowserWindow({
        width: 1310,
        height: 850,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            enableRemoteModule: false,
            allowRunningInsecureContent: false,
            contextIsolation: false
        },
        useContentSize: true
    })

    const appUrl = process.env.ELECTRON_URL
        ? path.join(process.env.ELECTRON_URL, '/webapp.html#/template')
        : url.format({
            pathname: path.join(__dirname, 'app/webapp.html'),
            slashes: true
        })

    setupMenu(app, window)
    window.loadURL(appUrl)
    readVersion().then(version => console.log(`Running version ${version}`))
    setupIpcListeners(app, window)
    // hot fix!
    setTimeout(() => {
        window.webContents.send('navigation', '/template')
    }, 500)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
