import { useState } from 'react';
import DamageListHeader from './DamageListHeader';
import DamageListTable from './DamageListTable';
import CostSummary from './CostSummary';

function DamageList({ 
  annotations = [], 
  currentImageCost = 0, 
  totalCost = 0, 
  loading = false, 
  error = null,
  onAddDamage,
  onEdit,
  onDelete 
}) {
  const [filter, setFilter] = useState('All');

  const filteredAnnotations = annotations.filter((annotation) => {
    if (filter === 'All') return true;
    const repairType = annotation.RepairReplaceID === 0 ? 'Repair' : 'Replace';
    return filter === repairType;
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
    <div className="h-full flex flex-col overflow-hidden">
      <DamageListHeader 
        filter={filter}
        setFilter={setFilter}
        onAddDamage={onAddDamage}
      />
      <DamageListTable 
        annotations={filteredAnnotations}
        onEdit={onEdit}
        onDelete={onDelete}
      />
      <CostSummary 
        currentImageCost={currentImageCost}
        totalCost={totalCost}
      />
    </div>
  );
}

export default DamageList;