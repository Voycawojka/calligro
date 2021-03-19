const { dialog } = require('electron')

function errorDialog(shortInfo, errorMessage) {
    dialog.showErrorBox(shortInfo, `Error message: ${errorMessage}.\n\nIf you think this is a bug please report it on Github or Itch.io.`)
}

exports.errorDialog = errorDialog
