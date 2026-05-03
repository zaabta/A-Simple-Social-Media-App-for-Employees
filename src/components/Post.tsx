import Badge, { BadgeColor } from "./Badge";

export type PostProps = {
    title: string;
    body: string;
    tags?: string[];
    reactions?: {
        likes?: number;
        dislikes?: number;
    };
};

export default function Post({ title, body, tags, reactions }: PostProps) {
    return (
        <div
            className="flex flex-col gap-2 items-start bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
            <h3 className="text-lg font-bold text-gray-900">
                {title}
            </h3>
            <p className="text-gray-700">{body}</p>

            <div className="w-full flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {tags?.map((tag) => (
                        <Badge key={tag} text={tag} color={BadgeColor.BLUE} />
                    ))}
                </div>
                {/* Reactions */}
                {reactions && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {reactions.likes !== undefined && (
                            <span className="flex items-center gap-0.5">
                                <img src="/assets/green-up-arrow.svg" alt="Like" className="w-4 h-4" />
                                <label htmlFor="like" className="text-green-600">{reactions.likes}</label>
                            </span>
                        )}
                        {reactions.dislikes !== undefined && (
                            <span className="flex  items-center gap-0.5">
                                <img src="/assets/red-down-arrow.svg" alt="Dislike" className="w-4 h-4" />
                                <label htmlFor="dislike" className="text-red-600">{reactions.dislikes}</label>
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}