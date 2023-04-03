const express = require('express')
const adminRouter = express.Router()
adminRouter.use(express.static('./public'))
const user = require('../models/userData')
const login = require('../models/loginData')


adminRouter.get('/',(req,res)=>{
    res.render('index')
})
adminRouter.get('/view-user',(req,res)=>{
    user.aggregate([{
        '$lookup': {
            'from': 'login_tbs',
            'localField': 'login_id',
            'foreignField': '_id',
            'as': 'login'
        }
    },
    {
        "$unwind": "$login"
    },
    {
        "$group": {
            "_id": "$_id",
            "name": { "$first": "$name" },
            "email": { "$first": "$email" },
            "phone_no": { "$first": "$phone_no" },
            "status": { "$first": "$login.status" },
            "login_id": { "$first": "$login._id" },

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
            console.log(data);
            res.render('view-user',{data})
        }
    })
   
})

adminRouter.get("/approve/:id", async (req, res) => {
    const id = req.params.id
    login.findByIdAndUpdate({ _id: id }, { $set: { status: 1 } }).then((details) => {
        console.log("details==>", details);
        res.redirect('/admin/view-user')
    })

});

adminRouter.get("/delete/:id", async (req, res) => {
    const id = req.params.id
    login.deleteOne({ _id: id }).then((details) => {
        console.log("details==>",details.deletedCount);
       if(details.deletedCount===1){
        user.deleteOne({ login_id: id }).then((details) => {
            res.redirect('/admin/view-user')
        })
       }
    })

});






module.exports = adminRouter