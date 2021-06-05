const ExpressError = require('./expressError');
const db = require('./db');


// Throws an error if the company code cannot be found
function doesCompanyExist(results, code) {
    if (results.rows.length === 0) {
        throw new ExpressError(`Could not find company with code: ${code}`, 404);
    };
}

// Throws an error if the invoice id is not found
function doesInvoiceExist(results, id) {
    if (results.rows.length === 0) {
        throw new ExpressError(`Could not find invoice with id: ${id}`, 404);
    };
}



// If all required data was not sent in the body of a request, throw an error
function userSentAllCompanyData(name, description) {
    if (!(name && description)) {
        throw new ExpressError('Please include a name, and description!', 400);
    }
}

// Same as above but for invoices
function userSentAllInvoiceData(comp_code, amt) {
    if (!(comp_code && amt)) {
        throw new ExpressError('Please include a comp_code and an amt!', 400);
    }
}

// Checks the paid status of an invoice
async function getPaidDate(userPaidStatus, invoiceId) {
    const result = await db.query(`SELECT paid, CAST(paid_date AS TEXT) FROM invoices WHERE id = $1`, [invoiceId]);
    let { paid:dbPaidStatus, paid_date } = result.rows[0];
    
    if (dbPaidStatus === false && userPaidStatus === true) {
        paid_date = new Date(Date.now());
    }
    else if (dbPaidStatus === true && userPaidStatus == false) {
        paid_date = null;
    }
    
    return paid_date;
}

// Checks that the industry code and company code are valid
async function checkForValidIndAndCo(ind, co) {
    const indResult = await db.query(`SELECT code FROM industries`);
    const industries = indResult.rows.map(val => val.code);

    const compResult = await db.query(`SELECT code FROM companies`);
    const companies = compResult.rows.map(val => val.code);

    if (!(industries.includes(ind) && companies.includes(co))) {
        throw new ExpressError('Please enter valid industry and company codes!', 400);
    }
}

module.exports = {
    doesInvoiceExist,
    doesCompanyExist,
    userSentAllCompanyData,
    userSentAllInvoiceData,
    checkForValidIndAndCo,
    getPaidDate
}