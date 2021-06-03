const express = require('express');
const router = new express.Router();
const { doesInvoiceExist } = require('../helperFuncs');
const db = require('../db');

router.get('/', async (req, res, next) => {
    try {
        const result = await db.query(`SELECT id, comp_code FROM invoices`);
        return res.json({invoices: result.rows});
    }
    catch(e) {
        return next(e);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const result = await db.query(`
        SELECT * FROM invoices
        JOIN companies ON comp_code = code
        WHERE id = $1`, 
        [req.params.id]
        );
        doesInvoiceExist(result, req.params.id);
        const {id, amt, paid, add_date, paid_date, code, name, description} = result.rows[0];

        const resultObj = {
            invoice: {
                id,
                amt,
                paid,
                add_date,
                paid_date,
                company: {
                    code,
                    name,
                    description
                }
            }
        }
        return res.json(resultObj);
    }
    catch(e) {
        return next(e);
    }
});

router.post('/', async function(req, res, next) {
    const { comp_code, amt } = req.body;
    
})





module.exports = router;