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
        <div className="flex flex-col items-left justify-left gap-2">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <select
                className="border border-gray-300 rounded-lg bg-white text-sm text-gray-700 py-2 px-4 focus:outline-none"
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