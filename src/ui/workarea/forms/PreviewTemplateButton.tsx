import { useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { Button, FormGroup } from "@blueprintjs/core";
import PreviewTemplateDialog from "./PreviewTemplateDialog";

export interface Props {
    project: ProjectData,
}

export default function PreviewTemplateButton({ project }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <FormGroup>
                <Button icon="eye-open" text="Preview Template" onClick={() => setDialogOpen(true)} />
            </FormGroup>

            <PreviewTemplateDialog
                project={project}
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
            />
        </>
    )
}
