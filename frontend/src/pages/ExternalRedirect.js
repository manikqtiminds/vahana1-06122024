import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { processExternalRequest } from '../utils/externalRequest/processor';
import LoadingState from '../components/external/LoadingState';
import ErrorState from '../components/external/ErrorState';

export default function ExternalRedirect() {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleExternalRequest = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const result = await processExternalRequest(params);

        if (result.success) {
          // Redirect to review page with encrypted reference
          navigate(`/review?data=${encodeURIComponent(result.encryptedRef)}`);
        } else {
          setError(result.error);
          // After 3 seconds, redirect to home with error message
          setTimeout(() => {
            navigate('/', { 
              state: { error: result.error }
            });
          }, 3000);
        }
      } catch (error) {
        setError('Failed to process request');
        setTimeout(() => {
          navigate('/', { 
            state: { error: 'Failed to process request' }
          });
        }, 3000);
      }
    };

    handleExternalRequest();
  }, [location.search, navigate]);

  if (error) {
    return <ErrorState message={error} />;
  }

  return <LoadingState />;
}