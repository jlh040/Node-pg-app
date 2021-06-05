process.env.NODE_ENV = 'test'; // Set the testing environment

// Import app, db, and request
const app = require('../app');
const db = require('../db');
const request = require('supertest');

