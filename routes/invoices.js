const express = require('express');
const router = new express.Router();
const ExpressError = require('../expressError');
const { doesInvoiceExist, userSentAllInvoiceData } = require('../helperFuncs');
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
    try {
        const { comp_code, amt } = req.body;
        userSentAllInvoiceData(comp_code, amt);

        const result = await db.query(`
            INSERT INTO invoices (comp_code, amt)
            VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        const { id, paid, add_date, paid_date } = result.rows[0];
    
        return res.status(201).json({
            invoice: {
                id,
                comp_code,
                amt,
                paid,
                add_date,
                paid_date
            }
        })
    }
    catch(e) {
        return next(e);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { amt } = req.body;
        if (!amt) throw new ExpressError('Must pass in amt!', 400);

        const result = await db.query(`
            UPDATE invoices SET amt = $1 WHERE id = $2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [amt, req.params.id]);
        doesInvoiceExist(result, req.params.id);
        const { id, comp_code, paid, add_date, paid_date } = result.rows[0]
    
        return res.json({
            invoice: {
                id,
                comp_code,
                amt,
                paid,
                add_date,
                paid_date
            }
        })
    }
    catch(e) {
        return next(e);
    }
})





module.exports = router;