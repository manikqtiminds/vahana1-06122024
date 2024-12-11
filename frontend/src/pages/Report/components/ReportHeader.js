import { format } from 'date-fns';

function ReportHeader({ referenceNo, summary }) {
  return (
    <div className="bg-[#002244] text-white p-8 rounded-lg">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Car Damage Assessment Report</h1>
          <div className="space-y-1 text-gray-300">
            <p>Reference Number: {referenceNo}</p>
            <p>Assessment Date: {format(new Date(), 'dd/MM/yyyy')}</p>
            <p>Total Images Assessed: {summary.totalImages}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-3xl font-bold">{summary.totalDamages}</p>
            <p className="text-sm text-gray-300">Total Damages</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <p className="text-3xl font-bold">₹{summary.totalCost.toFixed(2)}</p>
            <p className="text-sm text-gray-300">Total Cost</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportHeader;