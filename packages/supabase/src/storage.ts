import { getPublicSupabaseEnv } from "./env";

function encodeStoragePath(path: string) {
  return path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
}

export function getPublicStorageUrl(bucket: string, path: string) {
  const { url } = getPublicSupabaseEnv();
  const encodedPath = encodeStoragePath(path);

  return `${url}/storage/v1/object/public/${bucket}/${encodedPath}`;
}
