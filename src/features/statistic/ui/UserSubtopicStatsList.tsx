import type { SubtopicStatisticsResponse } from '../model/types'
import { SubtopicStatisticCard } from './SubtopicStatisticCard'

type Props = {
    statistics: SubtopicStatisticsResponse[]
}

export function UserSubtopicStatsList({ statistics }: Props) {
    if (statistics.length === 0) {
        return (
            <p className="text-slate-500">
                Статистика по подтемам пока отсутствует.
            </p>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statistics.map((statistic) => (
                <SubtopicStatisticCard
                    key={`${statistic.topicTitle}-${statistic.subtopic}`}
                    statistic={statistic}
                />
            ))}
        </div>
    )
}
