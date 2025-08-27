import mongoose from "mongoose";
import { LedgerEntry } from "../models/ledger.model.js";

// ======================
// 🔹 Admin Dashboard
// ======================
export const getAdminLedgerBalance = async (req, res) => {
  try {
    const escrow = await LedgerEntry.aggregate([
      {
        $group: {
          _id: null,
          totalCreditsIntoEscrow: {
            $sum: {
              $cond: [
                { $eq: ["$accounts.to", "escrow_account"] },
                "$credit",
                0,
              ],
            },
          },
          totalCreditsOutOfEscrow: {
            $sum: {
              $cond: [
                { $eq: ["$accounts.from", "escrow_account"] },
                "$credit",
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          balance: {
            $subtract: ["$totalCreditsIntoEscrow", "$totalCreditsOutOfEscrow"],
          },
        },
      },
    ]);

    const commission = await LedgerEntry.aggregate([
      { $match: { type: "commission_income" } },
      { $group: { _id: null, total: { $sum: "$credit" } } },
    ]);

    res.json({
      success: true,
      escrowBalance: escrow[0]?.balance || 0,
      totalCommission: commission[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch admin dashboard" });
  }
};

// ======================
// 🔹 Owner Dashboard
// ======================
export const getOwnerLedgerBalance = async (req, res) => {
  try {
    // TEMPORARY for testing
    const ownerId = "64f5a2d9f2d7b23e5a1f2b22";

    const earnings = await LedgerEntry.aggregate([
      { $match: { type: "payout_owner", ownerId: ownerId } },
      { $group: { _id: null, totalEarnings: { $sum: "$credit" } } },
    ]);

    res.json({
      success: true,
      totalEarnings: earnings[0]?.totalEarnings || 0,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch owner dashboard" });
  }
};

// ======================
// 🔹 Create Ledger Entry
// ======================
export const createLedgerEntry = async (req, res) => {
  try {
    const {
      bookingId,
      type, // escrow_account | payout_owner | commission_income | refund | adjustment
      debit = 0,
      credit = 0,
      currency = "LKR",
      accounts, // { from: "accountName", to: "accountName" }
      ownerId, // optional, required for payout_owner
      note,
    } = req.body;

    if (!bookingId || !type || !accounts || !accounts.from || !accounts.to) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const ledgerEntryData = {
      bookingId,
      type,
      debit,
      credit,
      currency,
      accounts,
      note,
    };

    // Only include ownerId if provided
    if (type === "payout_owner" && ownerId) {
      ledgerEntryData.ownerId = new mongoose.Types.ObjectId(ownerId);
    }

    const ledgerEntry = await LedgerEntry.create(ledgerEntryData);

    res.status(201).json({
      success: true,
      message: "Ledger entry created successfully",
      ledgerEntry,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to create ledger entry" });
  }
};
