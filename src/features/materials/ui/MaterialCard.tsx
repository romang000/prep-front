import { useEffect, useState, type MouseEvent } from "react";
import type { MaterialGetResponse, MaterialSetLikeRequest } from "../model/types";
import { setLikeRequest } from "../api/setLike";

type Props = {
    material: MaterialGetResponse;
    userId: number;
    onClick?: () => void;
};

export function MaterialCard({
    material,
    userId,
    onClick,
}: Props) {
    const [isLiked, setIsLiked] = useState(Boolean(material.isLiked));
    const [isLoading, setIsLoading] = useState(false);

    console.log("material:", material);
    console.log("material.isLiked:", material.isLiked);
    console.log("isLiked state:", isLiked);

    useEffect(() => {
        setIsLiked(Boolean(material.isLiked));
    }, [material.isLiked]);

    async function handleLikeClick(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();

        if (isLoading) return;

        const nextValue = !isLiked;

        try {
            setIsLoading(true);

            const req: MaterialSetLikeRequest = {
                userId,
                materialId: material.id,
                isLiked: nextValue,
            };

            const response = await setLikeRequest(req);

            setIsLiked(response.isLiked);
        } catch (error) {
            console.error("Ошибка при установке лайка", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={onClick}
            className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-slate-300 hover:shadow-md active:scale-[0.99]"
        >
            <div className="flex min-w-0 items-center gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">
                        {material.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                        {material.description}
                    </p>
                </div>
            </div>

            <div className="ml-4 flex shrink-0 items-center gap-3">
                <button
                    type="button"
                    onClick={handleLikeClick}
                    disabled={isLoading}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xl transition hover:bg-slate-100 disabled:opacity-50"
                >
                    {isLiked ? "❤️" : "🤍"}
                </button>

                <span className="text-2xl text-slate-400 transition group-hover:text-slate-700">
                    ›
                </span>
            </div>
        </div>
    );
}