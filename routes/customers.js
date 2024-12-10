const {Customers , validate} = require('../models/customer')
const auth = require('../middleware/auth')
const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();

router.get('/' , async(req, res) => {
    const customer = await Customers.find()
    .sort('name')

    res.send(customer);
})

router.get('/:id' , async(req, res) => {
    const customer = await Customers.findById(req.params.id)
    if(!customer) return res.status(404).send('Cutomer does not exist')

    res.send(customer);
})

router.delete('/:id' , async(req, res) => {
    const customer = await Customers.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(404).send('Cutomer does not exist')
        
    res.send(customer)
})

router.put('/:id' ,  async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const customer = await Customers.findByIdAndUpdate(req.params.id,
        {name: req.body.name , phone: req.body.phone, isGold: req.body.isGold},
        {new: true}
    )
    if(!customer) return res.status(404).send('Cutomer does not exist')
        
    res.send(customer)
})

router.post('/' ,auth , async(req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newCustomer = new Customers({
        name : req.body.name,
        phone : req.body.phone,
        isGold : req.body.isGold
    })
         
    const result = await newCustomer.save()
    res.send(result)
})

module.exports = router;