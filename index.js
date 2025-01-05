const express = require('express');
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const historicalPerformanceRoutes = require('./routes/historicalPerformanceRoutes');
require("./config/mysql2");
require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('forms');
});

app.get('/vendor-form', (req, res) => {
  res.render('vendor-form');
});

app.get('/historical-performance-form', (req, res) => {
  res.render('historical-performance-form');
});
app.get('/purchase-order-form', (req, res) => {
  res.render('purchase-order-form');
});

app.use('/api', vendorRoutes);
app.use('/api', purchaseOrderRoutes);
app.use('/api', historicalPerformanceRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
