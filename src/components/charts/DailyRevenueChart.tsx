'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface DailyRevenueData {
  date: string;
  revenue: number;
  pizzaCount: number;
  formattedDate: string;
  dayOfWeek: string;
  fullDate: string;
}

interface DailyRevenueChartProps {
  data: DailyRevenueData[];
  color?: string;
}

export function DailyRevenueChart({ data, color = '#3b82f6' }: DailyRevenueChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.fullDate}</p>
          <p className="text-sm font-medium text-blue-600">{data.dayOfWeek}</p>
          <p className="text-sm text-gray-600">
            Ingresos: ${data.revenue.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Pizzas vendidas: {data.pizzaCount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-gray-600"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}