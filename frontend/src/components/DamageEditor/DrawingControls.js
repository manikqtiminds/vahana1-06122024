import { Pencil, X } from 'lucide-react';

function DrawingControls({ isDrawingMode, setIsDrawingMode, selectedDamageType, setSelectedDamageType }) {
  const damageTypes = [
    { id: 0, label: 'Scratch', color: '#22c55e' },
    { id: 1, label: 'Dent', color: '#eab308' },
    { id: 2, label: 'Broken', color: '#ef4444' }
  ];

  return (
    <div className="absolute top-4 left-4 z-30 flex flex-col gap-2">
      <button
        onClick={() => setIsDrawingMode(!isDrawingMode)}
        className={`p-2 rounded-lg ${
          isDrawingMode ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
        } shadow-md hover:opacity-90 transition-opacity`}
        title={isDrawingMode ? 'Cancel Drawing' : 'Start Drawing'}
      >
        {isDrawingMode ? <X className="w-5 h-5" /> : <Pencil className="w-5 h-5" />}
      </button>

      {isDrawingMode && (
        <div className="flex gap-2 bg-white p-2 rounded-lg shadow-md">
          {damageTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedDamageType(type.id)}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                selectedDamageType === type.id ? 'ring-2 ring-blue-500 scale-110' : ''
              }`}
              style={{ backgroundColor: type.color }}
              title={type.label}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DrawingControls;