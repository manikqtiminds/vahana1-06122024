/**
 * Validates external request parameters
 */
export const validateExternalRequest = (params) => {
    if (!params) {
      throw new Error('No parameters provided');
    }
  
    // Check for reference number in different possible parameter names
    const encryptedRef = params.get('ref') || 
                        params.get('referenceNo') || 
                        params.get('referenceNumber') ||
                        params.get('data');
  
    if (!encryptedRef) {
      throw new Error('Reference number not found in request');
    }
  
    return encryptedRef;
  };