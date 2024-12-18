const Joi = require('joi'); 
const mongoose = require('mongoose')

const genreSchema = new mongoose.Schema({
    name : {type : String , required : true}
})

const Genre = mongoose.model('Genre' , genreSchema)

/*
const Genre = mongoose.model('Movie' , new mongoose.Schema({
    name : {type : String , required : true},
}))*/

function validateGenre(genre)
{
    const schema = Joi.object({
        name: Joi.string().min(5).required()
        });
        return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;