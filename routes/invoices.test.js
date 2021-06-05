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
        RETURNING id, amt, comp_code, paid, CAST(add_date AS TEXT), paid_date`);
        
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
        const response = await request(app).get('/invoices');

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({invoices: [{id: testInvoice.id, comp_code: testInvoice.comp_code}]});
    })
});

describe('GET /:id', () => {
    test('Get a single invoice', async () => {
        const resp = await request(app).get(`/invoices/${testInvoice.id}`);

        console.log(resp.body)
        
        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({invoice: {
                id: testInvoice.id,
                amt: testInvoice.amt,
                paid: testInvoice.paid,
                add_date: testInvoice.add_date,
                paid_date: testInvoice.paid_date,
                company: {
                    code: testCompany.code,
                    name: testCompany.name,
                    description: testCompany.description
                }
            }
        })
    })

    test('Return 404 if the invoice is not found', async () => {
        const resp = await request(app).get('/invoices/45');
        expect(resp.statusCode).toBe(404);
    })
});