'use client';

import React from 'react';
import { DailyRevenueChart } from '@/components/charts/DailyRevenueChart';
import { Calendar } from 'lucide-react';
import { EventsManager } from './EventsManager';

interface EventsData {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    formattedDate: string;
  }>;
  totalRevenue: number;
  totalSales: number;
  uniqueClients: number;
  periodLabel: string;
}

interface EventsSectionProps {
  data: EventsData;
}

export function EventsSection({ data }: EventsSectionProps) {
  const averageTicket = data.totalSales > 0 ? data.totalRevenue / data.totalSales : 0;

  return (
    <div className="space-y-4">
      {/* Métricas principales */}
      <div className="grid grid-cols-3 gap-4">
        {/* Ingresos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Ingresos</p>
              <p className="text-lg font-bold text-gray-900">
                ${data.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">💰</span>
            </div>
          </div>
        </div>

        {/* Ventas */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Ventas</p>
              <p className="text-lg font-bold text-gray-900">
                {data.totalSales}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">📋</span>
            </div>
          </div>
        </div>

        {/* Clientes Únicos */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Clientes Únicos</p>
              <p className="text-lg font-bold text-gray-900">
                {data.uniqueClients}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">👥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de ingresos diarios */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">📈 Ingresos Diarios - Eventos</h3>
        {data.dailyRevenue.length > 0 ? (
          <DailyRevenueChart
            data={data.dailyRevenue}
            color="#f97316"
          />
        ) : (
          <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No hay eventos registrados</p>
            </div>
          </div>
        )}
      </div>

      {/* Próximos Eventos - Funcional */}
      <EventsManager />
    </div>
  );
}