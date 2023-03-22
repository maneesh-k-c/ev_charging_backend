const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema  

const UserSchema = new Schema({
     login_id:{ type: Schema.Types.ObjectId, ref: "login_tb", required: true },
     name:{ type: String, required: true },
     email:{ type: String, required: true },
     phone_no:{ type: String, required: true },
     address:{ type: String, required: true },
     location:{ type: String, required: true }      
})

var Userdata = mongoose.model('user_tb',UserSchema) 
module.exports=Userdata;