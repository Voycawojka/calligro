import { MenuItem, MenuDivider } from "@blueprintjs/core";
import PlatformSwitch from "../../envSpecific/PlatformSwitch";
import ToolbarMenu from "../ToolbarMenu";
import { useState } from "react";
import AboutDialog from "../dialogs/AboutDialog";
import MenuItemExternalLink from "../MenuItemExternalLink";

export default function MoreMenu() {
    const [aboutModalOpen, setAboutModalOpen] = useState(false)

    return (
        <>
            <ToolbarMenu buttonIcon="array" buttonText="More">
                <MenuItemExternalLink key="github-repository" icon="git-repo" text="Github Repository" href="https://github.com/Voycawojka/calligro" />
                <MenuItemExternalLink key="proposals" icon="lightbulb" text="Propose a feature or report a bug" href="https://github.com/Voycawojka/calligro/issues" />
                <PlatformSwitch
                    desktop={() => <MenuItemExternalLink key="website" icon="open-application" text="Website" href="https://calligro.ideasalmanac.com" />}
                    web={() => <MenuItemExternalLink key="desktop-app" icon="open-application" text="Desktop App" href="https://voycawojka.itch.io/calligro" />}
                />
                <MenuItemExternalLink key="discord" icon="chat" text="Join Discord" href="https://discord.gg/5MmEpXWSsV" />
                <MenuDivider />
                <MenuItem key="about" icon="info-sign" text="About" onClick={() => setAboutModalOpen(true)} /> 
            </ToolbarMenu>

            <AboutDialog isOpen={aboutModalOpen} setIsOpen={setAboutModalOpen} />
        </>
    )
}
