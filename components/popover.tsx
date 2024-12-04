/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactElement } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PopoverDropdownProps {
  leftIcon?: ReactElement; // Optional property of type string for leftIcon
  rightIcon?: ReactElement; // Optional property of type string for rightIcon
  onClickAction?: (value: "Date" | "Name") => void; // Optional property of type function for onChangeAction
  eventName?: string;
  data: any; // Optional property of type string for eventName
  outline?: boolean;
  disabled?: boolean;
}

const PopoverDropdown = (props: PopoverDropdownProps) => {
  return (
    <Select onValueChange={props.onClickAction}>
      <SelectTrigger
        className={`w-fit lg:w-[120px] truncate flex justify-center ${
          props.outline ? "input" : "border-none"
        } py-5`}
      >
        {props.leftIcon}
        &nbsp;
        <div className="hidden lg:block">
          <SelectValue
            className=" text-text-1 truncate placeholder:truncate"
            placeholder={props.eventName}
          />
        </div>
        &nbsp;
        {props.rightIcon}
      </SelectTrigger>

      <SelectContent className="w-full bg-white rounded-xl border-border-1 divide-border-1">
        {props.data?.map((item: string, i: number) => (
          <SelectItem
            disabled={props.disabled}
            className="regular-14 text-black"
            key={i}
            value={item}
          >
            {item}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PopoverDropdown;
