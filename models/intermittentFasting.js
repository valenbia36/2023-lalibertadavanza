const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const intermittentFastingSchema = new mongoose.Schema(
    {
        userId:{
            type: String
        },
        startDateTime:{
            type: Date
        },
        endDateTime:{
            type: Date
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);    

intermittentFastingSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('intermittentFasting', intermittentFastingSchema);