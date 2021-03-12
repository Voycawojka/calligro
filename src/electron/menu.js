const { shell } = require('electron')
const { readVersion } = require('./version')

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
                },
                {
                    label: 'About',
                    click: async () => {
                        try {
                            const version = await readVersion()

                            window.webContents.send('about-popup', version)
                        } catch (error) {
                            console.log(error)

                            window.webContents.send('about-popup', '[error while reading version]')
                        }
                    }
                }
            ]
        },
        ...(process.env.ELECTRON_URL ? debugMenu : [])
    ]
}

exports.constructMenuTemplate = constructMenuTemplate
