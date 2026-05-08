const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const userModel = require("../models/user.model");

const mongoose = require("mongoose");


// ======================= CREATE TRANSACTION =======================

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "fromAccount, toAccount, amount, idempotencyKey are required!!",
    });
  }

  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message: "Invalid fromAccount or toAccount",
    });
  }

  // Idempotency check
  const existingTxn = await transactionModel.findOne({ idempotencyKey });

  if (existingTxn) {
    return res.status(200).json({
      message: "Transaction already processed",
      transaction: existingTxn,
    });
  }

  // Status check
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "Both accounts must be ACTIVE",
    });
  }

  // Balance check
  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    await emailService.sendTransactionFailureMail(
      req.user.email,
      req.user.name,
      amount,
      toAccount,
      "Insufficient balance"
    );

    return res.status(400).json({
      message: `Insufficient balance. Current Balance is ${balance}`,
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Create transaction
    const txnArr = await transactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount: toUserAccount._id,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    const transaction = txnArr[0];

    // Debit entry
    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session }
    );
    
    // await (()=>{
    //   return new Promise((resolve)=>setTimeout(resolve,100*1000))
    // })();

    // Credit entry
    await ledgerModel.create(
      [
        {
          account: toUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    // Mark completed
    await transactionModel.findOneAndUpdate({_id:transaction._id},{
      status:"COMPLETED"
    },{session});

    await session.commitTransaction();
    session.endSession();

    // Send email (non-blocking)
    emailService.sendTransactionMail(
      req.user.email,
      req.user.name,
      amount,
      toAccount
    );

    return res.status(201).json({
      message: "Transaction completed successfully",
      transaction,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    // Handle duplicate idempotency key
    if (err.code === 11000) {
      const existingTxn = await transactionModel.findOne({ idempotencyKey });

      return res.status(200).json({
        message: "Transaction already processed",
        transaction: existingTxn,
      });
    }

    console.error(err);

    await emailService.sendTransactionFailureMail(
      req.user.email,
      req.user.name,
      amount,
      toAccount,
      "Transaction failed due to server error"
    );

    return res.status(500).json({
      message: "Transaction failed",
    });
  }
}


// ======================= INITIAL FUNDING =======================

async function createInitalFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "toAccount, amount, idempotencyKey are required",
    });
  }

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid Account",
    });
  }

  const fromUser = await userModel.findOne({ systemUser: true });

  if (!fromUser) {
    return res.status(400).json({
      message: "System user not found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: fromUser._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const txnArr = await transactionModel.create(
      [
        {
          fromAccount: fromUserAccount._id,
          toAccount: toUserAccount._id,
          amount,
          idempotencyKey,
          status: "PENDING",
        },
      ],
      { session }
    );

    const transaction = txnArr[0];

    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "DEBIT",
        },
      ],
      { session }
    );

    await ledgerModel.create(
      [
        {
          account: toUserAccount._id,
          amount,
          transaction: transaction._id,
          type: "CREDIT",
        },
      ],
      { session }
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      message: "Initial funds transaction completed successfully",
      transaction,
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error(err);

    return res.status(500).json({
      message: "Initial funding failed",
    });
  }
}


module.exports = {
  createTransaction,
  createInitalFundsTransaction,
};