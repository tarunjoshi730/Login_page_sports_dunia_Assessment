const pool = require('../config/mysql2');
const logger = require('../config/logger');

async function createPurchaseOrderTable() {
  try {
    const [rows] = await pool.query("SHOW TABLES LIKE 'PurchaseOrder';");

    if (rows.length === 0) {
      const createTableQuery = `
        CREATE TABLE PurchaseOrder (
          id INT AUTO_INCREMENT PRIMARY KEY,
          poNumber VARCHAR(255) UNIQUE NOT NULL,
          vendorId INT,
          orderDate DATE,
          deliveryDate DATE,
          items JSON,
          quantity INT,
          status ENUM('pending', 'completed', 'canceled') NOT NULL,
          qualityRating DECIMAL(5,2),
          issueDate DATE,
          acknowledgmentDate DATE,
          FOREIGN KEY (vendorId) REFERENCES Vendor(id)
        );
      `;

      await pool.query(createTableQuery);
      console.log('PurchaseOrder table created successfully.');
    } else {
      // console.log('PurchaseOrder table already exists');
    }
  } catch (error) {
    console.error('Error creating PurchaseOrder table:', error.message);
  }
}

createPurchaseOrderTable();


class PurchaseOrderModel {
  static async generateUniquePONumber() {
    let isUnique = false;
    let poNumber = '';
  
    while (!isUnique) {
      poNumber = `PO-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const exists = await this.poNumberExists(poNumber);
      if (!exists) {
        isUnique = true;
      }
    }
  
    return poNumber;
  }

  static async poNumberExists(poNumber) {
    const sql = `SELECT COUNT(*) as count FROM PurchaseOrder WHERE poNumber = ?`;
    const [rows] = await pool.query(sql, [poNumber]);
    return rows[0].count > 0;
  }

  static async create(purchaseOrder) {
    if (!purchaseOrder.poNumber || !purchaseOrder.vendorId || !purchaseOrder.orderDate || !purchaseOrder.deliveryDate ||
        purchaseOrder.items === undefined || purchaseOrder.quantity === undefined || !purchaseOrder.status || 
        purchaseOrder.issueDate === undefined || purchaseOrder.acknowledgmentDate === undefined) {
      throw new Error('All required fields must be provided');
    }

    const sql = `INSERT INTO PurchaseOrder (poNumber, vendorId, orderDate, deliveryDate, items, quantity, status, qualityRating, issueDate, acknowledgmentDate) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(sql, [
      purchaseOrder.poNumber,
      purchaseOrder.vendorId,
      purchaseOrder.orderDate,
      purchaseOrder.deliveryDate,
      JSON.stringify(purchaseOrder.items),
      purchaseOrder.quantity,
      purchaseOrder.status,
      purchaseOrder.qualityRating,
      purchaseOrder.issueDate,
      purchaseOrder.acknowledgmentDate,
    ]);
    logger.info('Purchase Order created:', { poNumber: purchaseOrder.poNumber });
    return result.insertId;
  }

  static async findAll() {
    try {
      const sql = `SELECT * FROM PurchaseOrder;`;
      const [rows] = await pool.query(sql);
      logger.info('Retrieved all purchase orders', { count: rows.length });
      return rows;
    } catch (error) {
      logger.error('Error executing SQL query:', error.message);
      throw error;
    }
  }

  static async findById(poId) {
    const sql = `SELECT * FROM PurchaseOrder WHERE id = ?`;
    const [rows] = await pool.query(sql, [poId]);
    const purchaseOrder = rows[0];
    if (purchaseOrder) {
      logger.info('Retrieved purchase order by ID:', { poId });
    } else {
      logger.warn('Purchase order not found by ID:', { poId });
    }
    return purchaseOrder;
  }

  static async update(vendorId, updates) {
    const fields = [];
    const values = [];
    
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) {
        fields.push(`${key} = NULL`);
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      throw new Error('No fields to update');
    }

    const sql = `UPDATE Vendor SET ${fields.join(', ')} WHERE id = ?`;
    values.push(vendorId);

    try {
      await pool.execute(sql, values);
      logger.info('Vendor updated:', { vendorId, updates });
    } catch (error) {
      logger.error('Error updating vendor:', error);
      throw error;
    }
  }

  static async delete(poId) {
    const sql = `DELETE FROM PurchaseOrder WHERE id = ?`;
    await pool.execute(sql, [poId]);
    logger.info('Purchase Order deleted:', { poId });
  }
}

module.exports = PurchaseOrderModel;
