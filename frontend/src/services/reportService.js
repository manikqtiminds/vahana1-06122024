import axios from 'axios';
import apiUrl from '../config/apiConfig';

export const fetchReportData = async (referenceNo) => {
  if (!referenceNo) {
    throw new Error('Reference number is required');
  }

  try {
    console.log('Fetching report data for:', referenceNo);
    const response = await axios.get(`${apiUrl}/api/reports/${encodeURIComponent(referenceNo)}`);
    console.log('Report data received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch report data:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch report data');
  }
};