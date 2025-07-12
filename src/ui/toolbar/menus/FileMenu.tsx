import { MenuItem, MenuDivider, OverlayToaster } from "@blueprintjs/core";
import ToolbarMenu from "../ToolbarMenu";
import { listProjectNames, loadProject, saveProject } from "../../../filesystem/projectstore";
import { useContext, useState } from "react";
import NewProjectDialog from "../dialogs/NewProjectDialog";
import OpenProjectDialog from "../dialogs/OpenProjectDialog";
import { ProjectContext, ProjectLoadContext } from "../../contexts/ProjectContext";
import OverwriteChangesAlert from "../dialogs/OverwriteChangesAlert";
import SaveAsDialog from "../dialogs/SaveAsDialog";
import { exportTemplate } from "../../../filesystem/templatestore";
import ExportFontDialog from "../dialogs/ExportFontDialog";
import ImportTemplateWarningDialog from "../dialogs/ImportTemplateWarningDialog";

export default function FileMenu() {
    const [newProjectModalOpen, setIsNewProjectModalOpen] = useState(false)
    const [openProjectModalOpen, setIsOpenProjectModalOpen] = useState(false)
    const [overwriteAlertOpen, setIsOverwriteAlertOpen] = useState(false)
    const [overwriteAlertAcceptFunction, setOverwriteAlertAcceptFunction] = useState(() => () => {})
    const [saveAsModalOpen, setSaveAsModalOpen] = useState(false)
    const [importTemplateModalOpen, setImportTemplateModalOpen] = useState(false)
    const [exportFontModalOpen, setExportFontModalOpen] = useState(false)

    const project = useContext(ProjectContext)
    const setProjectContext = useContext(ProjectLoadContext)

    const recentProjectNames = listProjectNames(10)

    const openRecentProject = async (name: string, force: boolean) => {
        try {
            if (!force && project && project.dirty) {
                setOverwriteAlertAcceptFunction(() => () => openRecentProject(name, true))
                setIsOverwriteAlertOpen(true)
                return
            }

            const loadedProject = loadProject(name)
            if (!loadedProject) {
                throw new Error("Couldn't open project")
            }
            setProjectContext({ ...loadedProject })
        } catch (e: any) {
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
        }
    }

    const saveCurrentProject = async () => {
        try {
            if (!project) {
                throw new Error("No project to save")
            }
            project.dirty = false
            await saveProject(project.name, project)
            setProjectContext({ ...project })
        } catch (e: any) {
            if (project) {
                project.dirty = true
            }
            const toaster = await OverlayToaster.create({ position: "top-right" })
            toaster.show({
                icon: "error",
                intent: "danger",
                message: (e as Error).message
            })
        }
    }

    const exportCurrentTemplate = async () => {
        try {
            if (!project) {
                throw new Error("No project to export a template from")
            }

            exportTemplate(project)

            setProjectContext({
                ...project,
                lastExportSnapshot: {
                    defaultCharacterWidth: project.defaultCharacterWidth,
                    defaultCharacterHeight: project.defaultCharacterHeight,
                    characterBase: project.characterBase,
                    characterSet: project.characterSet,
                },
                dirty: true,
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

    return (
        <>
            <ToolbarMenu buttonIcon="document" buttonText="File">
                <MenuItem key="new-project" icon="new-object" text="New Project" onClick={() => setIsNewProjectModalOpen(true)} />
                <MenuItem key="open-project" icon="document-open" text="Open Project" onClick={() => setIsOpenProjectModalOpen(true)} />
                <MenuItem icon="history" text="Recent projects" disabled={recentProjectNames.length === 0}>
                    { recentProjectNames.map(projectName => (
                        <MenuItem key={projectName} icon="document-open" text={projectName} onClick={() => openRecentProject(projectName, false)} />
                    )) }
                </MenuItem>
                <MenuDivider />
                <MenuItem key="save-project" icon="floppy-disk" text={`${project?.dirty ? "*" : ""}Save Project`} disabled={!project} onClick={saveCurrentProject} />
                <MenuItem key="save-as" icon="folder-shared" text="Save As..." disabled={!project} onClick={() => setSaveAsModalOpen(true)} />
                <MenuDivider />
                <MenuItem key="export-template" icon="export" text="Export Template PNG" disabled={!project} onClick={exportCurrentTemplate} />
                <MenuItem key="import-template" icon="import" text="Import Template PNG" disabled={!project} onClick={() => setImportTemplateModalOpen(true)} />
                <MenuDivider />
                <MenuItem key="export-font" icon="generate" text="Export Font" disabled={!project} onClick={() => setExportFontModalOpen(true)} />
            </ToolbarMenu>

            <NewProjectDialog isOpen={newProjectModalOpen} setIsOpen={setIsNewProjectModalOpen} />
            <OpenProjectDialog isOpen={openProjectModalOpen} setIsOpen={setIsOpenProjectModalOpen} />
            <OverwriteChangesAlert isOpen={overwriteAlertOpen} setIsOpen={setIsOverwriteAlertOpen} onAccepted={overwriteAlertAcceptFunction} />
            <SaveAsDialog isOpen={saveAsModalOpen} setIsOpen={setSaveAsModalOpen} />
            <ImportTemplateWarningDialog isOpen={importTemplateModalOpen} setIsOpen={setImportTemplateModalOpen} />
            <ExportFontDialog isOpen={exportFontModalOpen} setIsOpen={setExportFontModalOpen} />
        </>
    )
}
