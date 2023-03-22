const express = require('express')
const ChargeRouter = express.Router()
const bcrypt = require('bcryptjs')
const login = require('../models/loginData')
const user = require('../models/userData')
const charging = require('../models/chargingStationData')
const service = require('../models/serviceStationData')
const booking = require('../models/bookingData')
const slot = require('../models/slotsData')
const checkAuth = require("../middleware/check-auth");
var objectId = require('mongodb').ObjectID;


ChargeRouter.get('/view-single-charging-station/:id', (req, res) => {
    const id = req.params.id;
    charging.find({ _id: id })
        .then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

ChargeRouter.get('/charging-stations-bookings/:id', (req, res) => {
   const id = req.params.id;
    
    booking.aggregate([{
        '$lookup': {
            'from': 'charging_station_tbs',
            'localField': 'charging_station_id',
            'foreignField': '_id',
            'as': 'station'
        }
    }, {
        '$lookup': {
            'from': 'slot_tbs',
            'localField': '_id',
            'foreignField': 'booking_id',
            'as': 'slot'
        }
    }, {
        '$lookup': {
            'from': 'user_tbs',
            'localField': 'login_id',
            'foreignField': 'login_id',
            'as': 'user'
        }
    },
    {
        "$unwind": "$station"
    },
    {
        "$unwind": "$slot"
    },
    {
        "$unwind": "$user"
    },
    {
        "$match": {
            "charging_station_id": objectId(id)
        }
    },
    {
        "$group": {
            "_id": "$_id",
            "vehicle_number": { "$first": "$vehicle_number" },
            "amount": { "$first": "$amount" },
            "status": { "$first": "$status" },
            "vehicle_model": { "$first": "$vehicle_model" },
            "slot_no": { "$first": "$slot.slot_no" },
            "time": { "$first": "$slot.time" },
            "date": { "$first": "$slot.date" },
            "name": { "$first": "$user.name" },
            "phone_no": { "$first": "$user.phone_no" },

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
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

ChargeRouter.get('/charging-stations-approved-bookings/:id', (req, res) => {
    const id = req.params.id;
     
     booking.aggregate([{
         '$lookup': {
             'from': 'charging_station_tbs',
             'localField': 'charging_station_id',
             'foreignField': '_id',
             'as': 'station'
         }
     }, {
         '$lookup': {
             'from': 'slot_tbs',
             'localField': '_id',
             'foreignField': 'booking_id',
             'as': 'slot'
         }
     }, {
         '$lookup': {
             'from': 'user_tbs',
             'localField': 'login_id',
             'foreignField': 'login_id',
             'as': 'user'
         }
     },
     {
         "$unwind": "$station"
     },
     {
         "$unwind": "$slot"
     },
     {
         "$unwind": "$user"
     },
     {
         "$match": {
             "charging_station_id": objectId(id),
         }
     },
     {
         "$match": {
             "status": "1"
         }
     },
     {
         "$group": {
             "_id": "$_id",
             "vehicle_number": { "$first": "$vehicle_number" },
             "amount": { "$first": "$amount" },
             "status": { "$first": "$status" },
             "vehicle_model": { "$first": "$vehicle_model" },
             "slot_no": { "$first": "$slot.slot_no" },
             "time": { "$first": "$slot.time" },
             "date": { "$first": "$slot.date" },
             "name": { "$first": "$user.name" },
             "phone_no": { "$first": "$user.phone_no" },
 
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
                 return res.status(200).json({
                     success: true,
                     error: false,
                     data: data
                 })
             }
         })
 
 })

ChargeRouter.post('/slot-booking', (req, res) => {
    console.log("data " + JSON.stringify(req.body))

    let bookingData = {
        login_id: req.body.login_id,
        charging_station_id: req.body.charging_station_id,
        vehicle_type: req.body.vehicle_type,
        vehicle_model: req.body.vehicle_model,
        vehicle_fuel: req.body.vehicle_fuel,
        status: 0,
        vehicle_number: req.body.vehicle_number,
        amount: req.body.amount
    }




    var booking_item = booking(bookingData)
    booking_item.save()
        .then(() => {

            booking.find().sort({ _id: -1 }).limit(1).then((d) => {

                let slotData = {
                    booking_id: d[0]._id,
                    slot_no: req.body.slot_no,
                    time: req.body.time,
                    date: req.body.date,
                }
                var slot_item = slot(slotData)
                slot_item.save().then(() => {
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: 'booking success',
                    })
                })



            })

        })
        .catch((err) => {
            res.status(401).json({
                success: false,
                error: true,
                data: err,
                message: 'something went wrong'
            })
        })





})

ChargeRouter.get('/update-booking-status/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.updateOne(  { _id:id} , { $set: { status : 1  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"status updated"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

ChargeRouter.get('/cancel-booking/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.deleteOne({ _id:id}).then(()=>{
        slot.deleteOne({ booking_id: id }).then(()=>{
            res.status(200).json({
                success:true,
                error:false,
                message:"Booking Canceled"
            })
        })    
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

ChargeRouter.get('/update-charging-complete-status/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.updateOne(  { _id:id} , { $set: { status : 2  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"status updated"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

ChargeRouter.get('/charging-stations-completed-charging/:id', (req, res) => {
    const id = req.params.id;
     
     booking.aggregate([{
         '$lookup': {
             'from': 'charging_station_tbs',
             'localField': 'charging_station_id',
             'foreignField': '_id',
             'as': 'station'
         }
     }, {
         '$lookup': {
             'from': 'slot_tbs',
             'localField': '_id',
             'foreignField': 'booking_id',
             'as': 'slot'
         }
     }, {
         '$lookup': {
             'from': 'user_tbs',
             'localField': 'login_id',
             'foreignField': 'login_id',
             'as': 'user'
         }
     },
     {
         "$unwind": "$station"
     },
     {
         "$unwind": "$slot"
     },
     {
         "$unwind": "$user"
     },
     {
         "$match": {
             "charging_station_id": objectId(id),
         }
     },
     {
         "$match": {
             "status": "2"
         }
     },
     {
         "$group": {
             "_id": "$_id",
             "vehicle_number": { "$first": "$vehicle_number" },
             "amount": { "$first": "$amount" },
             "status": { "$first": "$status" },
             "vehicle_model": { "$first": "$vehicle_model" },
             "slot_no": { "$first": "$slot.slot_no" },
             "time": { "$first": "$slot.time" },
             "date": { "$first": "$slot.date" },
             "name": { "$first": "$user.name" },
             "phone_no": { "$first": "$user.phone_no" },
 
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
                 return res.status(200).json({
                     success: true,
                     error: false,
                     data: data
                 })
             }
         })
 
 })

 ChargeRouter.get('/user-charging-booked-details/:id', (req, res) => {
    const id = req.params.id;
     
     booking.aggregate([{
         '$lookup': {
             'from': 'charging_station_tbs',
             'localField': 'charging_station_id',
             'foreignField': '_id',
             'as': 'station'
         }
     }, {
         '$lookup': {
             'from': 'slot_tbs',
             'localField': '_id',
             'foreignField': 'booking_id',
             'as': 'slot'
         }
     }, {
         '$lookup': {
             'from': 'user_tbs',
             'localField': 'login_id',
             'foreignField': 'login_id',
             'as': 'user'
         }
     },
     {
         "$unwind": "$station"
     },
     {
         "$unwind": "$slot"
     },
     {
         "$unwind": "$user"
     },
     {
         "$match": {
             "user.login_id": objectId(id),
         }
     },
    
     {
         "$group": {
             "_id": "$_id",
             "Station_name": { "$first": "$station.name" },
             "Station_location": { "$first": "$station.location" },
             "contact_no": { "$first": "$station.contact_no" },
             "slot_no": { "$first": "$slot.slot_no" },
             "time": { "$first": "$slot.time" },
             "date": { "$first": "$slot.date" },
             "amount": { "$first": "$amount" },
             "status": { "$first": "$status" },
            
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
                 return res.status(200).json({
                     success: true,
                     error: false,
                     data: data
                 })
             }
         })
 
 })

 ChargeRouter.get('/view-booked-details-by-date/:id/:data', (req, res) => {
    const id = req.params.id;
    const date = req.params.data;
    booking.aggregate([{
        '$lookup': {
            'from': 'slot_tbs',
            'localField': '_id',
            'foreignField': 'booking_id',
            'as': 'slot'
        }
    }, {
        '$lookup': {
            'from': 'user_tbs',
            'localField': 'login_id',
            'foreignField': 'login_id',
            'as': 'user'
        }
    },
    {
        "$unwind": "$slot"
    },
    {
        "$unwind": "$user"
    },
    {
        "$match": {
            "charging_station_id": objectId(id),
        }
    },
    {
        "$match": {
            "slot.date": date
        }
    },
    {
        "$group": {
            "_id": "$_id",
            "vehicle_number": { "$first": "$vehicle_number" },
            "amount": { "$first": "$amount" },
            "status": { "$first": "$status" },
            "vehicle_model": { "$first": "$vehicle_model" },
            "slot_no": { "$first": "$slot.slot_no" },
            "time": { "$first": "$slot.time" },
            "date": { "$first": "$slot.date" },
            "name": { "$first": "$user.name" },
            "phone_no": { "$first": "$user.phone_no" },

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
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})

ChargeRouter.get('/check-slot-availability/:id/:slot/:time', (req, res) => {
    const id = req.params.id;
    const slot_no = req.params.slot;
    const time = req.params.time;
    booking.aggregate([{
        '$lookup': {
            'from': 'slot_tbs',
            'localField': '_id',
            'foreignField': 'booking_id',
            'as': 'slot'
        }
    },
    {
        "$unwind": "$slot"
    },
   
    {
        "$match": {
            "charging_station_id": objectId(id),
        }
    },
    {
        "$match": {
            "slot.slot_no": slot_no
        }
    },
    {
        "$match": {
            "slot.time": time
        }
    },
    {
        "$group": {
            "_id": "$_id",
            "vehicle_number": { "$first": "$vehicle_number" },
            "amount": { "$first": "$amount" },
            "status": { "$first": "$status" },
            "vehicle_model": { "$first": "$vehicle_model" },
            "slot_no": { "$first": "$slot.slot_no" },
            "time": { "$first": "$slot.time" },
            "date": { "$first": "$slot.date" },

        }
    }


    ])
    .then(function (data) {
            if (data == 0) {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "Slot is available!"
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message:"Slot is busy"
                })
            }
        })

})

ChargeRouter.get('/search/:id', (req, res) => {
    const locations = req.params.id
   

    // let searchData = {
    //     location: req.body.location,
    // }
    if (locations) {


        charging.find({location: new RegExp('.*' + locations.toLowerCase() + '.*')})
            .then((data) => {

                res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            })
            .catch((err) => {
                res.status(401).json({
                    success: false,
                    error: true,
                    data: err,
                    message: 'something went wrong'
                })
            })
    }
    else {
        res.status(401).json({
            success: false,
            error: true,
            message: 'input something'
        })
    }





})

ChargeRouter.get('/charging-station-profile/:id', (req, res) => {
    const id =req.params.id
    charging.find({login_id : id})
    .then(function (data) {
            if (data == 0) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "No Data Found!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    data: data
                })
            }
        })

})






module.exports = ChargeRouter