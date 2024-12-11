export function generateDamageTable(doc, groupedAssessments, startY) {
    const tableConfig = {
      startY,
      margin: { top: 40, right: 40, bottom: 40, left: 40 },
      head: [['Image', 'Part', 'Damage Type', 'Action', 'Cost (₹)']],
      body: [],
      theme: 'grid',
      headStyles: {
        fillColor: [0, 34, 68],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: 'bold',
        cellPadding: { top: 8, right: 6, bottom: 8, left: 6 },
        lineWidth: 1,
        lineColor: [0, 34, 68]
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: { top: 6, right: 6, bottom: 6, left: 6 },
        lineWidth: 0.5,
        lineColor: [220, 220, 220]
      },
      columnStyles: {
        0: { cellWidth: 'auto', minCellWidth: 100, fontStyle: 'bold' },
        1: { cellWidth: 'auto', minCellWidth: 160 },
        2: { cellWidth: 'auto', minCellWidth: 100 },
        3: { cellWidth: 'auto', minCellWidth: 80 },
        4: { cellWidth: 'auto', minCellWidth: 100, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      tableWidth: 'auto',
      pageBreak: 'auto',
      rowPageBreak: 'avoid',
      showHead: 'everyPage',
      didParseCell: function(data) {
        // Handle cell merging and styling for image column
        if (data.section === 'body') {
          const rowInfo = tableConfig.body[data.row.index];
          
          if (data.column.index === 0) {
            if (rowInfo.isFirstInGroup) {
              data.cell.styles.fillColor = rowInfo.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
              data.cell.rowSpan = rowInfo.groupSize;
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.lineWidth = 1;
              data.cell.styles.lineColor = [200, 200, 200];
            } else {
              data.cell.rowSpan = 0;
            }
          } else {
            data.cell.styles.fillColor = rowInfo.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
          }
        }
      },
      didDrawCell: function(data) {
        // Add group separator lines
        if (data.section === 'body' && data.column.index === 0) {
          const rowInfo = tableConfig.body[data.row.index];
          if (rowInfo.isFirstInGroup) {
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(1);
            doc.line(
              data.cell.x,
              data.cell.y,
              data.cell.x + data.table.width,
              data.cell.y
            );
          }
        }
      },
      willDrawCell: function(data) {
        // Ensure proper cell background
        if (data.section === 'body') {
          const rowInfo = tableConfig.body[data.row.index];
          if (rowInfo) {
            data.cell.styles.fillColor = rowInfo.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 250, 251];
          }
        }
      }
    };
  
    // Prepare table data with group information
    let currentGroupIndex = 0;
    groupedAssessments.forEach((group) => {
      const groupSize = group.damages.length;
      group.damages.forEach((damage, index) => {
        const row = [
          damage.ImageName,
          damage.CarPartName,
          getDamageTypeLabel(damage.DamageTypeID),
          getRepairTypeLabel(damage.RepairReplaceID),
          damage.ActualCostRepair?.toFixed(2) || '0.00'
        ];
        
        // Add metadata for styling
        Object.assign(row, {
          groupIndex: currentGroupIndex,
          isFirstInGroup: index === 0,
          isLastInGroup: index === groupSize - 1,
          groupSize: groupSize
        });
        
        tableConfig.body.push(row);
      });
      currentGroupIndex++;
    });
  
    // Add total row
    const totalCost = groupedAssessments.reduce((sum, group) => 
      sum + group.damages.reduce((groupSum, damage) => 
        groupSum + (damage.ActualCostRepair || 0), 0), 0
    );
  
    tableConfig.foot = [[
      { 
        content: 'Total Assessment Cost:', 
        colSpan: 4, 
        styles: { 
          halign: 'right', 
          fillColor: [0, 34, 68], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          fontSize: 11,
          cellPadding: { top: 8, right: 6, bottom: 8, left: 6 }
        }
      },
      { 
        content: `₹${totalCost.toFixed(2)}`, 
        styles: { 
          halign: 'right', 
          fillColor: [0, 34, 68], 
          textColor: [255, 255, 255], 
          fontStyle: 'bold',
          fontSize: 11,
          cellPadding: { top: 8, right: 6, bottom: 8, left: 6 }
        }
      }
    ]];
  
    doc.autoTable(tableConfig);
    return doc.lastAutoTable.finalY;
  }
  
  function getDamageTypeLabel(type) {
    const types = {
      0: 'Scratch',
      1: 'Dent',
      2: 'Broken'
    };
    return types[type] || 'NA';
  }
  
  function getRepairTypeLabel(type) {
    const types = {
      0: 'Repair',
      1: 'Replace'
    };
    return types[type] || 'NA';
  }