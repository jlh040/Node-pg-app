const express = require('express');
const router = new express.Router();
const db = require('../db');
const { doesCompanyExist } = require('../helperFuncs');

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

})






module.exports = router;