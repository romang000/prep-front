import type { TopicStatisticsResponse } from '../model/types'

type Props = {
    statistic: TopicStatisticsResponse
    onClick: (topic: string) => void
}

export function TopicStatisticCard({ statistic, onClick }: Props) {
    return (
        <button
            onClick={() => onClick(statistic.topic)}
            className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    {statistic.topic}
                </h3>

                <span className="text-2xl text-slate-400">
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
        <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-semibold text-slate-900">{value}</p>
        </div>
    )
}