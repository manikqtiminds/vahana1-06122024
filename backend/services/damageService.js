const { sql, poolPromise } = require('../config/database');

class DamageService {
  async getDamageAnnotations(referenceNo, imageName) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('referenceNo', sql.NVarChar, referenceNo)
      .input('imageName', sql.NVarChar, imageName)
      .query(`
        SELECT 
          a.MLCaseImageAssessmentId,
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
          AND a.ImageName = @imageName
      `);
    return result.recordset;
  }

  async createDamageAnnotation(data) {
    const { carPartMasterId, damageTypeId, repairReplaceId, actualCostRepair, imageName, referenceNo } = data;
    const pool = await poolPromise;
    
    const result = await pool.request()
      .input('carPartMasterId', sql.Int, carPartMasterId)
      .input('damageTypeId', sql.Int, damageTypeId)
      .input('repairReplaceId', sql.Int, repairReplaceId)
      .input('actualCostRepair', sql.Decimal(10, 2), actualCostRepair)
      .input('imageName', sql.NVarChar, imageName)
      .input('referenceNo', sql.NVarChar, referenceNo)
      .query(`
        INSERT INTO MLCaseImageAssessment (
          MLImageAssessmentID, 
          CarPartMasterID, 
          DamageTypeID, 
          RepairReplaceID, 
          ActualCostRepair, 
          ImageName
        )
        VALUES (
          (SELECT MLImageAssessmentId FROM MLImageAssessment WHERE ReferenceNo = @referenceNo),
          @carPartMasterId,
          @damageTypeId,
          @repairReplaceId,
          @actualCostRepair,
          @imageName
        );
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    return result.recordset[0].id;
  }

  async updateDamageAnnotation(id, data) {
    const { carPartMasterId, damageTypeId, repairReplaceId, actualCostRepair } = data;
    const pool = await poolPromise;
    
    await pool.request()
      .input('id', sql.Int, id)
      .input('carPartMasterId', sql.Int, carPartMasterId)
      .input('damageTypeId', sql.Int, damageTypeId)
      .input('repairReplaceId', sql.Int, repairReplaceId)
      .input('actualCostRepair', sql.Decimal(10, 2), actualCostRepair)
      .query(`
        UPDATE MLCaseImageAssessment
        SET
          CarPartMasterID = @carPartMasterId,
          DamageTypeID = @damageTypeId,
          RepairReplaceID = @repairReplaceId,
          ActualCostRepair = @actualCostRepair
        WHERE MLCaseImageAssessmentId = @id
      `);
  }

  async deleteDamageAnnotation(id) {
    const pool = await poolPromise;
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM MLCaseImageAssessment WHERE MLCaseImageAssessmentId = @id');
  }

  async getTotalCosts(referenceNo) {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('referenceNo', sql.NVarChar, referenceNo)
      .query(`
        SELECT 
          SUM(ActualCostRepair) as TotalCost,
          ImageName,
          COUNT(*) as DamageCount
        FROM MLCaseImageAssessment a
        INNER JOIN MLImageAssessment ia ON a.MLImageAssessmentID = ia.MLImageAssessmentId
        WHERE ia.ReferenceNo = @referenceNo
        GROUP BY ImageName
      `);
    return result.recordset;
  }
}

module.exports = new DamageService();