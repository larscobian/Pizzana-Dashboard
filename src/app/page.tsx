'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { PageLoadingSpinner } from '@/components/layout/LoadingSpinner';
import { ErrorState } from '@/components/layout/ErrorState';
import { GeneralSection } from '@/components/sections/GeneralSection';
import { LocalSection } from '@/components/sections/LocalSection';
import { EventsSection } from '@/components/sections/EventsSection';
import { DateFilter, DateFilterPeriod, getDateRangeFromPeriod } from '@/components/ui/DateFilter';
import { format } from 'date-fns';

interface DashboardData {
  general: {
    totalRevenue: number;
    revenueChange: number;
    localRevenue: number;
    eventRevenue: number;
    localPercentage: number;
    eventPercentage: number;
    candlestickData: any[];
    periodLabel: string;
    startDate: string;
    endDate: string;
  };
  local: {
    dailyRevenue: any[];
    totalRevenue: number;
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
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Estados del filtro de fechas
  const [selectedPeriod, setSelectedPeriod] = useState<DateFilterPeriod>('6_months');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construir URL con parámetros de filtro
      const url = new URL('/api/dashboard', window.location.origin);
      url.searchParams.set('period', selectedPeriod);

      if (selectedPeriod === 'custom') {
        if (customStartDate) url.searchParams.set('startDate', customStartDate);
        if (customEndDate) url.searchParams.set('endDate', customEndDate);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      setLastUpdated(new Date().toLocaleTimeString('es-CL'));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, customStartDate, customEndDate]);

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
      <Header
        isLoading={loading}
        onRefresh={handleRefresh}
        lastUpdated={lastUpdated}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro de fechas */}
        <DateFilter
          selectedPeriod={selectedPeriod}
          customStartDate={customStartDate}
          customEndDate={customEndDate}
          onPeriodChange={handlePeriodChange}
          onCustomDateChange={handleCustomDateChange}
        />

        {/* Layout de 3 secciones */}
        <div className="space-y-12">
          {/* Sección General */}
          <section id="general">
            <GeneralSection data={data.general} />
          </section>

          {/* Grid de Local y Eventos */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Sección Local */}
            <section id="local" className="space-y-6">
              <LocalSection data={data.local} />
            </section>

            {/* Sección Eventos */}
            <section id="events" className="space-y-6">
              <EventsSection data={data.events} />
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              🍕 PIZZANA Dashboard - Desarrollado con ❤️ para optimizar tu negocio
            </p>
            <p className="text-sm">
              Datos sincronizados en tiempo real desde Google Sheets
            </p>
          </div>
        </footer>
      </main>

      {/* Indicador de carga flotante */}
      {loading && data && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
            <span className="text-sm text-gray-700">Actualizando...</span>
          </div>
        </div>
      )}
    </div>
  );
}
