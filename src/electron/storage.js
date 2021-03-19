const { readFile, writeFile } = require('fs')
const path = require('path')

function getStorage(key, app) {
    const filePath = path.join(app.getPath('userData'), `calligro-${key}.json`)

    return new Promise(resolve => readFile(filePath, (error, data) => error ? resolve(null) : resolve(data)))
}

async function setStorage(key, value, app) {
    const filePath = path.join(app.getPath('userData'), `calligro-${key}.json`)

    return new Promise(resolve => writeFile(filePath, value, () => resolve()))
}

exports.getStorage = getStorage
exports.setStorage = setStorage
