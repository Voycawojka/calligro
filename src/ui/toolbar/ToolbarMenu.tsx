import { Popover, Menu, Button, IconName } from "@blueprintjs/core";
import { PropsWithChildren } from "react";

export interface Props extends PropsWithChildren {
    buttonIcon: IconName
    buttonText: string
}

export default function ToolbarMenu({ children, buttonIcon, buttonText }: Props) {
    return (
        <Popover
            interactionKind="click"
            placement="bottom"
            minimal
            content={
                <Menu>
                    {children}
                </Menu>
            }
            renderTarget={({ isOpen, ...targetProps }) => (
                <Button {...targetProps} icon={buttonIcon}>{buttonText}</Button>
            )}
        />
    )
}
