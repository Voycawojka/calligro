import { MenuItem, MenuItemProps } from "@blueprintjs/core";
import { openUrl } from "@tauri-apps/plugin-opener";

interface Props extends Omit<MenuItemProps, "onClick"> {
    href: string
}

export default function MenuItemExternalLink({ href, ...props }: Props) {
    return <MenuItem {...props} onClick={() => {
        if (window.isTauri) {
            openUrl(href)
        } else {
            window.open(href, "_blank")?.focus()
        }
    }} />
}
