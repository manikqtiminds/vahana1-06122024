import { useState, useCallback, useEffect } from 'react';
import { normalizeRect } from '../utils';

export function useDrawing({ onSave }) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selectedDamageType, setSelectedDamageType] = useState(0);

  const startDrawing = useCallback((point) => {
    console.log('Starting drawing at:', point);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentRect({
      x: point.x,
      y: point.y,
      width: 0,
      height: 0,
      damageType: selectedDamageType
    });
  }, [selectedDamageType]);

  const updateDrawing = useCallback((point) => {
    if (!isDrawing || !startPoint) {
      console.log('Cannot update drawing:', { hasStartPoint: !!startPoint, isDrawing });
      return;
    }

    setCurrentRect(prev => ({
      ...prev,
      width: point.x - startPoint.x,
      height: point.y - startPoint.y
    }));
  }, [isDrawing, startPoint]);

  const finishDrawing = useCallback(() => {
    if (!isDrawing || !currentRect) {
      console.log('Cannot finish drawing:', { hasCurrentRect: !!currentRect, isDrawing });
      return;
    }

    const normalized = normalizeRect(currentRect);
    if (normalized.width > 10 && normalized.height > 10) {
      console.log('Saving drawing:', normalized);
      onSave(normalized);
    } else {
      console.log('Drawing too small, discarding');
    }

    setIsDrawing(false);
    setCurrentRect(null);
    setStartPoint(null);
  }, [isDrawing, currentRect, onSave]);

  // Handle global mouse up to ensure drawing finishes even if mouse leaves canvas
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawing) {
        console.log('Global mouse up detected');
        finishDrawing();
      }
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      setIsDrawing(false);
      setCurrentRect(null);
      setStartPoint(null);
    };
  }, [isDrawing, finishDrawing]);

  return {
    isDrawing,
    currentRect,
    selectedDamageType,
    setSelectedDamageType,
    startDrawing,
    updateDrawing,
    finishDrawing
  };
}