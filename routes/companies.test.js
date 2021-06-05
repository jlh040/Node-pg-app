process.env.NODE_ENV = 'test';

const app = require('../app');
const db = require('../db');
const request = require('supertest');

let testCompany;

beforeEach(async () => {
    const result = await db.query(`
        INSERT INTO companies (code, name, description)
        VALUES ('dd', 'DataDog', 'Cloud monitoring as a service')
        RETURNING code, name, description`);
    
    testCompany = result.rows[0];
})

afterEach(async () => {
    await db.query('DELETE FROM companies');
})

afterAll(() => {
    db.end();
})

describe('GET /companies', () => {
    test('Get a list of companies', () => {
        expect(1).toEqual(1)
    })
})