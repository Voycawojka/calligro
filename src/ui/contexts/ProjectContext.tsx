import { createContext, PropsWithChildren, useState } from "react";
import { ProjectData } from "../../filesystem/projectstore";

export interface ProjectMutContextType {
    setProjectData: (project: ProjectData | null) => void
    mutateCount: number
}

export const ProjectContext = createContext<ProjectData | null>(null)
export const ProjectMutContext = createContext<ProjectMutContextType>({ setProjectData: _ => {}, mutateCount: 0 })

export interface Props extends PropsWithChildren {}

export default function ProjectContextRoot({ children }: Props) {
    const [project, setProject] = useState<ProjectData | null>(null)
    const [mutateCount, setMutateCount] = useState(0)

    const mutData: ProjectMutContextType = {
        setProjectData: (newProject: ProjectData | null) => {
            setProject(newProject)
            setMutateCount(count => count + 1)
        },
        mutateCount
    }

    return (
        <ProjectMutContext.Provider value={mutData}>
            <ProjectContext.Provider value={project}>
                {children}
            </ProjectContext.Provider>
        </ProjectMutContext.Provider>
    )
}
