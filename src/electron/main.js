const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const url = require('url')
const { setupIpcListeners } = require('./listeners')

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
        useContentSize: true,
        autoHideMenuBar: true
    })

    const appUrl = process.env.ELECTRON_URL
        ? path.join(process.env.ELECTRON_URL, '/webapp.html')
        : url.format({
            pathname: path.join(__dirname, 'app/webapp.html'),
            slashes: true
        })

    window.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url)
        return { action: 'deny' }
    })

    window.loadURL(appUrl)
    setupIpcListeners(app, window)
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
