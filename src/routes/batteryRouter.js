const express = require('express')
const batteryRouter = express.Router()
const bcrypt = require('bcryptjs')
const batteryDetails = require('../models/batteryDetailsData')

batteryRouter.get('/update-battery/:id', (req, res) => {
    const {vehicle_name,model_name,capacity,amount} = req.body
    const id = req.params.id
    console.log(id);
    booking.updateOne({ _id: id }, { $set: {vehicle_name,model_name,capacity,amount} }).then((data) => {
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
        const result = await batteryDetails.create({vehicle_name,model_name,capacity,amount,battery_shop_id})
        if (result) {
            res.status(201).json({ success: true, error: false, message: "Battery Added", details: result });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})


module.exports = batteryRouter