/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
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
  FileDown,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import useProjectStore from "@/store/projects";
import { cn } from "@/lib/utils";

interface Project {
  id: string; // Unique identifier for the project
  project_name: string | number; // Project name, could be a string or number based on the given data
  created_by: string; // Creator of the project
  created_on: string; // ISO 8601 formatted timestamp
  bottle: string; // Bottle type or name
  preform: string; // Preform type or name
  resins: string; // JSON string of resins (should be parsed to an array if used in logic)
  inputs: {
    inputData: Record<string, unknown>; // Flexible type for nested input data
  };
}

const LocalProjectsTable = () => {
  const { projects } = useProjectStore((state) => state);

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

  function downloadJsonFile(data: Project, filename = "data.json") {
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = filename;
    link.click();
  }

  return (
    <section className="mt-10">
      <h1 className="px-10 font-semibold text-lg">Local Projects</h1>
      <div className="px-10 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="h-16 bg-light-blue">
              <TableHead className="w-12">
                <Checkbox />
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
              <TableHead className=" font-semibold text-lg"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length > 0 &&
              projects?.map((project) => (
                <TableRow key={project.id} className="h-14">
                  <TableCell>
                    <Checkbox />
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
                  <TableCell className="font-semibold text-md">
                    <FileDown
                      onClick={() =>
                        downloadJsonFile(project as any, project.bottle)
                      }
                      // onClick={() =>
                      //   ipcRenderer.send(project.project_name, project)
                      // }
                      className="text-blue cursor-pointer hover:scale-125 transition-all"
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div
        className={cn(
          "flex items-center px-10 justify-between mt-4",
          projects.length == 0 && "hidden"
        )}
      >
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

export default LocalProjectsTable;
