const express = require('express');
const router = new express.Router();
const slugify = require('slugify');
const db = require('../db');
const { doesCompanyExist, userSentAllCompanyData } = require('../helperFuncs');

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name FROM companies`);
        return res.json({companies: results.rows});
    }
    catch(e) {
        return next(e);
    }
})

router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const result = await db.query(`
            SELECT *
            FROM companies
            LEFT JOIN invoices ON companies.code = invoices.comp_code
            LEFT JOIN companies_industries ON companies.code = companies_industries.comp_code
            LEFT JOIN industries ON companies_industries.ind_code = industries.code
            WHERE companies.code = $1
            `, [code]);
        doesCompanyExist(result, code);
        const { name, description } = result.rows[0];
        const invoices = [...new Set(result.rows.map(val => val.id))];
        const industries = [...new Set(result.rows.map(val => val.industry))];

        const resultObj = {
            company: {
                code,
                name,
                description,
                invoices,
                industries
            }
        }

        return res.json(resultObj)
    }
    catch(e) {
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const code = slugify(name, {
            replacement: '-',
            lower: true,
            remove: /[*+~.()'"!:@^%&]/g
        });
        const result = await db.query(`
            INSERT INTO companies (code, name, description) VALUES ($1, $2, $3)
            RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({company: result.rows[0]});
    }
    catch(e) {
        return next(e);
    }
});

router.put('/:code', async (req, res, next) => {
    try {
        const {name, description} = req.body;
        userSentAllCompanyData(name, description);
        const results = await db.query(`
            UPDATE companies SET name = $1, description = $2 WHERE code = $3
            RETURNING code, name, description`, 
            [name, description, req.params.code]);

        doesCompanyExist(results, req.params.code)

        return res.json({company: results.rows[0]})
    }
    catch(e) {
        return next(e);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`
            DELETE FROM companies WHERE code = $1 RETURNING name`, [code]);
    
        doesCompanyExist(results, code);

        return res.json({status: 'deleted'});
    }
    catch(e) {
        return next(e);
    }
})


module.exports = router;