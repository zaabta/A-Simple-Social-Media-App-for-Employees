import Badge, { BadgeColor } from './Badge';

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
        <div className="flex flex-col gap-3 bg-white shadow-sm rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                {title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {body}
            </p>
            <div className="flex flex-wrap justify-between items-center gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5">
                    {tags?.map((tag) => (
                        <Badge key={tag} text={`#${tag}`} color={BadgeColor.BLUE} />
                    ))}
                </div>
                {reactions && (
                    <div className="flex items-center gap-3 text-sm shrink-0">
                        {reactions.likes !== undefined && (
                            <span className="flex items-center gap-1 text-green-600 font-medium">
                                <img src="/assets/green-up-arrow.svg" alt="Likes" className="w-4 h-4" />
                                {reactions.likes}
                            </span>
                        )}
                        {reactions.dislikes !== undefined && (
                            <span className="flex items-center gap-1 text-red-500 font-medium">
                                <img src="/assets/red-down-arrow.svg" alt="Dislikes" className="w-4 h-4" />
                                {reactions.dislikes}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}