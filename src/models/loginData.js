const mongoose = require('mongoose')
mongoose.connect('mongodb://userone:userone@database-shard-00-00.wkagg.mongodb.net:27017,database-shard-00-01.wkagg.mongodb.net:27017,database-shard-00-02.wkagg.mongodb.net:27017/NAMevDb?ssl=true&replicaSet=atlas-mkhgcd-shard-0&authSource=admin&retryWrites=true&w=majority')  //database connection
const Schema = mongoose.Schema    

const LoginSchema = new Schema({
     username: String,
     password: String,
     role: String,
     status: String,
})

var Logindata = mongoose.model('login_tb',LoginSchema) 
module.exports=Logindata;