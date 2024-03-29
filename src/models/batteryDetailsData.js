const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const BatteryDetailsSchema = new Schema({
    battery_shop_id:{ type: Schema.Types.ObjectId, ref: "battery_station_tb", required: true },
    vehicle_name:{ type: String, required: true },
    model_name:{ type: String, required: true },
    capacity:{ type: String, required: true },
    amount:{ type: String, required: true }     
})

var Batterydetailsdata = mongoose.model('battery_details_tb',BatteryDetailsSchema) 
module.exports=Batterydetailsdata;