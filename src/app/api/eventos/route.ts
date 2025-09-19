import { NextRequest, NextResponse } from 'next/server';
import { getEventos, createEvento, updateEvento, deleteEvento, EventoData } from '@/lib/googleSheets';

export async function GET() {
  try {
    const eventos = await getEventos();
    return NextResponse.json(eventos);
  } catch (error) {
    console.error('Error in GET /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error al obtener eventos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, fecha, personas, direccion, valor } = body;

    if (!nombre || !fecha || !personas) {
      return NextResponse.json(
        { error: 'Campos requeridos: nombre, fecha, personas' },
        { status: 400 }
      );
    }

    const nuevoEvento = await createEvento({
      nombre,
      fecha,
      personas: parseInt(personas),
      direccion,
      valor: valor ? parseFloat(valor) : undefined,
    });

    return NextResponse.json(nuevoEvento);
  } catch (error) {
    console.error('Error in POST /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error al crear evento' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido para actualizar' },
        { status: 400 }
      );
    }

    // Convertir tipos si existen
    if (updateData.personas) {
      updateData.personas = parseInt(updateData.personas);
    }
    if (updateData.valor) {
      updateData.valor = parseFloat(updateData.valor);
    }

    const eventoActualizado = await updateEvento(id, updateData);
    return NextResponse.json(eventoActualizado);
  } catch (error) {
    console.error('Error in PUT /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error al actualizar evento' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID es requerido para eliminar' },
        { status: 400 }
      );
    }

    await deleteEvento(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/eventos:', error);
    return NextResponse.json(
      { error: 'Error al eliminar evento' },
      { status: 500 }
    );
  }
}