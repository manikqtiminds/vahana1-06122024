import DamageListItem from './DamageListItem';

function DamageListTable({ annotations, onEdit, onDelete }) {
  return (
    <div className="flex-1 relative overflow-hidden">
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
            {annotations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  No damage annotations available
                </td>
              </tr>
            ) : (
              annotations.map((annotation) => (
                <DamageListItem
                  key={annotation.MLCaseImageAssessmentId}
                  annotation={annotation}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DamageListTable;