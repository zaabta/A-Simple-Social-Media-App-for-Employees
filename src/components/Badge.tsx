export enum Color {
    BLUE = "blue",
    PINK = "pink",
    GRAY = "gray"
}

export type BadgeProps = {
    text: string;
    color?: Color;
    className?: string;
};

export default function Badge({ text, color = Color.GRAY, className }: BadgeProps) {
    return (
        <span
            className={`inline-block mt-1 text-xs h-fit w-fit px-2 py-0.5 rounded-full ${color === Color.BLUE
                ? "bg-blue-100 text-blue-600"
                : color === Color.PINK
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-100 text-gray-600"
                } ${className || ""}`}
        >
            {text}
        </span>
    )
} 