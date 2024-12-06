import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../utils/encryption';
import { getReferenceNumbers, checkReferenceNumber } from '../../services/api';

function ReferenceSelect() {
  const [referenceNumbers, setReferenceNumbers] = useState([]);
  const [selectedReference, setSelectedReference] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReferenceNumbers();
  }, []);

  const fetchReferenceNumbers = async () => {
    try {
      setIsLoading(true);
      const numbers = await getReferenceNumbers();
      setReferenceNumbers(numbers || []);
    } catch (error) {
      console.error('Error fetching reference numbers:', error);
      setMessage('Failed to load reference numbers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReference) {
      setMessage('Please select a reference number');
      return;
    }

    try {
      setIsLoading(true);
      const exists = await checkReferenceNumber(selectedReference);

      if (exists) {
        const encryptedRefNo = encryptData(selectedReference);
        navigate(`/review?data=${encodeURIComponent(encryptedRefNo)}`);
      } else {
        setMessage('No Information Available For This Reference Number');
      }
    } catch (error) {
      console.error('Error checking reference number:', error);
      setMessage('An error occurred. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Car Inspection System
        </h2>
        <div className="mb-6">
          <select
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            value={selectedReference}
            onChange={(e) => {
              setSelectedReference(e.target.value);
              setMessage('');
            }}
            disabled={isLoading}
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
          disabled={isLoading}
          className={`w-full ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } text-white py-3 px-4 rounded-md transition duration-200 font-medium`}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
        {message && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ReferenceSelect;