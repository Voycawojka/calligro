# Calligro
Online bitmap font creator. 

Available at [calligro.ideasalmanac.com](https://calligro.ideasalmanac.com)

![Build & Deploy](https://github.com/Voycawojka/calligro/workflows/Build%20&%20Deploy/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/voycawojka/calligro/badge)](https://www.codefactor.io/repository/github/voycawojka/calligro)

Calligro generates bitmap fonts in the [AngelCode's BMFont](https://www.angelcode.com/products/bmfont/) format.
Unlike the original BMFont and other tools it doesn't convert TTF but instead generates bitmap fonts from custom images.

The workflow is as follows:
- generate a Calligro template (which is a .png image)
- draw your characters on the template in any graphics editor (Photoshop, Gimp, Aseprite, anything else)
- upload the filled template back to Calligro and download a bitmap font

Everything is calculated on the client side. No files are sent or stored on the server (we use gh pages anyway).

# Samples
The BMFont format has existed for a while and a lot of game frameworks, libraries and engines support it out of the box.
Some examples and more details on compatibility can be found in the [samples/](samples) directory.

# Use case
Calligro is useful when you need to draw a custom font stored as a spritesheet. Pixelart font would be a good use.

If you want to convert an existing truetype font into a bitmap font, try one of those tools instead:
- [AngelCode's BMFont](https://www.angelcode.com/products/bmfont/) 
- [Hiero](https://github.com/libgdx/libgdx/wiki/Hiero)
- [ShoeBox](http://renderhjs.net/shoebox/)
- [Littera](http://kvazars.com/littera/) (requires Flash)

# Contributing
If you'd like to contribute: thanks!

This is a regular create-react-app project in TypeScript using npm (not yarn) so:

```bash
# install dependencies and start a dev server with hot reloading
npm install
npm start

# then optionally start the desktop app
npm run electron:dev
```

Our actions use Node 14.

## Production builds

### Web

Create the production web build in the `build/` directory:

```bash
npm run build
```

### Desktop

Create the production destop build for Windows and Linux in the `electron_build/` directory:

```
npm run electron:build
```

Note this command only works on Windows.
