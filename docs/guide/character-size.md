---
description: Set the character width, height and baseline of a bitmap font in Calligro, and override the size of individual characters.
---

# Character Size and Base

Below the character set input are the width, height, and base inputs.
Width and height define the pixel size of each character.

The base sets the vertical position where the character "sits".
Anything below the base extends downward, like in "j" or "g".
For example, a character with a height of 100 and a base of 70 will have 30 pixels of space below the base.

When previewing the template, horizontal lines between character slots show the base for each character.

![Size and base inputs](/img/size-inputs.png)

## Size overrides

Below the size and base settings is the "Size Overrides" section.
It lets you define custom sizes for specific characters.

Click the "+" button to open a dialog where you can add characters to the override list.
For example, enter "abc" and click "Add all" to include "a", "b", and "c".

![Size overrides dialog](/img/add-size-override.png)

Select a character like "a" from the dropdown next to the "+" button.
Width and height inputs will appear.
Change them and press "Preview Template" to see the updated size in the template.

![Size override example](/img/a-override.png)
![Template preview with a size override](/img/template-with-override.png)
