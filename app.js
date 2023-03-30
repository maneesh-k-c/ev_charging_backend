const express = require('express')
const app = express()
const bodyParser=require('body-parser');
// const RegisterRouter = require('./src/routes/registerRouter')
const UserRouter = require('./src/routes/userRouter')
const LoginRouter = require('./src/routes/loginRouter')
const ServiceRouter = require('./src/routes/serviceStationRouter')
const ChargingRouter = require('./src/routes/chargingStationRouter')
const BatteryRouter = require('./src/routes/batteryRouter')


app.use(express.json())   //convert to json
// app.use(express.static('./public'));
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader( 
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });
 
  

app.use('/api/user',UserRouter)
app.use('/api/login',LoginRouter)
app.use('/api/station',ServiceRouter)
app.use('/api/charging',ChargingRouter)
app.use('/api/battery',BatteryRouter)



app.listen(8000,()=>{
    console.log('server started at port 8000')
})