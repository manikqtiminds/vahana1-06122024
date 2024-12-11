import { create } from 'zustand';
import { fetchDamageAnnotations, addDamageAnnotation, updateDamageAnnotation, deleteDamageAnnotation } from '../services/damageService';

const useDamageStore = create((set, get) => ({
  annotations: [],
  currentImageCost: 0,
  totalCost: 0,
  loading: false,
  error: null,

  fetchAnnotations: async (referenceNo, imageName) => {
    if (!referenceNo || !imageName) {
      console.warn('Missing required parameters:', { referenceNo, imageName });
      return;
    }

    set({ loading: true, error: null });
    try {
      console.log('Fetching annotations for:', { referenceNo, imageName });
      const data = await fetchDamageAnnotations(referenceNo, imageName);
      console.log('Received annotations:', data);
      
      set({
        annotations: data.annotations || [],
        currentImageCost: data.currentImageCost || 0,
        totalCost: data.totalCost || 0,
        loading: false
      });
    } catch (error) {
      console.error('Error fetching annotations:', error);
      set({ 
        error: error.message, 
        loading: false,
        annotations: [],
        currentImageCost: 0,
        totalCost: 0
      });
    }
  },

  addAnnotation: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log('Adding annotation:', data);
      const newAnnotation = await addDamageAnnotation(data);
      console.log('Added annotation:', newAnnotation);
      
      await get().fetchAnnotations(data.referenceNo, data.imageName);
    } catch (error) {
      console.error('Error adding annotation:', error);
      set({ error: error.message, loading: false });
    }
  },

  updateAnnotation: async (id, data) => {
    set({ loading: true, error: null });
    try {
      console.log('Updating annotation:', { id, data });
      await updateDamageAnnotation(id, data);
      await get().fetchAnnotations(data.referenceNo, data.imageName);
    } catch (error) {
      console.error('Error updating annotation:', error);
      set({ error: error.message, loading: false });
    }
  },

  deleteAnnotation: async (id, referenceNo, imageName) => {
    set({ loading: true, error: null });
    try {
      console.log('Deleting annotation:', { id, referenceNo, imageName });
      await deleteDamageAnnotation(id);
      await get().fetchAnnotations(referenceNo, imageName);
    } catch (error) {
      console.error('Error deleting annotation:', error);
      set({ error: error.message, loading: false });
    }
  },

  // Add method to get all annotations for report
  getAllAnnotations: () => {
    return get().annotations;
  }
}));

export default useDamageStore;