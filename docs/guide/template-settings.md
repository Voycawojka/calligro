---
description: Set up a bitmap font template in Calligro. Pre-fill it with a TTF font, pick colors and outlines, and choose the character set.
---

# Template Settings

In Template Settings you define the template, which is an image with blank spots where you'll draw your characters.

Press the "Preview Template" button at the bottom to see how it looks.
For a new project, you'll see a grid of transparent squares.
Each square corresponds to a different character (like "a", "b", "c", etc.), with 95 characters included by default.

![Blank template preview](/img/blank-template-preview.png)

## Pre-fill with a TTF font

Close the preview and check out the "Prefill" input at the top of Template Settings.
It lets you choose a regular TTF font to prefill the template.
Once you select a font, you'll immediately see a sample text preview.

![Prefill dropdown](/img/font-dropdown.png)
![Prefill input with sample text](/img/prefill-preview.png)

You can also adjust the font fill color, outline color, and outline width using the inputs below.
When you're done, press "Preview Template" again to see the updated template with your chosen font and colors.

![Prefilled template preview](/img/prefill-template-preview.png)

::: info
For technical reasons, the prefill dropdown in the web app only shows a limited set of commonly used fonts.
The desktop app lets you choose any font installed on your system.
:::

## Character set

Below the Prefill input, you'll find the "Character Set" button.
Click it to open a dialog where you can choose the characters to include in your template.
You can enter any characters manually, or start from a preset like "Basic Latin" or "Hiragana" using the "Override with preset" button.

![Character set dialog](/img/character-set-dialog.png)
![Character set preset dropdown](/img/preset-dropdown.png)

::: info
Emojis and other characters made of multiple code points are not supported.
You can, however, include any graphics you want by assigning them to characters you won't otherwise use.
:::
