const express = require('express');
const { createVendor, listVendors, getVendorById, updateVendor, deleteVendor} = require('../controllers/vendorController');

const router = express.Router();

router.post('/vendors', createVendor);
router.get('/vendors', listVendors);
router.get('/vendors/:vendorId', getVendorById);
router.put('/vendors/:vendorId', updateVendor);
router.delete('/vendors/:vendorId', deleteVendor);

module.exports = router;
