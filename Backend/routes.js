const express = require('express');
const route = express.Router();

const usersController = require('./controllers/usersControllers');

route.post('/users', usersController.createUser);

module.exports = route;
