const express=require("express");
const router=express.Router();

const authController=require('../controllers/auth.controller');


//REGISTER USER
router.post("/register",authController.userRegisterController);

//Login User
router.post("/login",authController.userLoginController);

//LOGOUT USER
router.post("/logout",authController.userLogoutController);


module.exports=router;