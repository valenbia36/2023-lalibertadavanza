const { matchedData } = require("express-validator");
const { encrypt, compare } = require("../utils/handlePassword");
const { usersModel } = require("../models");
const { tokenSign } = require("../utils/handleJWT");
const { handleHttpError } = require("../utils/handleErrors");

const registerController = async (req, res) => {
    try{
        console.log(req.body);
        req = matchedData(req);
        const password = await encrypt(req.password);
        const body = {...req, password};
        const dataUser = await usersModel.create(body);
        dataUser.set('password', undefined, {strict: false});
    
        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
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

const getUser = async (req, res) => {
    try{
        const data = await usersModel.findById(req.params.id);
        res.send({data});    

    } catch(e){
        handleHttpError(res, 'ERROR_GET_USER', 500);
    }
}

const updateUser = async (req, res) => {
    try{
        const data = await usersModel.findOneAndUpdate(
            req.params.id, req.body
        );
        res.send({data});
    } catch(e){
        handleHttpError(res, 'ERROR_UPDATE_USER', 500);
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

module.exports = { registerController, loginController, getUsers, getUser, deleteUser, updateUser };