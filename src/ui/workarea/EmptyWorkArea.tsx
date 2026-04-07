import { Button, ButtonGroup, Card, Classes, H6, Icon, OverlayToaster } from "@blueprintjs/core";
import { useContext, useState } from "react";
import { listProjectNames, loadProject } from "../../filesystem/projectstore";
import { ProjectMutContext } from "../contexts/ProjectContext";
import NewProjectDialog from "../toolbar/dialogs/NewProjectDialog";
import OpenProjectDialog from "../toolbar/dialogs/OpenProjectDialog";
import styles from "./emptyworkarea.module.css";
import { openUrl } from "@tauri-apps/plugin-opener";

export default function EmptyWorkArea() {
    const [newProjectOpen, setNewProjectOpen] = useState(false);
    const [openProjectOpen, setOpenProjectOpen] = useState(false);
    const { setProjectData } = useContext(ProjectMutContext);
    // TODO: this should update when a project is deleted
    const recentProjects = listProjectNames(5);

    const openRecent = async (name: string) => {
        try {
            const loadedProject = loadProject(name)
            if (!loadedProject) {
                throw new Error("Couldn't open project")
            }
            setProjectData(loadedProject)
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                intent: "success",
                message: `Project '${name}' opened.`
            })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
        }
    }

    const externalLink = (href: string) => {
        if (window.isTauri) {
            openUrl(href)
        } else {
            window.open(href, "_blank")?.focus()
        }
    }

    return (
        <div className={styles.container}>
            <img src="/img/promo/logo.svg" alt="Calligro" className={styles.logo} />

            <div>
                <H6 className={Classes.TEXT_MUTED}>Get started</H6>
                <ButtonGroup fill>
                    <Button icon="new-object" intent="primary" text="New Project" onClick={() => setNewProjectOpen(true)} size="large" />
                    <Button icon="document-open" text="Open Project" onClick={() => setOpenProjectOpen(true)} size="large" />
                </ButtonGroup>
            </div>

            {recentProjects.length > 0 && (
                <div>
                    <H6 className={Classes.TEXT_MUTED}>Recent projects</H6>
                    <div className={styles.recentProjects}>
                        {recentProjects.map(name => (
                            <Button key={name} icon="document-open" text={name} onClick={() => openRecent(name)} />
                        ))}
                    </div>
                </div>
            )}

            <div>
                <H6 className={Classes.TEXT_MUTED}>Resources</H6>
                <div className={styles.resourceCards}>
                    <Card interactive elevation={2} className={`${styles.resourceCard} ${styles.texttutorial}`} onClick={() => externalLink("https://calligro.ideasalmanac.com/tutorial.html")}>
                        <Icon icon="manual" size={28} color="#FFD76C" />
                        <strong>Text Tutorial</strong>
                        <small className={Classes.TEXT_MUTED}>Step-by-step guide to creating your first font</small>
                    </Card>
                    <Card interactive elevation={2} className={`${styles.resourceCard} ${styles.videotutorial}`} onClick={() => externalLink("https://youtu.be/cmwSS-oLLBo")}>
                        <Icon icon="video" size={28} color="#FF6B6B" />
                        <strong>Video Tutorial</strong>
                        <small className={Classes.TEXT_MUTED}>Watch a full walkthrough on YouTube</small>
                    </Card>
                    <Card interactive elevation={2} className={`${styles.resourceCard} ${styles.discord}`} onClick={() => externalLink("https://discord.gg/5MmEpXWSsV")}>
                        <Icon icon="chat" size={28} color="#5865F2" />
                        <strong>Discord</strong>
                        <small className={Classes.TEXT_MUTED}>Get help and share your work with the community</small>
                    </Card>
                </div>
            </div>

            <NewProjectDialog isOpen={newProjectOpen} setIsOpen={setNewProjectOpen} />
            <OpenProjectDialog isOpen={openProjectOpen} setIsOpen={setOpenProjectOpen} />
        </div>
    );
}
