/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import createSupabaseBrowerClient from "@/lib/supabase/client";
import { useOnlineStatus } from "@/hooks/isOnline";
import { toast } from "sonner";
import useProjectStore from "@/store/projects";

interface Project {
  id: string;
  project_name: string;
  bottle: string;
  preform: string;
  resins: string; // Assuming it's a stringified array
  created_on: string;
  created_by: string;
  inputs: {
    inputData: Record<string, unknown>; // Flexible type for nested input data
  };

  files: {
    bottle: Record<string, string>;
    preform: Record<string, string>;
    resins: Record<string, string>;
  };
}

const ProjectsTable = () => {
  const isOnline = useOnlineStatus();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [projectData, setprojectData] = useState<Project[]>([]);
  const { setProjects } = useProjectStore((state) => state);
  const getProjectData = async () => {
    const supabase = await createSupabaseBrowerClient();
    try {
      const { data: project_table, error } = await supabase
        .from("project_table")
        .select("*");
      if (error) return [];

      setprojectData(project_table);
      return project_table;
    } catch (error) {
      return { error: error || "Something went wrong", success: false };
    }
  };

  function HandleSelect(id: string) {
    setSelectedProjects((prev) => {
      const isAlreadySelected = prev.includes(id);
      if (isAlreadySelected) {
        // Remove the ID if it's already selected
        return prev.filter((selectedId) => selectedId !== id);
      } else {
        // Add the ID if it's not selected
        return [...prev, id];
      }
    });
  }
  async function AddToLocalProject() {
    try {
      // Map selected IDs to full project objects from projectData
      const selectedFullProjects = selectedProjects
        .map((id) => projectData.find((project) => project.id == id))
        .filter((project): project is Project => project !== undefined); // Ensure no undefined projects

      // Fetch files for each project and update the project object
      const enrichedProjects = await Promise.all(
        selectedFullProjects.map(async (project) => {
          const files = await fetchFiles(project);
          return {
            ...project,
            files, // Add the fetched files to the project
          };
        })
      );

      // Update the state by merging previous projects with the selected ones
      setProjects(enrichedProjects as Project[]);

      console.log("Enriched Projects:", enrichedProjects);
    } catch (error) {
      console.error("Error adding files to projects:", error);
    }
  }

  async function fetchFiles(data: Project) {
    console.log("data: ", data);
    const supabase = await createSupabaseBrowerClient();
    const bucketName = "files"; // Replace with your actual bucket name

    try {
      const files: {
        bottle: Record<string, string>;
        preform: Record<string, string>;
        resins: Record<string, string>;
      } = {
        bottle: {},
        preform: {},
        resins: {},
      };

      // Fetch bottle data
      const { data: bottleData, error: bottleError } = await supabase
        .from("bottle_table")
        .select("*")
        .eq("bottle_design", data.bottle)
        .single();

      if (bottleError) {
        throw new Error(`Error fetching bottle data: ${bottleError.message}`);
      }

      if (!bottleData) {
        throw new Error(`No bottle data found for bottle: ${data.bottle}`);
      }

      const bottleFiles = {
        bottleCutFile: bottleData.bottleCutFile,
        bottleInpFile: bottleData.bottleInpFile,
        referenceImg: bottleData.reference_img,
      };

      for (const [key, fileName] of Object.entries(bottleFiles)) {
        if (fileName) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(`Bottle/${key}/${fileName}`);

          if (!publicUrlData) {
            throw new Error(`Failed to get public URL for ${fileName}`);
          }

          files.bottle[key] = publicUrlData.publicUrl;
        }
      }

      // Fetch preform data
      const { data: preformData, error: preformError } = await supabase
        .from("preform_table")
        .select("preform_weight_file")
        .eq("preform_name", data.preform)
        .single();

      if (preformError) {
        throw new Error(`Error fetching preform data: ${preformError.message}`);
      }

      if (!preformData) {
        throw new Error(`No preform data found for preform: ${data.preform}`);
      }

      if (preformData.preform_weight_file) {
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(
            `Preform/preformWeightFile/${preformData.preform_weight_file}`
          );

        if (!publicUrlData) {
          throw new Error(`Failed to get public URL for preformWeightFile:`);
        }

        files.preform.preformWeightFile = publicUrlData.publicUrl;
      }

      // Fetch resin data
      const resins = JSON.parse(data.resins); // Assumes `data.resins` is a JSON string
      console.log("Parsed Resins: ", resins);

      for (const resin of resins) {
        const { data: resinData, error: resinError } = await supabase
          .from("resin_table")
          .select("resin_file")
          .eq("resin_name", resin)
          .single();

        if (resinError) {
          throw new Error(
            `Error fetching resin data for ${resin}: ${resinError.message}`
          );
        }

        if (!resinData) {
          throw new Error(`No resin data found for resin: ${resin}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(`Resin/resinFile/${resinData.resin_file}`);

        if (!publicUrlData) {
          throw new Error(
            `Failed to get public URL for resin file ${resinData.resin_file}`
          );
        }

        files.resins[resin] = publicUrlData.publicUrl;
      }

      console.log("Fetched Files:", files);
      return files;
    } catch (error) {
      console.error("Error fetching files:", error);
      throw error;
    }
  }

  useEffect(() => {
    getProjectData();
    if (isOnline) {
      toast.success("You Are Online");
    } else {
      toast.error("You Are Offline");
    }
  }, [isOnline]);

  function FormatDate(isoDate: string) {
    const formattedDate = new Date(isoDate).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      // hour: "2-digit",
      // minute: "2-digit",
      // second: "2-digit",
      // timeZoneName: "short",
    });

    return formattedDate;
  }

  return (
    <section>
      <div className="px-10  rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-16 bg-light-blue">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedProjects.length === projectData.length &&
                    projectData.length > 0
                  } // Check if all projects are selected
                  // indeterminate={
                  //   selectedProjects.length > 0 &&
                  //   selectedProjects.length < projectData.length // Check if partially selected
                  // }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // If checked, select all project IDs
                      setSelectedProjects(projectData.map((item) => item.id));
                    } else {
                      // If unchecked, clear all selections
                      setSelectedProjects([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead className=" font-semibold text-lg">
                Project Name
              </TableHead>
              <TableHead className=" font-semibold text-lg">Bottle</TableHead>
              <TableHead className=" font-semibold text-lg">Preform</TableHead>
              <TableHead className=" font-semibold text-lg ">Resins</TableHead>
              <TableHead className=" font-semibold text-lg">
                Created On
              </TableHead>
              <TableHead className=" font-semibold text-lg">
                Created By
              </TableHead>
            </TableRow>
          </TableHeader>
          {isOnline && (
            <TableBody>
              {projectData?.map((project) => {
                return (
                  <TableRow key={project.id} className="h-14">
                    <TableCell>
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => HandleSelect(project.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-semibold text-md">
                      {project.project_name}
                    </TableCell>
                    <TableCell className="font-semibold text-md">
                      {project.bottle}
                    </TableCell>
                    <TableCell className="font-semibold text-md">
                      {project.preform}
                    </TableCell>
                    <TableCell className="font-semibold text-md w-[100px]">
                      <HoverCard openDelay={100}>
                        <HoverCardTrigger className="truncate w-[100px]">
                          {project?.resins &&
                            Array.isArray(JSON.parse(project.resins)) &&
                            JSON.parse(project.resins).join(", ")}
                        </HoverCardTrigger>
                        <HoverCardContent>
                          {project?.resins &&
                            Array.isArray(JSON.parse(project.resins)) &&
                            JSON.parse(project.resins).join(", ")}
                        </HoverCardContent>
                      </HoverCard>
                    </TableCell>
                    <TableCell className="font-semibold text-md">
                      {FormatDate(project.created_on)}
                    </TableCell>
                    <TableCell className="font-semibold text-md">
                      {project.created_by}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          )}
        </Table>

        {!isOnline && (
          <h1 className="my-4 w-full text-center text-lg font-semibold">
            New Projects Will be Back Once You Are Online
          </h1>
        )}

        {selectedProjects.length > 0 && (
          <Button
            className=" bg-blue rounded-[8px] cursor-pointer hover:opacity-80 hover:bg-blue"
            onClick={AddToLocalProject}
          >
            Add To Local Projects
          </Button>
        )}
      </div>

      <div className="flex items-center px-10 justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Items per page</span>
          <Select defaultValue="10">
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">1 - 2 of 2</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ChevronsLeft className="h-4 w-4 text-blue" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ChevronLeft className="h-4 w-4 text-blue" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ChevronRight className="h-4 w-4 text-blue" />
            </Button>
            <Button variant="outline" size="icon" className="w-8 h-8">
              <ChevronsRight className="h-4 w-4 text-blue" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsTable;
