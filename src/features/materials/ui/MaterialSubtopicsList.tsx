import type { MaterialGetResponse } from "../model/types"
import { MaterialSubtopicCard } from "./MaterialSubtopicCard"

type MaterialSubtopicsListProps = {
    materials: MaterialGetResponse[]
    userId: number
    onSubtopicClick: (material: MaterialGetResponse) => void
}

export function MaterialSubtopicsList({
    materials,
    userId,
    onSubtopicClick,
}: MaterialSubtopicsListProps) {
    if (materials.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                    Подтемы не найдены
                </h2>

                <p className="mt-2 text-slate-500">
                    Сейчас нет доступных подтем для выбранной темы.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
                <MaterialSubtopicCard
                    key={material.id}
                    material={material}
                    userId={userId}
                    onClick={() => onSubtopicClick(material)}
                />
            ))}
        </div>
    )
}
