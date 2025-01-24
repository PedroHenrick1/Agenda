const express = require('express');
const route = express.Router();

const usersController = require('./controllers/usersControllers');

route.get('/', usersController.paginaInicial);

module.exports = route;
