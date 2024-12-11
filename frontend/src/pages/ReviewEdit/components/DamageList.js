import { useState } from 'react';
import { Filter, Plus, Edit2, Trash2 } from 'lucide-react';
import { DamageTypeIndicator } from './DamageTypeIndicator';

function DamageList({ 
  annotations = [], 
  currentImageCost = 0, 
  totalCost = 0, 
  loading = false, 
  error = null,
  onAddDamage,
  onDelete 
}) {
  const [filter, setFilter] = useState('All');

  const getDamageType = (type) => {
    switch (parseInt(type)) {
      case 0: return 'Scratch';
      case 1: return 'Dent';
      case 2: return 'Broken';
      default: return 'Unknown';
    }
  };

  const getRepairType = (type) => {
    switch (parseInt(type)) {
      case 0: return 'Repair';
      case 1: return 'Replace';
      default: return 'NA';
    }
  };

  const filteredAnnotations = annotations.filter((annotation) => {
    if (filter === 'All') return true;
    return filter === getRepairType(annotation.RepairReplaceID);
  });

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading damage annotations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-blue-400 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#002244]">Damage List</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#002244]" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="text-sm bg-white border border-[#002244] rounded-md text-[#002244] focus:ring-2 focus:ring-[#002244] py-1"
              >
                <option value="All">All</option>
                <option value="Repair">Repair</option>
                <option value="Replace">Replace</option>
              </select>
            </div>
            <button
              onClick={onAddDamage}
              className="flex items-center gap-2 bg-[#002244] text-white px-3 py-1 rounded-md hover:bg-[#003366] transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <table className="w-full min-w-[580px] divide-y divide-gray-200">
            <thead className="bg-[#FFDCB6] sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#002244] uppercase tracking-wider whitespace-nowrap">Part</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#002244] uppercase tracking-wider whitespace-nowrap">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#002244] uppercase tracking-wider whitespace-nowrap">Action</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-[#002244] uppercase tracking-wider whitespace-nowrap">Cost</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-[#002244] uppercase tracking-wider whitespace-nowrap">Edit</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAnnotations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No damage annotations available
                  </td>
                </tr>
              ) : (
                filteredAnnotations.map((annotation, index) => (
                  <tr key={annotation.MLCaseImageAssessmentId || index} className="bg-[#f2fff7]">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {annotation.CarPartName || 'Unknown Part'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DamageTypeIndicator type={annotation.DamageTypeID} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm px-2 py-1 rounded-full font-medium ${
                        getRepairType(annotation.RepairReplaceID) === 'Repair' 
                          ? 'bg-[#f17373] text-green-800'
                          : 'bg-[#e6da89] text-yellow-800'
                      }`}>
                        {getRepairType(annotation.RepairReplaceID)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      ₹{annotation.ActualCostRepair?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => onEdit?.(annotation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete?.(annotation.MLCaseImageAssessmentId)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cost Summary */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <table className="w-full min-w-[580px] border-collapse">
          <tbody>
            <tr className="bg-[#FFDCB6]">
              <td className="px-6 py-3 text-sm font-medium text-[#002244]">
                Current Damage Cost:
              </td>
              <td className="px-10"></td>
              <td className="px-6 py-3 text-sm font-bold text-[#002244] text-left">
                ₹{currentImageCost.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-blue-400">
              <td className="px-6 py-3 text-sm font-medium text-[#002244]">
                Total Cost:
              </td>
              <td className="px-10"></td>
              <td className="px-6 py-3 text-sm font-bold text-[#002244] text-left">
                ₹{totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DamageList;