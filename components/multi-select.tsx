/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface Material {
  id: string;
  resin_name: string;
}

interface MultipleSelectProps {
  value: string[];
  onChange?: (value: string[]) => void;
  data: Material[];
  maxSelectLimit?: number;
}

export function MultipleSelect({
  value,
  onChange,
  data,
  maxSelectLimit = 2,
}: MultipleSelectProps) {
  // // console.log(data);
  const [searchResins, setSearchResin] = React.useState<string>("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [filteredMaterial, setFilteredMaterial] = React.useState<
    {
      id: string;
      resin_name: string;
    }[]
  >([]);

  React.useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleClick = (item: string) => {
    let updatedSelection;
    if (selected.includes(item)) {
      updatedSelection = selected.filter((material) => material !== item);
    } else {
      if (selected.length >= maxSelectLimit) {
        updatedSelection = [...selected.slice(0, maxSelectLimit - 1), item];
      } else {
        updatedSelection = [...selected, item];
      }
    }

    setSelected(updatedSelection);
    if (onChange) {
      onChange(updatedSelection);
    }
  };

  React.useEffect(() => {
    if (data) {
      setFilteredMaterial(
        data?.filter((item) =>
          item.resin_name.toLowerCase().includes(searchResins.toLowerCase())
        )
      );
    }
  }, [data, searchResins]);

  return (
    <div className="w-full">
      <Select>
        <SelectTrigger className="w-full h-[49px] rounded-[8px] border-border-1 regular-14 text-black select-none relative z-1">
          <div className="w-full flex gap-2 items-center justify-start sticky left-0 z-10 truncate">
            {selected && selected.length !== 0 ? (
              selected?.map((item: string, i: number) => (
                <Badge
                  onClick={(e: any) => {
                    e.stopPropagation();
                    handleClick(item);
                  }}
                  key={i}
                  className="bg-light-blue rounded-[5px] relative z-50 text-blue px-2 py-1 semi-bold-14 capitalize text-left w-fit flex gap-2 items-center whitespace-nowrap"
                >
                  {item}
                </Badge>
              ))
            ) : (
              <SelectValue placeholder="Select Material" />
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-white p-0 rounded-[8px]">
          <SelectGroup>
            <SelectLabel className="relative font-md z-10 py-0 w-full pl-6 border-b border-[#D1D5DB]">
              <Input
                onChange={(e) => setSearchResin(e.target.value)}
                placeholder="Search Resins"
                value={searchResins}
                className="border-none"
              />
              <Search
                size={17}
                className="absolute left-3 top-3"
                color="#AAB3C0"
              />
            </SelectLabel>
            {data?.length !== 0 ? (
              filteredMaterial
                .sort((a, b) => a.resin_name.localeCompare(b.resin_name))
                .map((item) => (
                  <Label
                    key={item.id}
                    htmlFor={item.id}
                    className={cn(
                      "hover:bg-states-disabled flex gap-3 items-center h-10 borderB cursor-pointer px-4",
                      selected.includes(item.resin_name) && "bg-light-blue"
                    )}
                  >
                    <Input
                      checked={selected.includes(item.resin_name)}
                      type="checkbox"
                      className="size-4"
                      id={item.id}
                      onChange={() => handleClick(item.resin_name)}
                    />
                    <p className="text-input">{item.resin_name}</p>
                  </Label>
                ))
            ) : (
              <Label className="flex gap-3 items-center h-10 borderB cursor-pointer px-4">
                No Resins Found
              </Label>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
