import { createContext, PropsWithChildren, useState } from "react";
import { ProjectData } from "../filesystem/projectstore";

export const ProjectContext = createContext(null as ProjectData | null)
export const ProjectLoadContext = createContext((_: ProjectData | null) => {})

export interface Props extends PropsWithChildren {}

export default function ProjectContextRoot({ children }: Props) {
    const [project, setProject] = useState(null as ProjectData | null)

    return (
        <ProjectLoadContext.Provider value={setProject}>
            <ProjectContext.Provider value={project}>
                {children}
            </ProjectContext.Provider>
        </ProjectLoadContext.Provider>
    )
}
