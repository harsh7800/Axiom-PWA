/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function EditProject(values: any, id: string) {
  const supabase = await createSupabaseServerClient();

  const updatedProject = {
    bottle: values.bottle,
    resins: values.resins,
    preform: values.preform,
    inputs: values.inputs,
  };
  const { data: table, error } = await supabase
    .from("project_table")
    .update(updatedProject)
    .eq("id", id)
    .select();

  if (table && !error) {
    return { success: true };
  } else {
    return { success: false };
  }
}
