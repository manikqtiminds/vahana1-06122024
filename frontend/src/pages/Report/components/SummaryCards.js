function SummaryCards({ summary }) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[#002244]">Repair Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Number of Repairs:</span>
              <span className="font-semibold">{summary.repairs.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Repair Cost:</span>
              <span className="font-semibold text-green-600">₹{summary.repairs.cost.toFixed(2)}</span>
            </div>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[#002244]">Replacement Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Number of Replacements:</span>
              <span className="font-semibold">{summary.replacements.count}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Replacement Cost:</span>
              <span className="font-semibold text-yellow-600">₹{summary.replacements.cost.toFixed(2)}</span>
            </div>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 text-[#002244]">Assessment Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Parts Affected:</span>
              <span className="font-semibold">{summary.uniqueParts}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Damages:</span>
              <span className="font-semibold">{summary.totalDamages}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Images Assessed:</span>
              <span className="font-semibold">{summary.totalImages}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default SummaryCards;