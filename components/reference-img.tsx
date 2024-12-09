import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import createSupabaseBrowserClient from "@/lib/supabase/client";
// import project from "@/project.json"; // Assuming this contains default values
import { Loader2 } from "lucide-react";
import image_not_available from "@/public/Image_not_available.png";
import { cn } from "@/lib/utils";
const ReferenceImg = ({
  bottle_design,
  align,
}: {
  bottle_design: string | undefined;
  align: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      const supabase = await createSupabaseBrowserClient();

      try {
        const { data: bottles, error: bottleError } = await supabase
          .from("bottle_table")
          .select("reference_img")
          .eq("bottle_design", bottle_design)
          .single();

        if (!bottleError) {
          const { data } = supabase.storage
            .from("files")
            .getPublicUrl(`Bottle/referenceImg/${bottles.reference_img}`);
          if (data) {
            setImageUrl(data?.publicUrl);
          } else {
            console.error("Failed to fetch image URL:");
          }
        }
      } catch (error) {
        console.error("Failed to fetch image:", error);
      } finally {
        setLoading(false);
      }
    };
    if (bottle_design) {
      fetchImage();
    }
    setLoading(false);
  }, [bottle_design]);

  return (
    <div
      className={cn(
        "relative w-full md:w-1/2 border border-states-disabled rounded-2xl",
        align && "min-w-[300px] md:w-1/2 lg:w-fit"
      )}
    >
      <h1 className="semi-bold-16 border-b px-5 py-3 bg-states-disabled text-left rounded-t-2xl">
        Reference Image
      </h1>
      {loading ? (
        <Loader2
          size={50}
          className="animate-spin absolute top-1/2 left-1/2 text-blue"
        />
      ) : (
        <Suspense fallback={<Loader2 className="animate-spin text-blue" />}>
          <div className="py-10">
            {align ? (
              <div
                className={cn(
                  "flex relative justify-center items-center w-full mx-auto",
                  align && "md:pt-[80px]"
                )}
              >
                <Image
                  src={imageUrl || image_not_available}
                  className="md:absolute md:-top-[25px] sm:w-1/2 md:w-fit h-[450px]"
                  alt="Reference image"
                  width={300} // Adjust width and height as per design
                  height={300}
                />
              </div>
            ) : (
              <div className="flex justify-center items-center w-full h-[450px] overflow-hidden">
                <Image
                  src={imageUrl || image_not_available}
                  className="object-contain w-full h-full"
                  alt="Reference image"
                  width={450} // Adjust width and height as per your design
                  height={450}
                />
              </div>
            )}
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default ReferenceImg;
