import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && key) return createClient(url, key);
  return null;
}

export async function savePhoto(
  buffer: Buffer,
  fileName: string
): Promise<string> {
  const supabase = getSupabaseClient();

  // Use Supabase Storage if configured
  if (supabase) {
    const { data, error } = await supabase.storage
      .from("vehicle-photos")
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("vehicle-photos").getPublicUrl(data.path);

    return publicUrl;
  }

  // Fallback to local storage
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadDir, fileName);
  const dir = path.dirname(filePath);

  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}
