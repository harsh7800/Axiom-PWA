/* eslint-disable @typescript-eslint/no-explicit-any */
// import CreateProjectPanel from "@/components/CreateProjectPanel";
// import ProjectTable from "@/components/ProjectTable";

import CreateProjectPanel from "@/components/project-list-topbar";
import ProjectsTable from "@/components/projects-table";
import LocalProjectsTable from "@/components/local-projects";

// import { getProjectData } from "../helpers/getProjectData";
export default async function Home() {
  return (
    <main className="w-full">
      <CreateProjectPanel projectData={[]} />
      <ProjectsTable />
      <LocalProjectsTable />
    </main>
  );
}
