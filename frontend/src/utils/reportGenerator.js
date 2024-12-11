import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";

export const generateDamageReport = (referenceNo, images, annotations) => {
  try {
    console.log("Generating report with:", { referenceNo, annotations });

    // Create PDF in landscape mode
    const doc = new jsPDF("l", "pt", "a4");
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 40;

    // Header
    doc.setFillColor(0, 34, 68); // #002244
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("Car Damage Assessment Report", pageWidth / 2, 40, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.text("Car Inspection System", pageWidth / 2, 65, { align: "center" });

    let yPos = 100;

    // Report Information
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Group assessments by image
    const groups = {};
    annotations.forEach((assessment) => {
      if (!groups[assessment.ImageName]) {
        groups[assessment.ImageName] = [];
      }
      groups[assessment.ImageName].push(assessment);
    });

    // Table configuration
    const tableConfig = {
      startY: yPos + 20,
      head: [["Image", "Part", "Damage Type", "Action", "Cost"]],
      body: [],
      theme: "grid",
      headStyles: {
        fillColor: [0, 34, 68],
        textColor: [255, 255, 255],
        fontSize: 11,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 120, halign: "center" },
        1: { cellWidth: 200 },
        2: { cellWidth: 100, halign: "center" },
        3: { cellWidth: 80, halign: "center" },
        4: { cellWidth: 100, halign: "center" },
      },
      margin: { left: margin, right: margin },
      didParseCell: function (data) {
        if (data.section === "head" && data.column.index === 4) {
          data.cell.text = ["Cost", "(₹)"];
        }
        if (data.section === "body") {
          const row = data.row.raw;
          if (row.isSubtotal) {
            data.cell.styles.fontStyle = "bold";
            data.cell.styles.fillColor =
              row.groupIndex % 2 === 0 ? [245, 245, 245] : [240, 240, 240];
            if (data.column.index === 4) {
              data.cell.styles.halign = "center";
            }
          } else {
            if (data.column.index === 0 && row.isFirstInGroup) {
              data.cell.rowSpan = row.groupSize + 1; // +1 for subtotal row
              data.cell.styles.fillColor =
                row.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 249, 249];
              data.cell.styles.valign = "middle";
              data.cell.styles.halign = "center";
            }
            if (data.column.index === 4) {
              data.cell.styles.halign = "center";
              if (
                typeof data.cell.raw === "string" &&
                data.cell.raw.startsWith("₹")
              ) {
                data.cell.text = data.cell.raw;
              }
            }
            data.cell.styles.fillColor =
              row.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 249, 249];
          }
        }
      },
      willDrawCell: function (data) {
        if (data.section === "body") {
          const row = data.row.raw;
          if (row && !row.isSubtotal) {
            data.cell.styles.fillColor =
              row.groupIndex % 2 === 0 ? [255, 255, 255] : [249, 249, 249];
          }
        }
      },
    };

    // Prepare table data
    let groupIndex = 0;
    Object.entries(groups).forEach(([imageName, damages]) => {
      // Add damage rows
      damages.forEach((damage, index) => {
        const row = [
          damage.ImageName,
          damage.CarPartName,
          getDamageTypeLabel(damage.DamageTypeID),
          getRepairTypeLabel(damage.RepairReplaceID),
          `₹${damage.ActualCostRepair?.toFixed(2) || "0.00"}`,
        ];

        Object.assign(row, {
          isFirstInGroup: index === 0,
          groupSize: damages.length,
          groupIndex,
        });

        tableConfig.body.push(row);
      });

      // Add subtotal row for the image
      const subtotal = damages.reduce(
        (sum, damage) => sum + (damage.ActualCostRepair || 0),
        0
      );
      const subtotalRow = [
        imageName,
        { content: "Subtotal:", colSpan: 3, styles: { halign: "right" } },
        `₹${subtotal.toFixed(2)}`,
      ];
      Object.assign(subtotalRow, {
        isSubtotal: true,
        groupIndex,
      });
      tableConfig.body.push(subtotalRow);

      groupIndex++;
    });

    // Calculate total cost
    const totalCost = annotations.reduce(
      (sum, damage) => sum + (damage.ActualCostRepair || 0),
      0
    );

    // Add total row
    tableConfig.foot = [
      [
        {
          content: "Total Assessment Cost:",
          colSpan: 4,
          styles: {
            halign: "right",
            fillColor: [0, 34, 68],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
        },
        {
          content: `₹${totalCost.toFixed(2)}`,
          styles: {
            halign: "center",
            fillColor: [0, 34, 68],
            textColor: [255, 255, 255],
            fontStyle: "bold",
          },
        },
      ],
    ];

    // Generate table
    doc.autoTable(tableConfig);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Generated on ${format(new Date(), "dd/MM/yyyy HH:mm:ss")}`,
      pageWidth - margin,
      pageHeight - 20,
      { align: "right" }
    );

    return doc;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF report");
  }
};

function getDamageTypeLabel(type) {
  const types = {
    0: "Scratch",
    1: "Dent",
    2: "Broken",
  };
  return types[type] || "NA";
}

function getRepairTypeLabel(type) {
  const types = {
    0: "Repair",
    1: "Replace",
  };
  return types[type] || "NA";
}
