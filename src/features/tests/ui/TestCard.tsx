import type { TestResponse } from '../model/types'

type Props = {
    test: TestResponse
    onClick?: () => void
}

export function TestCard({ test, onClick }: Props) {
    return (

        <button
            onClick={onClick}
            className="w-full rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm shadow-slate-950/5 transition hover:border-slate-300 hover:bg-slate-50 hover:shadow-md hover:shadow-slate-950/10"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-800">{test.title}</h3>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    #{test.id}
                </span>
            </div>

            <p className="text-sm leading-6 text-slate-600">
                {test.description || 'Описание отсутствует'}
            </p>
        </button>
    )
}
