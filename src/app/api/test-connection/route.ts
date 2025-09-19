import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function GET() {
  try {
    // Test environment variables
    const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const spreadsheetId = process.env.PIZZANA_SPREADSHEET_ID;

    if (!clientEmail || !privateKey || !spreadsheetId) {
      return NextResponse.json({
        error: 'Missing environment variables',
        clientEmail: !!clientEmail,
        privateKey: !!privateKey,
        spreadsheetId: !!spreadsheetId,
      }, { status: 500 });
    }

    // Test Google Sheets connection
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Test basic connection
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    // Check if AGENDA EVENTOS sheet exists
    const agendaSheet = response.data.sheets?.find(
      sheet => sheet.properties?.title === 'AGENDA EVENTOS'
    );

    return NextResponse.json({
      success: true,
      spreadsheetTitle: response.data.properties?.title,
      sheetsCount: response.data.sheets?.length,
      agendaEventosExists: !!agendaSheet,
      allSheets: response.data.sheets?.map(sheet => sheet.properties?.title),
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json({
      error: 'Connection failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}