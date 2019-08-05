const config = require('config');
const environmentVariablesConfig = config.get('env');

let applicationConfig;

applicationConfig = environmentVariablesConfig;
console.log(applicationConfig);
require('../startup/validate')(applicationConfig);

module.exports = applicationConfig;
