const express = require("express");
const router = express.Router();
const {
  createIntermittentFasting,
  getNextIntermittentFastingByUserId,
  getActiveIntermittentFastingByUserId,
  deleteActiveIntermittentFasting,
} = require("../controllers/intermittentFasting");
const { verifyToken } = require("../utils/handleJWT");
const extractUserIdMiddleware = require("../utils/handleUserID");

router.post(
  "/",
  verifyToken,
  extractUserIdMiddleware,
  createIntermittentFasting
);
router.get(
  "/next",
  verifyToken,
  extractUserIdMiddleware,
  getNextIntermittentFastingByUserId
);
router.get(
  "/active/",
  verifyToken,
  extractUserIdMiddleware,
  getActiveIntermittentFastingByUserId
);
router.delete(
  "/active/:IntermittentFastingId",
  verifyToken,
  extractUserIdMiddleware,
  deleteActiveIntermittentFasting
);

module.exports = router;
