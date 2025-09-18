'use client';

import React from 'react';
import { DailyRevenueChart } from '@/components/charts/DailyRevenueChart';

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
        <h3 className="text-sm font-medium text-gray-900 mb-3">📈 Ingresos Diarios - Local</h3>
        <DailyRevenueChart
          data={data.dailyRevenue}
          color="#f97316"
        />
      </div>

      {/* Top Clientes */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <span>👑</span>
          <span>Top 5 Clientes</span>
        </h3>
        <div className="space-y-3">
          {data.topClients.map((client, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-600">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-900">{client.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                ${client.revenue.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pizzas */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <span>🍕</span>
          <span>Top 5 Pizzas Más Vendidas</span>
        </h3>
        <div className="space-y-3">
          {data.topPizzas.map((pizza, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-orange-600">{index + 1}</span>
                </div>
                <span className="text-sm text-gray-900">{pizza.name}</span>
              </div>
              <span className="text-sm text-gray-600">
                {pizza.count} vendidas
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}