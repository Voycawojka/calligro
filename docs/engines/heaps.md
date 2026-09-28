---
title: Bitmap Fonts in Heaps.io
description: How to use a bitmap font (BMFont .fnt) in Heaps.io with hxd.Res and h2d.Text.
---

# How to Use a Bitmap Font in Heaps.io

Heaps.io loads BMFont files through its resource system and displays them with `h2d.Text`.

[Export your font](/guide/exporting-a-font) in the TXT format.

Put the `.fnt` and `.png` files in the `res` folder.

Initialize resources, then get the font by its file name.

```haxe
// load
hxd.Res.initEmbed();
var font: h2d.Font = hxd.Res.my_font.toFont();

// display
var text = new h2d.Text(font);
text.text = "Hello\nCalligro";
s2d.addChild(text);
```

## Resources

- [Full Heaps.io sample project](https://github.com/Voycawojka/calligro/tree/main/samples/heaps)
- [Heaps.io text documentation](https://heaps.io/documentation/text.html)
