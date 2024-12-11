export const getScaledPoint = (e, element, scale, position) => {
  if (!element) return null;

  const rect = element.getBoundingClientRect();
  const scrollContainer = element.parentElement;
  const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
  const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;

  const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
  const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

  const x = (clientX - rect.left + scrollLeft - (position?.x || 0)) / scale;
  const y = (clientY - rect.top + scrollTop - (position?.y || 0)) / scale;

  return { x, y };
};

export const normalizeRect = (rect) => {
  if (!rect) return null;

  return {
    x: rect.width < 0 ? rect.x + rect.width : rect.x,
    y: rect.height < 0 ? rect.y + rect.height : rect.y,
    width: Math.abs(rect.width),
    height: Math.abs(rect.height),
    damageType: rect.damageType
  };
};