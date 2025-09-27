import { google } from 'googleapis';

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

export interface PedidoData {
  id: string;
  fecha: string;
  nombre_cliente: string;
  whatsapp: string;
  direccion: string;
  pizzas: { [emoji: string]: number };
  notas: string;
  metodo: string;
  entrega: string;
  comuna: string;
  pre_total: number;
  delivery: number;
  comision: number;
  total: number;
  tipo: string;
}

export interface ClienteData {
  nombre: string;
  whatsapp: string;
  direccion: string;
  primera_compra: string;
  ultima_compra: string;
  n_pedidos: number;
  total_gastado: number;
  dias_sin_comprar: number;
  estado: string;
  notas: string;
}

export interface KPIData {
  ano: string;
  mes: string;
  clientes: number;
  ingresos_total: number;
  ventas_total: number;
  ingresos_local: number;
  ventas_local: number;
  ingresos_eventos: number;
  ventas_eventos: number;
  ingresos_feria: number;
  ventas_feria: number;
  ingresos_otros: number;
  ventas_otros: number;
  work_days: number;
  viernes: number;
  sabados: number;
}

export interface ProductoData {
  nombre: string;
  emoji: string;
  precio: number;
  activo: boolean;
  ingredientes: string;
}

export interface EventoData {
  id: string;
  nombre: string;
  fecha: string;
  personas: number;
  direccion?: string;
  valor?: number;
  creado_en: string;
}

export async function getPizzanaData() {
  try {
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [
        'PEDIDOS!A:Y',
        'CLIENTES!A:J',
        'KPIs!A:P',
        'PRODUCTOS!A:E',
      ],
    });

    const [pedidosRaw, clientesRaw, kpisRaw, productosRaw] = response.data.valueRanges || [];

    return {
      pedidos: processPedidos(pedidosRaw?.values || []),
      clientes: processClientes(clientesRaw?.values || []),
      kpis: processKPIs(kpisRaw?.values || []),
      productos: processProductos(productosRaw?.values || []),
    };
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    throw error;
  }
}

function processPedidos(values: any[][]): PedidoData[] {
  if (values.length < 2) {
    console.log('No hay datos de pedidos en Google Sheets');
    return [];
  }

  const headers = values[0];
  const pizzaColumns = ['🌼', '⚡', '🌿', '🧀', '🥬', '🍕', '🤌', '🍄', '🌽'];

  console.log('Headers PEDIDOS:', headers);
  console.log('Total filas de pedidos:', values.length - 1);

  return values.slice(1).map((row, index) => {
    const pizzas: { [emoji: string]: number } = {};

    pizzaColumns.forEach(emoji => {
      const index = headers.indexOf(emoji);
      if (index !== -1 && row[index]) {
        pizzas[emoji] = parseInt(row[index]) || 0;
      }
    });

    const pedido = {
      id: row[0] || '',
      fecha: row[1] || '',
      nombre_cliente: row[2] || '',
      whatsapp: row[3] || '',
      direccion: row[4] || '',
      pizzas,
      notas: row[14] || '',
      metodo: row[15] || '',
      entrega: row[16] || '',
      comuna: row[17] || '',
      pre_total: parseFloat(row[18]?.replace(/[$.,]/g, '') || '0'),
      delivery: parseFloat(row[19]?.replace(/[$.,]/g, '') || '0'),
      comision: parseFloat(row[20]?.replace(/[$.,]/g, '') || '0'),
      total: parseFloat(row[21]?.replace(/[$.,]/g, '') || '0'),
      tipo: row[22] || '',
    };

    // Log primeros 3 pedidos para debug
    if (index < 3) {
      console.log(`Pedido ${index}:`, {
        fecha: pedido.fecha,
        total: pedido.total,
        tipo: pedido.tipo,
        cliente: pedido.nombre_cliente
      });
    }

    return pedido;
  });
}

function processClientes(values: any[][]): ClienteData[] {
  if (values.length < 2) return [];

  return values.slice(1).map(row => ({
    nombre: row[0] || '',
    whatsapp: row[1] || '',
    direccion: row[2] || '',
    primera_compra: row[3] || '',
    ultima_compra: row[4] || '',
    n_pedidos: parseInt(row[5]) || 0,
    total_gastado: parseFloat(row[6]?.replace(/[$.,]/g, '') || '0'),
    dias_sin_comprar: parseInt(row[7]) || 0,
    estado: row[8] || '',
    notas: row[9] || '',
  }));
}

function processKPIs(values: any[][]): KPIData[] {
  if (values.length < 3) return [];

  return values.slice(2).map(row => ({
    ano: row[0] || '',
    mes: row[1] || '',
    clientes: parseInt(row[2]) || 0,
    ingresos_total: parseFloat(row[3]?.replace(/[$.,]/g, '') || '0'),
    ventas_total: parseInt(row[4]) || 0,
    ingresos_local: parseFloat(row[5]?.replace(/[$.,]/g, '') || '0'),
    ventas_local: parseInt(row[6]) || 0,
    ingresos_eventos: parseFloat(row[7]?.replace(/[$.,]/g, '') || '0'),
    ventas_eventos: parseInt(row[8]) || 0,
    ingresos_feria: parseFloat(row[9]?.replace(/[$.,]/g, '') || '0'),
    ventas_feria: parseInt(row[10]) || 0,
    ingresos_otros: parseFloat(row[11]?.replace(/[$.,]/g, '') || '0'),
    ventas_otros: parseInt(row[12]) || 0,
    work_days: parseInt(row[13]) || 0,
    viernes: parseInt(row[14]) || 0,
    sabados: parseInt(row[15]) || 0,
  }));
}

function processProductos(values: any[][]): ProductoData[] {
  if (values.length < 2) return [];

  return values.slice(1).map(row => ({
    nombre: row[0] || '',
    emoji: row[1] || '',
    precio: parseFloat(row[2]?.replace(/[$.,]/g, '') || '0'),
    activo: row[3] === 'SI',
    ingredientes: row[4] || '',
  }));
}

// Funciones para manejo de eventos
export async function getEventos(): Promise<EventoData[]> {
  try {
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'AGENDA EVENTOS!A:G',
    });

    const values = response.data.values || [];

    if (values.length < 2) {
      return [];
    }

    return values.slice(1).map(row => ({
      id: row[0] || '',
      nombre: row[1] || '',
      fecha: row[2] || '',
      personas: parseInt(row[3]) || 0,
      direccion: row[4] || undefined,
      valor: row[5] ? parseFloat(row[5]) : undefined,
      creado_en: row[6] || '',
    }));
  } catch (error) {
    console.error('Error fetching eventos:', error);
    throw error;
  }
}

export async function createEvento(evento: Omit<EventoData, 'id' | 'creado_en'>): Promise<EventoData> {
  try {
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;
    const id = Date.now().toString();
    const creado_en = new Date().toISOString();

    const newEvento: EventoData = {
      ...evento,
      id,
      creado_en,
    };

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'AGENDA EVENTOS!A:G',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          newEvento.id,
          newEvento.nombre,
          newEvento.fecha,
          newEvento.personas,
          newEvento.direccion || '',
          newEvento.valor || '',
          newEvento.creado_en,
        ]],
      },
    });

    return newEvento;
  } catch (error) {
    console.error('Error creating evento:', error);
    throw error;
  }
}

export async function updateEvento(id: string, evento: Partial<EventoData>): Promise<EventoData> {
  try {
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;

    // Primero obtener todos los eventos para encontrar la fila
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'AGENDA EVENTOS!A:G',
    });

    const values = response.data.values || [];
    const rowIndex = values.findIndex((row, index) => index > 0 && row[0] === id);

    if (rowIndex === -1) {
      throw new Error('Evento no encontrado');
    }

    const currentRow = values[rowIndex];
    const updatedEvento: EventoData = {
      id: currentRow[0],
      nombre: evento.nombre || currentRow[1],
      fecha: evento.fecha || currentRow[2],
      personas: evento.personas || parseInt(currentRow[3]) || 0,
      direccion: evento.direccion !== undefined ? evento.direccion : currentRow[4],
      valor: evento.valor !== undefined ? evento.valor : (currentRow[5] ? parseFloat(currentRow[5]) : undefined),
      creado_en: currentRow[6],
    };

    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `AGENDA EVENTOS!A${rowIndex + 1}:G${rowIndex + 1}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          updatedEvento.id,
          updatedEvento.nombre,
          updatedEvento.fecha,
          updatedEvento.personas,
          updatedEvento.direccion || '',
          updatedEvento.valor || '',
          updatedEvento.creado_en,
        ]],
      },
    });

    return updatedEvento;
  } catch (error) {
    console.error('Error updating evento:', error);
    throw error;
  }
}

export async function deleteEvento(id: string): Promise<void> {
  try {
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;

    // Obtener todos los eventos para encontrar la fila
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'AGENDA EVENTOS!A:G',
    });

    const values = response.data.values || [];
    const rowIndex = values.findIndex((row, index) => index > 0 && row[0] === id);

    if (rowIndex === -1) {
      throw new Error('Evento no encontrado');
    }

    // Limpiar la fila
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `AGENDA EVENTOS!A${rowIndex + 1}:G${rowIndex + 1}`,
    });

  } catch (error) {
    console.error('Error deleting evento:', error);
    throw error;
  }
}

