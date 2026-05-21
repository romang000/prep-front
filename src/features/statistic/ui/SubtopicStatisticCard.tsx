import type { SubtopicStatisticsResponse } from '../model/types'

type Props = {
    statistic: SubtopicStatisticsResponse
}

export function SubtopicStatisticCard({ statistic }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/5">
            <div className="mb-4">
                <p className="text-sm text-slate-500">{statistic.topicTitle}</p>
                <h3 className="text-lg font-semibold text-slate-900">
                    {statistic.subtopic}
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoItem label="Всего ответов" value={statistic.totalAnswered} />
                <InfoItem label="Верных" value={statistic.correctCount} />
                <InfoItem label="Ошибок" value={statistic.incorrectCount} />
                <InfoItem label="Точность" value={`${statistic.accuracy}%`} />
            </div>
        </div>
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
