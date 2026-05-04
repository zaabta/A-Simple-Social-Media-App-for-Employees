export default function UsersLoading() {
    return (
        <div className="flex flex-col gap-4 mx-auto p-12">
            {/* Sort / Filter / Search skeletons */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 bg-white p-4 rounded-lg shadow animate-pulse">
                    <div className="h-9 w-36 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-28 bg-gray-200 rounded-lg" />
                </div>
                <div className="flex gap-4 bg-white p-4 rounded-lg shadow animate-pulse">
                    <div className="h-9 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-32 bg-gray-200 rounded-lg" />
                </div>
                <div className="flex gap-2 animate-pulse">
                    <div className="h-9 w-full bg-gray-200 rounded-lg" />
                    <div className="h-9 w-24 bg-gray-200 rounded-lg" />
                </div>
            </div>

            {/* User card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white shadow-sm rounded-xl p-3 animate-pulse">
                        <div className="w-14 h-14 rounded-lg bg-gray-200 shrink-0" />
                        <div className="flex flex-col gap-2 w-full">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                            <div className="flex justify-between">
                                <div className="h-5 bg-gray-200 rounded-full w-16" />
                                <div className="h-3 bg-gray-200 rounded w-20" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}