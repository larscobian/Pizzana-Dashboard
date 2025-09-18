'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { MetricCard } from '@/components/ui/MetricCard';
import { DailyRevenueChart } from '@/components/charts/DailyRevenueChart';
import { ShoppingCart, Users, Crown } from 'lucide-react';

interface LocalData {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    formattedDate: string;
  }>;
  totalRevenue: number;
  totalSales: number;
  uniqueClients: number;
  topClients: Array<{
    name: string;
    revenue: number;
    orders: number;
  }>;
  topPizzas: Array<{
    emoji: string;
    name: string;
    count: number;
    revenue: number;
  }>;
  periodLabel: string;
}

interface LocalSectionProps {
  data: LocalData;
}

export function LocalSection({ data }: LocalSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏪 Datos del Área Local ({data.periodLabel})
        </h2>
        <p className="text-gray-600">
          Operaciones B2C: Delivery y Retiro
        </p>
      </div>

      {/* Gráfico de ingresos diarios */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Ingresos por Días Trabajados</CardTitle>
        </CardHeader>
        <CardContent>
          <DailyRevenueChart
            data={data.dailyRevenue}
            color="#3b82f6"
          />
        </CardContent>
      </Card>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Ingresos Totales"
          value={`$${data.totalRevenue.toLocaleString()}`}
          emoji="💰"
          subtitle="Solo área local"
        />

        <MetricCard
          title="Número de Ventas"
          value={data.totalSales}
          icon={ShoppingCart}
          subtitle="Pedidos completados"
        />

        <MetricCard
          title="Clientes Únicos"
          value={data.uniqueClients}
          icon={Users}
          subtitle="Del período"
        />
      </div>

      {/* Top 3 Clientes y Pizzas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 3 Clientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <span>Top 3 Clientes del Período</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topClients.map((client, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client.name}</p>
                      <p className="text-sm text-gray-600">
                        {client.orders} pedidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${client.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${(client.revenue / client.orders).toFixed(0)}/pedido
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Pizzas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="text-xl">🍕</span>
              <span>Top 3 Pizzas del Período</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.topPizzas.map((pizza, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 flex items-center space-x-2">
                        <span className="text-lg">{pizza.emoji}</span>
                        <span>{pizza.name}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        {pizza.count} pedidos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${pizza.revenue.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total facturado
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}