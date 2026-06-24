import { useEffect, useState } from "react";
import { Button, ButtonGroup, FormGroup, Tooltip, Tag } from "@blueprintjs/core";
import ImportTemplateWarningDialog from "../../toolbar/dialogs/ImportTemplateWarningDialog";
import { useQuickReimport } from "../../toolbar/useQuickReimport";
import styles from "../workarea.module.scss";
import { ProjectData } from "../../../filesystem/projectstore";

interface Props {
    project: ProjectData
}

export default function ImportTemplateButton({ project }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [templateName, setTemplateName] = useState<string | null>("<loading...>")
    const { isAutoImportEnabled, setIsAutoImportEnabled, reimport, displayData: reimportDisplayData } = useQuickReimport()

    useEffect(() => {
        async function loadTemplateName() {
            const name = reimportDisplayData.enabled
                ? await reimportDisplayData.fileHandle.getFileName()
                : await project.importedTemplate?.fileHandle?.getFileName()
            setTemplateName(name ?? null)
        }
        loadTemplateName()
    }, [reimportDisplayData.enabled])

    return (
        <>
            <FormGroup>
                <div className={styles.currenttemplate}>
                    <span className={styles.currenttemplatelabel}>Current template</span>
                    <Tag minimal icon={templateName ? "document-open" : "document-locked"}>{templateName ?? "embedded in project"}</Tag>
                </div>
                <div className={styles.buttonrow}>
                    <Button icon="import" text="Import New Template" onClick={() => setDialogOpen(true)} size="large" className={styles.button} />
                    <ButtonGroup fill className={styles.button}>
                        <Tooltip content={!reimportDisplayData.enabled ? reimportDisplayData.reason : undefined} disabled={reimportDisplayData.enabled}>
                            <Button
                                icon="refresh"
                                text="Reimport"
                                disabled={!reimportDisplayData.enabled}
                                active={isAutoImportEnabled}
                                onClick={() => reimport(false)}
                                size="large"
                                fill
                            />
                        </Tooltip>
                        <Tooltip content={isAutoImportEnabled ? "Disable auto reimport" : "Auto reimport on changes"}>
                            <Button
                                icon="automatic-updates"
                                disabled={!reimportDisplayData.enabled}
                                active={isAutoImportEnabled}
                                onClick={() => setIsAutoImportEnabled(!isAutoImportEnabled)}
                                size="large"
                            />
                        </Tooltip>
                    </ButtonGroup>
                </div>
            </FormGroup>

            <ImportTemplateWarningDialog
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
