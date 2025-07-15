import { useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { Button, FormGroup } from "@blueprintjs/core";
import PreviewTemplateDialog from "./dialogs/PreviewTemplateDialog";

export interface Props {
    project: ProjectData
    forceDisabled: boolean
}

export default function PreviewTemplateButton({ project, forceDisabled }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <FormGroup>
                <Button icon="eye-open" text="Preview Template" onClick={() => setDialogOpen(true)} disabled={forceDisabled} />
            </FormGroup>

            <PreviewTemplateDialog
                project={project}
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
