import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { TriangleAlert } from "lucide-react";

export function AlertInfo({
  title,
  content,
  type,
}: {
  title: string;
  content: string;
  type?: "warn";
}) {
  return (
    <Alert
      className={cn(
        "w-[95%] sm:w-fit max-w-[450px] bg-states-error/20 border-0 border-l-2 border-states-error m-2 flex text-white rounded-[2px]",
        type == "warn" && "bg-states-warning/30 border-states-warning"
      )}
    >
      {/* <AlertTitle>{title}</AlertTitle> */}
      <AlertDescription
        className={cn(
          "flex text-states-error font-medium items-center gap-3",
          type == "warn" && "text-states-warning"
        )}
      >
        <span>
          <TriangleAlert
            className={cn(
              "text-states-error",
              type == "warn" && "text-states-warning"
            )}
          />
        </span>
        <span className="font-bold">{title}</span> {content}
      </AlertDescription>
    </Alert>
  );
}
