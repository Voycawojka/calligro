const fs = require('fs')
const path = require('path')

let cachedVersion = null

function readVersion() {
    if (cachedVersion) {
        return Promise.resolve(cachedVersion)
    }

    const versionPath = process.env.ELECTRON_URL
        ? '../../version.txt'
        : '../version.txt'

    return new Promise((resolve, reject) => fs.readFile(path.resolve(__dirname, versionPath), 'utf8', (error, data) => {
        if (error) {
            reject(error)
        } else {
            const version = data.startsWith('v.') ? data.substr(2) : data

            cachedVersion = version
            resolve(version)
        }
    }))
}

exports.readVersion = readVersion
