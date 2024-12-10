const {validate, Rental} = require('../models/rentals')
const {Movie} = require('../models/movies')
const {Customer} = require('../models/customer')
const mongoose = require('mongoose');
const Fawn = require('fawn')
const express = require('express')
const router = express.Router();

Fawn.init(mongoose);

router.get('/' , async(req, res) => {
    const rentals = await Rental.find().sort('-dateOut')
    if(!rentals) return res.status(404).send('No rentals found.')

        res.send(rentals)
})

router.get('/:id' , async(req, res) => {
    const rental = await Rental.findById(req.params.id)
    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental)
})

router.post('/' , async(req, res) => {
    const {error} = validate(req.body)
    if(error) return res.status(400).send(error.details[0].message)
 
    if(!mongoose.Types.ObjectId.isValid(req.body.customerId))
        return res.status(400).send('Invalid Customer')

    if(!mongoose.Types.ObjectId.isValid(req.body.movieId))
        return res.status(400).send('Invalid movie')

     const customer = await Customer.findById(req.body.customerId);
     if(!customer) return res.status(404).send('Invalid Customer.')

    const movie = await Rental.findById(req.body.movieId);
    if(!movie) return res.status(404).send('Invalid movie.')
 
    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock')
    
    const rental = new Movie({
         customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
         },
         movie: {
            _id: movie._id,
            title: movie.req,
            dailyRentalRate: movie.dailyRentalRate
         },
     })

    try {
        new Fawn.Task
        .save('rentals' , rental)
        .update('movies' , {_id: movie._id} ,
           { $inc: {numberInStock : -1 }})
        .run();

        res.send(rental);
}
    catch(ex){
        res.status(500).send('Something failed.')
    }

        /*
        //Without transaction or using Fawn, may not work proper
        rental  = await rental.save();
         movie.numberInStock--;
         movie.save();

         res.send(rental)*/
 })

 /*
 router.put('/:id' , async(req, res) => {
    const {error} = validate(req.body);
    if(error) return res.status(400).send(errors.details[0].message)

    const rental = await Rental.findByIdAndUpdate(req.params.id ,
        { customer: {
            _id : req.body._id,
            name : req.body.name,
            phone: req.body.phone}  
        },
        {
            movie: {
                _id: req.body._id,
                title:req.body.title,
                dailyRentalRate: req.body.dailyRentalRate
        }
        },{new: true})
        
    if(!rental) return res.status(404).send(errors.details[0].message)

        res.send(rental)
})

router.delete('/:id' , async(req, res) => {
    const rentals = await Rental.findByIdAndDelete(req.params.id)
    if (!rental) return res.status(404).send('The rental ID was not found.');
    
    res.send(rental);
})
*/

module.exports = router;