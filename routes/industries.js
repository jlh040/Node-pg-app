const express = require('express');
const router = new express.Router();
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
    const result = await db.query(`SELECT industry, code FROM industries`);
    return res.json({industries: result.rows});
});

router.post('/', async (req, res, next) => {
    try {
        const { industry } = req.body;
        const code = slugify(industry, {
            replacement: '-',
            lower: true,
            remove: /[*+~.()'"!:@^%&]/g
        });

        const result = await db.query(`
        INSERT INTO industries (industry, code) VALUES ($1, $2)
        RETURNING industry, code
        `, [industry, code]);

        return res.status(201).json({industry: result.rows[0]});
        
    }
    catch(e) {
        return next(e);
    }
})





module.exports = router;