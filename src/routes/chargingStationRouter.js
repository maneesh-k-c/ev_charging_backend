const express = require('express')
const ChargeRouter = express.Router()
const charging = require('../models/chargingStationData')
const booking = require('../models/bookingData')
const slot = require('../models/slotsData')
var objectId = require('mongodb').ObjectID;

ChargeRouter.get('/charging-station-accept-booking/:id', async(req, res) => {
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

ChargeRouter.get('/charging-station-reject-booking/:id', async(req, res) => {
    const id = req.params.id
        try{
            const oldData = await booking.updateOne({ _id:id},{$set:{status:"2"}});
            
            if (oldData) {
                return res.status(400).json({ success: false, error: true, message: "Booking rejected" });
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

ChargeRouter.get('/charging-station-complete-booking/:id', async(req, res) => {
        const id = req.params.id
            try{
                const oldData = await booking.updateOne({ _id:id},{$set:{status:"3"}});
                
                if (oldData) {
                    return res.status(400).json({ success: false, error: true, message: "Booking completed" });
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

ChargeRouter.get('/completed/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ charging_station_id: id, status:"3" })
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

ChargeRouter.post('/slot-booking', async(req, res) => {

    let bookingData = {
        login_id: req.body.login_id,
        charging_station_id: req.body.charging_station_id,
        date: req.body.date,
        slot_no: req.body.slot_no,
        time: req.body.time,
        status: 0,
        amount: req.body.amount
    }


    try{
        const oldData = await booking.findOne({ time: req.body.time, date: req.body.date,status:0,slot_no: req.body.slot_no });
        console.log(oldData);
        if (oldData) {
            return res.status(400).json({ success: false, error: true, message: "Time not available" });
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

ChargeRouter.get('/view-booked-slots-charging-station/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ charging_station_id: id, status:"0" })
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

ChargeRouter.get('/view-accepted-slots-charging-station/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ charging_station_id: id, status:"1" })
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

ChargeRouter.get('/view-booked-slots-user/:id', async (req, res) => {
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

ChargeRouter.get('/booked-single-slots-user/:id', async (req, res) => {
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


ChargeRouter.post('/add-slot', async (req, res) => {

    try {
        const oldSlot = await slot.findOne({ charging_station_id: req.body.charging_station_id });
        if (oldSlot) {
            if (oldSlot.slot_no === req.body.slot_no) {
                return res.status(400).json({ success: false, error: true, message: "Slot already exists" });
            }
        }
        var data = { charging_station_id: req.body.charging_station_id, slot_no: req.body.slot_no, status: 'Available' }
        const result = await slot(data).save()
        if (result) {
            return res.status(200).json({ success: true, error: false, message: "Slot added" });
        }
    } catch (error) {
        return res.status(400).json({ success: false, error: true, message: "Something went wrong" });
    }
})

ChargeRouter.get('/view-slots/:id', async (req, res) => {
    try {
        const id = req.params.id;
        slot.find({ charging_station_id: id })
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



ChargeRouter.get('/update-booking-status/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    booking.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
        console.log(user);
        res.status(200).json({
            success: true,
            error: false,
            message: "status updated"
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
    booking.deleteOne({ _id: id }).then(() => {
        slot.deleteOne({ booking_id: id }).then(() => {
            res.status(200).json({
                success: true,
                error: false,
                message: "Booking Canceled"
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
    booking.updateOne({ _id: id }, { $set: { status: 2 } }).then((user) => {
        console.log(user);
        res.status(200).json({
            success: true,
            error: false,
            message: "status updated"
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
                    message: "Slot is busy"
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


        charging.find({ location: new RegExp('.*' + locations.toLowerCase() + '.*') })
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
    const id = req.params.id
    charging.find({ login_id: id })
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