'use client';

import React, { useState } from 'react';
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
  netIncome: number;
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
  onPeriodChange?: (period: ChartPeriod) => void;
}

type ChartPeriod = 'months' | 'weeks' | 'days';

export function CandlestickChart({ data, onPeriodChange }: CandlestickChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<ChartPeriod>('months');

  // Verificar restricciones de datos basado en el rango de datos disponibles
  const getDataRangeInMonths = (): number => {
    if (data.length === 0) return 0;

    try {
      // Ordenar datos por fecha
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a.month.includes('/') ? a.month.split('/').reverse().join('-') : a.month);
        const dateB = new Date(b.month.includes('/') ? b.month.split('/').reverse().join('-') : b.month);
        return dateA.getTime() - dateB.getTime();
      });

      const firstDate = new Date(sortedData[0].month.includes('/') ? sortedData[0].month.split('/').reverse().join('-') : sortedData[0].month);
      const lastDate = new Date(sortedData[sortedData.length - 1].month.includes('/') ? sortedData[sortedData.length - 1].month.split('/').reverse().join('-') : sortedData[sortedData.length - 1].month);

      const diffTime = lastDate.getTime() - firstDate.getTime();
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); // Aproximación de días en un mes

      return Math.ceil(diffMonths);
    } catch {
      return 0;
    }
  };

  // Manejar cambio de período con validación
  const handlePeriodChange = (period: ChartPeriod) => {
    const dataRangeMonths = getDataRangeInMonths();

    if (period === 'days' && dataRangeMonths > 3) {
      alert('La vista por días solo está disponible para períodos de 3 meses o menos');
      return;
    }
    if (period === 'weeks' && dataRangeMonths > 12) {
      alert('La vista por semanas solo está disponible para períodos de 1 año o menos');
      return;
    }
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-xl">
          <p className="font-semibold text-gray-900 mb-2">{data.formattedMonth}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-800">
              <span className="font-medium text-gray-900">Total:</span> {formatCurrency(data.total)}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-medium text-gray-900">Neto:</span> {formatCurrency(data.netIncome || 0)}
            </p>
            <p className="text-sm text-gray-800">
              <span className="font-medium text-gray-900">Cambio:</span>
              <span className={`ml-1 font-semibold ${data.changePercent >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
              </span>
            </p>
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-800 mb-1">Distribución:</p>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="flex items-center text-gray-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                    Local:
                  </span>
                  <span className="font-medium text-gray-900">{data.localPercent.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="flex items-center text-gray-800">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                    Eventos:
                  </span>
                  <span className="font-medium text-gray-900">{data.eventPercent.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Componente personalizado para mostrar el valor y porcentaje arriba de cada barra
  const CustomLabel = ({ x, y, width, value, index }: any) => {
    const data = formattedData[index];
    const changePercent = data?.changePercent || 0;
    const changeColor = changePercent >= 0 ? '#16a34a' : '#dc2626'; // Verde o rojo
    const changeSign = changePercent >= 0 ? '+' : '';

    return (
      <g>
        {/* Valor de ingresos */}
        <text
          x={x + width / 2}
          y={y - 20}
          textAnchor="middle"
          fontSize="11"
          fill="#374151"
          fontWeight="500"
        >
          {formatCurrency(value)}
        </text>
        {/* Porcentaje de cambio */}
        <text
          x={x + width / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize="10"
          fill={changeColor}
          fontWeight="600"
        >
          {changeSign}{changePercent.toFixed(1)}%
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-96">
      {/* Controles de período */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'months', label: 'Meses' },
            { key: 'weeks', label: 'Semanas' },
            { key: 'days', label: 'Días' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => handlePeriodChange(period.key as ChartPeriod)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors duration-200 ${
                selectedPeriod === period.key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        {selectedPeriod !== 'months' && (
          <div className="text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
            ⚠️ Datos agrupados por mes. {selectedPeriod === 'days' ? 'Vista de días limitada a 3 meses' : 'Vista de semanas limitada a 1 año'}
          </div>
        )}
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{
            top: 60,
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
      </div>
    </div>
  );
}