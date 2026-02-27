import { Button, ButtonGroup, Checkbox, MenuItem, Tooltip } from "@blueprintjs/core"
import { Icon } from "@blueprintjs/core"
import { ProjectData } from "../../filesystem/projectstore"
import ToolbarMenu from "./ToolbarMenu"
import { useQuickReimport } from "./useQuickReimport"
import { useQuickReexport } from "./useQuickReexport"

export interface Props {
    project: ProjectData,
}

export default function QuickSyncSection() {
    const { isAutoImportEnabled, setIsAutoImportEnabled, reimport, displayData: reimportDisplayData } = useQuickReimport()
    const { reexport, displayData: reexportDisplayData } = useQuickReexport()

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
                        icon={<Icon icon="export" />}
                        onClick={() => reexport()}
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
                </ToolbarMenu> 
            </ButtonGroup>
       
    )
}
