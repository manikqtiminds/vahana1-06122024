import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../utils/encryption';
import apiUrl from '../config/apiConfig';

function ReferenceSelect() {
  const [referenceNumbers, setReferenceNumbers] = useState([]);
  const [selectedReference, setSelectedReference] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferenceNumbers();
  }, []);

  const fetchReferenceNumbers = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/referenceNumbers`);
      const data = await response.json();
      setReferenceNumbers(data.referenceNumbers);
    } catch (error) {
      console.error('Error fetching reference numbers:', error);
      setMessage('Failed to load reference numbers');
    }
  };

  const handleSubmit = async () => {
    if (!selectedReference) {
      setMessage('Please select a reference number');
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/api/referenceNumbers/check/${encodeURIComponent(selectedReference)}`
      );
      const data = await response.json();

      if (data.exists) {
        const encryptedRefNo = encryptData(selectedReference);
        navigate(`/review?data=${encodeURIComponent(encryptedRefNo)}`);
      } else {
        setMessage('Reference number not found in database');
      }
    } catch (error) {
      console.error('Error checking reference number:', error);
      setMessage('An error occurred. Please try again');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Car Inspection Reference
        </h2>
        <div className="mb-6">
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedReference}
            onChange={(e) => {
              setSelectedReference(e.target.value);
              setMessage('');
            }}
          >
            <option value="">Select Reference Number</option>
            {referenceNumbers.map((refNo) => (
              <option key={refNo} value={refNo}>
                {refNo}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
        {message && (
          <p className="mt-4 text-center text-red-600">{message}</p>
        )}
      </div>
    </div>
  );
}

export default ReferenceSelect;