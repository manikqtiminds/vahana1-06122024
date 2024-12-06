import axios from 'axios';
import apiUrl from '../config/apiConfig';

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getReferenceNumbers = async () => {
  try {
    const response = await api.get('/api/referenceNumbers');
    return response.data.referenceNumbers;
  } catch (error) {
    console.error('Failed to fetch reference numbers:', error);
    throw new Error('Failed to fetch reference numbers');
  }
};

export const checkReferenceNumber = async (referenceNo) => {
  try {
    const response = await api.get(`/api/referenceNumbers/check/${encodeURIComponent(referenceNo)}`);
    return response.data.exists;
  } catch (error) {
    console.error('Failed to check reference number:', error);
    throw new Error('Failed to verify reference number');
  }
};