const express = require('express')
const adminRouter = express.Router()
adminRouter.use(express.static('./public'))
const user = require('../models/userData')
const login = require('../models/loginData')
const serviceStation = require('../models/serviceStationData')
const ChargingStationdata = require('../models/chargingStationData')
const Batterydata = require('../models/batteryData')
const complaints = require('../models/complaintChargingData')
const Bcomplaints = require('../models/complaintBatteryData')
const Scomplaints = require('../models/complaintServiceData')
const feedback = require('../models/feebackData')





adminRouter.get('/',(req,res)=>{
    res.render('login')
})

adminRouter.get('/logout',(req,res)=>{
    res.render('login')
})
adminRouter.get('/index',(req,res)=>{
    res.render('index')
})
adminRouter.get('/view-user',(req,res)=>{
    user.aggregate([{
        '$lookup': {
            'from': 'login_tbs',
            'localField': 'login_id',
            'foreignField': '_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "email": { "$first": "$email" },
            "phone_no": { "$first": "$phone_no" },
            "status": { "$first": "$login.status" },
            "login_id": { "$first": "$login._id" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            console.log(data);
            res.render('view-user',{data})
        }
    })
   
})

adminRouter.get('/charging-station-complaints',(req,res)=>{
    complaints.aggregate([ {
        '$lookup': {
          'from': 'user_tbs', 
          'localField': 'login_id', 
          'foreignField': 'login_id', 
          'as': 'login'
        }
      },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$login.name" },
            "email": { "$first": "$login.email" },
            "phone_no": { "$first": "$login.phone_no" },
            "charging_station_name": { "$first": "$charging_station_name" },
            "complaint": { "$first": "$complaint" },
            "date": { "$first": "$date" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            res.render('view-complaints',{data})
        }
    })
   
})

adminRouter.get('/battery-shop-complaints',(req,res)=>{
    Bcomplaints.aggregate([ {
        '$lookup': {
          'from': 'user_tbs', 
          'localField': 'login_id', 
          'foreignField': 'login_id', 
          'as': 'login'
        }
      },
      {
        '$lookup': {
          'from': 'battery_station_tbs', 
          'localField': 'battery_shop_id', 
          'foreignField': '_id', 
          'as': 'battery'
        }
      },
    {
        "$unwind": "$login"
    },
    {
        "$unwind": "$battery"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$login.name" },
            "email": { "$first": "$login.email" },
            "phone_no": { "$first": "$login.phone_no" },
            "battery_shop_name": { "$first": "$battery.name" },
            "complaint": { "$first": "$complaint" },
            "date": { "$first": "$date" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
        
            res.render('view-complaint-battery',{data})
        }
    })
   
})

adminRouter.get('/service-station-complaints',(req,res)=>{
    Scomplaints.aggregate([ {
        '$lookup': {
          'from': 'user_tbs', 
          'localField': 'login_id', 
          'foreignField': 'login_id', 
          'as': 'login'
        }
      },
    {
        "$unwind": "$login"
    },
   
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$login.name" },
            "email": { "$first": "$login.email" },
            "phone_no": { "$first": "$login.phone_no" },
            "service_station_name": { "$first": "$service_station_name" },
            "complaint": { "$first": "$complaint" },
            "date": { "$first": "$date" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
     
            res.render('view-complaint-service',{data})
        }
    })
   
})


adminRouter.get("/approve/:id", async (req, res) => {
    const id = req.params.id
    login.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } }).then((details) => {
        console.log("details==>", details);
        res.redirect('/admin/view-user')
    })

});

adminRouter.get("/delete/:id", async (req, res) => {
    const id = req.params.id
    login.deleteOne({ _id: id }).then((details) => {
        console.log("details==>",details.deletedCount);
       if(details.deletedCount===1){
        user.deleteOne({ login_id: id }).then((details) => {
            res.redirect('/admin/view-user')
        })
       }
    })

});




adminRouter.get('/service-station',(req,res)=>{
    serviceStation.aggregate([{
        '$lookup': {
            'from': 'login_tbs',
            'localField': 'login_id',
            'foreignField': '_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "email": { "$first": "$email" },
            "phone_no": { "$first": "$phone_no" },
            "status": { "$first": "$login.status" },
            "login_id": { "$first": "$login._id" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            console.log(data);
            res.render('view-service-station',{data})
        }
    })
   
})

adminRouter.get("/approve-service-station/:id", async (req, res) => {
    const id = req.params.id
    login.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } }).then((details) => {
        console.log("details==>", details);
        res.redirect('/admin/service-station')
    })

});

adminRouter.get("/delete-service-station/:id", async (req, res) => {
    const id = req.params.id
    login.deleteOne({ _id: id }).then((details) => {
        console.log("details==>",details.deletedCount);
       if(details.deletedCount===1){
        serviceStation.deleteOne({ login_id: id }).then((details) => {
            res.redirect('/admin/service-station')
        })
       }
    })

});





adminRouter.get('/charging-station',(req,res)=>{
    ChargingStationdata.aggregate([{
        '$lookup': {
            'from': 'login_tbs',
            'localField': 'login_id',
            'foreignField': '_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "email": { "$first": "$email" },
            "phone_no": { "$first": "$phone_no" },
            "status": { "$first": "$login.status" },
            "login_id": { "$first": "$login._id" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            console.log(data);
            res.render('view-charging-station',{data})
        }
    })
   
})

adminRouter.get("/approve-charging-station/:id", async (req, res) => {
    const id = req.params.id
    login.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } }).then((details) => {
        console.log("details==>", details);
        res.redirect('/admin/charging-station')
    })

});

adminRouter.get("/delete-charging-station/:id", async (req, res) => {
    const id = req.params.id
    login.deleteOne({ _id: id }).then((details) => {
        console.log("details==>",details.deletedCount);
       if(details.deletedCount===1){
        ChargingStationdata.deleteOne({ login_id: id }).then((details) => {
            res.redirect('/admin/charging-station')
        })
       }
    })

});





adminRouter.get('/battery-shop',(req,res)=>{
    Batterydata.aggregate([{
        '$lookup': {
            'from': 'login_tbs',
            'localField': 'login_id',
            'foreignField': '_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "email": { "$first": "$email" },
            "phone_no": { "$first": "$phone_no" },
            "status": { "$first": "$login.status" },
            "login_id": { "$first": "$login._id" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            console.log(data);
            res.render('view-battery-shop',{data})
        }
    })
   
})

adminRouter.get("/approve-battery-shop/:id", async (req, res) => {
    const id = req.params.id
    login.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } }).then((details) => {
        console.log("details==>", details);
        res.redirect('/admin/battery-shop')
    })

});

adminRouter.get("/delete-battery-shop/:id", async (req, res) => {
    const id = req.params.id
    login.deleteOne({ _id: id }).then((details) => {
        console.log("details==>",details.deletedCount);
       if(details.deletedCount===1){
        Batterydata.deleteOne({ login_id: id }).then((details) => {
            res.redirect('/admin/battery-shop')
        })
       }
    })

});





// adminRouter.get('/complaints',(req,res)=>{
//     complaints.aggregate([{
//         '$lookup': {
//             'from': 'charging_station_tbs',
//             'localField': 'charging_station_id',
//             'foreignField': '_id',
//             'as': 'charging_station'
//         }
//     },
//     {
//         '$lookup': {
//             'from': 'service_station_tbs',
//             'localField': 'service_station_id',
//             'foreignField': '_id',
//             'as': 'service_station'
//         }
//     },
//     {
//         "$unwind": "$charging_station"
//     },
//     {
//         "$unwind": "$service_station"
//     },
//     {
//         "$group": {
//             "_id": "$_id",
//             "name": { "$first": "$name" },
//             "email": { "$first": "$email" },
//             "phone_no": { "$first": "$phone_no" },
//             "status": { "$first": "$login.status" },
//             "login_id": { "$first": "$login._id" },

//         }
//     }
// ])
//     .then(function (data) {
//         if (data == 0) {
//             return res.status(401).json({
//                 success: false,
//                 error: true,
//                 message: "No Data Found!"
//             })
//         }
//         else {
//             console.log(data);
//             res.render('view-complaints',{data})
//         }
//     })
   
// })

adminRouter.get('/feedback',(req,res)=>{
    feedback.aggregate([{
        '$lookup': {
            'from': 'user_tbs',
            'localField': 'login_id',
            'foreignField': 'login_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "date": { "$first": "$date" },
            "feedback": { "$first": "$feedback" },
            "name": { "$first": "$login.name" },

        }
    }
])
    .then(function (data) {
        if (data == 0) {
            return res.status(401).json({
                success: false,
                error: true,
                message: "No Data Found!"
            })
        }
        else {
            console.log(data);
            res.render('view-feedback',{data})
        }
    })
   
})






module.exports = adminRouter