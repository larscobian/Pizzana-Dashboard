import React from 'react';
import { Card, CardContent } from './Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: LucideIcon;
  emoji?: string;
  subtitle?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  change,
  icon: Icon,
  emoji,
  subtitle,
  className = ''
}: MetricCardProps) {
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
            {change !== undefined && (
              <p className={`text-sm ${getChangeColor(change)} mt-2`}>
                {formatChange(change)} vs mes anterior
              </p>
            )}
          </div>
          <div className="flex-shrink-0">
            {emoji && (
              <span className="text-3xl">{emoji}</span>
            )}
            {Icon && (
              <Icon className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}