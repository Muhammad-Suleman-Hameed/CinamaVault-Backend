const {validate, Movie} = require('../models/movies')
const {Genre} = require('../models/genres')
const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();

router.get('/' , async(req, res) => {
    const movies = await Movie.find().sort('name')
    if(!movies) return res.status(404).send('No movies found.')

        res.send(movies)
})

router.get('/:id' , async(req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');

    res.send(movie)
})

router.post('/' , async(req, res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(errors.details[0].message)
 
     const genre = await Genre.findById(req.body.genreId);
     if(!genre) return res.status(404).send('Invalid Genre.')
 
     const movie = new Movie({
         title: req.body.title,
         numberInStock : req.body.numberInStock,
         dailyRentalRate : req.body.dailyRentalRate,
         genre: {
             _id: genre._id,
             name: genre.name
         }
     })
       await movie.save()
         res.send(movie)
 })

 router.put('/:id' , async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(errors.details[0].message)

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send('Invalid Genre.');

    const movie = await Movie.findByIdAndUpdate(req.params.id ,
        {title : req.body.title,
            numberInStock : req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate, 
            genre: {
                _id: genre._id,
                name: genre.name
            }
        }
        ,{new: true})

    if(!movie) return res.status(404).send(errors.details[0].message)

        res.send(movie)
})

router.delete('/:id' , async(req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send('The movie with the given ID was not found.');
    
    res.send(movie);
})

module.exports = router;