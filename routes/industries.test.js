process.env.NODE_ENV = 'test'; // Set the testing environment

// Import app, db, and request
const app = require('../app');
const db = require('../db');
const request = require('supertest');

let testIndustry;
let testCompany;

beforeEach(async () => {
    const indResult = await db.query(`
    INSERT INTO industries (code, industry)
    VALUES ('aero', 'aeronautics')
    RETURNING code, industry`);

    const compResult = await db.query(`
    INSERT INTO companies (code, name, description)
    VALUES ('bg', 'boeing', 'An airplane company')
    RETURNING code, name, description`);

    await db.query(`
    INSERT INTO companies_industries (comp_code, ind_code)
    VALUES ('bg', 'aero')`);

    testIndustry = indResult.rows[0];
    testCompany = compResult.rows[0];
});

afterEach(async () => {
    await db.query(`DELETE FROM industries`);
    await db.query(`DELETE FROM companies`);
    await db.query(`DELETE FROM companies_industries`);
});

afterAll(() => {
    db.end();
})

describe(`GET /industries`, () => {
    test('Get all industries w/ company codes', async () => {
        const response = await request(app).get('/industries')

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            industries: [{
                industry: testIndustry.industry,
                code: testIndustry.code,
                company_codes: ['bg']
            }]
        })
    })
})

describe('POST /industries', () => {
    test('Create an industry', async () => {
        const resp = await request(app)
            .post('/industries')
            .send({industry: 'food and candy'});
        
        expect(resp.status).toBe(201);
        expect(resp.body).toEqual({industry: {industry: 'food and candy', code: 'food-and-candy'}});
    })
})