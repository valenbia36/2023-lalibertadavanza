const { foodModel } = require('../models');
const { handleHttpError } = require('../utils/handleErrors');


const getFoods = async (req, res) => {
    try{
        const user = req.user;
        const data = await foodModel.find({});
        res.send({ data, user });        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_FOODS', 500);
    }
}

const getFoodsByCategory = async (req, res) => {
    try{
        const user = req.user;
        const data = await categoryModel.find({name: req.params.category});
        res.send({ data, user });        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_CATEGORIES', 500);
    }
}

const createFood = async (req, res) => {
    try{
        const data = await foodModel.create(req.body);
        res.send({data});
    } catch(e){
        handleHttpError(res, 'ERROR_CREATE_FOOD', 500);
    }
}

module.exports = { getFoods, createFood, getFoodsByCategory};