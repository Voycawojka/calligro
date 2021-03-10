const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const { writeFile } = require('fs')
const path = require('path')
const url = require('url')
const { constructMenuTemplate } = require('./menu')

function createWindow() {
    const window = new BrowserWindow({
        width: 1310,
        height: 850,
        webPreferences: {
            nodeIntegration: true
        },
        useContentSize: true
    })

    const appUrl = process.env.ELECTRON_URL || url.format({
        pathname: path.join(__dirname, '/../../build/index.html'),
        protocol: 'file:',
        slashes: true
    })

    const menuTemplate = constructMenuTemplate(app, window)
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    window.loadURL(appUrl)
    window.webContents.openDevTools()
}

app.whenReady().then(createWindow)

ipcMain.on('save-template', (event, imageBlobBufferArray, templateCode) => {
    dialog.showSaveDialog()
        .then(object => {
            if (!object.canceled) {
                writeFile(`${object.filePath}.txt`, templateCode, () => { })
                writeFile(`${object.filePath}.png`, Buffer.from(imageBlobBufferArray), { encoding: 'base64' }, () => { })
            }
        })
})

ipcMain.on('save-font', (event, fntFile, pagesBufferArray) => {
    dialog.showSaveDialog()
        .then(object => {
            if (!object.canceled) {
                writeFile(`${object.filePath}.fnt`, fntFile, () => { })
                
                for (let i = 0; i < pagesBufferArray.length; i++) {
                    writeFile(`${object.filePath}-${i}.png`, Buffer.from(pagesBufferArray[i]), { encoding: 'base64' }, () => { })
                }
            }
        })
})

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
