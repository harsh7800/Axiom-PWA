import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Retrieves the public download URL for a file in Supabase Storage.
 *
 * @param {string} bucketName - The name of the Supabase Storage bucket.
 * @param {string} filePath - The file path in the Supabase bucket (e.g., 'folder/subfolder/filename.ext').
 * @returns {Promise<string>} - The public download URL for the file.
 */
export default async function getDownloadUrl(
  bucketName: string,
  filePath: string
) {
  const supabase = await createSupabaseServerClient();
  try {
    // Generate the public URL for the file
    const { data, error } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    if (error) {
      throw new Error(`Failed to get download URL: ${error.message}`);
    }

    console.log(`Download URL: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (err) {
    console.error(`Error retrieving download URL: ${err.message}`);
    throw err;
  }
}
