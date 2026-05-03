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
      <span className="w-3.5 h-3.5 text-gray-400">{icon}</span>
      <span className="text-gray-600">{label}:</span>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}