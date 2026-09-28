---
title: Bitmap Fonts in LÖVE
description: How to use a bitmap font (BMFont .fnt) in LÖVE (Love2D) with love.graphics.newFont.
---

# How to Use a Bitmap Font in Love2D

Love2D loads BMFont files with `love.graphics.newFont`, the same way as a regular `.ttf` font.

[Export your font](/guide/exporting-a-font) in the TXT format.

Put the `.fnt` and `.png` files in your game folder next to each other.

## Load the font

```lua
-- load
font = love.graphics.newFont('my-font.fnt')

-- draw
love.graphics.setFont(font)
love.graphics.print('Hello\nCalligro', 100, 200)
```

## Resources

- [Full LÖVE sample project](https://github.com/Voycawojka/calligro/tree/main/samples/love2d)
- [love.graphics.newFont documentation](https://love2d.org/wiki/love.graphics.newFont)
