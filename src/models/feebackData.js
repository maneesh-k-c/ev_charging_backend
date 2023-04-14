const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const FeedbackSchema = new Schema({
     login_id:{ type: Schema.Types.ObjectId, ref: "login_tb", required: true },
     battery_shop_id:{ type: Schema.Types.ObjectId, ref: "battery_station_tb" },
     charging_station_id:{ type: Schema.Types.ObjectId, ref: "charging_station_tb"},
     service_station_id:{ type: Schema.Types.ObjectId, ref: "service_station_tb" },
     date:{ type: String, required: true },
     feedback:{ type: String, required: true }
})

var Feedbackdata = mongoose.model('feedback_tb',FeedbackSchema) 
module.exports=Feedbackdata;