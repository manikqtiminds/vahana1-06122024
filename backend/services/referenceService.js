const { sql, poolPromise } = require('../config/database');

class ReferenceService {
  async getAllReferenceNumbers() {
    const pool = await poolPromise;
    const result = await pool.request().query(
      'SELECT Distinct ReferenceNo FROM [db_motor].[dbo].[MLImageAssessment]'
    );
    return result.recordset.map((row) => row.ReferenceNo);
  }

  async checkReferenceExists(referenceNo) {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('ReferenceNo', sql.VarChar, referenceNo)
      .query(
        'SELECT COUNT(1) as count FROM [db_motor].[dbo].[MLImageAssessment] WHERE ReferenceNo = @ReferenceNo'
      );
    return result.recordset[0].count > 0;
  }
}

module.exports = new ReferenceService();