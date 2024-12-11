import { Edit2, Trash2 } from 'lucide-react';
import DamageTypeIndicator from '../DamageTypeIndicator';

function DamageListItem({ annotation, onEdit, onDelete }) {
  const getRepairType = (type) => {
    switch (parseInt(type)) {
      case 0: return 'Repair';
      case 1: return 'Replace';
      default: return 'NA';
    }
  };

  const repairType = getRepairType(annotation.RepairReplaceID);
  const cost = annotation.ActualCostRepair || 0;

  return (
    <tr className="bg-[#f2fff7]">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {annotation.CarPartName || 'Unknown Part'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <DamageTypeIndicator type={annotation.DamageTypeID} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`text-sm px-2 py-1 rounded-full font-medium ${
          repairType === 'Repair' 
            ? 'bg-[#f17373] text-green-800'
            : 'bg-[#e6da89] text-yellow-800'
        }`}>
          {repairType}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
        ₹{cost.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onEdit(annotation)}
            className="text-blue-600 hover:text-blue-900"
            title="Edit damage details"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(annotation.MLCaseImageAssessmentId)}
            className="text-red-600 hover:text-red-900"
            title="Delete damage"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default DamageListItem;