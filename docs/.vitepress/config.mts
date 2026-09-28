import { defineConfig } from 'vitepress'

const siteUrl = 'https://calligro.ideasalmanac.com'
const base = '/tutorial/'

export default defineConfig({
  base,
  outDir: '../dist/tutorial',
  lang: 'en',
  title: 'Calligro Tutorial',
  titleTemplate: ':title | Calligro Bitmap Font Generator',
  description: 'Learn how to create bitmap fonts with Calligro and use them in Godot, LÖVE, raylib and other frameworks',
  cleanUrls: true,
  lastUpdated: true,
  appearance: 'force-dark',

  sitemap: {
    hostname: siteUrl + base,
  },

  head: [
    ['link', { rel: 'icon', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#000000' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:image', content: `${siteUrl}/OgImage.png` }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:image', content: `${siteUrl}/OgImage.png` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap' }],
    ['script', { 'data-goatcounter': 'https://goat-calligro.ideasalmanac.com/count', async: '', src: '//goat-calligro.ideasalmanac.com/count.js' }],
  ],

  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')
    const url = siteUrl + base + path
    const title = pageData.frontmatter.title ?? pageData.title
    const description = pageData.frontmatter.description ?? pageData.description

    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push(
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:title', content: `${title} | Calligro` }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'twitter:title', content: `${title} | Calligro` }],
      ['meta', { property: 'twitter:description', content: description }],
    )
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Tutorial',

    nav: [
      { text: 'Home', link: siteUrl + '/', target: '_self' },
      { text: 'Web App', link: siteUrl + '/webapp.html', target: '_self' },
      { text: 'Download', link: 'https://voycawojka.itch.io/calligro' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Web App vs Desktop App', link: '/guide/installation' },
          { text: 'UI Overview', link: '/guide/ui-overview' },
        ],
      },
      {
        text: 'Creating a Font',
        items: [
          { text: 'Template Settings', link: '/guide/template-settings' },
          { text: 'Character Size and Base', link: '/guide/character-size' },
          { text: 'Exporting and Importing Templates', link: '/guide/templates-export-import' },
          { text: 'Spacing and Kerning', link: '/guide/spacing-and-kerning' },
          { text: 'Exporting a Font', link: '/guide/exporting-a-font' },
        ],
      },
      {
        text: 'Using the Font',
        items: [
          { text: 'Engines and Frameworks', link: '/engines/' },
          { text: 'Godot 4', link: '/engines/godot-4' },
          { text: 'Godot 3', link: '/engines/godot-3' },
          { text: 'Phaser', link: '/engines/phaser' },
          { text: 'LÖVE', link: '/engines/love2d' },
          { text: 'libGDX', link: '/engines/libgdx' },
          { text: 'HaxeFlixel', link: '/engines/haxeflixel' },
          { text: 'Heaps.io', link: '/engines/heaps' },
          { text: 'Raylib', link: '/engines/raylib' },
        ],
      },
      {
        text: 'Reference',
        items: [
          { text: 'BMFont Format: TXT vs XML', link: '/reference/bmfont-format' },
        ],
      },
    ],

    search: {
      provider: 'local',
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Voycawojka/calligro' },
      { icon: 'discord', link: 'https://discord.gg/5MmEpXWSsV' },
    ],

    editLink: {
      pattern: 'https://github.com/Voycawojka/calligro/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: '<a href="/privacy.html" target="_self">Privacy policy</a>',
      copyright: 'Calligro by Filip A. Kowalski and Dominik Józefiak',
    },
  },
})
