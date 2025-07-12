import { useContext, useEffect, useState } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export function useProjectState<T extends keyof ProjectData>(key: T, project: ProjectData): [ProjectData[T], (v: ProjectData[T]) => void] {
    const [value, setValue] = useState(project[key])

    const setProjectContext = useContext(ProjectLoadContext)

    useEffect(() => {
        if (value !== project[key]) {
            setProjectContext({
                ...project,
                [key]: value,
                dirty: true,
            })
        }
    }, [value])

    useEffect(() => {
        setValue(project[key])
    }, [project[key]])

    return [value, setValue]
}
