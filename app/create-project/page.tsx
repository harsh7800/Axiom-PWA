import React from "react";
import InputComp from "@/components/input";
import { GetDataToPopulate } from "@/helpers/populating-data";

const Page = async () => {
  const data = await GetDataToPopulate();
  return (
    <>
      <InputComp data={data} />
    </>
  );
};

export default Page;
