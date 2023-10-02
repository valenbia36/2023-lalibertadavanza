const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const categorySchema = new mongoose.Schema(
    {
        name:{
            type: String,            
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
);    

categorySchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('category', categorySchema);