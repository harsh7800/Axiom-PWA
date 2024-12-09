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
// import { ipcRenderer } from "electron";

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

  // const handleDownload = async (project) => {
  //   const { files } = project;
  //   const { bottle, preform, resins } = files;

  //   // Create an array to hold all the download promises
  //   const downloadPromises = [];

  //   // Create a new folder to hold all the downloaded files
  //   const folderName = `${project.project_name}-downloads`;
  //   const folderPath = `${__dirname}/${folderName}`;

  //   // Create the folder if it doesn't exist
  //   if (!fs.existsSync(folderPath)) {
  //     fs.mkdirSync(folderPath);
  //   }

  //   // Function to download each file and save it to the folder
  //   const downloadFile = (fileUrl, fileName) => {
  //     return fetch(fileUrl)
  //       .then((response) => response.blob())
  //       .then((blob) => {
  //         const filePath = `${folderPath}/${fileName}`;
  //         const fileStream = fs.createWriteStream(filePath);

  //         return new Promise((resolve, reject) => {
  //           fileStream.on("error", (err) => reject(err));
  //           fileStream.on("finish", () => resolve());
  //           response.body.pipe(fileStream);
  //         });
  //       });
  //   };

  //   // Download bottle files
  //   for (const [key, fileUrl] of Object.entries(bottle)) {
  //     downloadPromises.push(downloadFile(fileUrl, `bottle-${key}`));
  //   }

  //   // Download preform files
  //   for (const [key, fileUrl] of Object.entries(preform)) {
  //     downloadPromises.push(downloadFile(fileUrl, `preform-${key}`));
  //   }

  //   // Download resin files
  //   for (const [key, fileUrl] of Object.entries(resins)) {
  //     downloadPromises.push(downloadFile(fileUrl, `resin-${key}`));
  //   }

  //   // Wait for all downloads to complete
  //   await Promise.all(downloadPromises);
  //   alert(`All files have been downloaded to the "${folderName}" folder!`);
  // };

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
                      onClick={
                        () => console.log("first")
                        // ipcRenderer.invoke("download-project-files", project)
                      } // Send the project to Electron
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
