const express=require("express");
const authMiddleware  = require("../middlewares/auth.middleware");

const transactionRoutes=express.Router();
const transactionController=require("../controllers/transaction.controller");

transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction);



/**
 * -POST /api/transactions/system/initial-funds
 * Create intitial funds transaction from system user
 */
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUser,transactionController.createInitalFundsTransaction);


module.exports=transactionRoutes;