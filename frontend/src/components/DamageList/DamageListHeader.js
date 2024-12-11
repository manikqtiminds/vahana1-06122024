import { Filter, Plus } from 'lucide-react';

function DamageListHeader({ filter, setFilter, onAddDamage }) {
  return (
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
  );
}

export default DamageListHeader;