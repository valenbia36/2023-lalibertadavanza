const { relationshipRequestModel } = require("../models");
const { handleHttpError } = require("../utils/handleErrors");
const { sendRelationshipRequestEmail } = require("./notifications");
const { updateNutritionist } = require("./auth");

const createRelationShipRequest = async (req, res) => {
  try {
    const data = await relationshipRequestModel.create(req.body);
    const reqRequest = {
      body: {
        email: req.body.nutritionistEmail,
        userNameUser: req.body.userName,
        userNameNutritionist: req.body.nutritionistUserName,
        url: req.body.url,
      },
    };

    const resRequest = {
      send: (data) => {},
      status: (statusCode) => {
        console.log(`Status Code: ${statusCode}`);
      },
    };

    sendRelationshipRequestEmail(reqRequest, resRequest);
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_CREATE_RELATIONSHIP_REQUEST", 500);
  }
};

const getRelationShipRequest = async (req, res) => {
  try {
    const data = await relationshipRequestModel.find();
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RELATIONSHIP_REQUEST", 500);
  }
};

const getRelationShipRequestByUser = async (req, res) => {
  try {
    const data = await relationshipRequestModel.find({ user: req.params.id });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RELATIONSHIP_REQUEST", 500);
  }
};

const getSentRelationShipRequestByUser = async (req, res) => {
  try {
    const data = await relationshipRequestModel.find({
      user: req.params.id,
      status: "Sent",
    });
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RELATIONSHIP_REQUEST", 500);
  }
};

const getRelationShipRequestByNutritionist = async (req, res) => {
  try {
    const data = await relationshipRequestModel.find({ nutritionist: req.params.id })
      .populate('user', 'firstName lastName email sex age height weight')
      .exec();

    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_GET_RELATIONSHIP_REQUEST", 500);
  }
};

const updateRelationShipRequestStatus = async (req, res) => {
  try {
    const data = await relationshipRequestModel.findByIdAndUpdate(req.params.id, {status: req.body.status});
    if(req.body.status === 'Accepted'){
      const reqRequest = {
        params: {
          id: req.body.userId
        },
        body: {
          nutritionistId: req.body.nutritionistId
        }
      }

      const reqResponse = {
        send: (data) => {},
        status: (statusCode) => {
          console.log(`Status Code: ${statusCode}`);
        },
      };

      await updateNutritionist(reqRequest, reqResponse);
    }
    res.send({ data });
  } catch (e) {
    handleHttpError(res, "ERROR_UPDATE_RELATIONSHIP_REQUEST", 500);
  }
};

module.exports = {
  createRelationShipRequest,
  getRelationShipRequest,
  getRelationShipRequestByUser,
  getSentRelationShipRequestByUser,
  getRelationShipRequestByNutritionist,
  updateRelationShipRequestStatus
};
