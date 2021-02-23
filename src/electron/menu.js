const { shell } = require('electron')

function constructMenuTemplate(app) {
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

    return [
        ...(isMac ? macAppMenu : []),
        {
            label: 'Create a template',
            click: () => alert('STEP 1')
        },
        {
            label: 'Generate a font',
            click: () => alert('STEP 2')
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
        }
    ]
}

exports.constructMenuTemplate = constructMenuTemplate
