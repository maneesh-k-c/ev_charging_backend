const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const SlotBookingSchema = new Schema({
     login_id:{ type: Schema.Types.ObjectId, ref: "login_tb", required: true },
     charging_station_id:{ type: Schema.Types.ObjectId, ref: "charging_station_tb", required: true },
     date:{ type: String, required: true },
     slot_no:{ type: String, required: true },
     time:{ type: String, required: true },
     amount:{ type: String, required: true },
     status:{ type: String, required: true },
    
})

var SlotBookingdata = mongoose.model('slot_booking_tb',SlotBookingSchema) 
module.exports=SlotBookingdata;