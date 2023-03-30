const express = require('express')
const batteryRouter = express.Router()
const bcrypt = require('bcryptjs')
const battery = require('../models/batteryData')
const batteryDetails = require('../models/batteryDetailsData')


batteryRouter.get('/view-user-profile/:id', (req, res) => {
    const id = req.params.id
    user.find({ login_id: id })
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


batteryRouter.post('/add-battery', async(req, res) => {
 
    try {
        const {vehicle_name,model_name,capacity,amount,battery_shop_id} = req.body
        const oldData = await batteryDetails.findOne({ vehicle_name: vehicle_name });
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