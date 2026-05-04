export default function UserDetailLoading() {
    return (
        <div className="flex flex-col gap-8">
            {/* UserInfoCard skeleton */}
            <div className="bg-white shadow-md rounded-lg p-6 flex sm:flex-row flex-col items-center gap-6 animate-pulse">
                <div className="w-20 h-20 rounded-full bg-gray-200 shrink-0" />
                <div className="flex flex-col gap-3 w-full">
                    <div className="h-6 bg-gray-200 rounded w-48" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="h-4 bg-gray-200 rounded w-40" />
                        <div className="h-4 bg-gray-200 rounded w-36" />
                        <div className="h-4 bg-gray-200 rounded w-32" />
                        <div className="h-4 bg-gray-200 rounded w-44" />
                    </div>
                </div>
            </div>

            {/* Posts skeleton */}
            <div className="flex flex-col gap-4">
                <div className="h-7 bg-gray-200 rounded w-32 animate-pulse" />
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 bg-white shadow-md rounded-lg p-6 animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="h-4 bg-gray-200 rounded w-5/6" />
                        <div className="flex gap-2 mt-1">
                            <div className="h-5 bg-gray-200 rounded-full w-14" />
                            <div className="h-5 bg-gray-200 rounded-full w-14" />
                            <div className="h-5 bg-gray-200 rounded-full w-14" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}