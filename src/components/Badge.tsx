export enum BadgeColor {
    BLUE = "blue",
    PINK = "pink",
    GRAY = "gray"
}

export type BadgeProps = {
    text: string;
    color?: BadgeColor;
    className?: string;
};

export default function Badge({ text, color = BadgeColor.GRAY, className }: BadgeProps) {
    return (
        <span
            className={`inline-block mt-1 text-xs h-fit w-fit px-2 py-0.5 rounded-full ${color === BadgeColor.BLUE
                ? "bg-blue-100 text-blue-700"
                : color === BadgeColor.PINK
                    ? "bg-pink-100 text-pink-700"
                    : "bg-gray-100 text-gray-700"
                } ${className || ""}`}
        >
            {text}
        </span>
    )
} 