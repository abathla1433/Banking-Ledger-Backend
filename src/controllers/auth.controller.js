const userModel=require("../models/user.model");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const tokenblackListModel=require("../models/blacklist.model");
const emailService=require("../services/email.service");


/** 
- REGISTER USER
- /api/auth/register
*/
async function userRegisterController(req,res){
    const {email,name,password}=req.body;
    console.log(req.body);
    try{
        const isExist=await userModel.findOne({email:email});
        if(isExist){
            return res.status(422).json({
                "message":"user already exists with email!!",
            })
        }

        const user=await userModel.create({
            email:email,
            password:password,
            name:name
        });

        const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"});
        console.log(token);
        res.cookie("token",token);

        res.status(201).json({
            "message":"User registered successfully!!",
            "user":{
                _id:user._id,
                name:user.name     
            },
            "token":token
            
        });

        await emailService.sendRegistrationEmail(user.email,user.name);

    }catch(err){
        console.log("User registration failed!!");
        res.status(500).json({
            "message":"User registration failed!!",
            "error":err.message
        })
    }
}


/**
 *- LOGIN USER
 *- /api/auth/login
 */
async function userLoginController(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password");
    if(!user){
        return res.status(400).json({
            "message":"Email or password is invalid"
        })
    }
    console.log(req.body);
    const isAuth=await user.comparePassword(password);
    if(!isAuth){
        return res.status(500).json({
            "message":"Wrong password!!"
        })
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"3d"});

    res.cookie("token",token);
    res.status(200).json({
        "message":"User Logged IN successfully"
    })

}

async function userLogoutController(req,res){
    try{
        const token=req.cookies.token || req.headers.authorization?.split(" ")[1]
    if(!token){
        return res.status(400).json({
            "message":"User logged out successfully"
        });
    }

    res.cookie("token","");
    res.clearCookie("token");
    await tokenblackListModel.create({
        token:token
    });
    res.status(200).json({
        "message":"user logout successfully"
    })
    }catch(err){
        res.status(400).json({
            "message":err.message
        })
    }

}



module.exports={userRegisterController,userLoginController,userLogoutController};