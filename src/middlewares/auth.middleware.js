const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenblackListModel=require("../models/blacklist.model");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  const token =
    req.cookies?.token;

    console.log("Cookies:", req.cookies);
console.log("Auth Header:", req.headers.authorization);

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized access, token is missing",
    });
  }

  const isBlackListed=await tokenblackListModel.findOne({token});
  if(isBlackListed){
    return res.status(401).json({
      "message":"Unauthorized access,token in invalid"
    })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized access, token is invalid",
    });
  }
}

async function authSystemUser(req,res,next){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
      return res.status(400).json({
        "message":"Unauthorized access, token is missing"
      })
    }
    
    const isBlackListed=await tokenblackListModel.findOne({token});
    if(isBlackListed){
      return res.status(401).json({
      "message":"Unauthorized access,token in invalid"
    })
  }

    try{
      const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);

      const user=await userModel.findById(decoded.userId).select("+systemUser");

      if(!user.systemUser){
        return res.status(403).json({
            "message":"Forbidden access!!, not a system user"
        })
      }

      req.user=user;
      return next();
      
    }catch(err){
      return res.status(401).json({
        message: "Unauthorized access, token is invalid",
      });
    }
}

module.exports = { authMiddleware ,authSystemUser};