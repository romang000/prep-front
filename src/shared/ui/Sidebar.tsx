import { Link } from "react-router-dom"

export type MenuItem = {
    label: string
    to: string
}

type SidebarProps = {
    isOpen: boolean
    onClose: () => void
    items: MenuItem[]
}

export function Sidebar({ isOpen, onClose, items }: SidebarProps) {
    return (
        <>
            <aside
                className={`fixed left-0 top-0 z-40 h-full w-72 transform border-r border-slate-200 bg-white shadow-2xl shadow-slate-950/10 transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Prep Platform
                        </p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">Меню</h2>
                        <p className="text-sm text-slate-500">Навигация по приложению</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        ✕
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-4">
                    {items.map((item) => (
                        <Link
                            key={item.to}
                            to={item.to}
                            onClick={onClose}
                            className="rounded-lg px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-emerald-900"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {isOpen && (
                <button
                    type="button"
                    onClick={onClose}
                    className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[1px]"
                />
            )}
        </>
    )
}
