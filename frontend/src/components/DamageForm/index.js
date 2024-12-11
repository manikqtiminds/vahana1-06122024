import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import useCarPartStore from '../../store/carPartStore';
import PartSearch from './PartSearch';

function DamageForm({ referenceNo, imageName, initialData = null, onCancel, onSuccess }) {
  const { carParts, loading: partsLoading, error: partsError, fetchCarParts, getRepairCost } = useCarPartStore();
  
  const [formData, setFormData] = useState({
    carPartId: '',
    damageType: '3',
    repairType: '2',
    partType: 'Metal',
    cost: '',
  });

  const [selectedPart, setSelectedPart] = useState(null);

  useEffect(() => {
    fetchCarParts();
  }, [fetchCarParts]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        carPartId: initialData.CarPartMasterID.toString(),
        damageType: initialData.DamageTypeID.toString(),
        repairType: initialData.RepairReplaceID.toString(),
        partType: initialData.PartType || 'Metal',
        cost: initialData.ActualCostRepair?.toString() || '',
      });
      setSelectedPart(carParts.find(part => part.CarPartMasterID === initialData.CarPartMasterID));
    }
  }, [initialData, carParts]);

  useEffect(() => {
    const fetchCost = async () => {
      if (formData.carPartId && formData.damageType !== '3' && formData.repairType !== '2') {
        const cost = await getRepairCost(
          parseInt(formData.carPartId),
          parseInt(formData.damageType),
          parseInt(formData.repairType)
        );
        setFormData(prev => ({ ...prev, cost: cost.toString() }));
      }
    };
    fetchCost();
  }, [formData.carPartId, formData.damageType, formData.repairType, getRepairCost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = {
      referenceNo,
      imageName,
      carPartMasterId: parseInt(formData.carPartId),
      damageTypeId: parseInt(formData.damageType),
      repairReplaceId: parseInt(formData.repairType),
      actualCostRepair: parseFloat(formData.cost) || 0,
      partType: formData.partType,
    };

    if (initialData?.MLCaseImageAssessmentId) {
      data.id = initialData.MLCaseImageAssessmentId;
    }

    onSuccess(data);
  };

  const handlePartSelect = (part) => {
    setSelectedPart(part);
    setFormData(prev => ({
      ...prev,
      carPartId: part.CarPartMasterID.toString(),
    }));
  };

  if (partsLoading) {
    return <div className="p-4">Loading car parts...</div>;
  }

  if (partsError) {
    return <div className="p-4 text-red-500">Error loading car parts: {partsError}</div>;
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">
        {initialData ? 'Edit Damage Details' : 'Add Damage Details'}
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <PartSearch
          parts={carParts}
          selectedPart={selectedPart}
          onSelect={handlePartSelect}
          onClear={() => {
            setSelectedPart(null);
            setFormData(prev => ({ ...prev, carPartId: '' }));
          }}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Part Type
          </label>
          <select
            value={formData.partType}
            onChange={(e) => setFormData(prev => ({ ...prev, partType: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="Metal">Metal</option>
            <option value="Plastic">Plastic</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Damage Type
          </label>
          <select
            value={formData.damageType}
            onChange={(e) => setFormData({ ...formData, damageType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="3">NA</option>
            <option value="0">Scratch</option>
            <option value="1">Dent</option>
            <option value="2">Broken</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repair Type
          </label>
          <select
            value={formData.repairType}
            onChange={(e) => setFormData({ ...formData, repairType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="2">NA</option>
            <option value="0">Repair</option>
            <option value="1">Replace</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Repair Cost (₹)
          </label>
          <input
            type="number"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {initialData ? 'Update' : 'Add'} Annotation
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default DamageForm;