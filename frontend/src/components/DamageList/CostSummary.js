function CostSummary({ currentImageCost, totalCost }) {
    return (
      <div className="sticky bottom-0 bg-white border-t border-gray-200">
        <table className="w-full min-w-[580px] border-collapse">
          <tbody>
            <tr className="bg-[#FFDCB6]">
              <td className="px-6 py-3 text-sm font-medium text-[#002244]">
                Current Damage Cost:
              </td>
              <td className="px-10"></td>
              <td className="px-6 py-3 text-sm font-bold text-[#002244] text-left">
                ₹{currentImageCost.toFixed(2)}
              </td>
            </tr>
            <tr className="bg-blue-400">
              <td className="px-6 py-3 text-sm font-medium text-[#002244]">
                Total Cost:
              </td>
              <td className="px-10"></td>
              <td className="px-6 py-3 text-sm font-bold text-[#002244] text-left">
                ₹{totalCost.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
  
  export default CostSummary;