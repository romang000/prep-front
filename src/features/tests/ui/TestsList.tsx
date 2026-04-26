import { useNavigate } from "react-router-dom"
import type { TestResponse } from "../model/types"
import { TestCard } from "./TestCard"
import { useState } from "react"
import { createUserTestSession } from "@/features/userTestSession/api/userTestSession"

type Props = {
    tests: TestResponse[]
}

export function TestsList({ tests }: Props) {
    const TEMPORARY_USER_ID = 1

    const navigate = useNavigate()

    const [selectedTestId, setSelectedTestId] = useState<number | null>(null)

    const createTestSession = async (testId: number) => {
        try {
            const response = await createUserTestSession({
                userId: TEMPORARY_USER_ID,
                testId: testId,
            })

            navigate(`/tests/${testId}?sessionId=${response.id}`)
        } catch (e) {
            console.error("Ошибка при создании тестовой сессии", e)
        }
    }

    if (tests.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
                        <h2 className="text-lg font-semibold mb-4">
                            Важно перед началом теста
                        </h2>

                        <p className="text-gray-600 mb-6">
                            После начала теста время будет запущено.
                            Вы не сможете изменить ответы после завершения.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedTestId(null)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Отмена
                            </button>

                            <button
                                onClick={ () => createTestSession(selectedTestId) }
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
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
