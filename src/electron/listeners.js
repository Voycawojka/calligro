const { ipcMain } = require('electron')
const { getFonts } = require('font-list')

function setupIpcListeners(app, window) {
    ipcMain.on('request-fonts', () => requestFonts(window))
}

async function requestFonts(window) {
    const fonts = await getFonts({ disableQuoting: true })

    window.webContents.send('fonts', { fonts })
}

exports.setupIpcListeners = setupIpcListeners
