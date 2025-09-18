'use client';

import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface CandlestickData {
  month: string;
  total: number;
  local: number;
  eventos: number;
  feria: number;
  otros: number;
  changePercent: number;
  localPercent: number;
  eventPercent: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
}

export function CandlestickChart({ data }: CandlestickChartProps) {
  // Función para formatear el mes a formato "Sept. 2025"
  const formatMonthLabel = (monthString: string) => {
    try {
      // Si viene en formato "9/2025"
      if (monthString.includes('/')) {
        const [month, year] = monthString.split('/');
        const monthNames = [
          'Ene.', 'Feb.', 'Mar.', 'Abr.', 'May.', 'Jun.',
          'Jul.', 'Ago.', 'Sept.', 'Oct.', 'Nov.', 'Dic.'
        ];
        return `${monthNames[parseInt(month) - 1]} ${year}`;
      }
      return monthString;
    } catch {
      return monthString;
    }
  };

  // Formatear los datos para mostrar etiquetas correctas
  const formattedData = data.map(item => ({
    ...item,
    formattedMonth: formatMonthLabel(item.month)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{data.formattedMonth}</p>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">Total:</span> {formatCurrency(data.total)}
            </p>
            <p className="text-sm">
              <span className="font-medium">Cambio:</span>
              <span className={`ml-1 ${data.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
              </span>
            </p>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600 mb-1">Distribución:</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    Local:
                  </span>
                  <span>{data.localPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                    Eventos:
                  </span>
                  <span>{data.eventPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para mostrar el valor arriba de cada barra
  const CustomLabel = ({ x, y, width, value }: any) => {
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        textAnchor="middle"
        fontSize="11"
        fill="#374151"
        fontWeight="500"
      >
        {formatCurrency(value)}
      </text>
    );
  };

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{
            top: 40,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="formattedMonth"
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            className="text-gray-600"
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />

          {/* Barra principal para ingresos totales con labels arriba */}
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            <LabelList content={<CustomLabel />} />
            {formattedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.changePercent >= 0 ? '#10b981' : '#ef4444'}
                opacity={0.8}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      {/* Indicadores de porcentaje de cambio mejorados */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {formattedData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-600 font-medium">{item.formattedMonth}</div>
            <div className={`text-sm font-semibold ${
              item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}