---
title: Bitmap Fonts in libGDX
description: How to load and draw a bitmap font (BMFont .fnt) in libGDX with the BitmapFont class.
---

# How to Use a Bitmap Font in libGDX

libGDX loads BMFont files with its `BitmapFont` class.

[Export your font](/guide/exporting-a-font) in the TXT format.

Put the `.fnt` and `.png` files in your assets folder (e.g. `core/assets`).

```java
// load
FileHandle fnt = Gdx.files.internal("my-font.fnt");
FileHandle page = Gdx.files.internal("my-font.png");
BitmapFont font = new BitmapFont(fnt, page, false);

// draw with a SpriteBatch
batch.begin();
font.draw(batch, "Hello\nCalligro", 20, 300);
batch.end();

// clean up
font.dispose();
```

## Resources

- [Full libGDX sample project](https://github.com/Voycawojka/calligro/tree/main/samples/libgdx)
- [BitmapFont class documentation](https://javadoc.io/doc/com.badlogicgames.gdx/gdx/latest/com/badlogic/gdx/graphics/g2d/BitmapFont.html)
