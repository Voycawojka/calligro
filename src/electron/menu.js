const { shell, Menu, dialog } = require('electron')
const { readFile } = require('fs')
const { errorDialog } = require('./nativeDialogs')
const { getRecentlySavedTemplates } = require('./recentlySaved')

async function setupMenu(app, window) {
    const menuTemplate = await constructMenuTemplate(app, window)
    const menu = Menu.buildFromTemplate(menuTemplate)

    Menu.setApplicationMenu(menu)
}

async function constructMenuTemplate(app, window) {
    const isMac = process.platform === 'darwin'

    const macAppMenu = [{
        label: app.name,
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { role: 'separator' },
            { role: 'quit' }
        ]
    }]

    const debugMenu = [{
        label: 'Debug',
        submenu: [
            {
                label: 'Dev tools',
                click: () => window.webContents.openDevTools()
            }
        ]
    }]

    const recentlySavedTemplates = await getRecentlySavedTemplates(app)

    return [
        ...(isMac ? macAppMenu : []),
        {
            label: 'Templates',
            submenu: [
                {
                    label: 'Create a template',
                    click: () => window.webContents.send('navigation', '/')
                },
                {
                    label: 'Recently saved',
                    enabled: recentlySavedTemplates.length > 0,
                    submenu: recentlySavedTemplates.map(template => ({
                        label: template.name,
                        sublabel: template.path,
                        click: () => {
                            

                            readFile(template.path, 'utf8', (error, data) => {
                                if (error) {
                                    errorDialog(`Cannot load ${template.path}`, error.message)
                                } else {
                                    window.webContents.send('navigation', '/')
                                    window.webContents.send('load-template', data)
                                }
                            })
                        }
                    }))
                }
            ]
        },
        {
            label: 'Fonts',
            submenu: [
                {
                    label: 'Generate a font',
                    click: () => window.webContents.send('navigation', '/step2')
                }
            ]
        },
        { 
            label: 'More',
            submenu: [
                {
                    label: 'Github repository',
                    click: () => shell.openExternal('https://github.com/Voycawojka/calligro')
                },
                {
                    label: 'Report a bug',
                    click: () => shell.openExternal('https://github.com/Voycawojka/calligro/issues')
                },
                {
                    label: 'Web version',
                    click: () => shell.openExternal('https://calligro.ideasalmanac.com')
                }
            ]
        },
        ...(process.env.ELECTRON_URL ? debugMenu : [])
    ]
}

exports.setupMenu = setupMenu
