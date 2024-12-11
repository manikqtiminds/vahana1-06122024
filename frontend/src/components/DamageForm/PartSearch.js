import { Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function PartSearch({ parts, selectedPart, onSelect, onClear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredParts = parts.filter(part => 
    part.CarPartName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Part Name
      </label>
      <div className="relative">
        <input
          type="text"
          value={selectedPart ? selectedPart.CarPartName : searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
            onClear();
          }}
          onClick={() => setIsDropdownOpen(true)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
          placeholder="Search part name..."
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        {selectedPart && (
          <button
            type="button"
            onClick={() => {
              onClear();
              setSearchTerm('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {filteredParts.length > 0 ? (
            filteredParts.map((part) => (
              <button
                key={part.CarPartMasterID}
                type="button"
                onClick={() => {
                  onSelect(part);
                  setIsDropdownOpen(false);
                  setSearchTerm('');
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
              >
                <span className="font-medium">{part.CarPartName}</span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              No parts found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PartSearch;