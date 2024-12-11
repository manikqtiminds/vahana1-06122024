const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/database');

router.get('/:referenceNo', async (req, res) => {
  const { referenceNo } = req.params;

  try {
    const pool = await poolPromise;
    
    // Get all damage assessments for the reference number
    const result = await pool.request()
      .input('referenceNo', sql.NVarChar, referenceNo)
      .query(`
        SELECT 
          a.MLCaseImageAssessmentId,
          a.ImageName,
          a.CarPartMasterID,
          cp.CarPartName,
          cp.PartType,
          a.DamageTypeID,
          a.RepairReplaceID,
          a.ActualCostRepair
        FROM MLCaseImageAssessment a
        INNER JOIN MLImageAssessment ia ON a.MLImageAssessmentID = ia.MLImageAssessmentId
        INNER JOIN CarPartMaster cp ON a.CarPartMasterID = cp.CarPartMasterID
        WHERE ia.ReferenceNo = @referenceNo
        ORDER BY a.ImageName, cp.CarPartName
      `);

    if (!result.recordset.length) {
      return res.json({
        referenceNo,
        assessments: [],
        imageTotals: [],
        totalCost: 0
      });
    }

    // Calculate totals
    const totalResult = await pool.request()
      .input('referenceNo', sql.NVarChar, referenceNo)
      .query(`
        SELECT 
          ImageName,
          SUM(ISNULL(ActualCostRepair, 0)) as ImageTotal
        FROM MLCaseImageAssessment a
        INNER JOIN MLImageAssessment ia ON a.MLImageAssessmentID = ia.MLImageAssessmentId
        WHERE ia.ReferenceNo = @referenceNo
        GROUP BY ImageName
      `);

    const reportData = {
      referenceNo,
      assessments: result.recordset,
      imageTotals: totalResult.recordset,
      totalCost: totalResult.recordset.reduce((sum, item) => sum + (item.ImageTotal || 0), 0)
    };

    console.log('Generated report data:', reportData);
    res.json(reportData);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ 
      error: 'Failed to generate report',
      message: error.message 
    });
  }
});

module.exports = router;