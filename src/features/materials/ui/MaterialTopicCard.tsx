type MaterialTopicCardProps = {
    topic: string
    onClick: () => void
}

export function MaterialTopicCard({ topic, onClick }: MaterialTopicCardProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-950/5 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-950/10"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-700 transition group-hover:border-slate-300 group-hover:bg-white">
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
