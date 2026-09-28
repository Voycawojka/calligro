---
title: Bitmap Fonts in Phaser
description: How to load and use a bitmap font (BMFont .fnt) in Phaser 3 with this.load.bitmapFont and BitmapText.
---

# How to Use a Bitmap Font in Phaser

Phaser loads BMFont files with `this.load.bitmapFont` and displays them with `BitmapText`.

[Export your font](/guide/exporting-a-font) in the XML format.

Put the `.fnt` and `.png` files next to your other assets.

## Load the font

In your scene's `preload`, give the font a key and pass the paths to the image and the `.fnt` file:

```js
// load
preload() {
    this.load.bitmapFont('my-font', 'my-font.png', 'my-font.fnt');
}

// display
create() {
    this.add.bitmapText(200, 100, 'my-font', 'Hello\nCalligro');
}
```

## Resources

- [Full Phaser sample project](https://github.com/Voycawojka/calligro/tree/main/samples/phaser)
- [BitmapText documentation](https://docs.phaser.io/api-documentation/class/gameobjects-bitmaptext)
- [Loader bitmapFont documentation](https://docs.phaser.io/api-documentation/class/loader-loaderplugin#bitmapfont)
