const { shell } = require('electron')

function constructMenuTemplate(app, window) {
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

    return [
        ...(isMac ? macAppMenu : []),
        {
            label: 'Create a template',
            click: () => window.webContents.send('navigation', '/')
        },
        {
            label: 'Generate a font',
            click: () => window.webContents.send('navigation', '/step2')
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

exports.constructMenuTemplate = constructMenuTemplate
