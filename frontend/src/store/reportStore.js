import { create } from 'zustand';
import { fetchReportData } from '../services/reportService';

const useReportStore = create((set) => ({
  reportData: null,
  loading: false,
  error: null,

  fetchReport: async (referenceNo) => {
    set({ loading: true, error: null });
    try {
      console.log('Fetching report data for reference:', referenceNo);
      const data = await fetchReportData(referenceNo);
      console.log('Setting report data:', data);
      set({ reportData: data, loading: false });
    } catch (error) {
      console.error('Error fetching report:', error);
      set({ error: error.message, loading: false });
    }
  },

  clearReport: () => {
    set({ reportData: null, loading: false, error: null });
  }
}));

export default useReportStore;