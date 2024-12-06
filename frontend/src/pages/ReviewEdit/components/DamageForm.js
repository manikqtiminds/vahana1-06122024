import { useState } from 'react';
import { Save } from 'lucide-react';

function DamageForm({ referenceNo, imageName, onCancel }) {
  const [formData, setFormData] = useState({
    carPartId: '',
    damageType: '3',
    repairType: '2',
    partType: 'Metal',
    cost: '',
  });

  const damageTypes = [
    { value: '0', label: 'Scratch' },
    { value: '1', label: 'Dent' },
    { value: '2', label: 'Broken' },
    { value: '3', label: 'NA' },
  ];

  const repairTypes = [
    { value: '0', label: 'Repair' },
    { value: '1', label: 'Replace' },
    { value: '2', label: 'NA' },
  ];

  const partTypes = [
    { value: 'Metal', label: 'Metal' },
    { value: 'Plastic', label: 'Plastic' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Add Damage Details</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Part Name
          </label>
          <select
            value={formData.carPartId}
            onChange={(e) => setFormData({ ...formData, carPartId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select Part Name</option>
            {/* Add car parts options here */}
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
            {damageTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
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
            {repairTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Part Type
          </label>
          <select
            value={formData.partType}
            onChange={(e) => setFormData({ ...formData, partType: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {partTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
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
            Add Annotation
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