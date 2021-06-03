const express = require('express');
const router = new express.Router();
const db = require('../db');
const { doesCompanyExist, userSentAllData } = require('../helperFuncs');

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
        const result = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);
        doesCompanyExist(result, code);

        return res.json({company: result.rows[0]})
    }
    catch(e) {
        return next(e);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const {code, name, description} = req.body;
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
        userSentAllData(name, description);
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