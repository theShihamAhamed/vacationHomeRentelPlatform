import express from "express";
import { getAdminLedgerBalance, getOwnerLedgerBalance, createLedgerEntry } from "../controllers/ledger.controller.js";

const router = express.Router();

// Admin view
router.get("/admin/dashboard", getAdminLedgerBalance);

// Owner view
router.get("/owner/dashboard", getOwnerLedgerBalance);

router.post("/test", createLedgerEntry);

export default router;
