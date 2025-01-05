const winston = require('winston');
const createLogStream = require('./createLogStream'); 

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.Stream({
      stream: createLogStream(),
    }),
  ],
});

module.exports = logger;