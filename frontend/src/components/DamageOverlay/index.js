import { memo } from 'react';

function DamageOverlay({ damageInfo, imageDimensions, frameDimensions }) {
  if (!damageInfo || !imageDimensions || !frameDimensions) return null;

  const scaleX = frameDimensions.width / imageDimensions.width;
  const scaleY = frameDimensions.height / imageDimensions.height;

  const getDamageColor = (damageType) => {
    switch (damageType) {
      case 0: return { border: '#22c55e', bg: 'rgba(34, 197, 94, 0.2)' }; // Green for Scratch
      case 1: return { border: '#eab308', bg: 'rgba(234, 179, 8, 0.2)' };  // Yellow for Dent
      case 2: return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)' };  // Red for Broken
      default: return { border: '#9ca3af', bg: 'rgba(156, 163, 175, 0.2)' }; // Gray for unknown
    }
  };

  const getDamageLabel = (damageType) => {
    switch (damageType) {
      case 0: return 'Scratch';
      case 1: return 'Dent';
      case 2: return 'Broken';
      default: return 'Unknown';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {damageInfo.map((damage, index) => {
        if (!damage?.coordinates) return null;

        const { x, y, width, height } = damage.coordinates;
        const color = getDamageColor(damage.damageType);
        const label = getDamageLabel(damage.damageType);

        const scaledX = Math.round(x * scaleX);
        const scaledY = Math.round(y * scaleY);
        const scaledWidth = Math.round(width * scaleX);
        const scaledHeight = Math.round(height * scaleY);

        return (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${scaledX}px`,
              top: `${scaledY}px`,
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
              border: `2px solid ${color.border}`,
              backgroundColor: color.bg,
            }}
          >
            <div 
              className="absolute left-0 -top-6 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
              style={{
                transform: 'translateY(-2px)',
              }}
            >
              <div className="flex items-center gap-1">
                <span 
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: color.border }}
                />
                {label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(DamageOverlay);