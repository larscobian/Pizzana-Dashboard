import { NextRequest, NextResponse } from 'next/server';
import { getPizzanaData } from '@/lib/googleSheets';
import { calculatePercentageChange } from '@/lib/utils';
import { startOfMonth, parseISO, format, subMonths } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '6_months';
    const customStart = searchParams.get('startDate');
    const customEnd = searchParams.get('endDate');

    const data = await getPizzanaData();
    const { pedidos, clientes, kpis, productos } = data;

    // Calcular rango de fechas basado en el período seleccionado
    // Usar la fecha actual real
    const currentDate = new Date();
    let startDate: Date;
    let endDate: Date = currentDate;

    if (period === 'custom' && customStart && customEnd) {
      startDate = new Date(customStart);
      endDate = new Date(customEnd);
    } else {
      const monthsMap: { [key: string]: number } = {
        '30_days': 1,    // 1 mes
        '3_months': 3,
        '6_months': 6,
        'current_year': 12,
        '2_years': 24,
        'last_month': 1,
        '12_months': 12
      };

      // Para período específicos, calculamos diferente
      if (period === 'current_month') {
        startDate = startOfMonth(currentDate);
        endDate = currentDate;
      } else if (period === '30_days') {
        startDate = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));
      } else {
        const months = monthsMap[period] || 6;
        startDate = subMonths(startOfMonth(currentDate), months);
      }
    }


    // Filtrar pedidos según el período seleccionado
    const filteredOrders = pedidos.filter(pedido => {
      if (!pedido.fecha) {
        console.log('Pedido sin fecha:', pedido.id);
        return false;
      }

      try {
        // Intentar diferentes formatos de fecha
        let fecha: Date;

        // Si la fecha viene en formato DD/MM/YYYY
        if (pedido.fecha.includes('/')) {
          const [day, month, year] = pedido.fecha.split('/');
          fecha = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Usar parseISO para formato ISO
          fecha = parseISO(pedido.fecha);
        }

        const isValid = !isNaN(fecha.getTime());
        const inRange = fecha >= startDate && fecha <= endDate;


        return isValid && inRange;
      } catch (error) {
        return false;
      }
    });


    // Calcular período anterior del mismo tamaño para comparaciones
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousPeriodEnd = new Date(startDate.getTime() - 1); // Un día antes del período actual
    const previousPeriodStart = new Date(previousPeriodEnd.getTime() - periodDuration);

    const previousPeriodOrders = pedidos.filter(pedido => {
      try {
        if (!pedido.fecha || pedido.fecha.trim() === '') {
          return false;
        }
        const fecha = parseISO(pedido.fecha);
        return !isNaN(fecha.getTime()) && fecha >= previousPeriodStart && fecha <= previousPeriodEnd;
      } catch (error) {
        return false;
      }
    });

    // Datos generales del período seleccionado
    const currentPeriodRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const previousPeriodRevenue = previousPeriodOrders.reduce((sum, order) => sum + order.total, 0);
    const revenueChange = calculatePercentageChange(currentPeriodRevenue, previousPeriodRevenue);

    // Separar local vs eventos en el período seleccionado
    const localOrders = filteredOrders.filter(order => order.tipo === 'Local');
    const eventOrders = filteredOrders.filter(order => order.tipo === 'Evento');

    const localRevenue = localOrders.reduce((sum, order) => sum + order.total, 0);
    const eventRevenue = eventOrders.reduce((sum, order) => sum + order.total, 0);

    const localPercentage = currentPeriodRevenue > 0 ? (localRevenue / currentPeriodRevenue) * 100 : 0;
    const eventPercentage = currentPeriodRevenue > 0 ? (eventRevenue / currentPeriodRevenue) * 100 : 0;

    // Datos por días trabajados (Local)
    const localRevenueByDay = calculateDailyRevenue(localOrders);

    // Datos por días trabajados (Eventos)
    const eventRevenueByDay = calculateDailyRevenue(eventOrders);

    // Clientes únicos
    const uniqueLocalClients = new Set(localOrders.map(order => order.nombre_cliente)).size;
    const uniqueEventClients = new Set(eventOrders.map(order => order.nombre_cliente)).size;

    // Top 3 clientes locales
    const localClientStats = calculateTopClients(localOrders);

    // Top 3 pizzas locales
    const topLocalPizzas = calculateTopPizzas(localOrders, productos);

    // Filtrar KPIs según el período seleccionado (últimos N meses desde la fecha actual)
    const filteredKPIs = kpis.filter(kpi => {
      const kpiDate = new Date(parseInt(kpi.ano), parseInt(kpi.mes) - 1, 1);
      return kpiDate >= startDate && kpiDate <= endDate;
    }).sort((a, b) => {
      const dateA = new Date(parseInt(a.ano), parseInt(a.mes) - 1, 1);
      const dateB = new Date(parseInt(b.ano), parseInt(b.mes) - 1, 1);
      return dateA.getTime() - dateB.getTime();
    });

    // Usar todos los KPIs filtrados para el gráfico (no solo 6 meses)
    const chartKPIs = filteredKPIs.map((kpi, index, array) => {
      const prevKPI = array[index - 1];
      const changePercent = prevKPI ? calculatePercentageChange(kpi.ingresos_total, prevKPI.ingresos_total) : 0;

      return {
        month: `${kpi.mes}/${kpi.ano}`,
        total: kpi.ingresos_total,
        local: kpi.ingresos_local,
        eventos: kpi.ingresos_eventos,
        feria: kpi.ingresos_feria,
        otros: kpi.ingresos_otros,
        changePercent,
        localPercent: kpi.ingresos_total > 0 ? (kpi.ingresos_local / kpi.ingresos_total) * 100 : 0,
        eventPercent: kpi.ingresos_total > 0 ? (kpi.ingresos_eventos / kpi.ingresos_total) * 100 : 0,
      };
    });

    // Función para generar etiqueta del período
    const getPeriodLabel = () => {
      const periodLabels: { [key: string]: string } = {
        'current_month': 'Este mes',
        '30_days': 'Últimos 30 días',
        '3_months': 'Últimos 3 meses',
        '6_months': 'Últimos 6 meses',
        'current_year': 'Último año',
        '2_years': '2 años',
        'last_month': 'Último Mes',
        '12_months': 'Últimos 12 Meses'
      };

      if (period === 'custom') {
        return `${format(startDate, 'dd/MM/yyyy')} - ${format(endDate, 'dd/MM/yyyy')}`;
      }

      return periodLabels[period] || 'Período Seleccionado';
    };

    const dashboardData = {
      general: {
        totalRevenue: currentPeriodRevenue,
        revenueChange,
        localRevenue,
        eventRevenue,
        localPercentage,
        eventPercentage,
        candlestickData: chartKPIs,
        periodLabel: getPeriodLabel(),
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
      },
      local: {
        dailyRevenue: localRevenueByDay,
        totalRevenue: localRevenue,
        totalSales: localOrders.length,
        uniqueClients: uniqueLocalClients,
        topClients: localClientStats.slice(0, 5),
        topPizzas: topLocalPizzas.slice(0, 5),
        periodLabel: getPeriodLabel(),
      },
      events: {
        dailyRevenue: eventRevenueByDay,
        totalRevenue: eventRevenue,
        totalSales: eventOrders.length,
        uniqueClients: uniqueEventClients,
        periodLabel: getPeriodLabel(),
      },
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json(
      { error: 'Error al obtener datos del dashboard' },
      { status: 500 }
    );
  }
}

function calculateDailyRevenue(orders: any[]) {
  const dailyData: { [date: string]: number } = {};

  orders.forEach(order => {
    try {
      // Validate that the date exists and is not empty
      if (!order.fecha || order.fecha.trim() === '') {
        return; // Skip this order
      }

      let parsedDate: Date;

      // Use the same date parsing logic as the main filter
      if (order.fecha.includes('/')) {
        const [day, month, year] = order.fecha.split('/');
        parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      } else {
        parsedDate = parseISO(order.fecha);
      }

      // Check if the parsed date is valid
      if (isNaN(parsedDate.getTime())) {
        return; // Skip this order
      }

      const date = format(parsedDate, 'yyyy-MM-dd');
      dailyData[date] = (dailyData[date] || 0) + order.total;
    } catch (error) {
      // Skip orders with invalid dates
      return;
    }
  });

  return Object.entries(dailyData)
    .map(([date, revenue]) => ({
      date,
      revenue,
      formattedDate: format(parseISO(date), 'dd/MM'),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function calculateTopClients(orders: any[]) {
  const clientStats: { [client: string]: { revenue: number; orders: number } } = {};

  orders.forEach(order => {
    const client = order.nombre_cliente;
    if (!clientStats[client]) {
      clientStats[client] = { revenue: 0, orders: 0 };
    }
    clientStats[client].revenue += order.total;
    clientStats[client].orders += 1;
  });

  return Object.entries(clientStats)
    .map(([name, stats]) => ({
      name,
      revenue: stats.revenue,
      orders: stats.orders,
    }))
    .sort((a, b) => b.revenue - a.revenue);
}

function calculateTopPizzas(orders: any[], productos: any[]) {
  const pizzaStats: { [emoji: string]: { count: number; revenue: number } } = {};

  orders.forEach(order => {
    // Verificar si order.pizzas existe y no está vacío
    if (order.pizzas && typeof order.pizzas === 'object') {
      Object.entries(order.pizzas).forEach(([emoji, count]) => {
        // Asegurar que count sea un número y mayor que 0
        const numericCount = typeof count === 'number' ? count : parseInt(count as string) || 0;

        if (numericCount > 0) {
          const producto = productos.find(p => p.emoji === emoji);
          const precio = producto?.precio || 0;

          if (!pizzaStats[emoji]) {
            pizzaStats[emoji] = { count: 0, revenue: 0 };
          }
          pizzaStats[emoji].count += numericCount;
          pizzaStats[emoji].revenue += numericCount * precio;
        }
      });
    }
  });

  return Object.entries(pizzaStats)
    .map(([emoji, stats]) => {
      const producto = productos.find(p => p.emoji === emoji);
      return {
        emoji,
        name: producto?.nombre || 'Desconocida',
        count: stats.count,
        revenue: stats.revenue,
      };
    })
    .sort((a, b) => b.count - a.count);
}