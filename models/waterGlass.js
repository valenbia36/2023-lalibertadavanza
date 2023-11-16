const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const waterGlassSchema = new mongoose.Schema(
    {
        userId:{
            type: String
        },
        date:{
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);    

waterGlassSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('waterGlass', waterGlassSchema);