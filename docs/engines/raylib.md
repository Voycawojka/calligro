---
title: Bitmap Fonts in raylib
description: How to load and draw a bitmap font (BMFont .fnt) in raylib with LoadFont and DrawTextEx.
---

# How to Use a Bitmap Font in raylib

Raylib loads BMFont files with `LoadFont` and draws them with `DrawTextEx`.

[Export your font](/guide/exporting-a-font) in the TXT format.

Put the `.fnt` and `.png` files next to each other.

## Load the font

```c
// load
Font font = LoadFont("my-font.fnt");

// draw
BeginDrawing();
    // use `font.baseSize` as the size to draw at the font's original pixel size
    DrawTextEx(font, "Hello\nCalligro", (Vector2){ 100.0f, 200.0f }, (float)font.baseSize, 1, WHITE);
EndDrawing();

// clean up
UnloadFont(font);
```

## Resources

- [Full raylib sample project](https://github.com/Voycawojka/calligro/tree/main/samples/raylib)
- [Raylib cheatsheet](https://www.raylib.com/cheatsheet/cheatsheet.html) (see `LoadFont` and `DrawTextEx`)
- [Official raylib font loading example](https://github.com/raysan5/raylib/blob/master/examples/text/text_font_loading.c)
