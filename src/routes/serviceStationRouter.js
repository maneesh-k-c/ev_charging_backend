const express = require('express')
const serviceRouter = express.Router()
const bcrypt = require('bcryptjs')
const login = require('../models/loginData')
const user = require('../models/userData')
const charging = require('../models/chargingStationData')
const service = require('../models/serviceStationData')
const booking = require('../models/serviceBookingData')
const services = require('../models/serviceData')
const checkAuth=require("../middleware/check-auth");
var objectId = require('mongodb').ObjectID;

serviceRouter.get('/view-all-booking/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ login_id: id })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})
serviceRouter.get('/service-accept-view/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ service_station_id: id, status:"1" })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

serviceRouter.get('/service-accept/:id', async(req, res) => {
    const id = req.params.id
        try{
            const oldData = await booking.updateOne({ _id:id},{$set:{status:"1"}});
            
            if (oldData) {
                return res.status(400).json({ success: false, error: true, message: "Booking accepted" });
            }
          
        }catch(err) {
                res.status(401).json({
                    success: false,
                    error: true,
                    data: err,
                    message: 'something went wrong'
                })
            }
        
    })

serviceRouter.get('/booked-single-service-user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ _id: id })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

serviceRouter.get('/view-booked-service-station/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ service_station_id: id, status:"0" })
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
    } catch (error) {
        return res.status(200).json({
            success: true,
            error: false,
            message: "Something went wrong"
        })
    }


})

serviceRouter.post('/service-booking', async(req, res) => {

    let bookingData = {
        login_id: req.body.login_id,
        service_station_id: req.body.service_station_id,
        service_id: req.body.service_id,
        service_name: req.body.service_name,
        date: req.body.date,
        duration: req.body.duration,
        status: 0,
        amount: req.body.amount
    }


    try{
        const oldData = await booking.findOne({ service_name: req.body.service_name,date: req.body.date,status:0 });
        console.log(oldData);
        if (oldData) {
            return res.status(400).json({ success: false, error: true, message: "Service not available today" });
        }
        const result = await booking(bookingData).save()
        if (result) {
            res.status(201).json({ success: true, error: false, message: "slot booked ", details: result });
        }
    }catch(err) {
            res.status(401).json({
                success: false,
                error: true,
                data: err,
                message: 'something went wrong'
            })
        }
    
})

serviceRouter.post('/add-service', async(req, res) => {
 
    try {
        const {service_name,amount,service_station_id,duration} = req.body
        const oldData = await services.findOne({ service_name: service_name });
        if (oldData) {
            return res.status(400).json({ success: false, error: true, message: "Service already exists" });
        }
        const result = await services.create({service_name,amount,service_station_id,duration})
        if (result) {
            res.status(201).json({ success: true, error: false, message: "Service Added", details: result });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})

serviceRouter.get('/view-services/:id', (req, res) => {
    const id = req.params.id;
    services.find({service_station_id: id})
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

serviceRouter.get('/delete-services/:id', (req, res) => {
    const id = req.params.id
    services.deleteOne({ _id: id })
        .then(function (data) {
            if (!data) {
                return res.status(401).json({
                    success: false,
                    error: true,
                    message: "Something went wrong!"
                })
            }
            else {
                return res.status(200).json({
                    success: true,
                    error: false,
                    message: "Service deleted"
                })
            }
        })

})

serviceRouter.post('/update-service/:id', (req, res) => {
    const {service_name,amount,duration} = req.body
    const id = req.params.id
    console.log(id);
    services.updateOne({ _id: id }, { $set: {service_name,amount,duration} }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Service updated"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})






serviceRouter.get('/view-single-station/:id', (req, res) => {
    const id = req.params.id;
    service.find({_id: id})
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

serviceRouter.post('/service-booking', (req, res) => {
    console.log("data " + JSON.stringify(req.body))

    let bookingData = {
        login_id: req.body.login_id,
        service_station_id: req.body.service_station_id,
        vehicle_number: req.body.vehicle_number,
        complaint_title: req.body.complaint_title,
        description: req.body.description,        
        type_of_service: req.body.type_of_service,
        date: req.body.date,
        amount:req.body.amount,
        status: 0,
    }

    var booking_item = booking(bookingData)
    booking_item.save()
        .then(() => {           
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: 'service booked',
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

serviceRouter.get('/service-station-booking-details/:id', (req, res) => {
    const id = req.params.id;
    booking.find({service_station_id: id})
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

serviceRouter.get('/approve-booking/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.updateOne(  { _id:id} , { $set: { status : 1  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"approved"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

serviceRouter.get('/complete-service/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.updateOne(  { _id:id} , { $set: { status : 2  } } ).then((user)=>{
        console.log(user);
        res.status(200).json({
            success:true,
            error:false,
            message:"completed"
        })
        
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })
 
})

serviceRouter.get('/view-user-booked-service/:id', (req, res) => {
    const id = req.params.id;
    booking.aggregate([
        {
          '$lookup': {
            'from': 'user_tbs', 
            'localField': 'login_id', 
            'foreignField': 'login_id', 
            'as': 'user'
          }
        },
        {
            '$lookup': {
              'from': 'service_station_tbs', 
              'localField': 'service_station_id', 
              'foreignField': '_id', 
              'as': 'station'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$station"
        },
        {
            "$match": {
                "login_id": objectId(id),
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "vehicle_number": { "$first": "$vehicle_number" },
                "complaint_title": { "$first": "$complaint_title" },
                "amount": { "$first": "$amount" },
                "date": { "$first": "$date" },
                "slot_no": { "$first": "$slot.slot_no" },
                "station_name": { "$first": "$station.name" },
                "contact_no": { "$first": "$station.contact_no" },
                "services": { "$first": "$station.services" },
    
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

serviceRouter.get('/view-approved-services/:id', (req, res) => {
    const id = req.params.id;
     
    booking.aggregate([
        {
          '$lookup': {
            'from': 'user_tbs', 
            'localField': 'login_id', 
            'foreignField': 'login_id', 
            'as': 'user'
          }
        },
        {
            '$lookup': {
              'from': 'service_station_tbs', 
              'localField': 'service_station_id', 
              'foreignField': '_id', 
              'as': 'station'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$station"
        },
        {
            "$match": {
                "service_station_id": objectId(id),
            }
        },
        {
            "$match": {
                "status": "1",
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "vehicle_number": { "$first": "$vehicle_number" },
                "complaint_title": { "$first": "$complaint_title" },
                "amount": { "$first": "$amount" },
                "date": { "$first": "$date" },
                "slot_no": { "$first": "$slot.slot_no" },
                "station_name": { "$first": "$station.name" },
                "contact_no": { "$first": "$station.contact_no" },
                "services": { "$first": "$station.services" },
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

 serviceRouter.get('/view-completed-services/:id', (req, res) => {
    const id = req.params.id;
     
    booking.aggregate([
        {
          '$lookup': {
            'from': 'user_tbs', 
            'localField': 'login_id', 
            'foreignField': 'login_id', 
            'as': 'user'
          }
        },
        {
            '$lookup': {
              'from': 'service_station_tbs', 
              'localField': 'service_station_id', 
              'foreignField': '_id', 
              'as': 'station'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$station"
        },
        {
            "$match": {
                "service_station_id": objectId(id),
            }
        },
        {
            "$match": {
                "status": "2",
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "vehicle_number": { "$first": "$vehicle_number" },
                "complaint_title": { "$first": "$complaint_title" },
                "amount": { "$first": "$amount" },
                "date": { "$first": "$date" },
                "slot_no": { "$first": "$slot.slot_no" },
                "station_name": { "$first": "$station.name" },
                "contact_no": { "$first": "$station.contact_no" },
                "services": { "$first": "$station.services" },
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

serviceRouter.get('/view-pending-services/:id', (req, res) => {
    const id = req.params.id;
     
    booking.aggregate([
        {
          '$lookup': {
            'from': 'user_tbs', 
            'localField': 'login_id', 
            'foreignField': 'login_id', 
            'as': 'user'
          }
        },
        {
            '$lookup': {
              'from': 'service_station_tbs', 
              'localField': 'service_station_id', 
              'foreignField': '_id', 
              'as': 'station'
            }
          },
        {
            "$unwind": "$user"
        },
        {
            "$unwind": "$station"
        },
        {
            "$match": {
                "service_station_id": objectId(id),
            }
        },
        {
            "$match": {
                "status": "1",
            }
        },
        {
            "$group": {
                "_id": "$_id",
                "vehicle_number": { "$first": "$vehicle_number" },
                "complaint_title": { "$first": "$complaint_title" },
                "amount": { "$first": "$amount" },
                "date": { "$first": "$date" },
                "station_name": { "$first": "$station.name" },
                "contact_no": { "$first": "$station.contact_no" },
                "services": { "$first": "$station.services" },
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

serviceRouter.get('/view-booked-service-by-date/:id/:data', (req, res) => {
    const id = req.params.id;
    const date = req.params.data;
    booking.find({"$and":[{"service_station_id":id},{"date":date}]})
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


module.exports = serviceRouter