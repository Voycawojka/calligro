import { useContext, useRef } from "react";
import { ProjectData } from "../../../filesystem/projectstore";
import { ProjectLoadContext } from "../../contexts/ProjectContext";

export function useProjectState<T extends keyof ProjectData>(key: T, project: ProjectData, debounceMs: number = 0): [ProjectData[T], (v: ProjectData[T]) => void] {
    const setProjectContext = useContext(ProjectLoadContext)
    const debounceRef = useRef<NodeJS.Timeout | null>(null)

    const setValue = (v: ProjectData[T]) => {
        if (v !== project[key]) {
            setProjectContext({
                ...project,
                [key]: v,
                dirty: true,
            })
        }
    }

    const setValueWithDebounce = (v: ProjectData[T]) => {
        if (debounceMs > 0) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current)
            }
            debounceRef.current = setTimeout(() => setValue(v), debounceMs)
        } else {
            setValue(v)
        }
    }

    return [project[key], setValueWithDebounce]
}
