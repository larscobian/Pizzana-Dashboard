import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryText?: string;
}

export function ErrorState({
  title = 'Error al cargar los datos',
  message = 'Ha ocurrido un problema al conectar con Google Sheets. Por favor, verifica tu configuración.',
  onRetry,
  retryText = 'Intentar de nuevo'
}: ErrorStateProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{retryText}</span>
          </button>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-left">
          <h3 className="font-semibold text-yellow-800 mb-2">
            ¿Necesitas ayuda con la configuración?
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Verifica tu archivo .env.local</li>
            <li>• Confirma que el Service Account tiene permisos</li>
            <li>• Revisa que el Spreadsheet ID sea correcto</li>
          </ul>
        </div>
      </div>
    </div>
  );
}