'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import { ErrorState } from '@/components/layout/ErrorState';
import { LocalSection } from '@/components/sections/LocalSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { WorkingDaysSlider } from '@/components/ui/WorkingDaysSlider';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { DateFilterPeriod } from '@/components/ui/DateFilter';

interface DashboardData {
  general: {
    totalRevenue: number;
    totalNetIncome: number;
    revenueChange: number;
    netIncomeChange: number;
    localRevenue: number;
    eventRevenue: number;
    localPercentage: number;
    eventPercentage: number;
    operationRate: number;
    workingDaysData: {
      year: number;
      month: number;
      monthName: string;
      viernes: number;
      sabados: number;
      totalPossible: number;
      actualWorked: number;
      rate: number;
      workingDaysDetail: {
        date: string;
        day: number;
        dayOfWeek: 'friday' | 'saturday';
        weekOfMonth: number;
        worked: boolean;
        hasLocal: boolean;
        hasEvents: boolean;
        ordersCount: number;
        localOrders: number;
        eventOrders: number;
      }[];
    }[];
    candlestickData: any[];
    periodLabel: string;
    startDate: string;
    endDate: string;
  };
  local: {
    dailyRevenue: any[];
    totalRevenue: number;
    fridayRevenue: number;
    saturdayRevenue: number;
    totalSales: number;
    uniqueClients: number;
    topClients: any[];
    topPizzas: any[];
    periodLabel: string;
  };
  events: {
    dailyRevenue: any[];
    totalRevenue: number;
    totalSales: number;
    uniqueClients: number;
    periodLabel: string;
  };
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados del filtro de fechas
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilterPeriod>('current_month');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  // Estado del período del gráfico
  const [chartPeriod, setChartPeriod] = useState<'months' | 'weeks' | 'days'>('months');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros de filtro
      const url = new URL('/api/dashboard', window.location.origin);
      url.searchParams.set('period', selectedPeriod);
      url.searchParams.set('chartPeriod', chartPeriod);

      if (selectedPeriod === 'custom') {
        if (customStartDate) url.searchParams.set('startDate', customStartDate);
        if (customEndDate) url.searchParams.set('endDate', customEndDate);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos de timeout

      const response = await fetch(url.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('El servidor está tardando más de lo esperado. Por favor, intenta de nuevo.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Error desconocido');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod, customStartDate, customEndDate, chartPeriod]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const handlePeriodChange = (period: DateFilterPeriod) => {
    setSelectedPeriod(period);
  };

  const handleCustomDateChange = (startDate: string, endDate: string) => {
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  const handleChartPeriodChange = (period: 'months' | 'weeks' | 'days') => {
    setChartPeriod(period);
  };

  if (loading && !data) {
    return <PageLoadingSpinner />;
  }

  if (error && !data) {
    return (
      <ErrorState
        title="Error de Conexión"
        message={`No se pudo cargar el dashboard: ${error}`}
        onRetry={handleRefresh}
      />
    );
  }

  if (!data) {
    return (
      <ErrorState
        title="Sin Datos"
        message="No se encontraron datos para mostrar."
        onRetry={handleRefresh}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con logo y botón actualizar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🍕</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">PIZZANA Dashboard</h1>
                <p className="text-xs text-gray-500">Analítica & CRM en tiempo real</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <span>📊</span>
              <span>Actualizar</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filtros de período */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg inline-flex">
            {[
              { key: 'current_month', label: 'Este mes' },
              { key: '30_days', label: 'Últimos 30 días' },
              { key: '3_months', label: 'Últimos 3 meses' },
              { key: '6_months', label: 'Últimos 6 meses' },
              { key: 'current_year', label: 'Último año' },
              { key: '2_years', label: '2 años' },
              { key: 'custom', label: 'Personalizado' }
            ].map((period) => (
              <button
                key={period.key}
                onClick={() => handlePeriodChange(period.key as DateFilterPeriod)}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  selectedPeriod === period.key
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Fechas personalizadas */}
          {selectedPeriod === 'custom' && (
            <div className="mt-4 flex items-center space-x-4 bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Desde:</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => handleCustomDateChange(e.target.value, customEndDate)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Hasta:</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => handleCustomDateChange(customStartDate, e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Resumen General */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-sm text-gray-600">📊</span>
            <span className="text-sm font-medium text-gray-900">Resumen General</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Ingresos Totales */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Totales</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.general.totalRevenue.toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    data.general.revenueChange === 0 ? 'text-gray-500' :
                    data.general.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {data.general.revenueChange === 0
                      ? 'Sin datos del período anterior'
                      : `${data.general.revenueChange >= 0 ? '+' : ''}${data.general.revenueChange.toFixed(1)}% vs período anterior`
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💰</span>
                </div>
              </div>
            </div>

            {/* Ingresos Neto */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Neto</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${(data.general.totalNetIncome || 0).toLocaleString()}
                  </p>
                  <p className={`text-sm ${
                    (data.general.netIncomeChange || 0) === 0 ? 'text-gray-500' :
                    (data.general.netIncomeChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {(data.general.netIncomeChange || 0) === 0
                      ? 'Beneficio después de costos'
                      : `${(data.general.netIncomeChange || 0) >= 0 ? '+' : ''}${(data.general.netIncomeChange || 0).toFixed(1)}% vs período anterior`
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">💎</span>
                </div>
              </div>
            </div>

            {/* Ingresos Local */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Local</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.general.localRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.general.localPercentage.toFixed(0)}% del total
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
              </div>
            </div>

            {/* Ingresos Eventos */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Ingresos Eventos</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${data.general.eventRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    {data.general.eventPercentage.toFixed(0)}% del total
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏠</span>
                </div>
              </div>
            </div>

            {/* Tasa de Operación */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tasa de Operación</p>
                  <p className={`text-2xl font-bold ${
                    data.general.operationRate > 75 ? 'text-green-600' :
                    data.general.operationRate >= 51 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {data.general.operationRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600">
                    Viernes y sábados trabajados
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  data.general.operationRate > 75 ? 'bg-green-100' :
                  data.general.operationRate >= 51 ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <span className="text-2xl">📅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gráfico de Evolución */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Evolución de Ingresos</h3>
            <CandlestickChart
              data={data.general.candlestickData}
              onPeriodChange={handleChartPeriodChange}
            />
          </div>
        </div>

        {/* Grid de Local y Eventos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sección Local */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">🏪</span>
              <span className="text-sm font-medium text-gray-900">Local</span>
              <span className="text-xs text-gray-500">Últimos 6 meses</span>
            </div>
            <LocalSection data={data.local} />
          </div>

          {/* Sección Eventos y Días Trabajados */}
          <div className="space-y-6">
            {/* Sección Eventos */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">🏠</span>
                <span className="text-sm font-medium text-gray-900">Eventos</span>
                <span className="text-xs text-gray-500">Últimos 6 meses</span>
              </div>
              <EventsSection data={data.events} />
            </div>

            {/* Sección de Días Trabajados */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">📅</span>
                <span className="text-sm font-medium text-gray-900">Días Trabajados</span>
                <span className="text-xs text-gray-500">{data.general.periodLabel}</span>
              </div>
              <WorkingDaysSlider
                data={data.general.workingDaysData}
                periodLabel={data.general.periodLabel}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Indicador de carga flotante */}
      {loading && data && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500"></div>
            <span className="text-sm text-gray-700">Actualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
