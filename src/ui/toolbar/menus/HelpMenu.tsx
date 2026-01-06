import { MenuItem } from "@blueprintjs/core";
import ToolbarMenu from "../ToolbarMenu";

export default function HelpMenu() {
    return (
        <ToolbarMenu buttonIcon="help" buttonText="Help">
            <MenuItem key="online-tutorial" icon="learning" text="Online Tutorial" onClick={() => 
                window.open("https://calligro.ideasalmanac.com/tutorial.html", "_blank")?.focus()
            } />
            <MenuItem key="discord" icon="chat" text="Join Discord" onClick={() =>
                window.open("https://discord.gg/5MmEpXWSsV", "_blank")?.focus()
            } />
        </ToolbarMenu>
    )
}
