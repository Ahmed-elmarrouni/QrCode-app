const express = require('express');
const router = express.Router();
const client = require('../db'); // Import the client from db.js

router.post('/scan', async (req, res) => {
    const { token } = req.body;

    try {
        const result = await client.query('SELECT * FROM bookings WHERE token = $1', [token]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Invalid token' });
        }

        const booking = result.rows[0];
        if (booking.used) {
            return res.status(400).json({ message: 'Token already used' });
        }

        // Mark as used
        await client.query('UPDATE bookings SET used = true WHERE token = $1', [token]);

        res.json({ message: 'Booking validated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error validating booking' });
    }
});

module.exports = router;
