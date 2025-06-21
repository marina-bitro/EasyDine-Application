const express = require('express');
const auth = require('../middleware/authMiddleware');

const {
  createReservation,
  checkAvailability,
  updateReservation,
  deleteReservation
} = require('../controllers/ReservationController');

const router = express.Router();

// Δημιουργία νέας κράτησης (POST /api/reservations)
router.post('/', auth, createReservation);

//Ελεγχος για την διαθεσιμότητα (GET/ api/reservations/check)
router.get('/check', checkAvailability);

// Ενημέρωση κράτησης (PUT /api/reservations/:reservation_id)
router.put('/:reservation_id', auth, updateReservation);

// Διαγραφή κράτησης (DELETE /api/reservations/:reservation_id)
router.delete('/:reservation_id', auth, deleteReservation);

module.exports = router;
