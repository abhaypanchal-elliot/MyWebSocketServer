const database = require('./mongo-config')
const MONGO_UTIL = require('./mongo_util');
const MONGO_CONFIG = require('./mongo-config');
  
  exports.getAssetDetailsByGatewayId = async (p_asset_id) => {
    try {
    
        let mongo_client = await MONGO_UTIL.dbClient();
        let result = await mongo_client.collection(MONGO_CONFIG.COLLECTION_NAMES.companyAssets).aggregate([
            {'$match':{
                'AssetId': p_asset_id,
                // 'SlaveId':  p_sid 
                // 'SlaveId': { $in: p_sid },
            }
        },
        { $sort: { SlaveId: 1 } }   
        ]).toArray();;
        return result;
    } catch (error) {
        throw error;
    }
  };