const express = require('express');
const router = new express.Router();
const { checkForValidIndAndCo } = require('../helperFuncs');
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
    const result = await db.query(`
        SELECT industry, industries.code, ARRAY_AGG(companies.code) AS companyCodes FROM industries
        LEFT JOIN companies_industries ON industries.code = companies_industries.ind_code
        LEFT JOIN companies ON companies.code = companies_industries.comp_code
        GROUP BY industry, industries.code;
    `);
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

router.put('/:code', async (req, res, next) => {
    try {
        await checkForValidIndAndCo(req.params.code, req.body.companyCode);

        const result = await db.query(`
        INSERT INTO companies_industries (comp_code, ind_code)
        VALUES ($1, $2)`, [req.body.companyCode, req.params.code]);

        return res.json({message: 'Update successful!'});
    }
    catch(e) {
        return next(e);
    }
})







module.exports = router;