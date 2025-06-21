//Σύνδεση με την βάση δεδομένων
const db = require('../config/database');

// Λαμβάνουμε την λίστα των εστιατορίων από τον πίνακα restaurants 
exports.getRestaurants = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM restaurants');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
