/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function CreateProject(values: any) {
  const supabase = await createSupabaseServerClient();

  const { data: projects, error: fetchError } = await supabase
    .from("project_table")
    .select("project_name")
    .order("project_name", { ascending: false })
    .limit(1);

  if (fetchError) {
    return { success: false };
  }

  const highestProjectName = projects.length > 0 ? projects[0].project_name : 0;

  // Increment the highest project_name
  const newProjectName = highestProjectName + 1;

  const newProject = {
    project_name: newProjectName,
    bottle: values.bottle,
    resins: values.resins,
    preform: values.preform,
    inputs: values.inputs,
    created_by: values.created_by,
  };

  //  Insert the new project with the incremented project_name
  const { data, error: insertError } = await supabase
    .from("project_table")
    .insert([newProject])
    .select();

  if (insertError) {
    return { success: false };
  }

  return data;
}
