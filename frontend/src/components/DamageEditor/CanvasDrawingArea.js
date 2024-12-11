import { useRef, useEffect, useCallback } from 'react';
import { DAMAGE_TYPES } from './constants';

function CanvasDrawingArea({
  isDrawingMode,
  currentImage,
  currentRect,
  damageInfo,
  onStartDrawing,
  onUpdateDrawing,
  onFinishDrawing
}) {
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!currentImage?.imageUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();

    image.onload = () => {
      imageRef.current = image;
      canvas.width = image.width;
      canvas.height = image.height;
      redrawCanvas();
    };

    image.src = currentImage.imageUrl;
  }, [currentImage?.imageUrl]);

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const image = imageRef.current;
    if (!ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    if (damageInfo) {
      damageInfo.forEach(damage => {
        const { coordinates, damageType } = damage;
        ctx.strokeStyle = DAMAGE_TYPES[damageType].color;
        ctx.fillStyle = `${DAMAGE_TYPES[damageType].color}20`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(coordinates.x, coordinates.y, coordinates.width, coordinates.height);
        ctx.fill();
        ctx.stroke();
      });
    }

    if (currentRect) {
      ctx.strokeStyle = DAMAGE_TYPES[currentRect.damageType].color;
      ctx.fillStyle = `${DAMAGE_TYPES[currentRect.damageType].color}20`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(currentRect.x, currentRect.y, currentRect.width, currentRect.height);
      ctx.fill();
      ctx.stroke();
    }
  }, [currentRect, damageInfo]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, currentRect, damageInfo]);

  const getCanvasPoint = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (point) onStartDrawing(point);
  }, [isDrawingMode, getCanvasPoint, onStartDrawing]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (point) onUpdateDrawing(point);
  }, [isDrawingMode, getCanvasPoint, onUpdateDrawing]);

  const handleMouseUp = useCallback((e) => {
    if (!isDrawingMode) return;
    e.preventDefault();
    onFinishDrawing();
  }, [isDrawingMode, onFinishDrawing]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: isDrawingMode ? 'auto' : 'none',
        zIndex: 999
      }}
      className={isDrawingMode ? 'cursor-crosshair' : ''}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
}

export default CanvasDrawingArea;
