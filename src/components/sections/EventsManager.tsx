'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2, MapPin, Users, DollarSign } from 'lucide-react';

export interface UpcomingEvent {
  id: string;
  nombre: string;
  fecha: string;
  personas: number;
  direccion?: string;
  valor?: number;
  creado_en: string;
}

interface EventsManagerProps {
  onEventsChange?: (events: UpcomingEvent[]) => void;
}

export function EventsManager({ onEventsChange }: EventsManagerProps) {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<UpcomingEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    personas: '',
    direccion: '',
    valor: ''
  });

  // Cargar eventos de la API al inicializar
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/eventos');
      if (!response.ok) {
        throw new Error('Error al cargar eventos');
      }
      const eventosData = await response.json();
      setEvents(eventosData);
      onEventsChange?.(eventosData);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Error al cargar los eventos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      fecha: '',
      personas: '',
      direccion: '',
      valor: ''
    });
    setEditingEvent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.fecha || !formData.personas) {
      alert('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setLoading(true);

      if (editingEvent) {
        // Actualizar evento existente
        const response = await fetch('/api/eventos', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingEvent.id,
            ...formData
          }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar evento');
        }
      } else {
        // Crear nuevo evento
        const response = await fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Error al crear evento');
        }
      }

      await fetchEvents(); // Recargar la lista
      resetForm();
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Error al guardar el evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (event: UpcomingEvent) => {
    setEditingEvent(event);
    setFormData({
      nombre: event.nombre,
      fecha: event.fecha,
      personas: event.personas.toString(),
      direccion: event.direccion || '',
      valor: event.valor?.toString() || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/eventos?id=${eventId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar evento');
      }

      await fetchEvents(); // Recargar la lista
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const sortedEvents = events
    .filter(event => new Date(event.fecha) >= new Date())
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>Próximos Eventos</span>
        </h3>
        <button
          onClick={() => setShowForm(true)}
          disabled={loading}
          className="flex items-center space-x-1 px-2 py-1 bg-orange-500 text-white text-xs rounded-md hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <Plus className="w-3 h-3" />
          <span>Agregar</span>
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Nombre del evento *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: Evento Corporativo"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Cantidad de personas *
                </label>
                <input
                  type="number"
                  value={formData.personas}
                  onChange={(e) => setFormData({...formData, personas: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: 50"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Valor estimado (CLP)
                </label>
                <input
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: e.target.value})}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ej: 150000"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Dirección (opcional)
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Ej: Av. Providencia 123, Santiago"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                {editingEvent ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de eventos */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-orange-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Cargando eventos...</p>
          </div>
        ) : sortedEvents.length > 0 ? (
          sortedEvents.map((event, index) => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{event.nombre}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{event.personas} personas</span>
                    </div>
                    {event.valor && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3" />
                        <span>${event.valor.toLocaleString()}</span>
                      </div>
                    )}
                    {event.direccion && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{event.direccion}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {formatDate(event.fecha)}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar evento"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar evento"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">No hay eventos próximos</p>
            <p className="text-xs text-gray-500">Haz clic en "Agregar" para crear uno</p>
          </div>
        )}
      </div>
    </div>
  );
}