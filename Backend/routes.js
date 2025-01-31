const express = require('express');
const route = express.Router();

const usersController = require('./controllers/usersControllers');

route.post('/users/create', usersController.createUser);
route.post('/users/login', usersController.loginUser);

module.exports = route;
