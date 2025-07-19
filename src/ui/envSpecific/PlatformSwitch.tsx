import { ReactNode } from "react";
import { WebOnly } from "./WebOnly";
import { DesktopOnly } from "./DesktopOnly";

export interface Props {
    desktop: () => ReactNode
    web: () => ReactNode
}

export default function PlatformSwitch({ desktop, web }: Props) {
    return (
        <>
            <DesktopOnly>
                {desktop()}
            </DesktopOnly>
            <WebOnly>
                {web()}
            </WebOnly>
        </>
    )
}
