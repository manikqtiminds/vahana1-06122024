import { useNavigate } from 'react-router-dom';
import { Download, FileText, ArrowLeft } from 'lucide-react';

function Header({ referenceNo, onDownloadReport }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#002244] text-white">
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button and Reference Number */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline">Back</span>
            </button>
            <div>
              <span className="text-lg text-gray-300 block md:inline">Reference Number:</span>
              <span className="text-lg font-semibold ml-2">{referenceNo}</span>
            </div>
          </div>

          {/* Right Side - Navigation and Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => navigate('/report')}
              className="flex items-center gap-1 md:gap-2 bg-blue-600 hover:bg-blue-700 px-2 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              <FileText className="w-6 h-6" />
              <span className="hidden md:inline">Report</span>
            </button>
            <button
              onClick={onDownloadReport}
              className="flex items-center gap-1 md:gap-2 bg-green-600 hover:bg-green-700 px-2 md:px-4 py-2 rounded-lg transition-colors text-xs md:text-sm whitespace-nowrap"
            >
              <Download className="w-6 h-6" />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;