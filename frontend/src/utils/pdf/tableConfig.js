export const getTableConfig = (margin) => ({
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [0, 34, 68],
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: 'bold',
      halign: 'center'
    },
    columnStyles: {
      0: { cellWidth: 120, halign: 'center' },
      1: { cellWidth: 200 },
      2: { cellWidth: 100, halign: 'center' },
      3: { cellWidth: 80, halign: 'center' },
      4: { cellWidth: 100, halign: 'right' }
    },
    margin: { left: margin, right: margin }
  });
  
  export const formatCurrency = (amount) => {
    return `₹ ${Number(amount || 0).toFixed(2)}`;
  };