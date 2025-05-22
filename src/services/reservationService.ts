import api from './api';

interface User {
  id: number;
}

interface Cliente {
  id: number;
}

interface SitioTuristico {
  id: number;
}

export interface Reservation {
  id?: number;
  status?: boolean;
  fecha: string;
  hora: string;
  numeroPersonas: number;
  observaciones: string;
  tipoReserva: string;
  user: User;
  cliente: {
    id: number;
    fullName?: string;       // Nuevo campo para facturación
    documentType?: string;  // Nuevo campo para facturación
    documentNumber?: string;// Nuevo campo para facturación
    email?: string;         // Nuevo campo para facturación
  };
  sitioTuristico: {
    id: number;
    title?: string;         // Nuevo campo para facturación
  };
  // Mantener todos los campos existentes
}

export const fetchReservations = async (): Promise<Reservation[]> => {
  try {
    const response = await api.get<Reservation[]>('/reservacion');
    return response.data.filter((res: Reservation) => res.status === true); // Filtro directo;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

export const fetchReservationById = async (id: number): Promise<Reservation> => {
  try {
    const response = await api.get<Reservation>(`/reservacion/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation with ID ${id}:`, error);
    throw error;
  }
};

export const createReservation = async (reservationData: Omit<Reservation, 'id'>): Promise<Reservation> => {
  try {
    // Asegurar que el status tenga un valor por defecto
    const payload = {
      ...reservationData,
      status: true // o false, según lo que necesites
    };
    
    const response = await api.post<Reservation>('/reservacion', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

export const updateReservation = async (id: number, reservationData: Partial<Reservation>): Promise<Reservation> => {
  try {
    // Format date and time if they're being updated
    const payload = { ...reservationData };
    
    if (payload.fecha) {
      payload.fecha = payload.fecha.split('T')[0];
    }
    
    if (payload.hora && payload.hora.includes('T')) {
      payload.hora = payload.hora.split('T')[1].split('.')[0];
    }

    const response = await api.put<Reservation>(`/reservacion/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation with ID ${id}:`, error);
    throw error;
  }
};

export const deleteReservation = async (id: number): Promise<void> => {
  try {
    await api.delete(`/reservacion/${id}`);
  } catch (error) {
    console.error(`Error deleting reservation with ID ${id}:`, error);
    throw error;
  }
};

// Additional functions you might need
export const fetchReservationsByClient = async (clientId: number): Promise<Reservation[]> => {
  try {
    const response = await api.get<Reservation[]>(`/reservacion/cliente/${clientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservations for client ${clientId}:`, error);
    throw error;
  }
};

export const fetchReservationsByTouristSite = async (siteId: number): Promise<Reservation[]> => {
  try {
    const response = await api.get<Reservation[]>(`/reservacion/sitio/${siteId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservations for tourist site ${siteId}:`, error);
    throw error;
  }
};