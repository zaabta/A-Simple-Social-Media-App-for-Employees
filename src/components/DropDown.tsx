export type Options = {
    value: string;
    label: string;
};

export type DropDownProps = {
    label: string;
    options: Options[];
    value?: string;
    onSelect: (option: string) => void;
};

export default function DropDown({ label, options, value, onSelect }: DropDownProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
            <select
                className="w-full border border-gray-300 rounded-lg bg-white text-sm text-gray-700 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                value={value}
                onChange={(e) => onSelect(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}