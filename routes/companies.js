const express = require('express');
const router = new express.Router();
const db = require('../db');

router.get('/', async (req, res, next) => {
    const results = await db.query(`SELECT code, name FROM companies`);
    return res.json({companies: results.rows});
})



























module.exports = router;