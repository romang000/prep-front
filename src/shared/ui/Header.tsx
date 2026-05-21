type HeaderProps = {
    title: string
    description: string
}

export function Header({title, description}: HeaderProps) {
    return (
        <div className="mb-8 border-b border-slate-200 pb-6">
            <div className="mb-4 h-1 w-16 rounded-full bg-emerald-400" />
            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                {title}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                {description}
            </p>
        </div>
    )
}
