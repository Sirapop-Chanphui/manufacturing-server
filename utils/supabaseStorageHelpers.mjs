/**
 * Derive storage object path from a Supabase public URL for a given bucket.
 * Returns null if the URL is not from this bucket (e.g. external URL).
 */
export function extractStorageObjectPath(publicUrl, bucketName) {
  if (!publicUrl || typeof publicUrl !== "string") return null;
  const marker = `/object/public/${bucketName}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  const raw = publicUrl.slice(idx + marker.length).split("?")[0].split("#")[0];
  try {
    return decodeURIComponent(raw) || null;
  } catch {
    return raw || null;
  }
}

/**
 * Best-effort delete of a file in the bucket given its public URL.
 * Does not throw; logs on failure (e.g. file already removed).
 */
export async function removeStorageObjectByPublicUrl(
  supabase,
  bucketName,
  publicUrl
) {
  const path = extractStorageObjectPath(publicUrl, bucketName);
  if (!path) return;

  const { error } = await supabase.storage.from(bucketName).remove([path]);

  if (error) {
    console.error(
      `[storage] remove failed bucket=${bucketName} path=${path}:`,
      error.message
    );
  }
}
