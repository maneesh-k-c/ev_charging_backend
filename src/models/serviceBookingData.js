const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const ServiceBookingSchema = new Schema({
     login_id:{ type: Schema.Types.ObjectId, ref: "login_tb", required: true },
     service_station_id:{ type: Schema.Types.ObjectId, ref: "service_station_tb", required: true },
     complaint_title:{ type: String, required: true },
     description:{ type: String, required: true },
     type_of_service:{ type: String, required: true },
     date:{ type: String, required: true },
     amount:{ type: String, required: true },
     status:{ type: String, required: true },
    
})

var ServiceBookingdata = mongoose.model('service_booking_tb',ServiceBookingSchema) 
module.exports=ServiceBookingdata;