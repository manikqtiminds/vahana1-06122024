import { useEffect } from 'react';
import useInspectionStore from '../../../store/inspectionStore';

function LeftColumn() {
  const { 
    images, 
    currentImageIndex, 
    loading, 
    error,
    setCurrentImageIndex 
  } = useInspectionStore();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-2">
        <p className="text-sm text-gray-500">Loading images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center p-2">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] w-full">
      <div className="h-full [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-track]:bg-gray-200 [&::-webkit-scrollbar-thumb]:bg-blue-300 overflow-x-auto overflow-y-hidden md:overflow-y-auto md:overflow-x-hidden">
        <div className="flex flex-row md:flex-col gap-2 p-[2px] mb-3 md:mb-0 items-center">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`
                thumbnail-container
                relative
                w-[60px] h-[60px]
                flex-shrink-0
                rounded-lg
                overflow-hidden
                transition
                hover:ring-2 hover:ring-blue-400
                focus:outline-none
                ${index === currentImageIndex ? 'ring-2 ring-blue-500' : ''}
              `}
            >
              <img
                src={image.imageUrl}
                alt={`Car view ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-1 right-1 text-[10px] text-white bg-black/50 px-1 rounded">
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftColumn;