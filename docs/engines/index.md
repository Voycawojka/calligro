---
title: Engines and Frameworks
description: How to use a bitmap font (BMFont .fnt) generated with Calligro in Godot, Phaser, LÖVE, libGDX, HaxeFlixel, Heaps.io and raylib.
---

# Using Bitmap Fonts in Game Engines

Calligro exports fonts in the BMFont format: a `.fnt` file plus one or more `.png` images.
It's the de facto standard for bitmap fonts and is supported by most game engines and frameworks.

Pick your engine below for code examples.

## Compatibility

| Engine | Format | Kerning pairs |
| --- | --- | --- |
| [Godot 4](/engines/godot-4) | TXT | ✅ Supported |
| [Godot 3](/engines/godot-3) | TXT | ✅ Supported |
| [Phaser](/engines/phaser) | XML | ❔ Unverified |
| [LÖVE](/engines/love2d) | TXT | ❔ Unverified |
| [libGDX](/engines/libgdx) | TXT | ❔ Unverified |
| [HaxeFlixel](/engines/haxeflixel) | XML | ❔ Unverified |
| [Heaps.io](/engines/heaps) | TXT | ❔ Unverified |
| [Raylib](/engines/raylib) | TXT | ❔ Unverified |

Each engine above has a sample project included in the [Calligro repository](https://github.com/Voycawojka/calligro/tree/main/samples).
The samples contain no Calligro-specific code. 
They only show how each engine loads a standard BMFont file.

::: tip Engine not listed?
Ask on [Discord](https://discord.gg/5MmEpXWSsV) so it can be added or [contribute yourself](https://github.com/Voycawojka/calligro)!
:::
