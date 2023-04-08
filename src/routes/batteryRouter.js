const express = require('express')
const batteryRouter = express.Router()
const bcrypt = require('bcryptjs')
const batteryDetails = require('../models/batteryDetailsData')
const booking = require('../models/batteryBooking')

batteryRouter.get('/accept-completed/:id', async(req, res) => {
    const id = req.params.id
        try{
            const oldData = await booking.updateOne({ _id:id},{$set:{status:"1"}});
            
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

batteryRouter.get('/completed-view/:id', async (req, res) => {
        try {
            const id = req.params.id;
            booking.find({ battery_shop_id: id, status:"1" })
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

batteryRouter.post('/battery-booking', async(req, res) => {

    let bookingData = {
        login_id: req.body.login_id,
        battery_id: req.body.battery_id,
        battery_shop_id: req.body.battery_shop_id,
        vehicle_name: req.body.vehicle_name,
        model_name: req.body.model_name,
        capacity: req.body.capacity,
        amount: req.body.amount,
        date: req.body.date,
        status: '0'
    }


    try{
        const result = await booking(bookingData).save()
        if (result) {
            res.status(201).json({ success: true, error: false, message: "battery booked ", details: result });
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

batteryRouter.get('/battery-booked-single-view/:id', async (req, res) => {
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

batteryRouter.get('/view-booked-batteries-battery-shop/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ battery_shop_id: id, status:"0" })
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

batteryRouter.get('/battery-shop-complete-booking/:id', async(req, res) => {
    const id = req.params.id
        try{
            const oldData = await booking.updateOne({ _id:id},{$set:{status:"1"}});
            
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

batteryRouter.get('/view-completed-battery-shop/:id', async (req, res) => {
    try {
        const id = req.params.id;
        booking.find({ battery_shop_id: id, status:"1" })
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

batteryRouter.get('/user-view-battery-booking/:id', async (req, res) => {
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

batteryRouter.post('/update-battery/:id', (req, res) => {
    const {vehicle_name,model_name,capacity,amount} = req.body
    const id = req.params.id
    console.log(id);
    batteryDetails.updateOne({ _id: id }, { $set: {vehicle_name,model_name,capacity,amount} }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Battery updated"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

batteryRouter.get('/view-battery/:id', (req, res) => {
    const id = req.params.id
    batteryDetails.find({ battery_shop_id: id })
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

batteryRouter.get('/view-single-battery/:id', (req, res) => {
    const id = req.params.id
    batteryDetails.find({ _id: id })
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

batteryRouter.get('/delete-battery/:id', (req, res) => {
    const id = req.params.id
    batteryDetails.deleteOne({ _id: id })
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
                    message: "Battery deleted"
                })
            }
        })

})


batteryRouter.post('/add-battery', async(req, res) => {
 
    try {
        const {vehicle_name,model_name,capacity,amount,battery_shop_id} = req.body
        const oldData = await batteryDetails.findOne({ model_name: model_name });
        if (oldData) {
            return res.status(400).json({ success: false, error: true, message: "Name already exists" });
        }
        const result = await batteryDetails.create({vehicle_name,model_name,capacity,amount,battery_shop_id,status:"0"})
        if (result) {
            res.status(201).json({ success: true, error: false, message: "Battery Added", details: result });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})


module.exports = batteryRouter