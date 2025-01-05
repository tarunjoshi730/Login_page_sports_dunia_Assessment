const VendorModel = require('../models/vendor');
const logger = require('../config/logger');

module.exports.createVendor = async (req, res) => {
  try {
    const {
      name,
      contactDetails,
      address,
      onTimeDeliveryRate,
      qualityRatingAvg,
      averageResponseTime,
      fulfillmentRate
    } = req.body;

    if (!name || !contactDetails || !address || onTimeDeliveryRate === undefined || qualityRatingAvg === undefined || averageResponseTime === undefined || fulfillmentRate === undefined) {
      logger.warn('Create Vendor - Missing required fields');
      return res.status(400).json({ error: 'All required fields must be provided' });
    }
    if (onTimeDeliveryRate < 0 || onTimeDeliveryRate > 100) {
      logger.warn('Create Vendor - Invalid On-Time Delivery Rate');
      return res.status(400).json({ error: 'On-Time Delivery Rate must be between 0 and 100' });
    }
    if (qualityRatingAvg < 0 || qualityRatingAvg > 5) {
      logger.warn('Create Vendor - Invalid Quality Rating Average');
      return res.status(400).json({ error: 'Quality Rating Average must be between 0 and 5' });
    }
    if (averageResponseTime < 0) {
      logger.warn('Create Vendor - Invalid Average Response Time');
      return res.status(400).json({ error: 'Average Response Time cannot be negative' });
    }
    if (fulfillmentRate < 0 || fulfillmentRate > 100) {
      logger.warn('Create Vendor - Invalid Fulfillment Rate');
      return res.status(400).json({ error: 'Fulfillment Rate must be between 0 and 100' });
    }

    const vendorCode = await VendorModel.generateUniqueVendorCode();
    logger.info('Create Vendor - Generated Vendor Code', { vendorCode });

    const vendor = {
      name,
      contactDetails,
      address,
      vendorCode,
      onTimeDeliveryRate,
      qualityRatingAvg,
      averageResponseTime,
      fulfillmentRate
    };

    const vendorId = await VendorModel.create(vendor);
    logger.info('Create Vendor - Vendor Created', { vendorId, vendorCode });

    res.status(201).json({ id: vendorId, vendorCode });
  } catch (error) {
    logger.error('Error creating vendor:', error);
    res.status(500).json({ error: 'Failed to create vendor' });
  }
};

module.exports.listVendors = async (req, res) => {
  try {
    const vendors = await VendorModel.findAll();
    logger.info('List Vendors - Retrieved all vendors', { vendorCount: vendors.length });
    res.status(200).json(vendors);
  } catch (error) {
    logger.error('Error retrieving vendors:', error);
    res.status(500).json({ error: 'Failed to retrieve vendors' });
  }
};

module.exports.getVendorById = async (req, res) => {
  try {
    const vendor = await VendorModel.findById(req.params.vendorId);
    if (vendor) {
      logger.info('Get Vendor by ID - Vendor found', { vendorId: req.params.vendorId });
      res.status(200).json(vendor);
    } else {
      logger.warn('Get Vendor by ID - Vendor not found', { vendorId: req.params.vendorId });
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    logger.error('Error retrieving vendor:', error);
    res.status(500).json({ error: 'Failed to retrieve vendor' });
  }
};

module.exports.updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const updatedFields = req.body;

    if (!vendorId || Object.keys(updatedFields).length === 0) {
      logger.warn('Update Vendor - Missing Vendor ID or update fields');
      return res.status(400).json({ error: 'Vendor ID and at least one field to update are required' });
    }

    await VendorModel.update(vendorId, updatedFields);
    logger.info('Update Vendor - Vendor updated successfully', { vendorId, updatedFields });
    res.status(200).json({ message: 'Vendor updated successfully' });
  } catch (error) {
    logger.error('Error updating vendor:', error);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
};

module.exports.deleteVendor = async (req, res) => {
  try {
    await VendorModel.delete(req.params.vendorId);
    logger.info('Delete Vendor - Vendor deleted successfully', { vendorId: req.params.vendorId });
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    logger.error('Error deleting vendor:', error);
    res.status(500).json({ error: 'Failed to delete vendor' });
  }
};
