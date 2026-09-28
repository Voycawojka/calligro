---
title: Bitmap Fonts in HaxeFlixel
description: How to use a bitmap font (BMFont .fnt) in HaxeFlixel with FlxBitmapFont.fromAngelCode and FlxBitmapText.
---

# How to Use a Bitmap Font in HaxeFlixel

HaxeFlixel loads BMFont files with `FlxBitmapFont.fromAngelCode` and displays them with `FlxBitmapText`.

[Export your font](/guide/exporting-a-font) in the XML format.

Put the `.png` file in `assets/images` and the `.fnt` file in `assets/data` (or wherever you keep assets).

```haxe
// load
var font = FlxBitmapFont.fromAngelCode(AssetPaths.my_font__png, AssetPaths.my_font__fnt);

// display
var text = new FlxBitmapText(font);
text.text = "Hello\nCalligro";
add(text);
```

## Resources

- [Full HaxeFlixel sample project](https://github.com/Voycawojka/calligro/tree/main/samples/haxeflixel)
- [FlxBitmapFont documentation](https://api.haxeflixel.com/flixel/graphics/frames/FlxBitmapFont.html)
