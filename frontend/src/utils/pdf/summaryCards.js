export function generateSummaryCards(doc, summary, startY) {
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40;
    const cardWidth = (pageWidth - (margin * 4)) / 3;
    
    // Common styles
    const titleStyle = {
      fontSize: 12,
      fontStyle: 'bold',
      textColor: [0, 34, 68]
    };
    
    const labelStyle = {
      fontSize: 10,
      textColor: [75, 85, 99]
    };
    
    const valueStyle = {
      fontSize: 10,
      fontStyle: 'bold',
      textColor: [0, 0, 0]
    };
  
    // Draw cards
    const cards = [
      {
        title: 'Repair Summary',
        items: [
          { label: 'Number of Repairs:', value: summary.repairs.count },
          { label: 'Total Repair Cost:', value: `₹${summary.repairs.cost.toFixed(2)}` }
        ]
      },
      {
        title: 'Replacement Summary',
        items: [
          { label: 'Number of Replacements:', value: summary.replacements.count },
          { label: 'Total Replacement Cost:', value: `₹${summary.replacements.cost.toFixed(2)}` }
        ]
      },
      {
        title: 'Assessment Statistics',
        items: [
          { label: 'Total Parts Affected:', value: summary.uniqueParts },
          { label: 'Total Damages:', value: summary.totalDamages },
          { label: 'Images Assessed:', value: summary.totalImages }
        ]
      }
    ];
  
    cards.forEach((card, index) => {
      const x = margin + (index * (cardWidth + margin));
      let y = startY + 20;
  
      // Card background
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x, startY, cardWidth, 120, 3, 3, 'F');
      
      // Title
      doc.setFontSize(titleStyle.fontSize);
      doc.setFont('helvetica', titleStyle.fontStyle);
      doc.setTextColor(...titleStyle.textColor);
      doc.text(card.title, x + 10, y);
      
      // Items
      y += 25;
      card.items.forEach(item => {
        // Label
        doc.setFontSize(labelStyle.fontSize);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...labelStyle.textColor);
        doc.text(item.label, x + 10, y);
        
        // Value
        doc.setFontSize(valueStyle.fontSize);
        doc.setFont('helvetica', valueStyle.fontStyle);
        doc.setTextColor(...valueStyle.textColor);
        doc.text(item.value.toString(), x + cardWidth - 10, y, { align: 'right' });
        
        y += 20;
      });
    });
  
    return startY + 140; // Return the final Y position
  }