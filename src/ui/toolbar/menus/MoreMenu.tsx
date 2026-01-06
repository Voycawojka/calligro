import { MenuItem, MenuDivider } from "@blueprintjs/core";
import PlatformSwitch from "../../envSpecific/PlatformSwitch";
import ToolbarMenu from "../ToolbarMenu";
import { useState } from "react";
import AboutDialog from "../dialogs/AboutDialog";

export default function MoreMenu() {
    const [aboutModalOpen, setAboutModalOpen] = useState(false)

    return (
        <>
            <ToolbarMenu buttonIcon="array" buttonText="More">
                <MenuItem key="github-repository" icon="git-repo" text="Github Repository" onClick={() => 
                    window.open("https://github.com/Voycawojka/calligro", "_blank")?.focus()
                } />
                <MenuItem key="proposals" icon="lightbulb" text="Propose a feature or report a bug" onClick={() =>
                    window.open("https://github.com/Voycawojka/calligro/issues", "_blank")?.focus()
                } />
                <PlatformSwitch
                    desktop={() => <MenuItem key="website" icon="open-application" text="Website" onClick={() =>
                        window.open("https://calligro.ideasalmanac.com", "_blank")?.focus()
                    } />}
                    web={() => <MenuItem key="desktop-app" icon="open-application" text="Desktop App" onClick={() =>
                        window.open("https://voycawojka.itch.io/calligro", "_blank")?.focus()
                    } />}
                />
                <MenuItem key="discord" icon="chat" text="Join Discord" onClick={() =>
                    window.open("https://discord.gg/5MmEpXWSsV", "_blank")?.focus()
                } />
                <MenuDivider />
                <MenuItem key="about" icon="info-sign" text="About" onClick={() => setAboutModalOpen(true)} /> 
            </ToolbarMenu>

            <AboutDialog isOpen={aboutModalOpen} setIsOpen={setAboutModalOpen} />
        </>
    )
}
