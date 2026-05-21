import type { QuestionResponse } from "../model/types"

type Props = {
    question: QuestionResponse
}

export function QuestionCard({ question }: Props) {
    return (
        <div
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5"
        >
            <div className="mb-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-slate-950">
                        {question.topic ?? question.subtopic ?? `Тема #${question.topicId}`}
                    </h2>
                </div>
                <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                    Вопрос #{question.serialNumber}
                </span>
            </div>

            <p className="leading-7 text-slate-700">
                {question.wordingQuestion}
            </p>
        </div>
    )
}
