import { useNavigate } from "react-router-dom"
import type { TestResponse } from "../model/types"
import { TestCard } from "./TestCard"
import { useState } from "react"
import { createUserTestSession } from "@/features/userTestSession/api/userTestSession"

type Props = {
    tests: TestResponse[]
    userId: number
}

export function TestsList({ tests, userId }: Props) {
    const navigate = useNavigate()

    const [selectedTestId, setSelectedTestId] = useState<number | null>(null)

    const createTestSession = async (testId: number) => {
        try {
            const response = await createUserTestSession({
                userId,
                testId: testId,
            })

            navigate(`/tests/${testId}?sessionId=${response.id}`)
        } catch (e) {
            console.error("Ошибка при создании тестовой сессии", e)
        }
    }

    if (tests.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                Тесты не найдены
            </div>
        )
    }

    return (
        <div className="grid gird-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tests.map(test => (
                <TestCard
                    key={test.id}
                    test={test}
                    onClick={() => setSelectedTestId(test.id)}
                />
            ))}

            {selectedTestId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-[1px]">
                    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-950/20">
                        <h2 className="mb-4 text-lg font-semibold text-slate-950">
                            Важно перед началом теста
                        </h2>

                        <p className="mb-6 text-sm leading-6 text-slate-600">
                            После начала теста время будет запущено.
                            Вы не сможете изменить ответы после завершения.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedTestId(null)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                Отмена
                            </button>

                            <button
                                onClick={ () => createTestSession(selectedTestId) }
                                className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                Пройти тест
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
