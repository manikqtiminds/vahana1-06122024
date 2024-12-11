import React from 'react';
import DamageTypeIndicator from '../../../components/DamageTypeIndicator';

function DamageTable({ groupedAssessments, totalCost }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[35%]">Part</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Damage Type</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Action</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Cost (₹)</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupedAssessments.map((group, groupIndex) => (
              <React.Fragment key={group.imageName}>
                {group.damages.map((damage, index) => (
                  <tr 
                    key={damage.MLCaseImageAssessmentId || `${group.imageName}-${index}`} 
                    className={`${groupIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-opacity-80`}
                  >
                    {index === 0 ? (
                      <td 
                        rowSpan={group.damages.length + 1} 
                        className={`px-6 py-4 text-center whitespace-nowrap text-sm font-medium border-r border-gray-200
                          ${groupIndex % 2 === 0 ? 'bg-white text-gray-900' : 'bg-gray-50 text-gray-700'}`}
                      >
                        {damage.ImageName}
                      </td>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {damage.CarPartName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center">
                        <DamageTypeIndicator type={damage.DamageTypeID} />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 text-sm rounded-full ${
                        damage.RepairReplaceID === 0 
                          ? 'bg-[#f17373] text-green-800' 
                          : 'bg-[#e6da89] text-yellow-800'
                      }`}>
                        {damage.RepairReplaceID === 0 ? 'Repair' : 'Replace'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      ₹{damage.ActualCostRepair?.toFixed(2) || '0.00'}
                    </td>
                  </tr>
                ))}
                <tr className={`bg-[#F3F4F6] border-t border-gray-200`}>
                  <td colSpan="3" className="px-8 py-4 text-sm font-semibold text-gray-800 text-right">
                    Subtotal:
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900 text-center">
                    ₹{group.damages.reduce((sum, damage) => sum + (damage.ActualCostRepair || 0), 0).toFixed(2)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="bg-[#002244] text-white font-medium">
            <tr>
              <td colSpan="4" className="px-6 py-4 text-sm font-semibold text-right">
                Total Assessment Cost:
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold">
                ₹{totalCost.toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default DamageTable;