process.env.NODE_ENV = 'test'; // set the testing environment

// import the app, db, and supertest
const app = require('../app');
const db = require('../db');
const request = require('supertest')

let testInvoice;
let testCompany;

beforeEach(async () => {
    const companyResult = await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('dd', 'DataDog', 'Cloud monitoring as a service')
        RETURNING code, name, description`);

    const invoiceResult = await db.query(`
        INSERT INTO invoices (comp_code, amt)
        VALUES ('dd', 399.99)
        RETURNING *`);
    
    testInvoice = invoiceResult.rows[0];
    testCompany = companyResult.rows[0];
});

afterEach(async () => {
    await db.query('DELETE FROM invoices');
    await db.query('DELETE FROM companies');
});

afterAll(() => {
    db.end();
})

describe('GET /invoices', () => {
    test('Get all invoices', async () => {
        expect(1).toBe(1);
    })
})