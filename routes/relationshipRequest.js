const express = require("express");
const router = express.Router();
const { createRelationShipRequest,
  getRelationShipRequest,
  getRelationShipRequestByUser,
  getSentRelationShipRequestByUser,
  getRelationShipRequestByNutritionist,
  updateRelationShipRequestStatus
} = require("../controllers/relationshipRequest");

router.get("/getRelationshipRequest", getRelationShipRequest);
router.get("/getRelationshipRequestByUserId/:id", getRelationShipRequestByUser);
router.get("/getSentRelationshipRequestByUserId/:id", getSentRelationShipRequestByUser);
router.get("/getRelationshipRequestByNutritionistId/:id", getRelationShipRequestByNutritionist);
router.post("/create", createRelationShipRequest);
router.put("/update/:id", updateRelationShipRequestStatus);

module.exports = router;
