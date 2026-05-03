import { useParams } from "react-router-dom";
import { MaterialViewer } from "./MaterialViewer";

export function MaterialDetailPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Материал не найден</div>;
  }

  return (
    <div>
      <h1>Материал</h1>
      <MaterialViewer fileId={Number(id)} />
    </div>
  );
}