'use client';

import React, { useState } from 'react';
import { DailyRevenueChart } from '@/components/charts/DailyRevenueChart';

interface LocalData {
  dailyRevenue: Array<{
    date: string;
    revenue: number;
    pizzaCount: number;
    formattedDate: string;
    dayOfWeek: string;
    fullDate: string;
  }>;
  totalRevenue: number;
  fridayRevenue: number;
  saturdayRevenue: number;
  totalSales: number;
  uniqueClients: number;
  topClients: Array<{
    name: string;
    revenue: number;
    orders: number;
    orderHistory: Array<{
      fecha: string;
      pizzas: { [emoji: string]: number };
      total: number;
      cantidad: number;
    }>;
  }>;
  topPizzas: Array<{
    emoji: string;
    name: string;
    count: number;
    revenue: number;
    topCustomers: Array<{
      name: string;
      count: number;
    }>;
  }>;
  periodLabel: string;
}

interface LocalSectionProps {
  data: LocalData;
}

export function LocalSection({ data }: LocalSectionProps) {
  const [hoveredClient, setHoveredClient] = useState<number | null>(null);
  const [hoveredPizza, setHoveredPizza] = useState<number | null>(null);
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null);

  const formatDate = (fecha: string) => {
    try {
      if (fecha.includes('/')) {
        const [day, month, year] = fecha.split('/');
        return `${day}/${month}/${year}`;
      }
      return new Date(fecha).toLocaleDateString('es-CL');
    } catch {
      return fecha;
    }
  };

  const getPizzaEmojis = (pizzas: { [emoji: string]: number }) => {
    return Object.entries(pizzas)
      .filter(([emoji, count]) => count > 0)
      .map(([emoji, count]) => `${emoji}×${count}`)
      .join(' ');
  };

  const handleClientMouseEnter = (index: number) => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
    setHoveredClient(index);
  };

  const handleClientMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredClient(null);
    }, 150); // Small delay to allow moving to tooltip
    setTooltipTimeout(timeout);
  };

  const handleTooltipMouseEnter = () => {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      setTooltipTimeout(null);
    }
  };

  const handleTooltipMouseLeave = () => {
    setHoveredClient(null);
  };

  return (
    <div className="space-y-4">
      {/* Métricas principales - 3 tarjetas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      {/* Ingresos por día - Viernes y Sábado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Ingresos Viernes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Ingresos Viernes</p>
              <p className="text-lg font-bold text-gray-900">
                ${data.fridayRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🎉</span>
            </div>
          </div>
        </div>

        {/* Ingresos Sábado */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Ingresos Sábado</p>
              <p className="text-lg font-bold text-gray-900">
                ${data.saturdayRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-lg">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Clientes */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center space-x-2">
          <span>👑</span>
          <span>Top 5 Clientes</span>
        </h3>
        <div className="space-y-4">
          {data.topClients.map((client, index) => (
            <div key={index} className="relative">
              <div
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                onMouseEnter={() => handleClientMouseEnter(index)}
                onMouseLeave={handleClientMouseLeave}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{client.name}</div>
                    <div className="text-xs text-gray-600">{client.orders} pedidos</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${client.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total gastado</div>
                </div>
              </div>

              {/* Tooltip with order history */}
              {hoveredClient === index && (
                <div
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 max-h-80 overflow-y-auto"
                  onMouseEnter={handleTooltipMouseEnter}
                  onMouseLeave={handleTooltipMouseLeave}
                >
                  <h4 className="font-medium text-gray-900 mb-2">Historial de Pedidos</h4>
                  <div className="space-y-2">
                    {client.orderHistory.slice(0, 15).map((order, orderIndex) => (
                      <div key={orderIndex} className="text-xs bg-gray-50 p-2 rounded">
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-gray-900">{formatDate(order.fecha)}</span>
                          <span className="font-medium text-green-600">${order.total.toLocaleString()}</span>
                        </div>
                        <div className="text-gray-600">
                          <div>🍕 {getPizzaEmojis(order.pizzas)}</div>
                          <div>📦 {order.cantidad} pizza{order.cantidad !== 1 ? 's' : ''}</div>
                        </div>
                      </div>
                    ))}
                    {client.orderHistory.length > 15 && (
                      <div className="text-xs text-gray-500 text-center pt-2">
                        ... y {client.orderHistory.length - 15} pedidos más
                      </div>
                    )}
                  </div>
                </div>
              )}

              {index < data.topClients.length - 1 && (
                <div className="border-b border-gray-200 mx-2"></div>
              )}
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
        <div className="space-y-4">
          {data.topPizzas.map((pizza, index) => (
            <div key={index} className="relative">
              <div
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredPizza(index)}
                onMouseLeave={() => setHoveredPizza(null)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-600">{index + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{pizza.name}</div>
                    <div className="text-xs text-gray-600">{pizza.count} vendidas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    ${pizza.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-600">Total recaudado</div>
                </div>
              </div>

              {/* Tooltip with top customers */}
              {hoveredPizza === index && pizza.topCustomers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
                  <h4 className="font-medium text-gray-900 mb-2">Top Clientes de {pizza.name}</h4>
                  <div className="space-y-1">
                    {pizza.topCustomers.map((customer, customerIndex) => (
                      <div key={customerIndex} className="flex justify-between items-center text-xs">
                        <span className="text-gray-700">{customer.name}:</span>
                        <span className="font-medium text-orange-600">{customer.count} pizza{customer.count !== 1 ? 's' : ''}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {index < data.topPizzas.length - 1 && (
                <div className="border-b border-gray-200 mx-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}