//βιβλιοθήκη για JWT tokens
const jwt = require('jsonwebtoken');

//Λαμβάνουμε το JWT token
const authenticateToken = (req, res, next) => {
    
const authHeader = req.headers['authorization'];
const token = authHeader && authHeader.split(' ')[1];


if (!token) return res.status(401).json({ message: 'Access denied' });

//αποθήκευση δεδομένου του χρήστη αν είναι αληθής 
jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
if (err) return res.status(403).json({ message: 'Invalid token' });
req.user = user;
next();
});
};

module.exports = authenticateToken;