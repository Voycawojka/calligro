import { ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import FileMenu from "./menus/FileMenu";
import MoreMenu from "./menus/MoreMenu";
import HelpMenu from "./menus/HelpMenu";
import { useContext } from "react";
import { ProjectContext } from "../ProjectContext";

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
        </Navbar>
    )
}
