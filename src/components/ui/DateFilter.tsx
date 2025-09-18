import React, { useState } from 'react';
import { subMonths, format, startOfMonth } from 'date-fns';

export type DateFilterPeriod = 'last_month' | '3_months' | '6_months' | '12_months' | '2_years' | 'custom';

interface DateFilterOption {
  value: DateFilterPeriod;
  label: string;
  months: number;
}

interface DateFilterProps {
  selectedPeriod: DateFilterPeriod;
  customStartDate?: string;
  customEndDate?: string;
  onPeriodChange: (period: DateFilterPeriod) => void;
  onCustomDateChange: (startDate: string, endDate: string) => void;
}

const dateFilterOptions: DateFilterOption[] = [
  { value: 'last_month', label: 'Último mes', months: 1 },
  { value: '3_months', label: 'Últimos 3 meses', months: 3 },
  { value: '6_months', label: 'Últimos 6 meses', months: 6 },
  { value: '12_months', label: 'Últimos 12 meses', months: 12 },
  { value: '2_years', label: 'Últimos 2 años', months: 24 },
  { value: 'custom', label: 'Personalizado', months: 0 },
];

export function DateFilter({
  selectedPeriod,
  customStartDate,
  customEndDate,
  onPeriodChange,
  onCustomDateChange,
}: DateFilterProps) {
  const [showCustomDates, setShowCustomDates] = useState(selectedPeriod === 'custom');

  const handlePeriodChange = (period: DateFilterPeriod) => {
    onPeriodChange(period);
    setShowCustomDates(period === 'custom');
  };

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      onCustomDateChange(value, customEndDate || format(new Date(), 'yyyy-MM-dd'));
    } else {
      onCustomDateChange(customStartDate || format(subMonths(new Date(), 1), 'yyyy-MM-dd'), value);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Filtro de Fechas</h3>
          <p className="text-sm text-gray-600">Selecciona el período para visualizar los datos</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Período predefinido */}
          <select
            value={selectedPeriod}
            onChange={(e) => handlePeriodChange(e.target.value as DateFilterPeriod)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          >
            {dateFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Fechas personalizadas */}
          {showCustomDates && (
            <div className="flex gap-2 items-center">
              <span className="text-sm text-gray-600 whitespace-nowrap">Desde:</span>
              <input
                type="date"
                value={customStartDate || ''}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-600 whitespace-nowrap">Hasta:</span>
              <input
                type="date"
                value={customEndDate || ''}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Información del período seleccionado */}
      {selectedPeriod !== 'custom' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            📅 Mostrando datos desde {' '}
            <strong>
              {format(subMonths(startOfMonth(new Date()), dateFilterOptions.find(opt => opt.value === selectedPeriod)?.months || 1), 'dd/MM/yyyy')}
            </strong>
            {' '} hasta {' '}
            <strong>{format(new Date(), 'dd/MM/yyyy')}</strong>
          </p>
        </div>
      )}

      {selectedPeriod === 'custom' && customStartDate && customEndDate && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            📅 Período personalizado: desde {' '}
            <strong>{format(new Date(customStartDate), 'dd/MM/yyyy')}</strong>
            {' '} hasta {' '}
            <strong>{format(new Date(customEndDate), 'dd/MM/yyyy')}</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export function getDateRangeFromPeriod(period: DateFilterPeriod, customStart?: string, customEnd?: string) {
  const now = new Date();

  if (period === 'custom') {
    return {
      startDate: customStart ? new Date(customStart) : subMonths(now, 1),
      endDate: customEnd ? new Date(customEnd) : now,
    };
  }

  const option = dateFilterOptions.find(opt => opt.value === period);
  const months = option?.months || 1;

  return {
    startDate: subMonths(startOfMonth(now), months),
    endDate: now,
  };
}