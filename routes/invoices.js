const express = require('express');
const router = new express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({invoices: result.rows});
    }
    catch(e) {
        return next(e);
    }
})





module.exports = router;