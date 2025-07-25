# Calligro
Online bitmap font creator. 

Available at [calligro.ideasalmanac.com](https://calligro.ideasalmanac.com)

Desktop version is hosted on [itch.io](https://voycawojka.itch.io/calligro)

![Build & Deploy](https://github.com/Voycawojka/calligro/workflows/Build%20&%20Deploy/badge.svg)
[![CodeFactor](https://www.codefactor.io/repository/github/voycawojka/calligro/badge)](https://www.codefactor.io/repository/github/voycawojka/calligro)

Calligro generates bitmap fonts in the [AngelCode's BMFont](https://www.angelcode.com/products/bmfont/) format.
It can be used to convert a TTF but unlike the original BMFont and other tools it can also generate bitmap fonts from custom images.

The workflow is as follows:
- generate a Calligro template (which is a .png image)
- draw your characters on the template in any graphics editor (Photoshop, Gimp, Aseprite, anything else)
- upload the filled template back to Calligro and download a bitmap font

Everything is calculated on the client side. No files are sent or stored on the server.

There is also an offline version available for Windows and Linux. It has the same core features but is a little bit more convenient to use. It also detects system fonts better.

# Samples
The BMFont format has existed for a while and a lot of game frameworks, libraries and engines support it out of the box.
Some examples and more details on compatibility can be found in the [samples/](samples) directory.

# Tutorial
A tutorial is available at [calligro.ideasalmanac.com](https://calligro.ideasalmanac.com/tutorial.html).

# Use case
Calligro is useful when you need to draw a custom font stored as a spritesheet. Pixelart font would be a good use.

If you only want to convert an existing truetype font into a bitmap font, you can also try one of those tools instead:
- [AngelCode's BMFont](https://www.angelcode.com/products/bmfont/) 
- [Hiero](https://libgdx.com/wiki/tools/hiero)
- [ShoeBox](http://renderhjs.net/shoebox/)

# Contributing
If you'd like to contribute: thanks!

This is a regular React/TypeScript project:

```bash
# install dependencies and start a dev server with hot reloading
npm install
npm run dev

# then optionally start the desktop app
cd electron_resources
npm install
cd ..
npm run electron:dev

# run unit tests
npm run test
```

Our actions use Node 20.

## Production builds

### Web

Create the production web build in the `dist/` directory:

```bash
npm run build
```

### Desktop

Create the production destop build for Windows and Linux in the `electron_build/` directory:

```
npm run electron:build
```

Note this command only works on Windows.
