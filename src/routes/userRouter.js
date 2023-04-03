const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const login = require('../models/loginData')
const user = require('../models/userData')
const register = require('../models/userData')
const charging = require('../models/chargingStationData')
const service = require('../models/serviceStationData')
const battery = require('../models/batteryData')
const checkAuth = require("../middleware/check-auth");
var ObjectId = require('mongodb').ObjectID;


userRouter.post('/update-battery-shop/:id', (req, res) => { 
    const {name,address,email,phone_no,location} = req.body
    const id = req.params.id
    console.log(id);
    battery.updateOne({ _id: id }, { $set: {name,address,email,phone_no,location} }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details updated"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

userRouter.post('/update-user-profile/:id', (req, res) => { 
    const {name,address,email,phone_no,location} = req.body
    const id = req.params.id
    console.log(id);
    register.updateOne({ _id: id }, { $set: {name,address,email,phone_no,location} }).then((data) => {
        console.log(data);
        res.status(200).json({
            success: true,
            error: false,
            message: "Details updated"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

userRouter.get('/view-user', (req, res) => {
    user.find()
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

userRouter.get('/view-user-profile/:id', (req, res) => {
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

userRouter.get('/view-charging-station-profile/:id', (req, res) => {
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

userRouter.get('/view-battery-shop-profile/:id', (req, res) => {
    const id = req.params.id
    battery.find({ login_id: id })
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

userRouter.get('/view-service-station-profile/:id', (req, res) => {
    const id = req.params.id
    service.find({ login_id: id })
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

userRouter.get('/admin-view-user', (req, res) => {
    login.aggregate([{
        '$lookup': {
            'from': 'user_tbs',
            'localField': '_id',
            'foreignField': 'login_id',
            'as': 'details'
        },
    },
    {
        '$match': {
            'role': '2'
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

userRouter.post('/service-station-register', async(req, res) => {
    console.log("data " + JSON.stringify(req.body))
    try {
        const oldUser = await login.findOne({ username: req.body.username });
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const oldphone = await service.findOne({ phone_no: req.body.phone_no });
        if (oldphone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        const oldemail = await service.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(400).json({ success: false, error: true, message: "Email id already exists" });
        }
        var log = { username: req.body.username, password: hashedPassword, role: 3, status: 0 }
        const result = await login(log).save()
        var reg ={login_id: result._id, name: req.body.name,email: req.body.email,phone_no: req.body.phone_no,location: req.body.location,address: req.body.address,} 
        const result2 = await service(reg).save()
        if (result2) {
            res.status(201).json({ success: true, error: false, message: "Registration completed", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})

userRouter.post('/charging-station-register', async(req, res) => {
    console.log("data " + JSON.stringify(req.body))
    try {
        const oldUser = await login.findOne({ username: req.body.username });
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const oldphone = await charging.findOne({ phone_no: req.body.phone_no });
        if (oldphone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        const oldemail = await register.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(400).json({ success: false, error: true, message: "Email id already exists" });
        }
        var log = { username: req.body.username, password: hashedPassword, role: 1, status: 0 }
        const result = await login(log).save()
        var reg ={login_id: result._id, name: req.body.name,email: req.body.email,phone_no: req.body.phone_no,address: req.body.address,location: req.body.location,slots: req.body.slots,} 
        const result2 = await charging(reg).save()
        if (result2) {
            res.status(201).json({ success: true, error: false, message: "Registration completed", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})

userRouter.post('/battery-shop-register', async(req, res) => {
    console.log("data " + JSON.stringify(req.body))
    try {
        const oldUser = await login.findOne({ username: req.body.username });
        console.log(oldUser);
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const oldphone = await battery.findOne({ phone_no: req.body.phone_no });
        if (oldphone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        const oldemail = await battery.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(400).json({ success: false, error: true, message: "Email id already exists" });
        }
        var log = { username: req.body.username, password: hashedPassword, role: 4, status: 0 }
        const result = await login(log).save()
        var reg ={login_id: result._id, name: req.body.name,address:req.body.address,email: req.body.email,phone_no: req.body.phone_no,location: req.body.location,slots: req.body.slots,} 
        const result2 = await battery(reg).save()
        if (result2) {
            res.status(201).json({ success: true, error: false, message: "Registration completed", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }

})

userRouter.post('/register', async (req, res) => {
    console.log("data " + JSON.stringify(req.body))
    try {
        const oldUser = await login.findOne({ username: req.body.username });
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const oldphone = await register.findOne({ phone_no: req.body.phone_no });
        if (oldphone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        const oldemail = await register.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(400).json({ success: false, error: true, message: "Email id already exists" });
        }
        var log = { username: req.body.username, password: hashedPassword, role: 2, status: 0 }
        const result = await login(log).save()
        var reg ={login_id: result._id, name: req.body.name,email: req.body.email,phone_no: req.body.phone_no,location: req.body.location,address: req.body.address,} 
        const result2 = await register(reg).save()
        if (result2) {
            res.status(201).json({ success: true, error: false, message: "Registration completed", details: result2 });
        }

    } catch (error) {
        res.status(500).json({ success: false, error: true, message: "Something went wrong" });
        console.log(error);
    }


})

userRouter.delete('/delete-user/:id', (req, res) => {
    const id = req.params.id   // login id 
    login.deleteOne({ _id: id }).then(function () {
        user.deleteOne({ login_id: id })
            .then(function () {
                res.status(200).json({
                    success: true,
                    error: false,
                    message: 'user deleted!'
                })
            })
    })
        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })
})

userRouter.get('/approve/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.find({ _id: id }).then((data) => {
        console.log("ddd==>", data[0]);
        if (data[0].status === '0') {
            login.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "approved"
                })

            }).catch(err => {
                return res.status(401).json({
                    message: "Something went Wrong!"
                })
            })
        } else if (data[0].status === '1') {
            login.updateOne({ _id: id }, { $set: { status: 0 } }).then((user) => {
                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "approved"
                })

            }).catch(err => {
                return res.status(401).json({
                    message: "Something went Wrong!"
                })
            })
        }
    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

userRouter.post('/approve-charging-station/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
        console.log(user);
        res.status(200).json({
            success: true,
            error: false,
            message: "approved"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

userRouter.post('/approve-battery-shop/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
        console.log(user);
        res.status(200).json({
            success: true,
            error: false,
            message: "approved"
        })

    }).catch(err => {
        return res.status(401).json({
            message: "Something went Wrong!"
        })
    })

})

userRouter.post('/approve-service-station/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.find({ _id: id }).then((data) => {
        console.log("data",data);
        if (data[0].status === "0") {
            login.updateOne({ _id: id }, { $set: { status: 1 } }).then((user) => {
                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "approved"
                })

            }).catch(err => {
                return res.status(401).json({
                    message: "Something went Wrong!"
                })
            })
        } else {
            login.updateOne({ _id: id }, { $set: { status: 0 } }).then((user) => {
                console.log(user);
                res.status(200).json({
                    success: true,
                    error: false,
                    message: "Disapproved"
                })

            }).catch(err => {
                return res.status(401).json({
                    message: "Something went Wrong!"
                })
            })
        }
    })
        .catch(err => {
            return res.status(401).json({
                message: "Something went Wrong!"
            })
        })


})

userRouter.get('/view-charging-station', (req, res) => {
    charging.find()
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

userRouter.get('/view-battery-shop', (req, res) => {
    battery.find()
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

userRouter.get('/admin-view-charging-station', (req, res) => {
    login.aggregate([{
        '$lookup': {
            'from': 'charging_station_tbs',
            'localField': '_id',
            'foreignField': 'login_id',
            'as': 'details'
        },
    },
    {
        '$match': {
            'role': '1'
        }
    }

    ])
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

userRouter.get('/view-service-station', (req, res) => {
    service.find()
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

userRouter.get('/admin-view-service-station', (req, res) => {
    login.aggregate([{
        '$lookup': {
            'from': 'service_station_tbs',
            'localField': '_id',
            'foreignField': 'login_id',
            'as': 'details'
        },
    },
    {
        '$match': {
            'role': '3'
        }
    }

    ])
        .then((data) => {
            res.status(200).json({
                success: true,
                error: false,
                data: data
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "something wrong"
            })
        })

})

module.exports = userRouter