const express = require('express')
const userRouter = express.Router()
const bcrypt = require('bcryptjs')
const login = require('../models/loginData')
const user = require('../models/userData')
const charging = require('../models/chargingStationData')
const service = require('../models/serviceStationData')
const checkAuth = require("../middleware/check-auth");
var ObjectId = require('mongodb').ObjectID;

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

userRouter.post('/service-station-register', (req, res) => {
    console.log("data " + JSON.stringify(req.body))
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'password hashing error'
            })
        }
        let logindata = {
            username: req.body.email,
            password: hashedPass,
            role: 3,
            status: 0
        }
        login.findOne({ username: req.body.username })
            .then(username => {
                if (username) {
                    return res.status(400).json({
                        success: false,
                        error: true,
                        message: 'email already exist!'
                    })
                }
                else {
                    var item = login(logindata)
                    item.save()
                        .then(() => {
                            login.findOne({ username: logindata.username })
                                .then(function (details) {
                                    var id = details._id
                                    let registerdata = {
                                        login_id: id,
                                        name: req.body.name,
                                        email: req.body.email,
                                        location: req.body.location,
                                        contact_no: req.body.contact_no,
                                        services: req.body.services,

                                    }
                                    service.findOne({ contact_no: registerdata.contact_no })
                                        .then((mobile) => {
                                            if (!mobile) {

                                                var register_item = service(registerdata)
                                                register_item.save()
                                                    .then(() => {
                                                        res.status(200).json({
                                                            success: true,
                                                            error: false,
                                                            message: 'registration success'
                                                        })
                                                    })

                                            }
                                            else {
                                                console.log(id)
                                                login.deleteOne({ _id: id })
                                                    .then(() => {

                                                        res.status(401).json({
                                                            success: false,
                                                            error: true,
                                                            message: 'Mobile number is already registered with us'
                                                        })


                                                    })

                                            }
                                        })


                                })

                        })

                }

            })
    })

})

userRouter.post('/charging-station-register', (req, res) => {
    console.log("data " + JSON.stringify(req.body))
    bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
        if (err) {
            return res.status(400).json({
                success: false,
                error: true,
                message: 'password hashing error'
            })
        }
        let logindata = {
            username: req.body.email,
            password: hashedPass,
            role: 1,
            status: 0
        }
        login.findOne({ username: req.body.username })
            .then(username => {
                if (username) {
                    return res.status(400).json({
                        success: false,
                        error: true,
                        message: 'email already exist!'
                    })
                }
                else {
                    var item = login(logindata)
                    item.save()
                        .then(() => {
                            login.findOne({ username: logindata.username })
                                .then(function (details) {
                                    var id = details._id
                                    let registerdata = {
                                        login_id: id,
                                        name: req.body.name,
                                        email: req.body.email,
                                        location: req.body.location.toLowerCase(),
                                        contact_no: req.body.contact_no,
                                        slots: req.body.slots,

                                    }
                                    charging.findOne({ contact_no: registerdata.contact_no })
                                        .then((mobile) => {
                                            if (!mobile) {

                                                var register_item = charging(registerdata)
                                                register_item.save()
                                                    .then(() => {
                                                        res.status(200).json({
                                                            success: true,
                                                            error: false,
                                                            message: 'registration success'
                                                        })
                                                    })

                                            }
                                            else {
                                                console.log(id)
                                                login.deleteOne({ _id: id })
                                                    .then(() => {

                                                        res.status(401).json({
                                                            success: false,
                                                            error: true,
                                                            message: 'Mobile number is already registered with us'
                                                        })


                                                    })

                                            }
                                        })


                                })

                        })

                }

            })
    })

})

userRouter.post('/register', async (req, res) => {
    console.log("data " + JSON.stringify(req.body))
    try {
        const oldUser = await login.findOne({ username: req.body.username });
        if (oldUser) {
            return res.status(400).json({ success: false, error: true, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const oldphone = await register.findOne({ phone: req.body.phone });
        if (oldphone) {
            return res.status(400).json({ success: false, error: true, message: "Phone number already exists" });
        }
        const oldemail = await register.findOne({ email: req.body.email });
        if (oldemail) {
            return res.status(400).json({ success: false, error: true, message: "Email id already exists" });
        }
        var log = { username: req.body.email, password: hashedPassword, role: 2, status: 1 }
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

userRouter.post('/approve-service-station/:id', (req, res) => {
    const id = req.params.id
    console.log(id);
    login.find({ _id: id }).then((data) => {
        if (data.login_id === 0) {
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
                    message: "approved"
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