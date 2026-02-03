import { useContext, useEffect, useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectMutContext } from "../../contexts/ProjectContext";

type Key = keyof {
    [P in keyof ProjectData as ProjectData[P] extends number? P: never]: any
}

export function useProjectStateNumericInput<T extends Key>(key: T, project: ProjectData): [string, (v: string) => void, number] {
    const [raw, setRaw] = useState(project[key].toString())
    const [num, setNum] = useState(project[key])

    const { setProjectData } = useContext(ProjectMutContext)

    useEffect(() => {
        if (num !== project[key]) {
            setProjectData({
                ...project,
                [key]: num,
                dirty: true,
            })
        }
    }, [num])

    useEffect(() => {
        setRaw(project[key].toString())
        setNum(project[key])
    }, [project[key]])

    const setRawWrapper = (newValue: string) => {
        setRaw(newValue)

        const parsed = Number(newValue)
        if (!isNaN(parsed) && newValue !== "-" && newValue !== "." && newValue !== "-.") {
            setNum(parsed)
        }
    }

    return [raw, setRawWrapper, num]
}
