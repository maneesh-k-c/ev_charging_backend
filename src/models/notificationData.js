const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const NotificationSchema = new Schema({
     user_id:{ type: Schema.Types.ObjectId, ref: "user_tb", required: true },
     battery_shop_id:{ type: Schema.Types.ObjectId, ref: "battery_station_tb" },
     charging_station_id:{ type: Schema.Types.ObjectId, ref: "charging_station_tb"},
     service_station_id:{ type: Schema.Types.ObjectId, ref: "service_station_tb" },
     battery_shop_name:{ type: String},
     charging_station_name:{ type: String},
     service_station_name:{ type: String},
     date:{ type: String, required: true },
     notification:{ type: String, required: true }
})

var Notificationdata = mongoose.model('notification_tb',NotificationSchema) 
module.exports=Notificationdata;