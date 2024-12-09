import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const LabelTooltip = ({
  content,
  label,
  small,
  side,
}: {
  content: string;
  label?: string;
  small?: boolean;
  side?: boolean;
}) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger
          className={cn(
            "flex text-md w-full font-medium justify-center items-center gap-2",
            small && "text-[10px] font-bold text-center"
          )}
        >
          {!small && (
            <Info
              className="text-black"
              size={small ? 13 : 20}
              strokeWidth={2}
            />
          )}
          {label}
          {small && (
            <Info
              className="text-black"
              size={small ? 15 : 20}
              strokeWidth={2}
            />
          )}
        </TooltipTrigger>
        <TooltipContent
          side={side ? (label === " IV" ? "left" : "bottom") : "top"}
          className={cn(
            "bg-white w-fit rounded-[8px] whitespace-normal max-w-[300px]",
            label === " I V" && "mt-2"
          )}
        >
          <p className={cn(small && "text-[11px]")}>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LabelTooltip;
