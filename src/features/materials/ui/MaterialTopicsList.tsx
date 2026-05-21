import { MaterialTopicCard } from "./MaterialTopicCard"
import type { MaterialTopicGetResponse } from "../model/types"

type MaterialTopicsListProps = {
    topics: MaterialTopicGetResponse[]
    onTopicClick: (topic: MaterialTopicGetResponse) => void
}

export function MaterialTopicsList({
    topics,
    onTopicClick,
}: MaterialTopicsListProps) {
    if (topics.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <h2 className="text-xl font-semibold text-slate-900">
                    Темы не найдены
                </h2>

                <p className="mt-2 text-slate-500">
                    Сейчас нет доступных тем материалов.
                </p>
            </div>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
                <MaterialTopicCard
                    key={topic.id}
                    topic={topic.topicTitle}
                    onClick={() => onTopicClick(topic)}
                />
            ))}
        </div>
    )
}
