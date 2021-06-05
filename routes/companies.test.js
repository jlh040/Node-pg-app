process.env.NODE_ENV = 'test'; // Set the testing environment

// import app, db, and supertest
const app = require('../app');
const db = require('../db');
const request = require('supertest');

let testCompany; // create a global variable to hold the test company

beforeEach(async () => {
    // insert a test company into the db
    const result = await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('dd', 'DataDog', 'Cloud monitoring as a service')
        RETURNING code, name, description`);
    
    testCompany = result.rows[0];
})

afterEach(async () => {
    // delete everything from the DB
    await db.query('DELETE FROM companies');
})

afterAll(() => {
    // close the DB connection
    db.end();
})

describe('GET /companies', () => {
    test('Get a list of companies', async () => {
        const resp = await request(app).get('/companies')

        expect(resp.statusCode).toBe(200);
        expect(resp.body).toEqual({companies: [{code: testCompany.code, name: testCompany.name}]});
    })
})

describe('GET /companies/:code', () => {
    test('Get a single company', async () => {
        const response = await request(app).get(`/companies/${testCompany.code}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({company: {
            name: testCompany.name,
            code: testCompany.code,
            description: testCompany.description,
            invoices: [null]
        }});
    })

    test('Return 404 if company code is not found', async () => {
        const response = await request(app).get('/bobslol');
        expect(response.statusCode).toBe(404);
    })
})

describe('POST /companies', () => {
    test('Create a company', async () => {
        const company = {
            code: 'goog',
            name: 'google',
            description: 'Search Engine'
        }
        const response = await request(app)
            .post('/companies')
            .send(company);

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({company})
    })
})

describe('PUT /companies/:code', () => {
    test('Update a company', async () => {
        const response = await request(app)
            .put(`/companies/${testCompany.code}`)
            .send({name: 'DataDog', description: 'A CMAS company'});
        
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({company: {name: 'DataDog', code: 'dd', description: 'A CMAS company'}});
    })

    test('Return 404 if the company cannot be found', async () => {
        const response = await request(app)
            .put('/companies/AMZN')
            .send({name: 'Amazon', description: 'Big company'});
        
        expect(response.status).toBe(404);
    })

    test('Return 400 if the request is missing data', async () => {
        const response = await request(app)
            .put(`/companies/${testCompany.code}`)
            .send({name: 'DataDog'});

        expect(response.status).toBe(400);
    })
})

describe('DELETE /companies/:code', () => {
    test('Delete a company', async () => {
        const response = await request(app).delete(`/companies/${testCompany.code}`);
        const result = await db.query(`SELECT COUNT(*) FROM companies`);

        expect(response.statusCode).toBe(200);
        expect(+result.rows[0].count).toBe(0);
    })
})