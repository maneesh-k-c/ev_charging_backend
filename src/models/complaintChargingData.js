const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const ComplaintSchema = new Schema({
     login_id:{ type: Schema.Types.ObjectId, ref: "login_tb", required: true },
     charging_station_id:{ type: Schema.Types.ObjectId, ref: "charging_station_tb"},
     charging_station_name:{ type: String },
     date:{ type: String, required: true },
     complaint:{ type: String, required: true }
})

var Complaintdata = mongoose.model('complaint_charging_tb',ComplaintSchema) 
module.exports=Complaintdata;