function ReferenceDropdown({ selectedReference, referenceNumbers, onChange }) {
  return (
    <div className="mb-6">
      <select
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        value={selectedReference}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Reference Number</option>
        {referenceNumbers.map((refNo) => (
          <option key={refNo} value={refNo}>
            {refNo}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ReferenceDropdown;