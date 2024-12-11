import axios from 'axios';
import apiUrl from '../config/apiConfig';

export const fetchCarParts = async () => {
  try {
    const response = await axios.get(`${apiUrl}/api/carParts`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch car parts:', error);
    throw new Error('Failed to fetch car parts');
  }
};

export const fetchRepairCost = async (carPartMasterId, damageTypeId, repairReplaceId) => {
  try {
    const response = await axios.get(`${apiUrl}/api/carParts/costofrepair`, {
      params: {
        carPartMasterId,
        damageTypeId,
        repairReplaceId
      }
    });
    return response.data.CostOfRepair;
  } catch (error) {
    console.error('Failed to fetch repair cost:', error);
    return 0; // Return 0 as default cost if fetch fails
  }
};