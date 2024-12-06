export function DamageTypeIndicator({ type }) {
    const getTypeInfo = (damageType) => {
      switch (parseInt(damageType)) {
        case 0:
          return { label: 'Scratch', color: '#22c55e' };
        case 1:
          return { label: 'Dent', color: '#eab308' };
        case 2:
          return { label: 'Broken', color: '#ef4444' };
        default:
          return { label: 'Unknown', color: '#9ca3af' };
      }
    };
  
    const typeInfo = getTypeInfo(type);
  
    return (
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: typeInfo.color }}
        />
        <span className="text-sm">{typeInfo.label}</span>
      </div>
    );
  }