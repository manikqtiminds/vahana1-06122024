import { useState, useRef, useCallback, useEffect } from 'react';
import { Pencil, X, Trash2 } from 'lucide-react';
import useInspectionStore from '../../store/inspectionStore';
import DrawingArea from './DrawingArea';
import DrawingControls from './DrawingControls';
import DamageList from './DamageList';

function DamageEditor({ scale, position, isDrawingMode, setIsDrawingMode }) {
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selectedDamageType, setSelectedDamageType] = useState(0);
  const containerRef = useRef(null);
  const drawingRef = useRef(false);

  const { currentImage, updateDamageInfo, deleteDamageInfo } = useInspectionStore();

  const getScaledPoint = useCallback((clientX, clientY) => {
    if (!containerRef.current) return null;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scrollContainer = containerRef.current.parentElement;
    
    // Calculate the actual point in the image space
    const x = (clientX - rect.left + scrollContainer.scrollLeft - position.x) / scale;
    const y = (clientY - rect.top + scrollContainer.scrollTop - position.y) / scale;
    
    // Ensure the point is within the image bounds
    if (currentImage?.dimensions) {
      return {
        x: Math.max(0, Math.min(x, currentImage.dimensions.width)),
        y: Math.max(0, Math.min(y, currentImage.dimensions.height))
      };
    }
    
    return { x, y };
  }, [scale, position, currentImage]);

  const startDrawing = useCallback((e) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    
    const point = getScaledPoint(
      e.type.includes('touch') ? e.touches[0].clientX : e.clientX,
      e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    );
    
    if (!point) return;
    
    drawingRef.current = true;
    setStartPoint(point);
    setCurrentRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      damageType: selectedDamageType
    });
  }, [isDrawingMode, selectedDamageType, getScaledPoint]);

  const updateDrawing = useCallback((e) => {
    if (!drawingRef.current || !startPoint) return;
    e.preventDefault();
    
    const point = getScaledPoint(
      e.type.includes('touch') ? e.touches[0].clientX : e.clientX,
      e.type.includes('touch') ? e.touches[0].clientY : e.clientY
    );
    
    if (!point) return;

    setCurrentRect(prev => ({
      ...prev,
      width: point.x - startPoint.x,
      height: point.y - startPoint.y
    }));
  }, [startPoint, getScaledPoint]);

  const finishDrawing = useCallback(() => {
    if (!drawingRef.current || !currentRect) return;
    drawingRef.current = false;

    // Only save if the rectangle is large enough
    if (Math.abs(currentRect.width) > 10 && Math.abs(currentRect.height) > 10) {
      const normalizedRect = {
        x: currentRect.width < 0 ? currentRect.x + currentRect.width : currentRect.x,
        y: currentRect.height < 0 ? currentRect.y + currentRect.height : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
        damageType: currentRect.damageType
      };
      updateDamageInfo(normalizedRect);
    }

    setCurrentRect(null);
    setStartPoint(null);
  }, [currentRect, updateDamageInfo]);

  useEffect(() => {
    return () => {
      drawingRef.current = false;
      setCurrentRect(null);
      setStartPoint(null);
    };
  }, []);

  return (
    <div className="absolute inset-0" ref={containerRef}>
      <DrawingControls
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        selectedDamageType={selectedDamageType}
        setSelectedDamageType={setSelectedDamageType}
      />

      <DamageList
        damageInfo={currentImage?.damageInfo}
        onDelete={deleteDamageInfo}
      />

      <DrawingArea
        isDrawingMode={isDrawingMode}
        scale={scale}
        currentRect={currentRect}
        onMouseDown={startDrawing}
        onMouseMove={updateDrawing}
        onMouseUp={finishDrawing}
        onMouseLeave={finishDrawing}
        onTouchStart={startDrawing}
        onTouchMove={updateDrawing}
        onTouchEnd={finishDrawing}
      />
    </div>
  );
}

export default DamageEditor;