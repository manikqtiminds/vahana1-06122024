import { create } from 'zustand';
import { fetchCarParts, fetchRepairCost } from '../services/carPartService';

const useCarPartStore = create((set, get) => ({
  carParts: [],
  loading: false,
  error: null,

  fetchCarParts: async () => {
    set({ loading: true, error: null });
    try {
      const parts = await fetchCarParts();
      set({ carParts: parts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  getRepairCost: async (carPartMasterId, damageTypeId, repairReplaceId) => {
    try {
      return await fetchRepairCost(carPartMasterId, damageTypeId, repairReplaceId);
    } catch (error) {
      console.error('Error fetching repair cost:', error);
      return 0;
    }
  }
}));

export default useCarPartStore;