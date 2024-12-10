const admin = require('../middleware/admin');
const auth = require('../middleware/auth')
const {Genre , validate} =require('../models/genres')
const express = require('express');
const router = express.Router();

router.get('/', async (req,res) => {
    const genres = await Genre
        .find()
        .sort('name')
    res.send(genres)
})

router.get('/:id', async (req,res) => {
    const genres = await Genre.findById(req.params.id)
    if(!genres) return res.status(404).send('Not found') 
    
    res.send(genres)
})

router.post('/', auth , async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Create a new Movie instance
    const genre = new Genre({
        name: req.body.name, // Assign data from the request body
    });

    try {
        // Save the instance to the database
        const savedGenre = await genre.save();
        res.status(201).send(savedGenre);
    } catch (err) {
        res.status(500).send('Internal Server Error: ' + err.message);
    }
});

router.put('/:id' , async (req,res) => {
    const {error} = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);

    const genres = await Genre.findByIdAndUpdate(req.params.id , 
        {name : req.body.name}
        ,{new : true}) 

    if(! genres) return res.status(404).send("No such record exists");

    res.send(genres)
    
})

router.delete('/:id' ,[auth , admin], async (req , res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if(! genre) return res.status(404).send("No such record exists");

    res.send(genre);

})

module.exports = router;