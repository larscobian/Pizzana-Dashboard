import { NextRequest, NextResponse } from 'next/server';
import { getPizzanaData } from '@/lib/googleSheets';

export async function GET(request: NextRequest) {
  try {
    const data = await getPizzanaData();
    const { pedidos, clientes, kpis, productos } = data;

    return NextResponse.json({
      summary: {
        totalPedidos: pedidos.length,
        totalClientes: clientes.length,
        totalKPIs: kpis.length,
        totalProductos: productos.length,
      },
      samplePedidos: pedidos.slice(0, 5).map(p => ({
        id: p.id,
        fecha: p.fecha,
        total: p.total,
        tipo: p.tipo,
        cliente: p.nombre_cliente
      })),
      sampleKPIs: kpis.slice(0, 3),
      sampleProductos: productos.slice(0, 3)
    });
  } catch (error) {
    console.error('Error in debug API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}