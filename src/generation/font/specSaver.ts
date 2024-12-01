import { isElectron } from "../../electron/electronInterop";
import { FontSpec } from "./Font";

type tagProp = [string, string | number]

function txtTag(name: string, properties: tagProp[]) {
    const joinedProps = properties.map(([ prop, value ]) => `${prop}=${value.toString()}`).join(' ')
    return `${name} ${joinedProps}`
}

function xmlTag(name: string, properties: tagProp[]) {
    const joinedProps = properties.map(([ prop, value ]) => `${prop}="${value.toString()}"`).join(' ')
    return `<${name} ${joinedProps} />`
}

export function fontSpecToTextFile(specification: FontSpec, format: 'txt' | 'xml') {
    const tag = format === 'txt' ? txtTag : xmlTag

    const info = specification.info
    const infoTag = tag('info', [
        ['face', info.face],
        ['size', info.size],
        ['unicode', '1'],
        ['bold', '0'],
        ['italic', '0'],
        ['stretchH', info.stretchH],
        ['aa', info.stretchH],
        ['padding', `${info.padding.up},${info.padding.right},${info.padding.down},${info.padding.left}`],
        ['spacing', `${info.spacing.horizontal},${info.spacing.vertical}`]
    ])

    const common = specification.common
    const commonTag = tag('common', [
        ['lineHeight', common.lineHeight],
        ['base', common.base],
        ['scaleW', common.scaleW],
        ['scaleH', common.scaleH],
        ['pages', common.pages]
    ])

    const pageTags = specification.pages.map(page => tag('page', [
        ['id', page.id],
        ['file', isElectron() ? `@<<PAGE_FILE_NAME_${page.id}>>` : page.file]
    ]))

    const charTags = specification.chars.map(char => tag('char', [
        ['id', char.id],
        ['x', char.x],
        ['y', char.y],
        ['width', char.width],
        ['height', char.height],
        ['xoffset', char.xoffset],
        ['yoffset', char.yoffset],
        ['xadvance', char.xadvance],
        ['page', char.page],
        ['chnl', char.chnl]
    ]))

    const kerningTags = specification.kernings.map(kerning => tag('kerning', [
        ['first', kerning.first],
        ['second', kerning.second],
        ['amount', kerning.amount]
    ]))

    switch(format) {
        case 'txt':
            return [
                infoTag,
                commonTag,
                ...pageTags,
                ...charTags,
                ...kerningTags
            ].join('\n')
        
        case 'xml':
            const font = [
                infoTag,
                commonTag,
                '<pages>',
                ...pageTags.map(tag => `\t${tag}`),
                '</pages>',
                `<chars count="${charTags.length}">`,
                ...charTags.map(tag => `\t${tag}`),
                '</chars>',
                `<kernings count="${kerningTags.length}">`,
                ...kerningTags.map(tag => `\t${tag}`),
                '</kernings>'
            ].join('\n\t')

            return [
                '<?xml version="1.0"?>',
                '<font>',
                '\t' + font,
                '</font>'
            ].join('\n')
    }
}
