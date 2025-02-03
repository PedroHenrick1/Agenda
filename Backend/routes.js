const express = require('express');
const route = express.Router();

const usersController = require('./controllers/usersControllers');
const { isAuthenticated } = require('./middlewares');

route.post('/users/create', usersController.createUser);
route.post('/users/login', usersController.loginUser);
route.get('/users/profile', isAuthenticated, usersController.profile);
route.post('/users/refresh', usersController.refreshT);

module.exports = route;
