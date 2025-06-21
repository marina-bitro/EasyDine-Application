//Βάση δεδομένων σύνδεση
const db = require('../config/database');

// 1. Δημιουργία κράτησης 
exports.createReservation = async (req, res) => {
    const {restaurant_id, reservation_date, reservation_people} = req.body;
    const user_id = req.user.user_id;

    const date = new Date(reservation_date);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`;

    const peopleCount = parseInt(reservation_people, 10);
    if (isNaN(peopleCount)) {
        return res.status(400).json({message: 'Invalid number of people'});
    }

    const conn = await db.getConnection(); // καλείται μέσω του pool για να μπορέσουν να υλοποιηθούν όλα τα βήματα

    try {

        await conn.beginTransaction();


        const [[{available_seats}]] = await conn.query(
                'SELECT available_seats FROM restaurants WHERE restaurant_id = ? FOR UPDATE',
                [restaurant_id]
                );

        if (available_seats < 1) {
            await conn.rollback();
            return res.status(400).json({message: 'Δεν υπάρχουν αρκετές διαθέσιμες θέσεις'});
        }

        await conn.query(
                'INSERT INTO reservations (restaurant_id, user_id, reservation_people, reservation_date) VALUES (?, ?, ?, ?)',
                [restaurant_id, user_id, peopleCount, formattedDate]
                );

        await conn.query(
                'UPDATE restaurants SET available_seats = available_seats - 1 WHERE restaurant_id = ?',
                [restaurant_id]
                );

        await conn.commit();
        res.json({message: 'Reservation created'});

    } catch (err) {
        await conn.rollback();
        res.status(500).json({error: err.message});
    } finally {
        conn.release();
    }
};


//2. ΈΛεγχος Διαθεσιμότητας

exports.checkAvailability = async (req, res) => {
    const {restaurant_id, date} = req.query;

    if (!restaurant_id || !date) {
        return res.status(400).json({message: 'Missing parameters'});
    }

    try {
        // Μετατρέπουμε το date που παίρνουμε σε JavaScript Date
        const selectedDate = new Date(date);


        const startTime = new Date(selectedDate.getTime() - 30 * 60000);
        const endTime = new Date(selectedDate.getTime() + 30 * 60000);

        // Μετατρέπουμε για MySQL datetime format
        const start = startTime.toISOString().slice(0, 19).replace('T', ' ');
        const end = endTime.toISOString().slice(0, 19).replace('T', ' ');


        const [rows] = await db.query(
                `SELECT COUNT(*) as count FROM reservations
             WHERE restaurant_id = ?
             AND reservation_date BETWEEN ? AND ?`,
                [restaurant_id, start, end]
                );

        const count = rows[0].count;

        res.json({count});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};


// 3. Επεξεργασία κράτησης
exports.updateReservation = async (req, res) => {
    const {reservation_id} = req.params;
    const {reservation_date, reservation_people} = req.body;

    const user_id = req.user.user_id;

    const peopleCount = parseInt(reservation_people, 10);
    if (isNaN(peopleCount)) {
        return res.status(400).json({message: 'Invalid number of people'});
    }


    console.log('reservation_id:', reservation_id);
    console.log('user_id from token:', user_id);
    console.log('reservation_date:', reservation_date);
    console.log('reservation_people:', peopleCount);

    try {
        const [result] = await db.query(
                'UPDATE reservations SET reservation_date = ?, reservation_people = ? WHERE reservation_id = ? AND user_id = ?',
                [reservation_date, peopleCount, reservation_id, user_id]
                );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Reservation not found or unauthorized'});
        }

        res.json({message: 'Reservation updated'});
        
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// 4. Διαγραφή κράτησης
exports.deleteReservation = async (req, res) => {
    const {reservation_id} = req.params;
    const user_id = req.user.user_id;

    const conn = await db.getConnection(); // σύνδεση από το pool

    try {
        await conn.beginTransaction();

        // Παίρνουμε το restaurant_id της κράτησης για να επιστρέψουμε θέσεις
        const [[reservation]] = await conn.query(
                'SELECT restaurant_id FROM reservations WHERE reservation_id = ? AND user_id = ?',
                [reservation_id, user_id]
                );

        if (!reservation) {
            await conn.rollback();
            return res.status(404).json({message: 'Reservation not found or unauthorized'});
        }

        // Διαγραφή κράτησης
        const [deleteResult] = await conn.query(
                'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
                [reservation_id, user_id]
                );

        if (deleteResult.affectedRows === 0) {
            await conn.rollback();
            return res.status(404).json({message: 'Reservation not found or unauthorized'});
        }

        // Επιστροφή διαθέσιμης θέσης 
        await conn.query(
                'UPDATE restaurants SET available_seats = available_seats + 1 WHERE restaurant_id = ?',
                [reservation.restaurant_id]
                );

        await conn.commit(); // Ολοκληρώνουμε transaction

        res.json({message: 'Reservation deleted and seats restored'});

    } catch (err) {
        await conn.rollback(); // Ακυρώνουμε αν κάτι πάει στραβά
        res.status(500).json({error: err.message});
    } finally {
        conn.release(); // Απελευθερώνουμε τη σύνδεση στο pool
    }
};
