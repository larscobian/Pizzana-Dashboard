import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  isLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: string;
}

export function Header({ isLoading = false, onRefresh, lastUpdated }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y título */}
          <div className="flex items-center space-x-4">
            <div className="text-2xl">🍕</div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                PIZZANA Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Panel de control en tiempo real
              </p>
            </div>
          </div>

          {/* Controles */}
          <div className="flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-sm text-gray-600">
                Última actualización: {lastUpdated}
              </div>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                  isLoading
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
                />
                <span>{isLoading ? 'Actualizando...' : 'Actualizar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}