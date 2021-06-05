const express = require('express');
const router = new express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    const result = await db.query(`SELECT industry, code FROM industries`);
    return res.json({industries: result.rows});
})







module.exports = router;