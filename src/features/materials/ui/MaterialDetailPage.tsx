import { useNavigate, useParams } from "react-router-dom"
import { MaterialViewer } from "./MaterialViewer"

export function MaterialDetailPage() {
    const navigate = useNavigate()
    const { materialId, fileId } = useParams()

    if (!materialId || !fileId) {
        return <div>Материал не найден</div>
    }

    const parsedFileId = Number(fileId)

    if (Number.isNaN(parsedFileId)) {
        return <div>Некорректный идентификатор файла</div>
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => navigate("/materials")}
                        className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
                    >
                        ← К материалам
                    </button>
                </div>

                <div className="rounded-[28px] bg-slate-50 p-8 shadow-sm">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Материал
                    </h1>

                    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <MaterialViewer fileId={parsedFileId} />
                    </div>
                </div>
            </div>
        </div>
    )
}