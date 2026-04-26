import { API_URLS } from "@/shared/api/config";

export type MaterialFileResponse = {
  blob: Blob;
  contentType: string | null;
  contentDisposition: string | null;
};

export async function getMaterialFile(
  fileId: number,
): Promise<MaterialFileResponse> {
  const response = await fetch(`${API_URLS.materials}/files/${fileId}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  return {
    blob: await response.blob(),
    contentType: response.headers.get("content-type"),
    contentDisposition: response.headers.get("content-disposition"),
  };
}