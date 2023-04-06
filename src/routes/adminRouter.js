const express = require('express')
const adminRouter = express.Router()
adminRouter.use(express.static('./public'))
const user = require('../models/userData')
const login = require('../models/loginData')
const serviceStation = require('../models/serviceStationData')
const ChargingStationdata = require('../models/chargingStationData')
const Batterydata = require('../models/batteryData')





adminRouter.get('/',(req,res)=>{
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





adminRouter.get('/complaints',(req,res)=>{
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
            res.render('view-user',{data})
        }
    })
   
})

adminRouter.get('/feedback',(req,res)=>{
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
            res.render('view-user',{data})
        }
    })
   
})






module.exports = adminRouter