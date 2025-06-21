const express = require('express'); 
const auth = require('../middleware/authMiddleware');
const { getUserReservations } = require('../controllers/UserController'); 

const router = express.Router();  

//Λαμβάνουμε την λίστα με τις κρατήσεις του χρήστη με ( GET /api/user/reservations)
router.get('/reservations', auth, getUserReservations);

module.exports = router;
