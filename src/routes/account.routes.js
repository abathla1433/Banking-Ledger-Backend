const express=require("express");
const router=express.Router();
const accountController=require('../controllers/account.controller');

const authMiddleware=require("../middlewares/auth.middleware");

/**
 * -POST /api/accounts/
    -create a new account

*/
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController);

/**
 * -GET /api/accounts
 * -get all the accounts of the logged in user
 * -protected route
 */

router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController);

/**
 * -GET /api/accounts/balance/:accountId
 * get the balance of the account
 */

router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getBalanceOfAccount);

module.exports=router;  