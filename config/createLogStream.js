const rfs = require("rotating-file-stream");
const fs = require("fs");

const path = require('path');


const logDirectory = path.join(__dirname, "../logs"); 


if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

function generateTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/:/g, '-');
}

function createLogStream() {
  return rfs.createStream((time, index) => {
    if (!time) return "default.log";
    const timestamp = generateTimestamp();
    return `logs_${timestamp}.log`;
  }, {
    interval: "3h",
    path: logDirectory
  });
}

module.exports = createLogStream;