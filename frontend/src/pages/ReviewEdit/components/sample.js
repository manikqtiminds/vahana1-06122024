import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import useInspectionStore from '../../../store/inspectionStore';
import useImageZoom from '../../../hooks/useImageZoom';
import ImageFrame from '../../../components/ImageFrame';
import DamageEditor from '../../../components/DamageEditor';

function CenterColumn() {
  const { 
    images, 
    currentImageIndex, 
    currentImage,
    loading, 
    error,
    setCurrentImageIndex 
  } = useInspectionStore();

  const {
    scale,
    position,
    isDragging,
    isDrawingMode,
    setIsDrawingMode,
    zoomIn,
    zoomOut,
    resetZoom,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  } = useImageZoom();

  const handlePrevious = () => {
    setCurrentImageIndex(currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1);
    resetZoom();
  };

  const handleNext = () => {
    setCurrentImageIndex(currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0);
    resetZoom();
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading images...</p>
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

  if (!images.length || !currentImage) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Zoom Controls */}
      <div className="flex items-center justify-end gap-2 p-2 bg-gray-50 border-b">
        <button
          onClick={zoomOut}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={zoomIn}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={resetZoom}
          className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      {/* Image Container */}
      <div className="relative flex-1 bg-gray-100">
        {/* Navigation Buttons */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div className="absolute inset-0 overflow-auto scrollbar-custom">
          {/* Zoomable Content Container */}
          <div 
            className={`min-h-full min-w-full flex items-center justify-center ${!isDrawingMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
            onMouseDown={!isDrawingMode ? handleMouseDown : undefined}
            onMouseMove={!isDrawingMode ? handleMouseMove : undefined}
            onMouseUp={!isDrawingMode ? handleMouseUp : undefined}
            onMouseLeave={!isDrawingMode ? handleMouseUp : undefined}
          >
            {/* Transform Container */}
            <div
              className="relative"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <ImageFrame image={currentImage} />
              <DamageEditor 
                scale={scale} 
                position={position} 
                isDrawingMode={isDrawingMode}
                setIsDrawingMode={setIsDrawingMode}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-2 bg-gray-50 border-t flex items-center justify-between text-sm">
        <div>
          <span className="text-gray-600">
            Image {currentImageIndex + 1} of {images.length}
          </span>
          <span className="mx-2 text-gray-400">|</span>
          <span className="text-gray-500">{currentImage.imageName}</span>
        </div>
        <div className="text-gray-500">
          Zoom: {Math.round(scale * 100)}%
        </div>
      </div>
    </div>
  );
}

export default CenterColumn;