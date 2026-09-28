---
description: The explanaton of the BMFont bitmap font format. The difference between the TXT and XML versions and which one to use.
---

# BMFont Format: TXT vs XML

Calligro exports fonts in the BMFont format, created by AngelCode.
It's the most widely supported bitmap font format in game engines and frameworks.

A BMFont font consists of:

- a **`.fnt` file**: describes the font properties and where each character is on the image
- one or more **`.png` pages**: the images containing the characters

The `.fnt` file refers to the pages by file name so keep them in the same folder.

## TXT vs XML

The `.fnt` file comes in several versions with the same content in different syntax.

Calligro can export the two most common versions: TXT (`key=value` pairs) and XML .
Both files use the `.fnt` extension.
Engines usually support only one of them and it's generally undocumented.
See the [compatibility table](/engines/#compatibility) for the known formats.

## Kerning

Kerning pairs are part of the BMFont specification but not all engines support them.
See the [compatibility table](/engines/#compatibility) and [Spacing and Kerning](/guide/spacing-and-kerning#kerning-pairs).

## Specification

- [Official BMFont file format documentation](https://www.angelcode.com/products/bmfont/doc/file_format.html)
