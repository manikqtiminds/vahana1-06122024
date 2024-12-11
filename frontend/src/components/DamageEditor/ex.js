import { useCallback, useRef } from 'react';

function DrawingArea({ 
  isDrawingMode,
  scale,
  currentRect,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd
}) {
  const areaRef = useRef(null);
  
  const damageTypes = [
    { id: 0, color: '#22c55e' }, // Scratch - Green
    { id: 1, color: '#eab308' }, // Dent - Yellow
    { id: 2, color: '#ef4444' }  // Broken - Red
  ];

  const getDisplayRect = useCallback(() => {
    if (!currentRect) return null;

    // Calculate the display rectangle position and size
    const displayRect = {
      left: Math.min(currentRect.x, currentRect.x + currentRect.width) * scale,
      top: Math.min(currentRect.y, currentRect.y + currentRect.height) * scale,
      width: Math.abs(currentRect.width) * scale,
      height: Math.abs(currentRect.height) * scale,
    };

    return {
      left: `${displayRect.left}px`,
      top: `${displayRect.top}px`,
      width: `${displayRect.width}px`,
      height: `${displayRect.height}px`,
      borderColor: damageTypes[currentRect.damageType].color,
      backgroundColor: `${damageTypes[currentRect.damageType].color}20`
    };
  }, [currentRect, scale, damageTypes]);

  const handleMouseDown = (e) => {
    if (!isDrawingMode || !areaRef.current) return;
    
    const rect = areaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    onMouseDown(e);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingMode || !areaRef.current) return;
    
    const rect = areaRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    onMouseMove(e);
  };

  const handleMouseUp = (e) => {
    if (!isDrawingMode) return;
    onMouseUp(e);
  };

  const handleMouseLeave = (e) => {
    if (!isDrawingMode) return;
    onMouseUp(e);
  };


  const handleTouchStart = (e) => {
    if (!isDrawingMode || !areaRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = areaRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    onTouchStart(e);
  };

  const handleTouchMove = (e) => {
    if (!isDrawingMode || !areaRef.current) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = areaRef.current.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / scale;
    const y = (touch.clientY - rect.top) / scale;
    
    onTouchMove(e);
  };

  if (!isDrawingMode) return null;

  return (
    <div
      ref={areaRef}
      className="absolute inset-0 cursor-crosshair touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      // onMouseUp={onMouseUp}
      // onMouseLeave={onMouseUp}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {currentRect && (
        <div
          className="absolute border-2 pointer-events-none"
          style={getDisplayRect()}
        />
      )}
    </div>
  );
}

export default DrawingArea;