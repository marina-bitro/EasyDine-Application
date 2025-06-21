const express = require('express');
const { getRestaurants } = require('../controllers/RestaurantController');
const router = express.Router();

//Λαμβάνουμε την λίστα με τα στοιχεία των εστιατορίων νέας κράτησης με (GET /api/restaurants)
router.get('/', getRestaurants);

module.exports = router;
