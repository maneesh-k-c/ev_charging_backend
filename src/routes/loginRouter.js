const express = require('express')
const LoginRouter = express.Router()
const bcrypt = require('bcryptjs')
const userRegister = require('../models/userData')
const login = require('../models/loginData')
const cstation = require('../models/chargingStationData')
const sstation = require('../models/serviceStationData')
const jwt = require('jsonwebtoken')

LoginRouter.post('/',(req, res)=>{
    console.log("logindata====",req.body)
    let fetchedUser
    login.findOne({username: req.body.username})
    .then((user)=>{
       
        if(!user){
            return res.status(401).json({
                success:false,
                error:true,
                message:"User Not Found!"
            })
        }
            fetchedUser = user
            return bcrypt.compare(req.body.password, user.password)      
    })
    .then(result=>{
        if(!result){
            return res.status(401).json({
                success:false,
                error:true,
                message:"Please Check Password!"
            })
        }
        id = fetchedUser._id
        console.log(fetchedUser);
        if(fetchedUser.role=="0"){
            login.findOne({login_id:id})
                .then((registerData)=>{
                    const token = jwt.sign(
                        {username:fetchedUser.username, role:fetchedUser.role,
                            userId:fetchedUser._id},
                        "secret_this_should_be_longer",
                        { expiresIn: "5h" }
                    )
                    res.status(200).json({
                        success:true,
                        error:false,
                        token: token,
                        expiresIn: 3600,
                         role:fetchedUser.role,
                        loginId: fetchedUser._id,
                    })
                })
    }
        if(fetchedUser.role=="1"){
              if(fetchedUser.status=="1"){
            console.log("approved");
            cstation.findOne({login_id:id})
            .then((registerData)=>{
                const token = jwt.sign(
                    {username:fetchedUser.username, role:fetchedUser.role,
                        userId:fetchedUser._id},
                    "secret_this_should_be_longer",
                    { expiresIn: "5h" }
                )
                res.status(200).json({
                    success:true,
                    error:false,
                    token: token,
                    expiresIn: 3600,
                    role:fetchedUser.role,
                    chargingStationName:registerData.name,
                    chargingStation_id:registerData._id,
                    loginId: fetchedUser._id,
                })
            })
     
        } 
        else{
            res.status(200).json({
                success:false,
                error:true,
              message:"request pending!!!!!!!!!!"
            })
        }
        }
        else if(fetchedUser.role=="2"){
            if(fetchedUser.status=="1"){
                console.log("approved");
                userRegister.findOne({login_id:id})
                .then((registerData)=>{
                    // console.log("membersss",registerData.members.length);
                    const token = jwt.sign(
                        {username:fetchedUser.username, role:fetchedUser.role,
                            userId:fetchedUser._id},
                        "secret_this_should_be_longer",
                        { expiresIn: "1h" }
                    )

                    res.status(200).json({
                        success:true,
                        error:false,
                        token: token,
                        expiresIn: 3600,
                         role:fetchedUser.role,
                        loginId: fetchedUser._id,
                        name: registerData.name,
                       
                    })
                })
         
            }
            else{
                res.status(200).json({
                    success:false,
                    error:true,
                  message:"request pending!!!!!!!!!!"
                })
            }
        }
        else if(fetchedUser.role=="3"){
            if(fetchedUser.status=="1"){
                console.log("approved");
                sstation.findOne({login_id:id})
                .then((registerData)=>{
                    const token = jwt.sign(
                        {username:fetchedUser.username, userRole:fetchedUser.role,
                            userId:fetchedUser._id},
                        "secret_this_should_be_longer",
                        { expiresIn: "5h" }
                    )
                    res.status(200).json({
                        success:true,
                        error:false,
                        token: token,
                        expiresIn: 3600,
                         role:fetchedUser.role,
                        loginId: fetchedUser._id,
                        name:registerData.name,
                        service_station_id:registerData._id,
                      
                    })
                })
         
            }
            else{
                res.status(200).json({
                    success:false,
                    error:true,
                  message:"request pending!!!!!!!!!!"
                })
            }
        }
       
       
       
    })
    .catch(err=>{
        return res.status(401).json({
            message: "Auth failed"
        })
    })
})

module.exports = LoginRouter