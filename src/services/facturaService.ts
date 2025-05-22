// src/services/facturaService.ts
import api from './api';

export interface Reservacion {
  id: number;
}

export interface Factura {
  id?: number;
  status: boolean;
  descripcion: string;
  metodoPago: string;
  estadoPago: string;
  reservacion: Reservacion;
  montoTotal: number;
}

export const fetchFacturas = async (): Promise<Factura[]> => {
  try {
    const response = await api.get<Factura[]>('/factura');
    return response.data.filter((res: Factura) => res.status === true); // Filtro directo;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};

export const createFactura = async (facturaData: Omit<Factura, 'id'>): Promise<Factura> => {
  try {
    // Asegurando que el status sea true como en tu ejemplo
    const payload = {
      ...facturaData,
      status: true
    };
    
    const response = await api.post<Factura>('/factura', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
};

export const updateFactura = async (id: number, facturaData: Partial<Factura>): Promise<Factura> => {
  try {
    // Manteniendo el status como true
    const payload = {
      ...facturaData,
      status: true
    };
    
    const response = await api.put<Factura>(`/factura/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
};

export const deleteFactura = async (id: number): Promise<void> => {
  try {
    await api.delete(`/factura/${id}`);
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
};

export const getFacturaById = async (id: number): Promise<Factura> => {
  try {
    const response = await api.get<Factura>(`/factura/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoice by ID:', error);
    throw error;
  }
};

export const getFacturasByReservacion = async (reservacionId: number): Promise<Factura[]> => {
  try {
    const response = await api.get<Factura[]>(`/factura/reservacion/${reservacionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices by reservation:', error);
    throw error;
  }
};