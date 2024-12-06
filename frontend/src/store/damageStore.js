import { create } from 'zustand';
import { fetchDamageAnnotations, addDamageAnnotation, updateDamageAnnotation, deleteDamageAnnotation } from '../services/damageService';

const useDamageStore = create((set, get) => ({
  annotations: [],
  currentImageCost: 0,
  totalCost: 0,
  loading: false,
  error: null,

  fetchAnnotations: async (referenceNo, imageName) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchDamageAnnotations(referenceNo, imageName);
      set({
        annotations: data.annotations,
        currentImageCost: data.currentImageCost || 0,
        totalCost: data.totalCost || 0,
        loading: false
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addAnnotation: async (data) => {
    set({ loading: true, error: null });
    try {
      const newAnnotation = await addDamageAnnotation(data);
      set(state => ({
        annotations: [...state.annotations, newAnnotation],
        loading: false
      }));
      await get().fetchAnnotations(data.referenceNo, data.imageName);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateAnnotation: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await updateDamageAnnotation(id, data);
      await get().fetchAnnotations(data.referenceNo, data.imageName);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  deleteAnnotation: async (id, referenceNo, imageName) => {
    set({ loading: true, error: null });
    try {
      await deleteDamageAnnotation(id);
      await get().fetchAnnotations(referenceNo, imageName);
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useDamageStore;