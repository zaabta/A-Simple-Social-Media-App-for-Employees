import { ReactNode } from 'react';

export type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

export default function InfoRow({
  icon,
  label,
  value,
}: InfoRowProps) {
  return (
    <div className="flex justify-start items-center gap-2">
      {icon}
      <span className="text-sm text-gray-600">{label}:</span>
      <div className="text-sm text-gray-600">{value}</div>
    </div>
  );
}