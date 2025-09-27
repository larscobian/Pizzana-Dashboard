'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { CandlestickChart } from '@/components/charts/CandlestickChart';
import { WorkingDaysVisualization } from '@/components/ui/WorkingDaysVisualization';
import { TrendingUp, DollarSign, Calendar } from 'lucide-react';

interface WorkingDaysData {
  viernes: number;
  sabados: number;
  totalPossible: number;
  actualWorked: number;
  rate: number;
}

interface GeneralData {
  totalRevenue: number;
  totalNetIncome: number;
  revenueChange: number;
  netIncomeChange: number;
  localRevenue: number;
  eventRevenue: number;
  localPercentage: number;
  eventPercentage: number;
  operationRate: number;
  workingDaysData: WorkingDaysData | null;
  candlestickData: any[];
  periodLabel: string;
  startDate: string;
  endDate: string;
}

interface GeneralSectionProps {
  data: GeneralData;
}

export function GeneralSection({ data }: GeneralSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Datos Generales
        </h2>
        <p className="text-gray-600">
          Panorama general del negocio PIZZANA
        </p>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={`Ingresos Totales (${data.periodLabel})`}
          value={`$${data.totalRevenue.toLocaleString()}`}
          change={data.revenueChange}
          emoji="💰"
          subtitle="Todas las fuentes de ingresos"
        />

        <MetricCard
          title={`Ingresos Neto (${data.periodLabel})`}
          value={`$${(data.totalNetIncome || 0).toLocaleString()}`}
          change={data.netIncomeChange || 0}
          emoji="💎"
          subtitle="Beneficio después de costos"
        />

        <MetricCard
          title="Tendencia de Crecimiento"
          value={data.revenueChange >= 0 ? 'Positiva' : 'Negativa'}
          icon={TrendingUp}
          subtitle={`${data.revenueChange >= 0 ? '+' : ''}${data.revenueChange.toFixed(1)}% vs período anterior`}
          className={data.revenueChange >= 0 ? 'border-green-200' : 'border-red-200'}
        />

        <MetricCard
          title="Tasa de Operación"
          value={`${data.operationRate.toFixed(1)}%`}
          icon={Calendar}
          subtitle="Viernes y sábados trabajados este mes"
          className={
            data.operationRate >= 80 ? 'border-green-200' :
            data.operationRate >= 60 ? 'border-yellow-200' :
            'border-red-200'
          }
        />
      </div>

      {/* Distribución de ingresos y días trabajados */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribución de ingresos */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Distribución de Ingresos del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Local */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">🏪 Local (B2C)</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {data.localPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${data.localPercentage}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    ${data.localRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Delivery y retiro local
                  </p>
                </div>
              </div>

              {/* Eventos */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">🎪 Eventos (B2B)</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {data.eventPercentage.toFixed(1)}%
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${data.eventPercentage}%` }}
                  ></div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-900">
                    ${data.eventRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Catering y eventos corporativos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualización de días trabajados */}
        <WorkingDaysVisualization
          data={data.workingDaysData}
          currentMonth={new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
        />
      </div>

      {/* Gráfico de velas - Período seleccionado */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Tendencia de Ingresos - {data.periodLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          <CandlestickChart data={data.candlestickData} />
          <div className="mt-4 text-sm text-gray-600">
            <p>
              * Las barras verdes indican crecimiento vs mes anterior,
              las rojas indican decrecimiento.
            </p>
            <p>
              * Hover sobre las barras para ver distribución detallada Local vs Eventos.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}