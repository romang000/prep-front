type HeaderProps = {
    title: string
    description: string
}

export function Header({title, description}: HeaderProps) {
    return (
        <div className="mb-8 rounded-3xl bg-linear-to-r from-blue-600 to-cyan-500 p-6 text-white shadow-lg sm:p-8">
            <h1 className="text-3xl font-bold sm:text-4xl">
                {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                {description}
            </p>
        </div>
    )
}