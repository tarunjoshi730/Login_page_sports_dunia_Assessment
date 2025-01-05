
const PurchaseOrderModel = require('../models/purchaseOrder');
const db = require('../config/mysql2');
const VendorModel = require('../models/vendor');
const logger = require('../config/logger');

module.exports.createPurchaseOrder = async (req, res) => {
  try {
    const purchaseOrderData = req.body;
    const poNumber = await PurchaseOrderModel.generateUniquePONumber();

    const purchaseOrder = {
      poNumber,
      vendorId: purchaseOrderData.vendorId,
      orderDate: purchaseOrderData.orderDate || new Date().toISOString().split('T')[0],
      deliveryDate: purchaseOrderData.deliveryDate || null,
      items: purchaseOrderData.items || [],
      quantity: purchaseOrderData.quantity || 0,
      status: purchaseOrderData.status || 'pending',
      qualityRating: purchaseOrderData.qualityRating || null,
      issueDate: purchaseOrderData.issueDate || new Date().toISOString().split('T')[0],
      acknowledgmentDate: purchaseOrderData.acknowledgmentDate || null
    };

    // Validate required fields
    if (!purchaseOrder.vendorId || !purchaseOrder.deliveryDate || !purchaseOrder.items ) {
      return res.status(400).json({ error: 'Vendor ID and delivery  and items are required' });
    }

    if (purchaseOrder.quantity < 0) {
      return res.status(400).json({ error: 'Quantity cannot be negative' });
    }

    // Check if the vendor exists
    const vendorExists = await VendorModel.findById(purchaseOrder.vendorId);
    if (!vendorExists) {
      return res.status(400).json({ error: 'Vendor ID does not exist' });
    }

    // Create the purchase order in the database
    const id = await PurchaseOrderModel.create(purchaseOrder);
    res.status(201).json({ id, poNumber });
  } catch (error) {
    logger.error('Error creating purchase order:', error.message);
    res.status(500).json({ error: 'Failed to create purchase order', details: error.message });
  }
};


module.exports.listPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await PurchaseOrderModel.findAll();
    res.status(200).json(purchaseOrders);
  } catch (error) {
    // logger.error('Error listing purchase orders:', error.message);
    res.status(500).json({ error: 'Failed to retrieve purchase orders', details: error.message });
  }
};



module.exports.getPurchaseOrderById = async (req, res) => {
  try {
    const { poId } = req.params;
    const purchaseOrder = await PurchaseOrderModel.findById(poId);
    if (purchaseOrder) {
      res.status(200).json(purchaseOrder);
    } else {
      res.status(404).json({ error: 'Purchase Order not found' });
    }
  } catch (error) {
    logger.error('Error retrieving purchase order:', error);
    res.status(500).json({ error: 'Failed to retrieve purchase order' });
  }
};




module.exports.updatePurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    const updatedFields = req.body;

    if (!poId || Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ error: 'Purchase Order ID and at least one field to update are required' });
    }

    await PurchaseOrderModel.update(poId, updatedFields);
    res.status(200).json({ message: 'Purchase Order updated successfully' });
  } catch (error) {
    logger.error('Error updating purchase order:', error);
    res.status(500).json({ error: 'Failed to update purchase order' });
  }
};


module.exports.deletePurchaseOrder = async (req, res) => {
  try {
    const { poId } = req.params;
    await PurchaseOrderModel.delete(poId);
    res.status(200).json({ message: 'Purchase Order deleted successfully' });
  } catch (error) {
    logger.error('Error deleting purchase order:', error);
    res.status(500).json({ error: 'Failed to delete purchase order' });
  }
};
