import { Alignment, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading, Slider, Switch } from "@blueprintjs/core";
import FileMenu from "./menus/FileMenu";
import MoreMenu from "./menus/MoreMenu";
import HelpMenu from "./menus/HelpMenu";
import { useContext } from "react";
import { ProjectContext } from "../contexts/ProjectContext";
import ThemeSwitch from "./ThemeSwitch";

export default function Toolbar() {
    const project = useContext(ProjectContext)

    return (
        <Navbar>
            <NavbarGroup>
                <NavbarHeading>Calligro</NavbarHeading>
                <NavbarDivider />
                <ButtonGroup>
                    <FileMenu />
                    <MoreMenu />
                    <HelpMenu />
                </ButtonGroup>
                { project &&
                    <>
                        <NavbarDivider />
                        <NavbarHeading>
                            Project: <strong>{project.name}</strong> {project.dirty && "(unsaved)"}
                        </NavbarHeading>
                    </>
                }
            </NavbarGroup>
            <NavbarGroup align={Alignment.END}>
                <ThemeSwitch />
            </NavbarGroup>
        </Navbar>
    )
}
