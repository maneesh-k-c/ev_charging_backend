const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const ServiceSchema = new Schema({
    service_station_id:{ type: Schema.Types.ObjectId, ref: "service_station_tb", required: true },
    service_name:{ type: String, required: true },
    amount:{ type: String, required: true },
    duration:{ type: String, required: true }   
})

var Servicedata = mongoose.model('service_tb',ServiceSchema) 
module.exports=Servicedata;