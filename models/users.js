const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,            
        },
        lastName:{
            type: String
        },
        email:{
            type: String,
            unique: true
        },
        password:{
            type: String,
            select: false
        },
        sex:{
            type: String,
        },
        age:{
            type: Number,
        },
        height:{
            type: Number,
        },
        weight:{
            type: Number,
        },
        role:{
            type: ["user", "admin"],
            default: "user"
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);    

userSchema.plugin(mongooseDelete, { overrideMethods: 'all' });
module.exports = mongoose.model('users', userSchema);