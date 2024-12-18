const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const _ = require('lodash')
const {User} = require('../models/users')
const express = require('express')
const mongoose = require('mongoose')
const router =  express.Router()

router.post('/' , async(req,res) => {
    const {error} = await validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email })
    if(!user) return res.status(400).send('Invalid email or password.')
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid email or password.')

    const token = user.generateAuthToken(); 
    res.send({token})
})

function validate(req)
{
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(3).max(255).required()
        });
        return schema.validate(req);
}

module.exports = router




