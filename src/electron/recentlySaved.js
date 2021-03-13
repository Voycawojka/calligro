const { getStorage, setStorage } = require('./storage')

async function getRecentlySavedTemplates(app) {
    const storedValue = await getStorage('recent-templates', app)

    return storedValue ? JSON.parse(storedValue) : []
}

async function addRecentlySavedTemplate(template, app) {
    const templates = await getRecentlySavedTemplates(app)

    templates.unshift(template)

    if (templates.length > 8) {
        templates.length = 8
    }

    await setStorage('recent-templates', JSON.stringify(templates), app)
}

exports.getRecentlySavedTemplates = getRecentlySavedTemplates
exports.addRecentlySavedTemplate = addRecentlySavedTemplate
