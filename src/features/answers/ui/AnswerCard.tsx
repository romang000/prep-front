import type { AnswerGetResponse } from "../model/types"

type Props = {
    answer: AnswerGetResponse
    selectedAnswerId?: number
    isAnswered: boolean
    onSelect: (answerId: number) => void
}

export function AnswerCard({
    answer,
    selectedAnswerId,
    isAnswered,
    onSelect,
}: Props) {
    const isSelected = selectedAnswerId === answer.id

    let className =
        "w-full text-left border rounded-lg p-4 transition"

    if (!isAnswered) {
        className += isSelected
            ? " border-blue-500 bg-blue-50"
            : " border-gray-200 hover:bg-gray-50"
    } else {
        if (answer.isCorrect) {
            className += " border-green-500 bg-green-50"
        } else if (isSelected && !answer.isCorrect) {
            className += " border-red-500 bg-red-50"
        } else {
            className += " border-gray-200 bg-white"
        }
    }

    return (
        <button
            type="button"
            onClick={() => onSelect(answer.id)}
            disabled={isAnswered}
            className={className}
        >
            <div className="flex items-start justify-between gap-4">
                <span className="text-gray-800">{answer.text}</span>

                {isAnswered && answer.isCorrect && (
                    <span className="text-sm font-medium text-green-700">
                        Правильный
                    </span>
                )}

                {isAnswered && isSelected && !answer.isCorrect && (
                    <span className="text-sm font-medium text-red-700">
                        Неправильный
                    </span>
                )}
            </div>

            {isAnswered && answer.explanation && (
                <p className="text-sm text-gray-600 mt-2">
                    {answer.explanation}
                </p>
            )}
        </button>
    )
}