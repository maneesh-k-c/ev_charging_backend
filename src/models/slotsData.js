const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const SlotSchema = new Schema({
     booking_id:{ type: Schema.Types.ObjectId, ref: "booking_tb", required: true },
     slot_no:{ type: String, required: true },
     time:{ type: String, required: true },      
     date:{ type: String, required: true },      
})

var Slotdata = mongoose.model('slot_tb',SlotSchema) 
module.exports=Slotdata;