//Σύνδεση με την βάση δεδομένων
const db = require('../config/database');   

exports.getUserReservations = async (req, res) => {
  console.log("User from token:", req.user); 

  const user_id = req.user.user_id; 

  try {
   const [rows] = await db.query(
  `SELECT r.*, res.restaurant_name 
   FROM reservations r
   JOIN restaurants res ON r.restaurant_id = res.restaurant_id
   WHERE r.user_id = ?`,
  [user_id]
);
    res.json(rows);
  } catch (err) {
    console.error(err); // 
    res.status(500).json({ error: err.message });
  }
};


