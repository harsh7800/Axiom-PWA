"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

export async function readUserSession() {
  noStore();
  const supabsae = await createSupabaseServerClient();
  return await supabsae.auth.getSession();
}

export async function readUser() {
  noStore();
  const supabsae = await createSupabaseServerClient();
  return await supabsae.auth.getUser();
}
