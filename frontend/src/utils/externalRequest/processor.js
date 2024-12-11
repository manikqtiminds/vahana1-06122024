import { decryptData } from '../encryption';
import { validateExternalRequest } from './validator';
import { checkReferenceNumber } from '../../services/api';

/**
 * Processes external request and validates reference number
 */
export const processExternalRequest = async (searchParams) => {
  try {
    // Validate and get encrypted reference
    const encryptedRef = validateExternalRequest(searchParams);

    // Decrypt reference number
    const referenceNo = decryptData(encryptedRef);
    if (!referenceNo) {
      throw new Error('Failed to decrypt reference number');
    }

    // Verify reference number exists in database
    const exists = await checkReferenceNumber(referenceNo);
    if (!exists) {
      throw new Error('Reference number not found in system');
    }

    return {
      success: true,
      referenceNo,
      encryptedRef
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to process request'
    };
  }
};