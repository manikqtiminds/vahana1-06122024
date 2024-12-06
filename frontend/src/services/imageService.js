import axios from 'axios';
import apiUrl from '../config/apiConfig';

export const fetchImages = async (referenceNo) => {
  console.log('Fetching images from API for reference:', referenceNo);
  
  try {
    const response = await axios.get(`${apiUrl}/api/images/${referenceNo}`);
    console.log('API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      }
    });
    throw new Error('Failed to fetch images');
  }
};