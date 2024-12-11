import { useNavigate, useLocation } from 'react-router-dom';
import { Download, FileText, ArrowLeft } from 'lucide-react';
import { generateDamageReport } from '../../utils/reportGenerator';
import useInspectionStore from '../../store/inspectionStore';
import useDamageStore from '../../store/damageStore';

function Header({ referenceNo }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { images } = useInspectionStore();
  const { annotations } = useDamageStore();

  const handleBack = () => {
    if (location.pathname === '/report') {
      // Get the current URL search params
      const params = new URLSearchParams(location.search);
      // Navigate back to review page with the same params
      navigate(`/review?${params.toString()}`);
    } else {
      navigate('/');
    }
  };

  const handleReportClick = () => {
    const params = new URLSearchParams(location.search);
    navigate(`/report?${params.toString()}`);
  };

  const handleDownloadReport = () => {
    try {
      if (!referenceNo || !annotations?.length) {
        console.error('Missing required data for report:', { referenceNo, annotations });
        alert('Unable to generate report. No damage annotations found.');
        return;
      }

      // Generate the PDF document
      const doc = generateDamageReport(referenceNo, images || [], annotations);
      
      // Create blob from PDF
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Open preview window
      const previewWindow = window.open('', '_blank');
      if (!previewWindow) {
        alert('Please allow pop-ups to preview the report');
        return;
      }

      // Write preview HTML with embedded PDF viewer
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Report Preview - ${referenceNo}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { 
                font-family: system-ui, -apple-system, sans-serif;
                background: #f3f4f6;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
              }
              .toolbar {
                background: #002244;
                color: white;
                padding: 1rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .title {
                font-size: 1.25rem;
                font-weight: 600;
              }
              .buttons {
                display: flex;
                gap: 1rem;
              }
              .btn {
                padding: 0.5rem 1rem;
                border: none;
                border-radius: 0.375rem;
                cursor: pointer;
                font-size: 0.875rem;
                font-weight: 500;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.2s;
              }
              .btn-primary {
                background: #2563eb;
                color: white;
              }
              .btn-primary:hover {
                background: #1d4ed8;
              }
              .btn-secondary {
                background: #64748b;
                color: white;
              }
              .btn-secondary:hover {
                background: #475569;
              }
              .viewer {
                margin-top: 4rem;
                flex: 1;
                height: calc(100vh - 4rem);
              }
              #pdf-viewer {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>
          <body>
            <div class="toolbar">
              <div class="title">
                Damage Assessment Report - ${referenceNo}
              </div>
              <div class="buttons">
                <button id="downloadBtn" class="btn btn-primary">
                  Download PDF
                </button>
                <button id="closeBtn" class="btn btn-secondary">
                  Close Preview
                </button>
              </div>
            </div>
            <div class="viewer">
              <iframe id="pdf-viewer" src="${pdfUrl}#toolbar=0"></iframe>
            </div>
            <script>
              document.getElementById('downloadBtn').onclick = function() {
                const link = document.createElement('a');
                link.href = '${pdfUrl}';
                link.download = 'damage-report-${referenceNo}.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              };
              document.getElementById('closeBtn').onclick = function() {
                window.close();
              };
              window.onbeforeunload = function() {
                URL.revokeObjectURL('${pdfUrl}');
              };
            </script>
          </body>
        </html>
      `);
      previewWindow.document.close();

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="bg-[#002244] text-white">
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="inline">Back</span>
            </button>
            {referenceNo && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-lg text-gray-300">Reference Number:</span>
                <span className="text-lg font-semibold">{referenceNo}</span>
              </div>
            )}
          </div>

          {referenceNo && (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleReportClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
              >
                <FileText className="w-5 h-5" />
                <span className="inline">Report</span>
              </button>
              <button
                onClick={handleDownloadReport}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors text-sm whitespace-nowrap flex-1 sm:flex-none justify-center"
              >
                <Download className="w-5 h-5" />
                <span className="inline">Download</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;