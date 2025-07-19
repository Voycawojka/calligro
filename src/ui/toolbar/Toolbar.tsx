import { Alignment, ButtonGroup, Navbar, NavbarDivider, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import FileMenu from "./menus/FileMenu";
import MoreMenu from "./menus/MoreMenu";
import HelpMenu from "./menus/HelpMenu";
import { useContext } from "react";
import { useState } from "react";
import { ProjectContext } from "../contexts/ProjectContext";
import ThemeSwitch from "./ThemeSwitch";
import { useUpdater } from "./useUpdater";
import UpdaterIcon from "./UpdaterIcon";
import UpdaterModal from "./UpdaterModal";

export default function Toolbar() {
    const project = useContext(ProjectContext)
    const [hasUpdate, updaterInfo] = useUpdater();
    const [updaterModalOpen, setUpdaterModalOpen] = useState(false);

    return (
        <Navbar>
            <NavbarGroup>
                <img src="../../../public/favicon.svg" height="30px" />
                <NavbarDivider />
                <ButtonGroup>
                    <FileMenu />
                    <MoreMenu />
                    <HelpMenu />
                </ButtonGroup>
                { hasUpdate && updaterInfo && (
                    <>
                        <NavbarDivider />
                        <UpdaterIcon onClick={() => setUpdaterModalOpen(true)} />
                        <UpdaterModal isOpen={updaterModalOpen} setIsOpen={setUpdaterModalOpen} versionInfo={updaterInfo} />
                    </>
                )}
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
