import axios from 'axios';
import { Skin } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const skinApi = {
  getAllSkins: async (params?: { weapon?: string; rarity?: string; collection?: string }): Promise<Skin[]> => {
    const response = await api.get('/skins', { params });
    return response.data;
  },

  getSkinById: async (id: number): Promise<Skin> => {
    const response = await api.get(`/skins/${id}`);
    return response.data;
  },

  getWeaponTypes: async (): Promise<string[]> => {
    const response = await api.get('/weapons');
    return response.data;
  },

  getSkinsByWeapon: async (weaponType: string): Promise<Skin[]> => {
    const response = await api.get(`/skins/weapon/${weaponType}`);
    return response.data;
  },

  checkHealth: async (): Promise<{ status: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;