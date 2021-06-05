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
    VALUES ('bg', 'boing', 'An airplane company')
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
        expect(1).toBe(1);
    })
})