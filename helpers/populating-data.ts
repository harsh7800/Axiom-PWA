"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GetDataToPopulate() {
  const supabase = await createSupabaseServerClient();

  const { data: bottle, error: bottleError } = await supabase
    .from("bottle_table")
    .select("*");
  if (bottleError) {
    console.error("Error fetching bottles:", bottleError);
    return { error: bottleError.message };
  }

  const { data: preform, error: preformError } = await supabase
    .from("preform_table")
    .select("*");
  if (preformError) {
    console.error("Error fetching preforms:", preformError);
    return { error: preformError.message };
  }
  const { data: resin, error: resinError } = await supabase
    .from("resin_table")
    .select("*");
  if (resinError) {
    console.error("Error fetching preforms:", preformError);
    return { error: resinError.message };
  }

  const { data: location, error: locationError } = await supabase
    .from("location_table")
    .select("*");
  if (locationError) {
    console.error("Error fetching locations:", locationError);
    return { error: locationError.message };
  }
  const { data: model, error: modelError } = await supabase
    .from("model_file_table")
    .select("*");
  if (modelError) {
    console.error("Error fetching locations:", modelError);
    return { error: modelError.message };
  }

  const uniqueBottles = Array.from(
    new Map(
      bottle.map((b) => [
        b.id,
        {
          id: b.id,
          bottle_design: b.bottle_design,
          reference_img: b.reference_img,
        },
      ])
    ).values()
  );
  const uniqueModels = Array.from(
    new Map(
      model.map((b) => [
        b.id,
        {
          id: b.id,
          model_name: b.model_name,
        },
      ])
    ).values()
  );

  const uniquePreforms = Array.from(
    new Map(
      preform.map((p) => [
        p.id,
        {
          id: p.id,
          preform_name: p.preform_name,
        },
      ])
    ).values()
  );
  const uniqueResins = Array.from(
    new Map(
      resin.map((p) => [
        p.id,
        {
          id: p.id,
          resin_name: p.resin_name,
        },
      ])
    ).values()
  );

  const uniqueLocations = Array.from(
    new Map(
      location.map((l) => [
        l.id,
        {
          id: l.id,
          location: l.location,
          machine: l.machine,
          massFlowRate: l.mass_flow_rate,
          SRS: l.SRS,
        },
      ])
    ).values()
  );

  const dataArray = {
    bottles: uniqueBottles,
    preforms: uniquePreforms,
    resins: uniqueResins,
    locations: uniqueLocations,
    models: uniqueModels,
  };

  return dataArray;
}
