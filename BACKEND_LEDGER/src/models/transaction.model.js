const mongoose = require("mongoose");

const transactionSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:[true,"amount is required for creating transaction"]
    },
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must associated with an account"],
        index:true
    },
    toAccount: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Transaction must associated with an account"],
        index:true,

    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either PENDING, COMPLETE, FAILED or REVERSED",

        },
        default:"PENDING",
    },
    idempotencyKey:{
        type:String,
        required:[true,"idempotencyKey is required for creating transaction"],
        index:true,
        unique:true
    }
},{
    timestamps:true
});

const transactionModel=mongoose.model("transaction",transactionSchema);
module.exports=transactionModel;