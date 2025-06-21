//Βιβλιοθήκες express, cors, dotenv
const express = require('express'); //Express
const cors = require('cors'); //Middleware
require('dotenv').config(); // npm βιβλιοθήκη για token authentication συνδέεται με τον φάκελο .env

// import αρχεία routes
const authRoutes = require('./routes/AuthRoute');
const restaurantRoutes = require('./routes/RestaurantRoutes');
const reservationRoutes = require('./routes/ReservationRoutes');
const userRoutes = require('./routes/UserRoutes');

//Δημιουργία Αντικειμένου Application
const app = express();

//Ενεργοποίηση cors and json 
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/user', userRoutes); // το route για /api/user/reservations


app.listen(3000, () => {
console.log('Server running on port 3000');

});