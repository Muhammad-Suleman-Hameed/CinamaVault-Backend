const Joi = require('joi'); 
const mongoose = require('mongoose')
const {genreSchema} = require('../models/genres')

const Movie = mongoose.model('Movie' , new mongoose.Schema({
    title : {
        type: String , 
        required: true,
        minlength:  5,
        maxlength: 255,  
        trim: true
    },
    numberInStock: { 
        type : Number , 
        required : true, 
        min: 0,
        max: 255
        },
    dailyRentalRate: {
        type : Number , 
        required : true, 
        min: 0,
        max: 255
    },
    //Works Fine
    /*genre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'genreSchema'
    }*/
        genre: {
            type: genreSchema,
            required: true
        }
}))

function validateMovie(movie)
{
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(0).max(255).required(),
        genreId: Joi.objectId().required()

        });
        return schema.validate(movie);
}

exports.Movie = Movie;
exports.validate = validateMovie;