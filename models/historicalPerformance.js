const db = require('../config/mysql2');
const logger = require('../config/logger');

async function createHistoricalPerformanceTable() {
    try {
      const [rows] = await db.query("SHOW TABLES LIKE 'HistoricalPerformance';");
  
      if (rows.length === 0) {
        const createTableQuery = `
          CREATE TABLE HistoricalPerformance (
            id INT AUTO_INCREMENT PRIMARY KEY,
            vendorId INT,
            date DATE NOT NULL,
            onTimeDeliveryRate DECIMAL(5,2),
            qualityRatingAvg DECIMAL(3,2),
            averageResponseTime DECIMAL(5,2),
            fulfillmentRate DECIMAL(5,2),
            FOREIGN KEY (vendorId) REFERENCES Vendor(id)
          );
        `;
  
        await db.query(createTableQuery);
        logger.info('HistoricalPerformance table created successfully');
      } else {
        // logger.info('HistoricalPerformance table already exists');
      }
    } catch (error) {
      logger.error('Error creating HistoricalPerformance table:', error);
    }
  }
  
  createHistoricalPerformanceTable();
  
class HistoricalPerformanceModel {
  static async create(historicalPerformance) {
    const sql = `INSERT INTO HistoricalPerformance (vendorId, date, onTimeDeliveryRate, qualityRatingAvg, averageResponseTime, fulfillmentRate) VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      historicalPerformance.vendorId,
      historicalPerformance.date,
      historicalPerformance.onTimeDeliveryRate,
      historicalPerformance.qualityRatingAvg,
      historicalPerformance.averageResponseTime,
      historicalPerformance.fulfillmentRate,
    ]);
    logger.info('Historical Performance created:', { id: result.insertId });
    return result.insertId;
  }
  
  static async findByVendorId(vendorId) {
    const sql = `SELECT * FROM HistoricalPerformance WHERE vendorId = ? ORDER BY date DESC`;
    const [rows] = await db.query(sql, [vendorId]);
    logger.info('Retrieved historical performance by vendor ID:', { vendorId, count: rows.length });
    return rows;
  }

  static async update(id, performance) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(performance)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      } else {
        fields.push(`${key} = NULL`);
      }
    }
  
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
  
    const sql = `UPDATE HistoricalPerformance SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
  
    await db.execute(sql, values);
    logger.info('Historical Performance updated:', { id, updatedFields: performance });
  }
  
  static async delete(id) {
    const sql = `DELETE FROM HistoricalPerformance WHERE id = ?`;
    await db.execute(sql, [id]);
    logger.info('Historical Performance deleted:', { id });
  }
}

module.exports = HistoricalPerformanceModel;

  