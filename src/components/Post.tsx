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
            className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
            <h3 className="text-lg font-bold text-gray-900 mb-2">
                {title}
            </h3>
            <p className="text-gray-700 mb-4">{body}</p>

            {/* Tags */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag) => (
                        <Badge key={tag} text={tag} color={BadgeColor.BLUE} />
                    ))}
                </div>
            )}

            {/* Reactions */}
            {reactions && (
                <div className="flex gap-4 text-sm text-gray-600">
                    {reactions.likes !== undefined && (
                        <span className="flex items-center gap-1">
                            👍 {reactions.likes}
                        </span>
                    )}
                    {reactions.dislikes !== undefined && (
                        <span className="flex items-center gap-1">
                            👎 {reactions.dislikes}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}