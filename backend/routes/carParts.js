const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../config/database');

// Fetch car parts
router.get('/', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT 
        CarPartMasterID,
        CarPartName,
        CASE 
          WHEN PartType = 'Metal' THEN 'Metal'
          WHEN PartType = 'Plastic' THEN 'Plastic'
          ELSE 'NA'
        END as PartType
      FROM [db_motor].[dbo].[CarPartMaster]
      ORDER BY CarPartName
    `);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching car parts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch cost of repair
router.get('/costofrepair', async (req, res) => {
  const { carPartMasterId, damageTypeId, repairReplaceId } = req.query;

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('carPartMasterId', sql.Int, carPartMasterId)
      .input('damageTypeId', sql.Int, damageTypeId)
      .input('repairReplaceId', sql.Int, repairReplaceId)
      .query(`
        SELECT CostOfRepair
        FROM [db_motor].[dbo].[CostOfRepair]
        WHERE CarPartMasterId = @carPartMasterId
          AND DamageTypeId = @damageTypeId
          AND RepairReplaceId = @repairReplaceId;
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.json({ CostOfRepair: 0 });
    }
  } catch (error) {
    console.error('Error fetching repair cost:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;