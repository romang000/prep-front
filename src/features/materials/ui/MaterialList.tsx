import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MaterialGetResponse } from "../model/types";
import { MaterialCard } from "./MaterialCard";

type Props = {
    materials: MaterialGetResponse[];
};

export function MaterialsList({ materials }: Props) {
    const navigate = useNavigate();

    const [selectedMaterial, setSelectedMaterial] = useState<MaterialGetResponse | null>(null);

    const openMaterial = (materialId: number) => {
        navigate(`/materials/${materialId}`);
    };

    if (materials.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                Материалы не найдены
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {materials.map((material) => (
                    <MaterialCard
                        key={material.id}
                        material={material}
                        userId={1} // TODO: заменить на реальный ID текущего пользователя из контекста аутентификации
                        onClick={() => setSelectedMaterial(material)}
                    />
                ))}
            </div>

            {selectedMaterial && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-semibold text-slate-900">
                            {selectedMaterial.title}
                        </h2>

                        <p className="mt-3 text-sm text-slate-600">
                            {selectedMaterial.description}
                        </p>

                        <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                            <div>
                                <span className="font-medium text-slate-800">Тема:</span>{" "}
                                {selectedMaterial.topic}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Подтема:</span>{" "}
                                {selectedMaterial.subtopic}
                            </div>
                            <div>
                                <span className="font-medium text-slate-800">Уровень:</span>{" "}
                                {selectedMaterial.level}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setSelectedMaterial(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                                Отмена
                            </button>

                            <button
                                type="button"
                                onClick={() => openMaterial(selectedMaterial.id)}
                                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Открыть материал
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}