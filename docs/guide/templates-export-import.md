---
description: Export a Calligro font template as PNG or Aseprite, draw your characters in any graphics editor, and import the template back.
---

# Exporting and Importing Templates

If you only want to use the [pre-fill option](/guide/template-settings#pre-fill-with-a-ttf-font) and don't want to draw your own characters, you can skip this step.
To draw your own characters, you'll need to export the template.

## Exporting the template

To export the template, press "Export Template" at the bottom.
You can choose either PNG or Aseprite format.
Aseprite templates have the grid and the pre-filled font as separate layers.

You now have an image file that can be edited in any graphics editor.
Remember that the horizontal lines show character baselines.
Once you're done drawing, import the file back into Calligro.

![Template export dialog](/img/template-export-dialog.png)

## Importing templates

In Font Settings, notice a label that says "Current template: your-file-name".
It means Calligro is aware of the file.
Press "Reimport" to reload the file and see your changes in the preview.

::: info
If the label ever says "Current template: embedded in project", the template is stored in the project file and not linked to an external file.
In that case, press "Import New Template" to link a file to the project.
:::

You can enable "Auto reimport on changes" next to "Reimport" to have Calligro automatically reimport the template whenever the file changes.

![Template import controls](/img/template-import-controls.png)
![Preview of an imported template](/img/imported-preview.png)

After importing, Template Settings are disabled by default.
It's best to leave them alone from now on.

::: info
You can still make changes by checking "Edit anyway" at the top, but those changes won't affect the font unless you export and import the template again.
:::
