import { useContext } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export function useProjectState<T extends keyof ProjectData>(key: T, project: ProjectData): [ProjectData[T], (v: ProjectData[T]) => void] {
    const setProjectContext = useContext(ProjectLoadContext)

    const setValue = (v: ProjectData[T]) => {
        if (v !== project[key]) {
            setProjectContext({
                ...project,
                [key]: v,
                dirty: true,
            })
        }
    }

    return [project[key], setValue]
}
