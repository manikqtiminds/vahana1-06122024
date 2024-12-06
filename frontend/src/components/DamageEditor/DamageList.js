import { Trash2 } from 'lucide-react';

function DamageList({ damageInfo, onDelete }) {
  const damageTypes = [
    { id: 0, label: 'Scratch', color: '#22c55e' },
    { id: 1, label: 'Dent', color: '#eab308' },
    { id: 2, label: 'Broken', color: '#ef4444' }
  ];

  if (!damageInfo?.length) return null;

  return (
    <div className="absolute top-4 right-4 z-30 bg-white p-2 rounded-lg shadow-md max-w-xs">
      <h3 className="text-sm font-semibold mb-2">Damage Markings</h3>
      <div className="space-y-2">
        {damageInfo.map((damage, index) => (
          <div key={index} className="flex items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: damageTypes[damage.damageType].color }}
              />
              <span>{damageTypes[damage.damageType].label}</span>
            </div>
            <button
              onClick={() => onDelete(index)}
              className="p-1 hover:bg-red-100 rounded-full text-red-500"
              title="Delete marking"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DamageList;