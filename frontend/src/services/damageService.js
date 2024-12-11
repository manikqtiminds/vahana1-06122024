import axios from 'axios';
import apiUrl from '../config/apiConfig';

export const fetchDamageAnnotations = async (referenceNo, imageName) => {
  try {
    console.log('Fetching damage annotations from API:', { referenceNo, imageName });
    const response = await axios.get(
      `${apiUrl}/api/damageannotations/${encodeURIComponent(referenceNo)}/${encodeURIComponent(imageName)}`
    );
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to fetch damage annotations');
  }
};

export const addDamageAnnotation = async (data) => {
  try {
    console.log('Adding damage annotation:', data);
    const response = await axios.post(`${apiUrl}/api/damageannotations`, data);
    console.log('Add annotation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to add damage annotation');
  }
};

export const updateDamageAnnotation = async (id, data) => {
  try {
    console.log('Updating damage annotation:', { id, data });
    const response = await axios.put(`${apiUrl}/api/damageannotations/${id}`, data);
    console.log('Update annotation response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to update damage annotation');
  }
};

export const deleteDamageAnnotation = async (id) => {
  try {
    console.log('Deleting damage annotation:', id);
    await axios.delete(`${apiUrl}/api/damageannotations/${id}`);
    console.log('Annotation deleted successfully');
  } catch (error) {
    console.error('API Error:', error.response || error);
    throw new Error(error.response?.data?.message || 'Failed to delete damage annotation');
  }
};