const fs = require('fs')
const path = require('path')

function readVersion() {
    const versionPath = process.env.ELECTRON_URL
        ? '../../version.txt'
        : '../version.txt'

    return new Promise((resolve, reject) => fs.readFile(path.resolve(__dirname, versionPath), 'utf8', (error, data) => {
        if (error) {
            reject(error)
        } else {
            resolve(data)
        }
    }))
}

exports.readVersion = readVersion
