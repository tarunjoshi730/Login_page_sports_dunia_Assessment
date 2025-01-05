const db = require('../config/mysql2');
const logger = require('../config/logger');

// Function to create the Vendor table
async function createVendorTable() {
  try {
    const [rows] = await db.query("SHOW TABLES LIKE 'Vendor';");

    if (rows.length === 0) {
      const createTableQuery = `
        CREATE TABLE Vendor (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          contactDetails VARCHAR(255),
          address VARCHAR(255),
          vendorCode VARCHAR(255) UNIQUE NOT NULL,
          onTimeDeliveryRate DECIMAL(5,2),
          qualityRatingAvg DECIMAL(3,2),
          averageResponseTime DECIMAL(5,2),
          fulfillmentRate DECIMAL(5,2)
        );
      `;

      await db.query(createTableQuery);
      logger.info('Vendor table created successfully');
    } else {
      // logger.info('Vendor table already exists');
    }
  } catch (error) {
    logger.error('Error creating Vendor table:', error);
  }
}

createVendorTable();


class VendorModel {
  static async generateUniqueVendorCode() {
    let isUnique = false;
    let vendorCode = '';
  
    while (!isUnique) {
      vendorCode = `VEN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const exists = await this.vendorCodeExists(vendorCode);
      if (!exists) {
        isUnique = true;
      }
    }
  
    logger.info('Generated unique vendor code:', { vendorCode });
    return vendorCode;
  }
  
  static async vendorCodeExists(vendorCode) {
    const sql = `SELECT COUNT(*) as count FROM Vendor WHERE vendorCode = ?`;
    const [rows] = await db.query(sql, [vendorCode]);
    const exists = rows[0].count > 0;
    logger.info('Checked vendor code existence:', { vendorCode, exists });
    return exists;
  }
  
  static async create(vendor) {
    const sql = `INSERT INTO Vendor (name, contactDetails, address, vendorCode, onTimeDeliveryRate, qualityRatingAvg, averageResponseTime, fulfillmentRate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.execute(sql, [
      vendor.name,
      vendor.contactDetails,
      vendor.address,
      vendor.vendorCode,
      vendor.onTimeDeliveryRate,
      vendor.qualityRatingAvg,
      vendor.averageResponseTime,
      vendor.fulfillmentRate,
    ]);
    logger.info('Vendor created:', { vendorId: result.insertId });
    return result.insertId;
  }
  
  static async findAll() {
    const sql = `SELECT * FROM Vendor`;
    const [rows] = await db.query(sql);
    logger.info('Retrieved all vendors', { vendorCount: rows.length });
    return rows;
  }

  static async findById(id) {
    const sql = `SELECT * FROM Vendor WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    const vendor = rows[0];
    if (vendor) {
      logger.info('Retrieved vendor by ID:', { id });
    } else {
      logger.warn('Vendor not found by ID:', { id });
    }
    return vendor;
  }

  static async update(id, vendor) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(vendor)) {
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
  
    const sql = `UPDATE Vendor SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
  
    await db.execute(sql, values);
    logger.info('Vendor updated:', { id, updatedFields: vendor });
  }
  
  static async delete(id) {
    const sql = `DELETE FROM Vendor WHERE id = ?`;
    await db.execute(sql, [id]);
    logger.info('Vendor deleted:', { id });
  }
}

module.exports = VendorModel;
