import { MenuItem } from "@blueprintjs/core";
import ToolbarMenu from "../ToolbarMenu";

export default function HelpMenu() {
    return (
        <ToolbarMenu buttonIcon="help" buttonText="Help">
            <MenuItem key="online-tutorial" icon="learning" text="Online Tutorial" onClick={() => 
                window.open("https://calligro.ideasalmanac.com/tutorial.html", "_blank")?.focus()
            } />
        </ToolbarMenu>
    )
}
