import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_ENCRYPTION_KEY || 'your_secret_key_here';

export const encryptData = (data) => {
  if (!data) {
    throw new Error('Data is required for encryption');
  }
  
  try {
    const encrypted = CryptoJS.AES.encrypt(data, secretKey);
    if (!encrypted) {
      throw new Error('Encryption failed');
    }
    return encrypted.toString();
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

export const decryptData = (encryptedData) => {
  if (!encryptedData) {
    throw new Error('Encrypted data is required for decryption');
  }
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    if (!bytes) {
      throw new Error('Decryption failed');
    }
    
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) {
      throw new Error('Decryption resulted in empty data');
    }
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
};