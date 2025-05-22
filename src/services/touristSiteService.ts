// src/services/touristSiteService.ts
import api from './api';

export interface TouristSite {

  id?: number;
  status: boolean;

  title: string;
  description: string;
  type: string;
  imageUrl: string;
  location: string;
  schedule: string;
  price: number;
  contact: string;
}

export const fetchTouristSites = async (): Promise<TouristSite[]> => {
  try {
    const response = await api.get<TouristSite[]>('/sitioTuristico');
    return response.data.filter((res: TouristSite) => res.status === true); // Filtro directo;
  } catch (error) {
    console.error('Error fetching tourist sites:', error);
    throw error;
  }
};

export const createTouristSite = async (siteData: Omit<TouristSite, 'id' | 'status'>): Promise<TouristSite> => {
  try {
    const payload = {
      ...siteData,
      status: true // Establecemos el status como true por defecto
    };
    
    const response = await api.post<TouristSite>('/sitioTuristico', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating tourist site:', error);
    throw error;
  }
};

export const updateTouristSite = async (id: number, siteData: Partial<TouristSite>): Promise<TouristSite> => {
  try {
    const payload = {
      ...siteData,
      status: true // Mantenemos el status como true
    };
    
    const response = await api.put<TouristSite>(`/sitioTuristico/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating tourist site:', error);
    throw error;
  }
};

export const deleteTouristSite = async (id: number): Promise<void> => {
  try {
    await api.delete(`/sitioTuristico/${id}`);
  } catch (error) {
    console.error('Error deleting tourist site:', error);
    throw error;
  }
};

export const fetchTouristSiteById = async (id: number): Promise<TouristSite> => {
  try {
    const response = await api.get<TouristSite>(`/sitioTuristico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tourist site with ID ${id}:`, error);
    throw error;
  }
};