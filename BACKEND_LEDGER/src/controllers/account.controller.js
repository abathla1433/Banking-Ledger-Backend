    const accountModel = require("../models/account.model");
    const userModel = require("../models/user.model");

    async function createAccountController(req, res) {
        try {
            // ✅ Ensure user exists
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const userId = req.user._id; // ✅ NEVER trust req.body for this

            const user = await userModel.findById(userId);

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const account = await accountModel.create({
                user: userId
            });

            return res.status(201).json({
                account
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to create account"
            });
        }
    }


    async function getUserAccountsController(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }

            const accounts = await accountModel.find({
                user: req.user._id
            });

            return res.status(200).json({
                accounts
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch accounts"
            });
        }
    }

    async function getBalanceOfAccount(req,res){


        const {accountId}=req.params;
        if(!accountId){
            return res.status(400).json({
                "message":"Account is required to fetch balance"
            })
        }
        const account=await accountModel.findOne({_id:accountId,user:req.user._id});
        if(!account){
            return res.status(401).json({
                "message":"User does not exist"
            });
        }
        const balance=await account.getBalance();
        return res.status(200).json({
            "message":"Balance fetched successfully",
            "Balance":balance
        });
    }

    module.exports = {
        createAccountController,
        getUserAccountsController,
        getBalanceOfAccount
    };