const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const { foodModel } = require('../models');

const mealSchema = new mongoose.Schema(
    {
        name:{
            type: String,            
        },
        foods: {
            type: [],
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);    

mealSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('meals', mealSchema);