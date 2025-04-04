
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorVariants = {
  blue: 'border-qa-blue',
  green: 'border-green-500',
  orange: 'border-orange-500',
  purple: 'border-purple-500',
};

const iconColorVariants = {
  blue: 'bg-blue-100 text-qa-blue',
  green: 'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  purple: 'bg-purple-100 text-purple-600',
};

export function StatCard({ title, value, icon: Icon, description, trend, color }: StatCardProps) {
  return (
    <div className={cn('qa-stat-card', colorVariants[color])}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-semibold mt-1">{value}</h3>
          {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={cn(
                  "text-xs font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-full', iconColorVariants[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
