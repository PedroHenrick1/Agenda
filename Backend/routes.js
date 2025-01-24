const express = require('express');
const route = express.Router();

const usersController = require('./controllers/usersControllers');

route.get('/users', usersController.createUser);

module.exports = route;
