const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies')
const auth = require('./routes/auth')
const users = require('./routes/users')
const config = require('config')
const express = require('express');
const Joi = require('joi');

const app = express();
const mongoose = require('mongoose')
Joi.objectId = require('joi-objectid')(Joi)

if (!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined.')
    process.exit()
}
  
app.use(express.json());
app.use('/genres' , genres);
app.use('/customers' , customers);
app.use('/movies' , movies)
app.use('/users' , users)
app.use('/auth' , auth)

app.listen(9000)
console.log('Listening at port 9000...');

mongoose.connect('mongodb://localhost/Vidily')
    .then(console.log('Connected to Mongodb...'))
    .catch(() => console.log('Not connected to Mongodb'))
    