'use client';

import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';

interface WorkingDaysData {
  viernes: number;
  sabados: number;
  totalPossible: number;
  actualWorked: number;
  rate: number;
}

interface WorkingDaysVisualizationProps {
  data: WorkingDaysData | null;
  currentMonth: string;
}

export function WorkingDaysVisualization({ data, currentMonth }: WorkingDaysVisualizationProps) {
  if (!data) {
    return (
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
            📅 Días Trabajados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">
            <p>No hay datos disponibles para el mes actual</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calcular distribución de días para visualización
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // Obtener todos los viernes y sábados del mes
  const fridaysAndSaturdays = getFridaysAndSaturdays(year, month);

  // Simular qué días se trabajaron (basado en los totales del KPI)
  // Como no tenemos el detalle día por día, mostramos una distribución representativa
  const workedDays = simulateWorkedDays(fridaysAndSaturdays, data.viernes, data.sabados);

  return (
    <Card className="border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          📅 Días Trabajados
          <span className={`text-sm px-2 py-1 rounded-full ${
            data.rate >= 80 ? 'bg-green-100 text-green-800' :
            data.rate >= 60 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {data.rate.toFixed(0)}%
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{data.viernes}</p>
              <p className="text-xs text-gray-600">Viernes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{data.sabados}</p>
              <p className="text-xs text-gray-600">Sábados</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{data.actualWorked}/{data.totalPossible}</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
          </div>

          {/* Calendario visual */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">{currentMonth}</p>

            {/* Encabezados */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 text-center">
              <div>Viernes</div>
              <div>Sábados</div>
            </div>

            {/* Días por semana */}
            {workedDays.weeks.map((week, index) => (
              <div key={index} className="grid grid-cols-2 gap-2 text-center">
                <div className="text-lg">
                  {week.friday !== null ? (
                    week.friday.worked ?
                      (week.friday.type === 'local' ? '🏪' : '🏠') :
                      '❌'
                  ) : ''}
                </div>
                <div className="text-lg">
                  {week.saturday !== null ? (
                    week.saturday.worked ?
                      (week.saturday.type === 'local' ? '🏪' : '🏠') :
                      '❌'
                  ) : ''}
                </div>
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="text-xs text-gray-600 space-y-1 border-t pt-3">
            <div className="flex items-center justify-between">
              <span>🏪 Local (B2C)</span>
              <span>🏠 Eventos (B2B)</span>
            </div>
            <div className="text-center">
              <span>❌ No trabajó</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Función auxiliar para obtener todos los viernes y sábados del mes
function getFridaysAndSaturdays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const fridaysAndSaturdays = [];

  for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
    const currentDay = new Date(year, month - 1, day);
    const dayOfWeek = currentDay.getDay();

    if (dayOfWeek === 5 || dayOfWeek === 6) {
      fridaysAndSaturdays.push({
        date: day,
        type: dayOfWeek === 5 ? 'friday' : 'saturday',
        weekOfMonth: Math.ceil(day / 7)
      });
    }
  }

  return fridaysAndSaturdays;
}

// Función auxiliar para simular qué días se trabajaron
function simulateWorkedDays(allDays: any[], fridaysWorked: number, saturdaysWorked: number) {
  const fridays = allDays.filter(d => d.type === 'friday');
  const saturdays = allDays.filter(d => d.type === 'saturday');

  // Obtener el número máximo de semanas
  const maxWeek = Math.max(...allDays.map(d => d.weekOfMonth));

  const weeks = [];

  for (let week = 1; week <= maxWeek; week++) {
    const friday = fridays.find(f => f.weekOfMonth === week);
    const saturday = saturdays.find(s => s.weekOfMonth === week);

    weeks.push({
      friday: friday ? {
        worked: fridaysWorked > 0,
        type: Math.random() > 0.7 ? 'event' : 'local' // Distribución simulada
      } : null,
      saturday: saturday ? {
        worked: saturdaysWorked > 0,
        type: Math.random() > 0.6 ? 'event' : 'local' // Distribución simulada
      } : null
    });

    // Decrementar contadores (distribución simple)
    if (friday && fridaysWorked > 0) fridaysWorked--;
    if (saturday && saturdaysWorked > 0) saturdaysWorked--;
  }

  return { weeks };
}