const mongoose = require('mongoose');
const Joi = require('joi')

const Customers = mongoose.model('Customers' , new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 12
    },
    isGold: {
        type: Boolean,
        default: false
    }
}));

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(12).required(),
        isGold: Joi.boolean()
    })
    return schema.validate(customer);
}


exports.Customers  = Customers;
exports.validate = validateCustomer;