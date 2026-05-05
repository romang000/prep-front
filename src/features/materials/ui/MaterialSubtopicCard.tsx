import { useEffect, useState, type KeyboardEvent, type MouseEvent } from "react"
import type {
    MaterialGetResponse,
    MaterialSetLikeRequest,
} from "../model/types"
import { setLikeRequest } from "../api/setLike"

type MaterialSubtopicCardProps = {
    material: MaterialGetResponse
    userId: number
    onClick: () => void
}

export function MaterialSubtopicCard({
    material,
    userId,
    onClick,
}: MaterialSubtopicCardProps) {
    const [isLiked, setIsLiked] = useState(Boolean(material.isLiked))
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLiked(Boolean(material.isLiked))
    }, [material.isLiked])

    async function handleLikeClick(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()

        if (isLoading) return

        const nextValue = !isLiked

        try {
            setIsLoading(true)

            const req: MaterialSetLikeRequest = {
                userId,
                materialId: material.id,
                isLiked: nextValue,
            }

            const response = await setLikeRequest(req)

            setIsLiked(response.isLiked)
        } catch (error) {
            console.error("Ошибка при установке лайка", error)
        } finally {
            setIsLoading(false)
        }
    }

    function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onClick()
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            className="group flex w-full cursor-pointer items-start justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-950/5 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-950/10 active:scale-[0.99]"
        >
            <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xl text-slate-700">
                    📄
                </div>

                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                        {material.subtopic}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                        Перейти к материалу по этой подтеме
                    </p>

                    <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                        {material.title}
                    </p>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3">
                <button
                    type="button"
                    onClick={handleLikeClick}
                    disabled={isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-xl transition hover:border-slate-300 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLiked ? "❤️" : "🤍"}
                </button>

                <span className="text-2xl text-slate-400 transition group-hover:text-slate-700">
                    ›
                </span>
            </div>
        </div>
    )
}
