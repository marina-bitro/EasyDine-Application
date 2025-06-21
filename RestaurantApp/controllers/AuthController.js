const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');


//REGISTER
exports.register = async (req, res) => {

    const {name, password} = req.body;

    if (!name || !password) {
        return res.status(400).json({error: 'name and password are required'});
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (name, password) VALUES (?, ?)', [name, hashed]);
        res.json({message: 'User created'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }

};


//LOGIN

exports.login = async (req, res) => {

    const {name, password} = req.body;

    if (!name || !password) {
        return res.status(400).json({error: 'Name and password are required'});
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
        if (users.length === 0)
            return res.status(400).json({message: 'Invalid credentials'});

        const match = await bcrypt.compare(password, users[0].password);
        
        if (!match)
            return res.status(400).json({message: 'Wrong password'});

        const token = jwt.sign({user_id: users[0].user_id}, process.env.JWT_SECRET);

        console.log('Generated token payload:', jwt.decode(token));
        
        res.json({token});
        
    } catch (err) {
        res.status(500).json({error: err.message});
    }




};
