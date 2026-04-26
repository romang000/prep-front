import { useEffect, useState } from "react";
import { getMaterialFile } from "../api/getFileMaterial";

type Props = {
  fileId: number;
};

export function MaterialViewer({ fileId }: Props) {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentUrl: string | null = null;

    async function loadFile() {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getMaterialFile(fileId);
        currentUrl = URL.createObjectURL(result.blob);

        setFileUrl(currentUrl);
        setContentType(result.contentType ?? "");
      } catch {
        setError("Не удалось загрузить файл");
      } finally {
        setIsLoading(false);
      }
    }

    loadFile();

    return () => {
      if (currentUrl) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [fileId]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!fileUrl) {
    return <div>Файл не найден</div>;
  }

  if (contentType.includes("application/pdf")) {
    return (
      <iframe
        src={fileUrl}
        title="Просмотр материала"
        style={{
          width: "100%",
          height: "800px",
          border: "none",
        }}
      />
    );
  }

  if (contentType.startsWith("image/")) {
    return (
      <img
        src={fileUrl}
        alt="Материал"
        style={{
          maxWidth: "100%",
          display: "block",
        }}
      />
    );
  }

  if (contentType.startsWith("text/")) {
    return (
      <iframe
        src={fileUrl}
        title="Текстовый материал"
        style={{
          width: "100%",
          height: "800px",
          border: "none",
        }}
      />
    );
  }

  return (
    <div>
      <p>Предпросмотр для этого типа файла не поддерживается.</p>
      <a href={fileUrl} download>
        Скачать файл
      </a>
    </div>
  );
}