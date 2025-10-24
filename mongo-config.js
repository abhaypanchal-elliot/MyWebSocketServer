// const CONFIG = require('');

// database connection string
const DATABASE = {
    URL:  'mongodb://127.0.0.1:27017/',
    NAME: 'prod_ems_db'
}

// collection names in mongo db
// const COLLECTION_NAMES = {
//     companies: 'companies',
//     assetTypes: 'assetTypes',
//     companyAssets: 'companyAssets',
//     allRegisters: 'allRegisters',
//     energyMeterRawData: 'energyMeterRawDataSeptTwoZeroTwoOne',
//     lastEnergyMeterRawData: 'lastEnergyMeterRawData',
//     energyMeterRawDataShubham: 'energyMeterRawDataShubham',
//     energyMeterValues: 'machineMeterValues',
//     energyMeterMDValues: 'energyMeterMDValues',
//     energyMeterMonthlyMDValues: 'energyMeterMonthlyMDValues',
//     energyMeterMonthlyValues: 'energyMeterMonthlyValues',
//     energyMeterDailyValues: 'energyMeterDailyValues',
//     halfHours: 'halfHours',
//     users: 'users',
//     powerFactorAlerts: 'powerFactorAlerts',
//     modbusRaw: 'modbusRaw',
//     functionalLogs: 'functionalLogs',
//     tempShubham : 'tempShubham',
//     parameters:'parameters',
//     parametersValues:'parametersValues',
//     alerts:'alerts',
//     smsLog: 'smsLog',
//     automaticGateWayCallSet :"automaticGateWayCallSet",
//     lastEnergyMeterRawData:"lastEnergyMeterRawData"
// }



// collection names in mongo db
const COLLECTION_NAMES = {
    raw: 'MmaRaw72022',
    cycleStartStopStatus: 'cycleStartStopStatus72022',
    companies: 'companies',
    assetTypes: 'assetTypes',
    companyAssets: 'companyAssets',
    allRegisters: 'allRegisters',
    energyMeterRawData: 'energyMeterRawDataSeptTwoZeroTwoOne',
    lastEnergyMeterRawData: 'lastEnergyMeterRawData',
    energyMeterRawDataShubham: 'energyMeterRawDataShubham',
    energyMeterValues: 'newMmaData72022',
    energyMeterValues1: 'historicalMeterValues',
    energyMeterMDValues: 'energyMeterMDValues',
    energyMeterMonthlyMDValues: 'energyMeterMonthlyMDValues',
    energyMeterMonthlyValues: 'energyMeterMonthlyValues',
    energyMeterDailyValues: 'energyMeterDailyValues',
    halfHours: 'halfHours',
    users: 'users',
    powerFactorAlerts: 'powerFactorAlerts',
    modbusRaw: 'modbusRaw',
    functionalLogs: 'functionalLogs',
    tempShubham : 'tempShubham',
    parameters:'parameters',
    parametersValues:'parametersValues',
    alerts:'alerts',
    alertsMaa:'alertsMaa',
    smsLog: 'smsLog',
    automaticGateWayCallSet :"automaticGateWayCallSet",
    lastEnergyMeterRawData:"lastEnergyMeterRawData",
    assetStatus : "assetStatus"
}
module.exports = {
    DATABASE,
    COLLECTION_NAMES
};
