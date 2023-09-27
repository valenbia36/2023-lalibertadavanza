const { mealModel } = require('../models');
const { handleHttpError } = require('../utils/handleErrors');


const getMeals = async (req, res) => {
    try{
        const user = req.user;
        const data = await mealModel.find({});
        res.send({ data, user });        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_MEALS', 500);
    }
}

const getMealsByUserId = async (req, res) => {
    try{
        const user = req.user;
        const data = await mealModel.find({userId: req.params.id});
        res.send({ data, user });        
    } catch(e){
        handleHttpError(res, 'ERROR_GET_MEALS', 500);
    }
}

const createMeal = async (req, res) => {
    try{
        const data = await mealModel.create(req.body);
        res.send({data});
    } catch(e){
        handleHttpError(res, 'ERROR_CREATE_MEALS', 500);
    }
}

module.exports = { getMeals, createMeal, getMealsByUserId };