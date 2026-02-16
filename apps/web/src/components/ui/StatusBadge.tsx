import { cn } from '@/lib/utils';

const stageColors: Record<string, string> = {
  SOFT: 'bg-green-100 text-green-800',
  HARD: 'bg-orange-100 text-orange-800',
  LEGAL: 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  OPEN: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  RESOLVED: 'bg-gray-100 text-gray-800',
  CLOSED: 'bg-black text-white',
};

export function StatusBadge({ type, value }: { type: 'stage' | 'status', value: string }) {
  const styles = type === 'stage' ? stageColors[value] : statusColors[value];
  return (
    <span className={cn("px-2 py-1 rounded-full text-xs font-medium", styles)}>
      {value}
    </span>
  );
}