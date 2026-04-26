import type { QuestionResponse } from "../model/types"

type Props = {
    question: QuestionResponse
}

export function QuestionCard({ question }: Props) {
    return (
        <div
            className="border-2 border-gray-200 rounded-lg p-5 m-2 hover:shadow-lg
                       transition-all duration-300 bg-white hover:border-blue-300"
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        {question.topic}
                    </h2>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    Вопрос #{question.serialNumber}
                </span>
            </div>

            <p className="text-gray-700 leading-relaxed pl-11">
                {question.wordingQuestion}
            </p>
        </div>
    )
}