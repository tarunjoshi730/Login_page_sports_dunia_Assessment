
const mysql = require('mysql2/promise');
const logger = require('./logger');
require('dotenv').config();

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database:  process.env.DATABASE,
  port: 3306,
});

logger.info('Connected to the MySQL database mysql2'); 

pool.on('error', (err) => {
  logger.error('MySQL database connection error:', err);
});

module.exports = pool;