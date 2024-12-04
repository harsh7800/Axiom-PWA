import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type Project = {
  id: number;
  project_name: string;
  bottle: string;
  preform: string;
  resins: string; // Assuming it's a stringified array
  created_on: string;
  created_by: string;
  inputs: {
    inputData: Record<string, unknown>; // Flexible type for nested input data
  };
};

type ProjectState = {
  projects: Project[];
  setProjects: (newProjects: Project[]) => void; // Modify this to handle both replacing and appending
  clearProjects: () => void;
};

const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],

      // Manage both adding new projects and setting projects
      setProjects: (newProjects: Project[]) =>
        set((state) => {
          // Combine the old and new projects, ensuring no duplicates
          const updatedProjects = [
            ...state.projects,
            ...newProjects.filter(
              (newProject) =>
                !state.projects.some((p) => p.id === newProject.id)
            ),
          ];
          return { projects: updatedProjects };
        }),

      // Clear all projects
      clearProjects: () => set({ projects: [] }),
    }),
    {
      name: "project-storage", // Key in local storage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useProjectStore;
