# BMFont Raylib Sample

This project was created with raylib 4.0

The example is supposed to be compiled with the default Notepad++ setup.

See the `main.c` file for the font usage.

Note raylib requires the TXT version of the format.
It also doesn't support kerning pairs.

- [raylib cheatsheet](https://www.raylib.com/cheatsheet/cheatsheet.html) (see `LoadFont` and `DrawTextEx` functions)
- [official bmfont example](https://github.com/raysan5/raylib/blob/master/examples/text/text_font_loading.c)

## Warning

Fonts generated by Calligro are not compatible with raylib out of the box. We'll look into it and in the meantime use the following workaround:

Generate a font in the TXT format and edit the `.fnt` file manually in a text editor. Change the 3rd line from this:

```
page id=0 file=calligro-page-0.png
```

into this:

```
page id=0 file="calligro-page-0.png"
chars count=X
```

where `X` is equal to the number of characters in your font. Also note the added quotation marks.

