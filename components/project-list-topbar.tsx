/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Filter,
  Loader2,
  Plus,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
// import { projectData } from "../lib/content";
import { useRouter } from "next/navigation";
// import { useFilterAndSort, useSearchQuery } from "@/lib/zustand-store";
// import { useShallow } from "zustand/react/shallow";
// import { GetAdmins } from "@/app/helpers/Admin";
import Link from "next/link";
import PopoverDropdown from "./popover";
const CreateProjectPanel = ({ projectData }: any) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  //   const [created_by, setCreated_by] = useState<object[]>([]);
  //   const { setFilter, setSort } = useFilterAndSort(useShallow((state) => state));

  //   const setQuery = useSearchQuery(useShallow((state) => state.setQuery));

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    //     if (setQuery) {
    console.log(event);
    //       setQuery(event.target.value);
    //     }
  };

  //   useEffect(() => {
  //     setFilter("");
  //     async function getAdminsNames() {
  //       let { data } = await GetAdmins();
  //       if (data) {
  //         let names = data.map((name) => {
  //           return name.name;
  //         });
  //         setCreated_by(names);
  //       }
  //     }
  //     getAdminsNames();

  //     // eslint-disable-next-line
  //   }, []);
  return (
    <div className="w-full sticky top-[65px] sm:top-24 bg-[#FAFAFA] px-5 md:px-10 z-10">
      {/* //Desktop Panel for creating- Project responsive for tablet too */}
      <div className="bg-[#FAFAFA] hidden sm:flex items-center justify-between py-3 w-full">
        <div className="w-fit flex flex-col lg:flex-row flex-wrap justify-start lg:items-center  gap-5">
          <h1 className="semi-bold-24 text-left lg:text-center text-[18px] text-black">
            Saved Projects ({projectData?.length || 0})
          </h1>

          <span className="w-full flex lg:w-fit space-x-3 lg:space-x-5">
            <PopoverDropdown
              // disabled={true}
              outline={true}
              //   onClickAction={setFilter}
              leftIcon={<Filter color="#97A1AF" strokeWidth={1} size={20} />}
              //   rightIcon={
              //     <ChevronDown
              //       color="#97A1AF"
              //       className="h-4 w-4 shrink-0 transition-transform duration-200"
              //     />
              //   }
              data={[]}
              eventName="Filter"
            />
            <PopoverDropdown
              //   onClickAction={setSort}
              outline={true}
              leftIcon={
                <ArrowDownWideNarrow
                  color="#97A1AF"
                  strokeWidth={1}
                  size={20}
                />
              }
              //   rightIcon={
              //     <ChevronDown
              //       color="#97A1AF"
              //       className="h-4 w-4 shrink-0 transition-transform duration-200"
              //     />
              //   }
              data={["Date", "Name"]}
              eventName="Sort"
            />
          </span>
        </div>

        <div className="w-1/2 flex flex-col-reverse lg:flex-row justify-end items-end gap-3 lg:gap-5">
          <div className="relative w-full lg:w-3/4 max-w-[400px]">
            <Input
              onChange={handleChange}
              className="w-full input pl-10"
              placeholder="Search Project Name"
            />
            <Search
              className="text-border-1 absolute left-3 top-1/4"
              size={18}
            />
          </div>
          <Button
            className="bg-blue w-fit rounded-[8px] semi-bold-14 text-white hover:text-blue hover:border-2 hover:border-blue p-0"
            onClick={() => {
              setLoading(true);
              // router.push("/new-project");
            }}
          >
            <Link
              href="/new-project"
              className="flex items-center cursor-pointer p-3"
            >
              {!loading ? (
                <Plus size={20} />
              ) : (
                <Loader2 size={20} className={`${loading && "animate-spin"}`} />
              )}
              &nbsp; Create Project
            </Link>
          </Button>
        </div>
      </div>

      {/* //mobile Panel for creating- Project */}
      <div className="w-full block sm:hidden space-y-4 py-4">
        <div className="w-full flex-center items-center justify-between">
          <h1 className="semi-bold-12 text-left lg:text-center text-black">
            Saved Projects ({projectData?.length || 0})
          </h1>
          <Button
            className="bg-blue max-w-fit rounded-[8px] semi-bold-14 text-white"
            onClick={() => {
              setLoading(true);
              router.push("/new-project");
            }}
          >
            {!loading ? (
              <Plus size={20} />
            ) : (
              <Loader2 size={20} className={`${loading && "animate-spin"}`} />
            )}
            &nbsp; Create Project
          </Button>
        </div>
        <div className="w-full flex gap-3">
          <div className="relative w-full lg:w-3/4 max-w-[400px]">
            <Input
              onChange={handleChange}
              className="w-full input placeholder:font-normal pl-10"
              placeholder="Search Files"
            />
            <Search
              className="text-border-1 absolute left-3 top-1/4"
              size={18}
            />
          </div>
          <PopoverDropdown
            disabled={true}
            outline={true}
            // onClickAction={setFilter}
            leftIcon={<Filter color="#97A1AF" strokeWidth={1} size={20} />}
            rightIcon={
              <ChevronDown
                color="#97A1AF"
                className="h-4 w-4 shrink-0 transition-transform duration-200"
              />
            }
            data={["Recently"]}
            eventName="Filter"
          />
          <PopoverDropdown
            // onClickAction={setSort}
            outline={true}
            leftIcon={
              <ArrowDownWideNarrow color="#97A1AF" strokeWidth={1} size={20} />
            }
            rightIcon={
              <ChevronDown
                color="#97A1AF"
                className="h-4 w-4 shrink-0 transition-transform duration-200"
              />
            }
            data={["Date", "Name"]}
            eventName="Sort"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProjectPanel;
