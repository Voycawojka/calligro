---
title: Bitmap Fonts in Godot 4
description: How to import and use a bitmap font (BMFont .fnt) in Godot 4, in the editor or from GDScript.
---

# How to Use a Bitmap Font in Godot 4

Godot 4 imports BMFont `.fnt` files natively as a `FontFile` resource.
You can use it exactly the same way as a regular TTF font.

[Export your font](/guide/exporting-a-font) in the TXT format.

Copy the `.fnt` and `.png` files into your Godot project folder. Keep them next to each other.

## In the editor

Select a control node (e.g. a `Label`) and in the Inspector set **Theme Overrides -> Fonts -> Font** to your `.fnt` file.
Of course you can also use a theme resource.

For pixel art fonts, set filtering to `nearest` so the characters stay crisp.

## In GDScript

```gdscript
# load
var font = load("res://my-font.fnt")

# apply to a control node
$Label.add_theme_font_override("font", font)
```

## Resources

- [Full Godot 4 sample project](https://github.com/Voycawojka/calligro/tree/main/samples/godot4)
- [FontFile class documentation](https://docs.godotengine.org/en/stable/classes/class_fontfile.html)
