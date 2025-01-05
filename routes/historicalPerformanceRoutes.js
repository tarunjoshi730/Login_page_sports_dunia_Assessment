const express = require('express');
const router = express.Router();
const historicalPerformanceController = require('../controllers/historicalPerformanceController');

router.post('/historical_performance', historicalPerformanceController.createHistoricalPerformance);
router.get('/historical_performance/vendor/:vendorId', historicalPerformanceController.getHistoricalPerformanceByVendorId);
router.put('/historical_performance/:performanceId', historicalPerformanceController.updateHistoricalPerformance);
router.delete('/historical_performance/:performanceId', historicalPerformanceController.deleteHistoricalPerformance);

module.exports = router;
