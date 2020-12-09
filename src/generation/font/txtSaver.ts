import { FontSpec } from "./Font";

function tag(name: string, properties: [string, string | number][]) {
    const joinedProps = properties.map(([ prop, value ]) => `${prop}="${value.toString()}"`).join(' ')
    return `${name} ${joinedProps}`
}

export function fontSpecToTxt(specification: FontSpec) {
    const info = specification.info
    const infoTag = tag('info', [
        ['face', info.face],
        ['size', info.size],
        ['unicode', '1'],
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
        ['file', page.file]
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

    return [
        infoTag,
        commonTag,
        ...pageTags,
        ...charTags
    ].join('\n')
}
