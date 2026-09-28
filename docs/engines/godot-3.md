---
title: Bitmap Fonts in Godot 3
description: How to import and use a bitmap font (BMFont .fnt) in Godot 3, in the editor or from GDScript.
---

# How to Use a Bitmap Font in Godot 3

Godot 3 imports BMFont `.fnt` files natively as a `BitmapFont` resource.
You can use it exactly the same way as a regular TTF font.

[Export your font](/guide/exporting-a-font) in the TXT format.

Copy the `.fnt` and `.png` files into your Godot project folder. Keep them next to each other.

## In the editor

Select a control node (e.g. a `Label`) and in the Inspector set **Custom Fonts -> Font** to your `.fnt` file.

## In GDScript

```gdscript
# load
var font = load("res://my-font.fnt")

# apply to a control node
$Label.add_font_override("font", font)
```

## Resources

- [Full Godot 3 sample project](https://github.com/Voycawojka/calligro/tree/main/samples/godot3)
- [BitmapFont class documentation](https://docs.godotengine.org/en/3.6/classes/class_bitmapfont.html)
