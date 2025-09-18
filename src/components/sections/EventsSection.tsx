'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { DailyRevenueChart } from '@/components/charts/DailyRevenueChart';
import { ShoppingCart, Users, Calendar } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🎪 Datos del Área Eventos ({data.periodLabel})
        </h2>
        <p className="text-gray-600">
          Operaciones B2B: Catering y Eventos Corporativos
        </p>
      </div>

      {/* Gráfico de ingresos diarios */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Ingresos por Días Trabajados</CardTitle>
        </CardHeader>
        <CardContent>
          {data.dailyRevenue.length > 0 ? (
            <DailyRevenueChart
              data={data.dailyRevenue}
              color="#f97316"
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No hay eventos registrados este mes</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Ingresos Totales"
          value={`$${data.totalRevenue.toLocaleString()}`}
          emoji="💰"
          subtitle="Solo área eventos"
        />

        <MetricCard
          title="Número de Eventos"
          value={data.totalSales}
          icon={Calendar}
          subtitle="Eventos completados"
        />

        <MetricCard
          title="Clientes B2B"
          value={data.uniqueClients}
          icon={Users}
          subtitle="Empresas atendidas"
        />

        <MetricCard
          title="Ticket Promedio"
          value={`$${averageTicket.toLocaleString()}`}
          emoji="🎯"
          subtitle="Por evento"
        />
      </div>

      {/* Insights adicionales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas del período */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Estadísticas del Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Días con eventos:</span>
                <span className="font-semibold text-gray-900">
                  {data.dailyRevenue.length} días
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Ingresos promedio/día:</span>
                <span className="font-semibold text-gray-900">
                  ${data.dailyRevenue.length > 0 ?
                    (data.totalRevenue / data.dailyRevenue.length).toLocaleString() :
                    '0'}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Eventos por cliente:</span>
                <span className="font-semibold text-gray-900">
                  {data.uniqueClients > 0 ?
                    (data.totalSales / data.uniqueClients).toFixed(1) :
                    '0'} eventos/cliente
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparativa con Local */}
        <Card>
          <CardHeader>
            <CardTitle>🔄 Comparativa B2B vs B2C</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 border border-orange-200 rounded-lg">
                <div className="text-2xl mb-2">🎪</div>
                <div className="text-lg font-semibold text-gray-900">
                  Eventos (B2B)
                </div>
                <div className="text-sm text-gray-600">
                  Ticket promedio: ${averageTicket.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  Enfoque: Volumen alto, menos frecuencia
                </div>
              </div>

              <div className="text-center p-4 border border-blue-200 rounded-lg">
                <div className="text-2xl mb-2">🏪</div>
                <div className="text-lg font-semibold text-gray-900">
                  Local (B2C)
                </div>
                <div className="text-sm text-gray-600">
                  Ticket promedio: Variable
                </div>
                <div className="text-sm text-gray-600">
                  Enfoque: Volumen menor, alta frecuencia
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mensaje motivacional si no hay eventos */}
      {data.totalSales === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¡Oportunidad de Crecimiento!
            </h3>
            <p className="text-gray-600">
              Este mes no se registraron eventos. Considera estrategias de marketing B2B
              para captar nuevos clientes corporativos y expandir este canal de ingresos.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}