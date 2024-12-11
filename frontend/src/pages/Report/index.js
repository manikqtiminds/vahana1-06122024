import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { decryptData } from '../../utils/encryption';
import useReportStore from '../../store/reportStore';
import Header from '../../components/Header';
import ReportContent from './components/ReportContent';
import { Download } from 'lucide-react';
import { generateDamageReport } from '../../utils/reportGenerator';

function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { reportData, fetchReport, clearReport } = useReportStore();

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
      console.log('Fetching report for:', decryptedRefNo);
      fetchReport(decryptedRefNo);
    } catch (error) {
      console.error('Error loading report:', error);
      navigate('/');
    }

    return () => clearReport();
  }, [location.search, navigate, fetchReport, clearReport]);

  const handleDownloadPDF = () => {
    if (!reportData) {
      alert('No report data available');
      return;
    }

    try {
      const doc = generateDamageReport(
        reportData.referenceNo,
        [], // Images not needed for PDF
        reportData.assessments
      );

      // Open PDF in new window for preview
      const pdfDataUri = doc.output('datauristring');
      const previewWindow = window.open('');
      if (!previewWindow) {
        alert('Please allow pop-ups to preview the report');
        return;
      }

      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Report Preview - ${reportData.referenceNo}</title>
            <style>
              body { margin: 0; padding: 20px; font-family: system-ui; }
              #preview-controls {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                gap: 10px;
              }
              .btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
              }
              .btn-primary {
                background: #2563eb;
                color: white;
              }
              .btn-secondary {
                background: #64748b;
                color: white;
              }
              iframe {
                width: 100%;
                height: calc(100vh - 40px);
                border: none;
              }
            </style>
          </head>
          <body>
            <div id="preview-controls">
              <button id="downloadBtn" class="btn btn-primary">
                Download Report
              </button>
              <button id="closeBtn" class="btn btn-secondary">
                Close Preview
              </button>
            </div>
            <iframe src="${pdfDataUri}"></iframe>
            <script>
              document.getElementById('downloadBtn').onclick = function() {
                window.parent.postMessage('download', '*');
              };
              document.getElementById('closeBtn').onclick = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `);

      // Handle download message from preview window
      window.addEventListener('message', (event) => {
        if (event.data === 'download') {
          doc.save(`damage-report-${reportData.referenceNo}.pdf`);
        }
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header referenceNo={reportData?.referenceNo} />
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
          <ReportContent />
        </div>
      </div>
    </div>
  );
}

export default Report;