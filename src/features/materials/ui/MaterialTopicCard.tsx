type MaterialTopicCardProps = {
    topic: string
    onClick: () => void
}

export function MaterialTopicCard({ topic, onClick }: MaterialTopicCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    📘
                </div>

                <div className="min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900">
                        {topic}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Перейти к подтемам и учебным материалам по этой теме
                    </p>
                </div>
            </div>
        </button>
    )
}