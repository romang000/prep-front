import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MaterialViewer } from "./MaterialViewer"
import { Loader } from "@/shared/ui/Loader"
import { ErrorLoad } from "@/shared/ui/ErrorLoad"
import { getMaterialById } from "../api/getMaterialById"
import type { MaterialGetResponse } from "../model/types"
import { TopBar } from "@/shared/ui/TopBar"

export function MaterialDetailPage() {
    const navigate = useNavigate()
    const { materialId, fileId } = useParams()
    const [material, setMaterial] = useState<MaterialGetResponse | null>(null)
    const [resolvedFileId, setResolvedFileId] = useState<number | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!materialId) {
            return
        }

        const parsedMaterialId = Number(materialId)

        if (Number.isNaN(parsedMaterialId)) {
            setError("Некорректный идентификатор материала")
            return
        }

        if (fileId) {
            const parsedFileId = Number(fileId)

            if (Number.isNaN(parsedFileId)) {
                setError("Некорректный идентификатор файла")
                return
            }

            setResolvedFileId(parsedFileId)
            return
        }

        async function loadMaterial() {
            try {
                setIsLoading(true)
                setError(null)

                const loadedMaterial = await getMaterialById(parsedMaterialId)

                setMaterial(loadedMaterial)
                setResolvedFileId(loadedMaterial.fileId)
            } catch {
                setError("Не удалось загрузить материал")
            } finally {
                setIsLoading(false)
            }
        }

        loadMaterial()
    }, [materialId, fileId])

    if (!materialId) {
        return <div>Материал не найден</div>
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <TopBar backLabel="← К материалам" onBackClick={() => navigate("/materials")} />

                <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm shadow-slate-950/5">
                    <h1 className="text-2xl font-bold text-slate-900">
                        {material?.title ?? "Материал"}
                    </h1>

                    {material?.description && (
                        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {material.description}
                        </p>
                    )}

                    <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        {isLoading && <Loader />}

                        {!isLoading && error && <ErrorLoad message={error} />}

                        {!isLoading && !error && resolvedFileId && (
                            <MaterialViewer fileId={resolvedFileId} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
