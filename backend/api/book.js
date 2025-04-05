const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const client = require('../db');


router.post('/book', async (req, res) => {
    const { name, pitch, date, time, duration } = req.body;
    const token = crypto.randomBytes(16).toString('hex'); // Generate unique token

    try {
        const result = await client.query(
            'INSERT INTO bookings(name, pitch, date, time, duration, token) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, pitch, date, time, duration, token]
        );

        res.json({ token: result.rows[0].token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error inserting booking data' });
    }
});

module.exports = router;
