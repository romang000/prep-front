import type { TopicStatisticsResponse } from '../model/types'

type Props = {
    statistic: TopicStatisticsResponse
    onClick: (topicId: number, topicTitle: string) => void
}

export function TopicStatisticCard({ statistic, onClick }: Props) {
    return (
        <button
            onClick={() => onClick(statistic.topicId, statistic.topicTitle)}
            className="group w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-950/5 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-950/10"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    {statistic.topicTitle}
                </h3>

                <span className="text-2xl text-slate-400 transition group-hover:text-slate-700">
                    →
                </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoItem label="Всего ответов" value={statistic.totalAnswered} />
                <InfoItem label="Верных" value={statistic.correctCount} />
                <InfoItem label="Ошибок" value={statistic.incorrectCount} />
                <InfoItem label="Точность" value={`${statistic.accuracy}%`} />
            </div>
        </button>
    )
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-semibold text-slate-900">{value}</p>
        </div>
    )
}
