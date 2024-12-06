import { useState, useRef, useCallback, useEffect } from "react";
import useInspectionStore from "../../store/inspectionStore";
import DrawingControls from './DrawingControls';
import DamageList from './DamageList';
import DrawingArea from './DrawingArea';

function DamageEditor({ scale, position, isDrawingMode, setIsDrawingMode }) {
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selectedDamageType, setSelectedDamageType] = useState(0);
  const containerRef = useRef(null);
  const drawingRef = useRef(false);

  const { currentImage, updateDamageInfo, deleteDamageInfo } =
    useInspectionStore();

  const getScaledPoint = useCallback(
    (clientX, clientY) => {
      if (!containerRef.current) return null;

      const rect = containerRef.current.getBoundingClientRect();
      const scrollContainer = containerRef.current.parentElement;

      // Calculate the actual point in the image space
      const x =
        (clientX - rect.left + scrollContainer.scrollLeft - position.x) / scale;
      const y =
        (clientY - rect.top + scrollContainer.scrollTop - position.y) / scale;

      // Ensure the point is within the image bounds
      if (currentImage?.dimensions) {
        return {
          x: Math.max(0, Math.min(x, currentImage.dimensions.width)),
          y: Math.max(0, Math.min(y, currentImage.dimensions.height)),
        };
      }

      return { x, y };
    },
    [scale, position, currentImage]
  );

  const startDrawing = useCallback(
    (point) => {
      if (!isDrawingMode || !point) return;
      drawingRef.current = true;
      setStartPoint(point);
      setCurrentRect({
        x: point.x,
        y: point.y,
        width: 0,
        height: 0,
        damageType: selectedDamageType,
      });
    },
    [isDrawingMode, selectedDamageType]
  );

  const updateDrawing = useCallback(
    (point) => {
      if (!drawingRef.current || !startPoint || !point) return;

      const width = point.x - startPoint.x;
      const height = point.y - startPoint.y;

      setCurrentRect((prev) => ({
        ...prev,
        width,
        height,
      }));
    },
    [startPoint]
  );

  const finishDrawing = useCallback(() => {
    if (!drawingRef.current || !currentRect) return;
    drawingRef.current = false;

    // Only save if the rectangle is large enough
    if (Math.abs(currentRect.width) > 10 && Math.abs(currentRect.height) > 10) {
      const normalizedRect = {
        x:
          currentRect.width < 0
            ? currentRect.x + currentRect.width
            : currentRect.x,
        y:
          currentRect.height < 0
            ? currentRect.y + currentRect.height
            : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
        damageType: currentRect.damageType,
      };
      updateDamageInfo(normalizedRect);
    }

    setCurrentRect(null);
    setStartPoint(null);
  }, [currentRect, updateDamageInfo]);

  const handleMouseDown = useCallback(
    (e) => {
      if (!isDrawingMode) return;
      e.preventDefault();
      const point = getScaledPoint(e.clientX, e.clientY);
      startDrawing(point);
    },
    [isDrawingMode, getScaledPoint, startDrawing]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const point = getScaledPoint(e.clientX, e.clientY);
      updateDrawing(point);
    },
    [getScaledPoint, updateDrawing]
  );

  const handleMouseUp = useCallback(() => {
    finishDrawing();
  }, [finishDrawing]);

  const handleTouchStart = useCallback(
    (e) => {
      if (!isDrawingMode) return;
      e.preventDefault();
      const touch = e.touches[0];
      const point = getScaledPoint(touch.clientX, touch.clientY);
      startDrawing(point);
    },
    [isDrawingMode, getScaledPoint, startDrawing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!drawingRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];
      const point = getScaledPoint(touch.clientX, touch.clientY);
      updateDrawing(point);
    },
    [getScaledPoint, updateDrawing]
  );

  const handleTouchEnd = useCallback(() => {
    finishDrawing();
  }, [finishDrawing]);

  useEffect(() => {
    return () => {
      drawingRef.current = false;
      setCurrentRect(null);
      setStartPoint(null);
    };
  }, []);

  const handleDelete = (index) => {
    deleteDamageInfo(index);
  };

  return (
    <div className="absolute inset-0" ref={containerRef}>
      {/* Drawing Controls */}
      <DrawingControls
        isDrawingMode={isDrawingMode}
        setIsDrawingMode={setIsDrawingMode}
        selectedDamageType={selectedDamageType}
        setSelectedDamageType={setSelectedDamageType}
      />

      {/* Damage List */}
      {currentImage?.damageInfo?.length > 0 && !isDrawingMode && (
        <DamageList damageInfo={currentImage.damageInfo} onDelete={handleDelete} />
      )}

      {/* Drawing Area */}
      <DrawingArea
        isDrawingMode={isDrawingMode}
        scale={scale}
        position={position}
        currentRect={currentRect}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleTouchStart={handleTouchStart}
        handleTouchMove={handleTouchMove}
        handleTouchEnd={handleTouchEnd}
      />
    </div>
  );
}

export default DamageEditor;
