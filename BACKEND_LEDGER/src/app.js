const express=require("express");
const app=express();
require("dotenv").config();
const cookieParser=require("cookie-parser");
const connectDB=require("./config/db/db");

app.use(express.json());
app.use(cookieParser());

/**
 * -ROUTES
 */
const authRouter=require("./routes/auth.routes");
const accountRouter=require("./routes/account.routes");
const transactionRouter=require("./routes/transaction.routes");

/**
 * -Use ROUTES
 */
app.use("/api/auth/",authRouter);
app.use("/api/accounts",accountRouter);
app.use("/api/transactions",transactionRouter);


connectDB();

module.exports=app;
