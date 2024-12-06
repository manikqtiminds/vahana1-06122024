import axios from 'axios';
import apiUrl from '../config/apiConfig';

export const fetchDamageAnnotations = async (referenceNo, imageName) => {
  try {
    const response = await axios.get(`${apiUrl}/api/damageannotations/${referenceNo}/${imageName}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch damage annotations:', error);
    throw new Error('Failed to fetch damage annotations');
  }
};

export const addDamageAnnotation = async (data) => {
  try {
    const response = await axios.post(`${apiUrl}/api/damageannotations`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to add damage annotation:', error);
    throw new Error('Failed to add damage annotation');
  }
};

export const updateDamageAnnotation = async (id, data) => {
  try {
    const response = await axios.put(`${apiUrl}/api/damageannotations/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Failed to update damage annotation:', error);
    throw new Error('Failed to update damage annotation');
  }
};

export const deleteDamageAnnotation = async (id) => {
  try {
    await axios.delete(`${apiUrl}/api/damageannotations/${id}`);
  } catch (error) {
    console.error('Failed to delete damage annotation:', error);
    throw new Error('Failed to delete damage annotation');
  }
};