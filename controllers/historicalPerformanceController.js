const db = require('../config/mysql2');
const logger = require('../config/logger');
const HistoricalPerformanceModel = require('../models/historicalPerformance');

module.exports.createHistoricalPerformance = async (req, res) => {
  try {
    const { vendorId, date, onTimeDeliveryRate, qualityRatingAvg, averageResponseTime, fulfillmentRate } = req.body;

    if (!vendorId || !date || onTimeDeliveryRate === undefined || qualityRatingAvg === undefined || averageResponseTime === undefined || fulfillmentRate === undefined) {
      logger.warn('Create Historical Performance - Missing required fields');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if vendor exists
    const [vendorRows] = await db.query('SELECT * FROM Vendor WHERE id = ?', [vendorId]);
    if (vendorRows.length === 0) {
      logger.warn('Create Historical Performance - Vendor does not exist');
      return res.status(400).json({ error: 'Vendor ID does not exist' });
    }

    if (onTimeDeliveryRate < 0 || onTimeDeliveryRate > 100) {
      logger.warn('Create Historical Performance - Invalid On-Time Delivery Rate');
      return res.status(400).json({ error: 'On-Time Delivery Rate must be between 0 and 100' });
    }
    if (qualityRatingAvg < 0 || qualityRatingAvg > 5) {
      logger.warn('Create Historical Performance - Invalid Quality Rating Average');
      return res.status(400).json({ error: 'Quality Rating Average must be between 0 and 5' });
    }
    if (averageResponseTime < 0) {
      logger.warn('Create Historical Performance - Invalid Average Response Time');
      return res.status(400).json({ error: 'Average Response Time cannot be negative' });
    }
    if (fulfillmentRate < 0 || fulfillmentRate > 100) {
      logger.warn('Create Historical Performance - Invalid Fulfillment Rate');
      return res.status(400).json({ error: 'Fulfillment Rate must be between 0 and 100' });
    }

    const performanceId = await HistoricalPerformanceModel.create({
      vendorId,
      date,
      onTimeDeliveryRate,
      qualityRatingAvg,
      averageResponseTime,
      fulfillmentRate
    });

    logger.info('Create Historical Performance - Performance Created', { performanceId });
    res.status(201).json({ id: performanceId, message : 'Create Historical Performance - Performance Created' });
  } catch (error) {
    logger.error('Error creating historical performance:', error);
    res.status(500).json({ error: 'Failed to create historical performance' });
  }
};


module.exports.getHistoricalPerformanceByVendorId = async (req, res) => {
  try {
    const performances = await HistoricalPerformanceModel.findByVendorId(req.params.vendorId);
    res.status(200).json(performances);
  } catch (error) {
    logger.error('Error retrieving historical performance:', error);
    res.status(500).json({ error: 'Failed to retrieve historical performance' });
  }
};

module.exports.updateHistoricalPerformance = async (req, res) => {
  try {
    const { performanceId } = req.params;
    const updatedFields = req.body;

    if (!performanceId || Object.keys(updatedFields).length === 0) {
      logger.warn('Update Historical Performance - Missing Performance ID or update fields');
      return res.status(400).json({ error: 'Performance ID and at least one field to update are required' });
    }

    await HistoricalPerformanceModel.update(performanceId, updatedFields);
    logger.info('Update Historical Performance - Performance updated successfully', { performanceId, updatedFields });
    res.status(200).json({ message: 'Historical Performance updated successfully' });
  } catch (error) {
    logger.error('Error updating historical performance:', error);
    res.status(500).json({ error: 'Failed to update historical performance' });
  }
};

module.exports.deleteHistoricalPerformance = async (req, res) => {
  try {
    await HistoricalPerformanceModel.delete(req.params.performanceId);
    logger.info('Delete Historical Performance - Performance deleted successfully', { performanceId: req.params.performanceId });
    res.status(200).json({ message: 'Historical Performance deleted successfully' });
  } catch (error) {
    logger.error('Error deleting historical performance:', error);
    res.status(500).json({ error: 'Failed to delete historical performance' });
  }
};
