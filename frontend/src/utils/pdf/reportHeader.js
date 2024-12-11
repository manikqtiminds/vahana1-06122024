import { format } from 'date-fns';

export function generateReportHeader(doc, referenceNo, summary) {
  const pageWidth = doc.internal.pageSize.width;
  const margin = 40;

  // Header background
  doc.setFillColor(0, 34, 68); // #002244
  doc.rect(0, 0, pageWidth, 100, 'F');

  // Report Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Car Damage Assessment Report', pageWidth / 2, 40, { align: 'center' });

  // Report Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Reference Number: ${referenceNo}`, margin, 65);
  doc.text(`Assessment Date: ${format(new Date(), 'dd/MM/yyyy')}`, margin, 80);
  doc.text(`Total Images: ${summary.totalImages}`, margin, 95);

  // Quick Stats
  const statsX = pageWidth - margin - 120;
  doc.setFillColor(255, 255, 255, 0.1);
  
  // Total Damages Box
  doc.roundedRect(statsX, 55, 120, 40, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.text(summary.totalDamages.toString(), statsX + 60, 75, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Total Damages', statsX + 60, 90, { align: 'center' });

  return 120; // Return the height used
}