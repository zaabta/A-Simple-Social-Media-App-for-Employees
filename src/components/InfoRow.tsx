import { ReactNode } from 'react';

export type InfoRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  title?: string;
};

export default function InfoRow({ icon, label, value, title }: InfoRowProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm text-gray-500 shrink-0">{label}:</span>
      <div className="text-sm text-gray-700 truncate min-w-0" title={title}>
        {value}
      </div>
    </div>
  );
}