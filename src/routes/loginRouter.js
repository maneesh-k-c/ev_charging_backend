const express = require('express')
const LoginRouter = express.Router()
const bcrypt = require('bcryptjs')
const userRegister = require('../models/userData')
const login = require('../models/loginData')
const cstation = require('../models/chargingStationData')
const sstation = require('../models/serviceStationData')
const battery = require('../models/batteryData')
const jwt = require('jsonwebtoken')


LoginRouter.post("/", async (req, res) => {
    const { username, password } = req.body;
    console.log(username);

    try {
        const oldUser = await login.findOne({ username })
        if (!oldUser) return res.status(404).json({ success: false, error: true, message: "User doesn't Exist" })
        const isPasswordCorrect = await bcrypt.compare(password, oldUser.password)
        console.log("user", isPasswordCorrect);

        if (!isPasswordCorrect) return res.status(400).json({ success: false, error: true, message: "Incorrect password" })

        if (oldUser.role === '1') {
            if (oldUser.status == "1") {
                const chargingDetails = await cstation.findOne({ login_id: oldUser._id })
                if (chargingDetails) {
                    return res.status(200).json({
                        success: true,
                        error: false,
                        username: oldUser.username,
                        role: oldUser.role,
                        status: oldUser.status,
                        login_id: oldUser._id,
                        chargingStationIid: chargingDetails._id
                    })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    error: true,
                    login_id: oldUser._id,
                    message: "waiting for admins approval"
                })
            }
        }
        else if (oldUser.role === '2') {
            if (oldUser.status == "1") {
                const userDetails = await userRegister.findOne({ login_id: oldUser._id })
                if (userDetails) {
                    res.status(200).json({
                        success: true,
                        error: false,
                        username: oldUser.username,
                        role: oldUser.role,
                        status: oldUser.status,
                        login_id: oldUser._id,
                        name: userDetails.name,

                    })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    error: true,
                    login_id: oldUser._id,
                    message: "waiting for admins approval"
                })
            }
        }
        else if (oldUser.role === '3') {
            if (oldUser.status == "1") {
                const serviceDetails = await sstation.findOne({ login_id: oldUser._id })
                if (serviceDetails) {
                    res.status(200).json({
                        success: true,
                        error: false,
                        username: oldUser.username,
                        role: oldUser.role,
                        status: oldUser.status,
                        login_id: oldUser._id,
                        serviceStationName: serviceDetails.name,
                        serviceStationId: serviceDetails._id,

                    })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    error: true,
                    login_id: oldUser._id,
                    message: "waiting for admins approval"
                })
            }
        }
        else if (oldUser.role === '4') {
            if (oldUser.status == "1") {
                const serviceDetails = await battery.findOne({ login_id: oldUser._id })
                console.log(serviceDetails);
                if (serviceDetails) {
                    res.status(200).json({
                        success: true,
                        error: false,
                        username: oldUser.username,
                        role: oldUser.role,
                        status: oldUser.status,
                        login_id: oldUser._id,
                        shopName: serviceDetails.name,
                        batteryShopId: serviceDetails._id,

                    })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    error: true,
                    login_id: oldUser._id,
                    message: "waiting for admins approval"
                })
            }
        }
       
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" })
    }
})

LoginRouter.post("/admin-login", async (req, res) => {
    const { username, password } = req.body;
    console.log(username);

    try {
        const oldUser = await login.findOne({ username })
        if (!oldUser) return res.redirect('/admin')
        const isPasswordCorrect =  bcrypt.compare(password, oldUser.password)
        console.log("user", isPasswordCorrect);

        if (!isPasswordCorrect) return res.redirect('/admin')

        if (oldUser.role === '0') {
                const admin = await login.findOne({ _id: oldUser._id })
                if (admin) {
                    return res.redirect('/admin/index')
                }           
        }       
    } catch (error) {
        return res.status(500).redirect('/admin')
    }
})


module.exports = LoginRouter