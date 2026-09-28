---
description: Adjust letter spacing, line height and kerning pairs of a bitmap font in Calligro.
---

# Spacing and Kerning

Font Settings let you adjust additional properties like spacing, line height, and kerning.
These can still be changed after the template has been imported.

## Spacing and line height

Horizontal spacing is the space in pixels between characters.
If spacing is set to 0, characters are directly next to each other (as defined by the template sizes).

Line height is the vertical space between lines of text.

![Spacing and line height inputs](/img/spacing-input.png)

::: info
There's also a vertical spacing input.
It's deprecated since Calligro 2.4.0.
Use line height instead.
:::

## Kerning pairs

Kerning pairs let you define custom spacing between specific character pairs.
For example, if you want "a" to be closer to "b" than to "c", add a kerning pair for "ab" with a negative value.
This value sets how much the second character moves relative to the first.

::: warning
Although kerning pairs are part of the BMFont specification, not all game engines support them.
This is often not documented, so you may need to test whether your engine supports kerning.
See the [engine compatibility table](/engines/#compatibility) for known cases.
:::

To add a pair, click the "+" button next to the kerning pairs input.
A dialog appears where you can enter the characters and spacing.
Click "Add" to save the pair.

You can enter multiple characters in the first and second character inputs to create multiple pairs at once.
For example, entering "ab" in the first input and "cd" in the second creates the pairs "ac", "ad", "bc", and "bd".

![Add kerning pair dialog](/img/add-kerning.png)

You can edit an existing pair by selecting it from the dropdown and adjusting the distance.
To remove a pair, press the "-" button next to the dropdown.

![Edit kerning](/img/edit-kerning.png)
![Kerning preview](/img/kerning-preview.png)
