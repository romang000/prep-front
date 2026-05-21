import { apiFetchBlob } from "@/shared/api/client";

export type MaterialFileResponse = {
  blob: Blob;
  contentType: string | null;
  contentDisposition: string | null;
};

export async function getMaterialFile(
  fileId: number,
): Promise<MaterialFileResponse> {
  const response = await apiFetchBlob(`/files/${fileId}`, {
    service: "materials",
    method: "GET",
  });

  return {
    blob: await response.blob(),
    contentType: response.headers.get("content-type"),
    contentDisposition: response.headers.get("content-disposition"),
  };
}
