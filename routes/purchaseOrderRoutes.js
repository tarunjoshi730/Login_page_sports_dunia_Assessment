const express = require('express');
const router = express.Router();
const { listPurchaseOrders, getPurchaseOrderById, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder} = require('../controllers/purchaseOrderController');
const logger = require('../config/logger');

router.post('/purchase-orders', createPurchaseOrder);
router.get('/purchase-orders', listPurchaseOrders);
router.get('/purchase-orders/:poId', getPurchaseOrderById);
router.put('/purchase-orders/:poId', updatePurchaseOrder);
router.delete('/purchase-orders/:poId', deletePurchaseOrder);



router.use((err, req, res, next) => {
  logger.error('Error in purchase order router:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = router;
