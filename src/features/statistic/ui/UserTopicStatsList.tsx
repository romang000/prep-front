import type { TopicStatisticsResponse } from '../model/types'
import { TopicStatisticCard } from './TopicStatisticCard'

type Props = {
    statistics: TopicStatisticsResponse[]
    onTopicClick: (topicId: number, topicTitle: string) => void
}

export function UserTopicStatsList({ statistics, onTopicClick }: Props) {
    if (statistics.length === 0) {
        return (
            <p className="text-slate-500">
                Статистика по темам пока отсутствует.
            </p>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statistics.map((statistic) => (
                <TopicStatisticCard
                    key={statistic.topicId}
                    statistic={statistic}
                    onClick={onTopicClick}
                />
            ))}
        </div>
    )
}
