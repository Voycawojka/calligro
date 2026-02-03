import { Button, ButtonGroup, Checkbox, MenuItem, Tooltip } from "@blueprintjs/core"
import { Icon } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"
import ToolbarMenu from "./ToolbarMenu"
import { useQuickReimport } from "./useQuickReimport"
import { useQuickReexport } from "./useQuickReexport"

export interface Props {
    project: ProjectData,
}

export default function QuickSyncSection({ project }: Props) {
    const { isAutoImportEnabled, setIsAutoImportEnabled, reimport, displayData: reimportDisplayData } = useQuickReimport(project)
    const { isAutoExportEnabled, setIsAutoExportEnabled, reexport, displayData: reexportDisplayData } = useQuickReexport(project)

    return (
            <ButtonGroup>
                <Tooltip content={<div>Reimport last template{!reimportDisplayData.enabled && <><br />{reimportDisplayData.reason}</>}</div>} position="bottom">
                    <Button 
                        disabled={!reimportDisplayData.enabled} 
                        variant="outlined"
                        active={isAutoImportEnabled}
                        icon={<Icon icon="refresh" />} 
                        onClick={() => reimport(false)}
                    />
                </Tooltip>
                <Tooltip content={<div>Reexport font{!reexportDisplayData.enabled && <><br />{reexportDisplayData.reason}</>}</div>} position="bottom">
                    <Button 
                        disabled={!reexportDisplayData.enabled} 
                        variant="outlined"
                        active={isAutoExportEnabled}
                        icon={<Icon icon="export" />}
                        onClick={() => reexport(false)}
                    />
                </Tooltip>
                <ToolbarMenu buttonIcon="chevron-down" buttonText="">
                    <MenuItem key="auto-refresh" shouldDismissPopover={false} text={
                        <Checkbox
                            inline
                            style={{ margin: 0 }}
                            disabled={!reimportDisplayData.enabled} 
                            checked={isAutoImportEnabled}
                            onChange={e => setIsAutoImportEnabled(e.currentTarget.checked)}>
                            Auto reimport on changes
                        </Checkbox>
                    } />
                    <MenuItem key="auto-export" shouldDismissPopover={false} text={
                        <Checkbox
                            inline
                            style={{ margin: 0 }}
                            disabled={!reexportDisplayData.enabled} 
                            checked={isAutoExportEnabled}
                            onChange={e => setIsAutoExportEnabled(e.currentTarget.checked)}>
                            Auto reexport on changes
                        </Checkbox>
                    } />
                </ToolbarMenu> 
            </ButtonGroup>
       
    )
}
