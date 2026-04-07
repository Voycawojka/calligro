import { useState } from "react";
import { Button, FormGroup, Tooltip } from "@blueprintjs/core";
import ExportFontDialog from "../../toolbar/dialogs/ExportFontDialog";
import { useQuickReexport } from "../../toolbar/useQuickReexport";
import styles from "../workarea.module.scss";

export default function ExportFontButton() {
    const [dialogOpen, setDialogOpen] = useState(false)
    const { reexport, displayData: reexportDisplayData } = useQuickReexport()

    return (
        <>
            <FormGroup>
                <div className={styles.buttonrow}>
                    <Button icon="generate" text="Export New Font" onClick={() => setDialogOpen(true)} size="large" className={styles.button} />
                    <Tooltip content={!reexportDisplayData.enabled ? reexportDisplayData.reason : undefined} disabled={reexportDisplayData.enabled} className={styles.button}>
                        <Button
                            icon="refresh"
                            text="Reexport"
                            disabled={!reexportDisplayData.enabled}
                            onClick={() => reexport()}
                            size="large"
                            fill
                        />
                    </Tooltip>
                </div>
            </FormGroup>

            <ExportFontDialog
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
