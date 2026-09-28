---
description: Export a bitmap font from Calligro in the BMFont TXT or XML format and find out which format your game engine needs.
---

# Exporting a Font

Once you're happy with your font, export it by pressing "Export Font".
You can choose between the TXT and XML formats.
Different game engines require different formats.
This often isn't documented, so you may need to try both.

![Font export dialog](/img/font-export-dialog.png)

The export produces a `.fnt` file (the font description) and a `.png` image (the character page).
Keep them in the same folder, since the `.fnt` file refers to the image by name.

For later exports, press "Reexport" to quickly export the font to the same files again.

## Which format should I use?

Check the [compatibility table](/engines/#compatibility) for the format your engine needs.
See [Engines and Frameworks](/engines/) for code examples for each one, and [BMFont Format: TXT vs XML](/reference/bmfont-format) for details on the formats.

To get help or report issues, join the [Ideas Almanac Discord server](https://discord.gg/5MmEpXWSsV).
