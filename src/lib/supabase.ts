import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function uploadPhoto(
  file: Buffer,
  fileName: string
): Promise<string> {
  const { data, error } = await supabaseAdmin.storage
    .from("vehicle-photos")
    .upload(fileName, file, {
      contentType: "image/jpeg",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabaseAdmin.storage.from("vehicle-photos").getPublicUrl(data.path);

  return publicUrl;
}
