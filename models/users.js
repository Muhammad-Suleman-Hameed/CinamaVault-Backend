const Joi = require('joi'); 
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {type : String , required : true, minlenght: 3 , maxlength: 50},
    email: {type: String , minlenght: 5 , maxlength: 255 ,required: true , unique: true},
    password: {type: String , required: true , minlenght: 3 , maxlength: 1024},
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign( {  _id: this._id , isAdmin: this.isAdmin} , config.get('jwtPrivateKey'))
    return token;
}

const User = mongoose.model('User' , userSchema )


function validateUser(user)
{
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
        });
        return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;