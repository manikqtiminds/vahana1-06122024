import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../utils/encryption';
import useInspectionStore from '../../store/inspectionStore';
import Header from '../../components/Header';
import LeftColumn from './components/LeftColumn';
import CenterColumn from './components/CenterColumn';
import RightColumn from './components/RightColumn';

function ReviewEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setReferenceNo, fetchImages, referenceNo } = useInspectionStore();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const encryptedData = params.get('data');

    if (!encryptedData) {
      navigate('/');
      return;
    }

    try {
      const decryptedRefNo = decryptData(encryptedData);
      if (!decryptedRefNo) {
        throw new Error('Failed to decrypt reference number');
      }
      setReferenceNo(decryptedRefNo);
    } catch (error) {
      console.error('Error decrypting reference number:', error);
      navigate('/');
    }
  }, [location.search, navigate, setReferenceNo]);

  useEffect(() => {
    if (referenceNo) {
      fetchImages();
    }
  }, [referenceNo, fetchImages]);

  const handleReportClick = () => {
    const params = new URLSearchParams(location.search);
    navigate(`/report?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header 
        referenceNo={referenceNo}
        onReportClick={handleReportClick}
      />
      <div className="flex flex-col md:flex-row flex-1 gap-2 md:gap-[0.5%] p-4">
        <div className="w-full md:w-[5%] bg-white rounded-lg shadow-md mb-2 md:mb-0">
          <LeftColumn />
        </div>
        <div className="w-full md:w-[48%] bg-white rounded-lg shadow-md mb-2 md:mb-0">
          <CenterColumn />
        </div>
        <div className="w-full md:w-[46%] bg-white rounded-lg shadow-md">
          <RightColumn />
        </div>
      </div>
    </div>
  );
}

export default ReviewEdit;