const ExpressError = require('./expressError');


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



module.exports = {
    doesInvoiceExist,
    doesCompanyExist,
    userSentAllCompanyData,
    userSentAllInvoiceData
}