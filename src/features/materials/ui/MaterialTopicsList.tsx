import { MaterialTopicCard } from "./MaterialTopicCard"
import type { MaterialTopicGetResponse } from "../model/types"

type MaterialTopicsListProps = {
    topics: MaterialTopicGetResponse[]
    onTopicClick: (topic: string) => void
}

export function MaterialTopicsList({
    topics,
    onTopicClick,
}: MaterialTopicsListProps) {
    if (topics.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
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
                    topic={topic.topic}
                    onClick={() => onTopicClick(topic.topic)}
                />
            ))}
        </div>
    )
}