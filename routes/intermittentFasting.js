const express = require("express");
const router = express.Router();
const {
  createIntermittentFasting,
  getIntermittentFastingByUserId,
  getActiveIntermittentFastingByUserId,
  deleteActiveIntermittentFasting,
} = require("../controllers/intermittentFasting");
const { verifyToken } = require("../utils/handleJWT");

router.post("/", createIntermittentFasting);
router.get("/:userId", getIntermittentFastingByUserId);
router.get("/active/:userId", getActiveIntermittentFastingByUserId);
router.delete(
  "/active/:IntermittentFastingId",
  deleteActiveIntermittentFasting
);

module.exports = router;
