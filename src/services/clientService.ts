// src/services/clientService.ts
import api from './api';

export interface Client {
  id?: number;
  status: boolean;
  documentType: string;
  documentNumber: string;
  fullName: string;
  birthDate: string;
  email: string;
  phone: string;
}

export const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await api.get<Client[]>('/cliente');
    return response.data.filter((res: Client) => res.status === true); // Filtro directo;
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

export const createClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
  try {
    // Asegurando que el status sea true como en tu ejemplo
    const payload = {
      ...clientData,
      status: true
    };
    
    const response = await api.post<Client>('/cliente', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id: number, clientData: Partial<Client>): Promise<Client> => {
  try {
    // Manteniendo el status como true
    const payload = {
      ...clientData,
      status: true
    };
    
    const response = await api.put<Client>(`/cliente/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await api.delete(`/cliente/${id}`);
  } catch (error) {
    console.error('Error deleting client:', error);
    throw error;
  }
};

export const getClientById = async (id: number): Promise<Client> => {
  try {
    const response = await api.get<Client>(`/cliente/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client by ID:', error);
    throw error;
  }
};