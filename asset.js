

const database = require('./mongo-config')
const MONGO_UTIL = require('./mongo_util');
const MONGO_CONFIG = require('./mongo-config');
  
  exports.getAssetDetailsByGatewayId = async (p_asset_id) => {
    try {
    
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            {'$match':{
                'Gateway': p_asset_id,          
            }
        },
        { $sort: { SlaveId: 1 } }   
        ]).toArray();;
        return result;
    } catch (error) {
        throw error;
    }
  };

  exports.getAssetDetailsByGatewayIdAndSlaveId = async (p_asset_id,p_slave_id) => {
    try {    
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            {'$match':{
                'Gateway': p_asset_id,
                'SlaveId':  p_slave_id 
             
            }
        },      
        ]).toArray();;
        return result;
    } catch (error) {
        throw error;
    }
  };


exports.getregiterDetailsByAddress = async (all_Registers_Id) => {
    try {    
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).aggregate([
            {'$match':{
                'RegisterAddress': { $in: all_Registers_Id},              
            }
        },      
        ]).toArray();;
        return result;
    } catch (error) {
        throw error;
    }
  };

  exports.generateJsonStructureForHourlyData = (registerId, actVal, valueReceivedDate, hourlyId, createdDate, assetId) => {
    return {
        RegisterId: registerId,
        ActValue: actVal,
        ValueReceivedDate: valueReceivedDate,
        HourlyId: hourlyId,
        CreatedDate: createdDate,
        AssetId: assetId
    }
  };

 exports.saveEnargyMeterValueMany = async (p_Data) => {
    try { 
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues).insertMany(p_Data)
        return result;
    } catch (error) {
        throw error;
    }
  };

  exports.saveEnargyMeterValueManyEnargyCollection = async (p_Data) => {
    try { 
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.energyMeterValues1).insertMany(p_Data)
           return result;
    } catch (error) {
        throw error;
    }
  };

  exports.updateAssetStatus = async (p_Data) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).updateOne({AssetId:p_Data.AssetId }, {$set:{status: p_Data.status}});
        if (result.modifiedCount == 0) {
            let error = new Error("Could Not Create the GateWay call!");
            error.status = 1;
        }
        return result.result;  
    } catch (error) {
        console.log(error);
    }
}

// storeCycleStatus

exports.storeCycleStatus = async (p_Data) => {
    try { 
        let result;
        let mongo_client = await MONGO_UTIL.dbClient();        
         let lastStatus = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.cycleStartStopStatus).aggregate([
             {'$match':{
                 'AssetId': p_Data.AssetId,
              },           
         },
         { $sort: { _id: -1 } },
         ]).toArray();
         if(p_Data.Status == true){
         if(lastStatus.length == 0 || lastStatus[0].Status == false  ){
         result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.cycleStartStopStatus).insertOne({AssetId : p_Data.AssetId,Status :p_Data.Status,StartTime : p_Data.time})
         }}else if(p_Data.Status == false){
            if(lastStatus.length == 0 || lastStatus[0].Status == true  ){      
                 result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.cycleStartStopStatus).updateOne(
                        { '_id': lastStatus[0]._id },
                        { '$set': {WeldingNumber :  p_Data.WeldingNumber,StopTime :p_Data.time,Status :p_Data.Status } }
                    )
            }
           }
        return true;
    } catch (error) {
        throw error;
    }
  };
// storeCycleStatus

exports.storeCycleStatusNew = async (p_Data) => {
    try { 
        let result;
        let mongo_client = await MONGO_UTIL.dbClient();          
         result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.cycleStartStopStatus).insertOne({AssetId : p_Data.AssetId,Status :p_Data.Status,StartTime : p_Data.StartTime,StopTime :p_Data.StopTime,WeldingNumber :  p_Data.WeldingNumber})
        return true;
    } catch (error) {
        throw error;
    }
  };

//   inserAlert

exports.inserAlert = async (p_Data,p_AssetId) => {
    try { 

        const arrOfNum = Object.keys(p_Data).map(str => {          
            if( Number(str) !== NaN){
            return Number(str) ;
          }          
          });

        let mongo_client = await MONGO_UTIL.dbClient();
         let allRegistersgiter = await  this.getregiterDetailsByAddress(arrOfNum)
        allRegistersgiterId = []
        for(let i = 0 ;i< allRegistersgiter.length;i++) {
            if(allRegistersgiter[i].RegisterAddress !== 7442 && allRegistersgiter[i].RegisterAddress !== 7443  && allRegistersgiter[i].RegisterAddress !== 7444 ){
                allRegistersgiterId.push({RegusterId : allRegistersgiter[i].RegisterId,Value : p_Data[allRegistersgiter[i].RegisterAddress] })
            }
        }
      
         let lastAlertsStatus = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.alertsMaa).aggregate([
             {
            '$match': {
                'AssetId': p_AssetId,
                'RegisterId': { $in: [430,431,432,433,434,435] },
           },
        },
        {
            $group: {
                _id: "$RegisterId",
                 indetify : { $last: "$_id" },  
                Value: { $last: "$Value" }
            }
        },
         ]).toArray();

        for(let i = 0 ; i < allRegistersgiterId.length;i++){
            const found = lastAlertsStatus.find(element => element._id ==allRegistersgiterId[i].RegusterId );
           if(allRegistersgiterId[i].Value == 1 ){
          if(lastAlertsStatus.length == 0  || found == undefined || found.Value == 0){
       
        let deletCycle =  this.deleteCycle(p_AssetId);
         result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.alertsMaa).insertOne({AssetId : p_AssetId,RegisterId :allRegistersgiterId[i].RegusterId,StartTime : p_Data.time,Value  : allRegistersgiterId[i].Value })
        //  console.log(result)
          }
      }else if(allRegistersgiterId[i].Value == 0){
      
        if( found != undefined && found.Value == 1  ){
  
                       result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.alertsMaa).updateOne(
                        { '_id': found.indetify },
                        { '$set': {StopTime : p_Data.time,Value  : allRegistersgiterId[i].Value } }
                    )
        }
      }

        }
        return true;
    } catch (error) {
        throw error;
    }
  };


exports.insertData = async (test1,AssetDetails) => {
    try {

        const arrOfNum = Object.keys(test1).map(str => {          
             if( Number(str) !== NaN){
             return Number(str) ;
           }                
           });

         RegitserDetails = await  this.getregiterDetailsByAddress(arrOfNum);
               for(let i = 0 ; i < RegitserDetails.length;i++){
                let obj = {
                 ActValue:   test1[RegitserDetails[i].RegisterAddress],
                 AssetId :AssetDetails[0].AssetId,
                  AssetTypeId : AssetDetails[0].AssetTypeId,
                  RegisterId : RegitserDetails[i].RegisterId,
                  ValueReceivedDate : Date.parse(new Date()) ,
                  CreatedDate : new Date().getTime(),
                  RegisterAddress :  RegitserDetails[i].RegisterAddress
                }    
                  savedata.push(obj)    
               }
             let finalResult = await this.saveEnargyMeterValueMany(savedata)


    } catch (error) {
        // console.log(error);
    }
}

exports.insertDataNew = async (test1,AssetDetails,ValueReceivedDate) => {
    try {

        const arrOfNum = Object.keys(test1).map(str => {          
             if( Number(str) !== NaN){
             return Number(str) ;
           }                
           });

         RegitserDetails = await  this.getregiterDetailsByAddress(arrOfNum);
               for(let i = 0 ; i < RegitserDetails.length;i++){
                let obj = {
                 ActValue:   test1[RegitserDetails[i].RegisterAddress],
                 AssetId :AssetDetails[0].AssetId,
                  AssetTypeId : AssetDetails[0].AssetTypeId,
                  RegisterId : RegitserDetails[i].RegisterId,
                  ValueReceivedDate : ValueReceivedDate,
                  CreatedDate : ValueReceivedDate,
                  RegisterAddress :  RegitserDetails[i].RegisterAddress
                }         
                  savedata.push(obj)    
               }
             let finalResult = await this.saveEnargyMeterValueMany(savedata)
         

    } catch (error) {
        // console.log(error);
    }
}
//  saveStatus

exports.saveAssetStatus= async (p_assetId,p_status,p_time) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.assetStatus).insertOne({AssetId : p_assetId,Status : p_status,Time : p_time})
        return true
    } catch (error) {
        // console.log(error);
    }
}


exports.deleteCycle= async (p_assetId) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        let time = new Date();
        result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.cycleStartStopStatus).deleteOne({AssetId : p_assetId,Status : true,WeldingNumber : undefined})
        return true
    } catch (error) {
        // console.log(error);
    }
}

  exports.mqttData= async (p_gatewayId,test1) => {
    try { 
          time = new Date()       
        let AssetDetails = await this.getAssetDetailsByGatewayId(p_gatewayId); 
        let Assetstatus = await this.saveAssetStatus(AssetDetails[0].AssetId,true,Date.parse(new Date()) )

        if(test1["RSSI"] !== undefined){
          }else{
            savedata = []
            if(test1.Status){
                let insertAlert = await this.inserAlert(test1,AssetDetails[0].AssetId)
            }else {
                timea =  new Date(time.setFullYear(2000+test1['7384'],test1['7385']-1,test1['7386'])).setHours(test1['7387'],test1['7388'],test1['7389'])
                timeb =  new Date(time.setFullYear(2000+test1['7390'],test1['7391']-1,test1['7392'])).setHours(test1['7393'],test1['7394'],test1['7395'])
               timec  = (timea+timeb)/2;               
                 let cycleStartOrStopNew = await this.storeCycleStatusNew({AssetId : AssetDetails[0].AssetId,Status:test1.Status,StartTime :timea ,StopTime : timeb,WeldingNumber : test1["7396"]})             
                let insertData = await this.insertDataNew(test1,AssetDetails,timeb)
            }

          }
return true
    } catch (error) {
        // console.log(error);
    }
}

exports.getregiterDetailsByAddressAndAssetType = async (all_Registers_Id,p_assetTypeId) => {
    try {
    
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.allRegisters).aggregate([
            {'$match':{
                'RegisterAddress': { $in: all_Registers_Id},
                "AssetTypeId": p_assetTypeId,    
             
            }
        },
      
        ]).toArray();;
        return result;
    } catch (error) {
        throw error;
    }
  };
exports.insertDataNewEnargyMeter = async (test1,AssetDetails,ValueReceivedDate) => {
    try {

        const arrOfNum = Object.keys(test1).map(str => {          
             if( Number(str) !== NaN){
             return Number(str)-1 ;
           }                
           });

         RegitserDetails = await  this.getregiterDetailsByAddressAndAssetType(arrOfNum,AssetDetails[0].AssetTypeId);
               for(let i = 0 ; i < RegitserDetails.length;i++){
                let obj = {
                 ActValue:   test1[RegitserDetails[i].RegisterAddress+1],
                 AssetId :AssetDetails[0].AssetId,
                  AssetTypeId : AssetDetails[0].AssetTypeId,
                  RegisterId : RegitserDetails[i].RegisterId,
                  ValueReceivedDate : ValueReceivedDate,
                  CreatedDate : ValueReceivedDate,
                  RegisterAddress :  RegitserDetails[i].RegisterAddress
                }           
                  savedata.push(obj)    
               }
             let finalResult = await this.saveEnargyMeterValueManyEnargyCollection(savedata)
       

    } catch (error) {
        // console.log(error);
    }
}

exports.mqttDataEnargyMeter = async (p_gatewayId,test1) => {
    try {  
        
        if(p_gatewayId == "AB1"){
            // .log(test1);
        }
        //   time = new Date()     
        // test1['time'] = Date.parse(new Date())
        // let AssetDetails = await this.getAssetDetailsByGatewayIdAndSlaveId(p_gatewayId,test1['Slave_id']); 
        // if(test1["RSSI"] !== undefined){           
        //   }else{
        //     savedata = []          
        //         let insertData = await this.insertDataNewEnargyMeter(test1,AssetDetails, test1['time'])
        //  }
return true
    } catch (error) {
        // console.log(error);
    }
}



// saveRaw
exports.saveRaw= async (Id,data) => {
    try {
        let mongo_client = await MONGO_UTIL.dbClient();
        data['time'] = Date.parse(new Date())
        result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.raw).insertOne({Id : Id,data : data})
        return true
    } catch (error) {
        // console.log(error);
    }
}




