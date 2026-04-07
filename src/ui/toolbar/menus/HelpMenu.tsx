import ToolbarMenu from "../ToolbarMenu";
import MenuItemExternalLink from "../MenuItemExternalLink";

export default function HelpMenu() {
    return (
        <ToolbarMenu buttonIcon="help" buttonText="Help">
            <MenuItemExternalLink key="video-tutorial" icon="video" text="Video Tutorial" href="https://youtu.be/cmwSS-oLLBo" />
            <MenuItemExternalLink key="written-tutorial" icon="learning" text="Written Tutorial" href="https://calligro.ideasalmanac.com/tutorial.html" />
            <MenuItemExternalLink key="discord" icon="chat" text="Join Discord" href="https://discord.gg/5MmEpXWSsV" />
        </ToolbarMenu>
    )
}
