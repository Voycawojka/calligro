import { useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { Button, FormGroup } from "@blueprintjs/core";
import PreviewTemplateDialog from "./dialogs/PreviewTemplateDialog";
import ExportTemplateDialog from "../../../ui/toolbar/dialogs/ExportTemplateDialog";
import styles from "../workarea.module.scss";

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function PreviewTemplateButton({ project, forceDisabled }: Props) {
    const [previewOpen, setPreviewOpen] = useState(false)
    const [exportOpen, setExportOpen] = useState(false)

    return (
        <>
            <FormGroup>
                <div className={styles.buttonrow}>
                    <Button icon="eye-open" text="Preview Template" onClick={() => setPreviewOpen(true)} disabled={forceDisabled} size="large" className={styles.button} />
                    <Button icon="export" text="Export Template" onClick={() => setExportOpen(true)} disabled={forceDisabled} size="large" className={styles.button} />
                </div>
            </FormGroup>

            <PreviewTemplateDialog
                project={project}
                isOpen={previewOpen}
                setIsOpen={setPreviewOpen}
            />
            <ExportTemplateDialog
                project={project}
                isOpen={exportOpen}
                setIsOpen={setExportOpen}
            />
        </>
    )
}
