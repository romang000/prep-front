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
        "w-full rounded-xl border p-4 text-left transition"

    if (!isAnswered) {
        className += isSelected
            ? " border-slate-950 bg-slate-100"
            : " border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
    } else {
        if (answer.isCorrect) {
            className += " border-emerald-300 bg-emerald-50"
        } else if (isSelected && !answer.isCorrect) {
            className += " border-red-300 bg-red-50"
        } else {
            className += " border-slate-200 bg-white"
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
                <span className="text-slate-800">{answer.text}</span>

                {isAnswered && answer.isCorrect && (
                    <span className="shrink-0 text-sm font-medium text-emerald-700">
                        Правильный
                    </span>
                )}

                {isAnswered && isSelected && !answer.isCorrect && (
                    <span className="shrink-0 text-sm font-medium text-red-700">
                        Неправильный
                    </span>
                )}
            </div>

            {isAnswered && answer.explanation && (
                <p className="mt-2 text-sm leading-6 text-slate-600">
                    {answer.explanation}
                </p>
            )}
        </button>
    )
}
