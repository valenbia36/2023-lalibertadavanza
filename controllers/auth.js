const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { usersModel } = require("../models");
const { tokenSign } = require("../utils/handleJWT");
const { handleHttpError } = require("../utils/handleErrors");

const registerController = async (req, res) => {
    try{
        req = matchedData(req);
        const password = await encrypt(req.password);
        const body = {...req, password};
        const dataUser = await usersModel.create(body);
        dataUser.set('password', undefined, {strict: false});
    
        const data = {
            token: await tokenSign(dataUser),
            user: dataUser,
        }
        res.send(data);
    } catch(e){
        handleHttpError(res, 'ERROR_REGISTER_USER', 500);
    }
}

const loginController = async (req, res) => {
    try{
        const user = await usersModel.findOne({email: req.body.email}).select('firstName lastName email password role');
        if(!user){
            handleHttpError(res, 'USER_NOT_EXISTS', 404);
            return;
        } 
        const hashPassword = user.get('password');
        const checkPassword = await compare(req.body.password, hashPassword);
        
        if(!checkPassword){
            handleHttpError(res, 'PASSWORD_INVALID', 401);
            return;
        }

        user.set('password', undefined, {strict: false});

        const data = {
            token: await tokenSign(user),
            user,
            status: 200
        };

        res.send(data);

    } catch(e){
        handleHttpError(res, 'ERROR_LOGIN_USER', 500);
    }
}

const getUsers = async (req, res) => {
    try{
        const data = await usersModel.find({});
        res.send({data});        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_USERS', 500);
    }
}

const getNutritionistUsers = async (req, res) => {
    try{
        const data = await usersModel.find({role: 'nutritionist'});
        res.send({data});        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_NUTRITIONIST_USERS', 500);
    }
}

const getUser = async (req, res) => {
    try{
        const data = await usersModel.findById(req.params.id);
        res.send({data});    

    } catch(e){
        handleHttpError(res, 'ERROR_GET_USER', 500);
    }
}

const getUserByEmail = async (req, res) => {
    try{
        const data = await usersModel.findOne({'email': req.params.email});
        res.send({data});    

    } catch(e){
        handleHttpError(res, 'ERROR_GET_USER_BY_EMAIL', 500);
    }
}

const updateUserPassword = async (req, res) => {
    try{
        const newPassword = req.body.password;
        const password = await encrypt(newPassword);

        const data = await usersModel.findOneAndUpdate(
            { "_id": req.params.id }, {"password": password}
        );
        res.send({data});
        res.status(200)
    } catch(e){
        handleHttpError(res, 'ERROR_UPDATE_USER_PASSWORD', 500);
    }
}

const updateUser = async (req, res) => {
    try{
        const data = await usersModel.findOneAndUpdate(
            { "_id": req.params.id }, req.body
        );
        res.send({data});
        res.status(200)
        return 200;
    } catch(e){
        handleHttpError(res, 'ERROR_UPDATE_USER', 500);
        return 500;
    }
}

const deleteUser = async (req, res) => {
    try{
        const data = await usersModel.delete({_id:req.params.id});;
        res.send({data});
    } catch(e){
        handleHttpError(res, 'ERROR_DELETE_USER', 500);
    }
}

const updateNutritionist = async (req, res) => {
    try{
        const data = await usersModel.findByIdAndUpdate(
            req.params.id, {"nutritionist": req.body.nutritionistId}
        );
        res.send({data});
        res.status(200)
    } catch(e){
        handleHttpError(res, 'ERROR_UPDATE_NUTRITIONIST', 500);
    }
}

const getNutritionistByUserId = async (req, res) => {
    try{
        const data = await usersModel.findById(req.params.id).populate('nutritionist');
        res.send({data});    
    } catch(e){
        console.log(e);
        handleHttpError(res, 'ERROR_GET_NUTRITIONIST_BY_USER_ID', 500);
    }
}

const getPatientsByNutritionistId = async (req, res) => {
    try {
        const data = await usersModel.find({ nutritionist: req.params.id });
        res.json({data});
      } catch (e) {
        console.log(e);
        handleHttpError(res, 'ERROR_GET_PATIENTS_BY_NUTRITIONIST_ID', 500);
      }
}

module.exports = { registerController, loginController, getUsers, getNutritionistUsers, getUser, getUserByEmail, deleteUser, updateUserPassword, updateUser, updateNutritionist, getNutritionistByUserId, getPatientsByNutritionistId };