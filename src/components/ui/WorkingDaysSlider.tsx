'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

interface MonthWorkingData {
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
}

interface WorkingDaysSliderProps {
  data: MonthWorkingData[];
  periodLabel: string;
}

export function WorkingDaysSlider({ data, periodLabel }: WorkingDaysSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!data || data.length === 0) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            📅 Días Trabajados - {periodLabel}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <p>No hay datos disponibles para el período seleccionado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentMonth = data[currentIndex];

  // Usar datos reales del mes
  const generateMonthVisualization = (monthData: MonthWorkingData) => {
    const workingDaysDetail = monthData.workingDaysDetail || [];

    // Organizar por semanas
    const weekData: { [week: number]: { friday?: any; saturday?: any } } = {};

    workingDaysDetail.forEach(day => {
      if (!weekData[day.weekOfMonth]) {
        weekData[day.weekOfMonth] = {};
      }

      if (day.dayOfWeek === 'friday') {
        weekData[day.weekOfMonth].friday = {
          worked: day.worked,
          hasLocal: day.hasLocal,
          hasEvents: day.hasEvents,
          ordersCount: day.ordersCount
        };
      } else {
        weekData[day.weekOfMonth].saturday = {
          worked: day.worked,
          hasLocal: day.hasLocal,
          hasEvents: day.hasEvents,
          ordersCount: day.ordersCount
        };
      }
    });

    // Convertir a array de semanas
    const weeks = [];
    const maxWeek = Math.max(...Object.keys(weekData).map(Number));

    for (let week = 1; week <= maxWeek; week++) {
      weeks.push({
        friday: weekData[week]?.friday || null,
        saturday: weekData[week]?.saturday || null
      });
    }

    return { weeks };
  };

  const monthVisualization = generateMonthVisualization(currentMonth);

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < data.length - 1;

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          📅 Días Trabajados - {periodLabel}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={!canGoPrevious}
              className={`p-1 rounded ${
                canGoPrevious
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
              {currentMonth.monthName} {currentMonth.year}
            </span>
            <button
              onClick={() => setCurrentIndex(Math.min(data.length - 1, currentIndex + 1))}
              disabled={!canGoNext}
              className={`p-1 rounded ${
                canGoNext
                  ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              →
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Estadísticas del mes actual */}
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{currentMonth.viernes}</p>
              <p className="text-xs text-gray-600">Viernes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{currentMonth.sabados}</p>
              <p className="text-xs text-gray-600">Sábados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{currentMonth.actualWorked}/{currentMonth.totalPossible}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div>
              <p className={`text-2xl font-bold ${
                currentMonth.rate >= 80 ? 'text-green-600' :
                currentMonth.rate >= 60 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {currentMonth.rate.toFixed(0)}%
              </p>
              <p className="text-xs text-gray-600">Tasa</p>
            </div>
          </div>

          {/* Calendario visual del mes */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700 text-center">
              Calendario del mes
            </div>

            {/* Encabezados */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 text-center">
              <div>Viernes</div>
              <div>Sábados</div>
            </div>

            {/* Días por semana */}
            {monthVisualization.weeks.map((week, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 text-center">
                <div className="text-2xl leading-tight">
                  {week.friday !== null ? (
                    week.friday.worked ? (
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1">
                          {week.friday.hasLocal && <span className="text-2xl">🏪</span>}
                          {week.friday.hasEvents && <span className="text-2xl">🏠</span>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-2xl">❌</span>
                    )
                  ) : (
                    ''
                  )}
                </div>
                <div className="text-2xl leading-tight">
                  {week.saturday !== null ? (
                    week.saturday.worked ? (
                      <div className="flex flex-col items-center">
                        <div className="flex space-x-1">
                          {week.saturday.hasLocal && <span className="text-2xl">🏪</span>}
                          {week.saturday.hasEvents && <span className="text-2xl">🏠</span>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-2xl">❌</span>
                    )
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <span>🏪 Local</span>
              <span>🏠 Eventos</span>
              <span>❌ No trabajó</span>
            </div>
            <div className="text-center text-xs text-gray-500">
              Un día puede tener ambos tipos de trabajo
            </div>
          </div>

          {/* Indicador de posición */}
          {data.length > 1 && (
            <div className="flex justify-center pt-2">
              <div className="flex space-x-1">
                {data.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full ${
                      index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}