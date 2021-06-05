### RESTful API Company/Invoice Tracker

#### Functionality

- This app is a RESTful back-end JSON API server that allows a user to perform all the CRUD operations on two different resources: companies, and invoices.
- Testing will be provided shortly.

#### Technicalities

- To get this code onto your machine, run `git clone https://github.com/jlh040/Node-pg-app.git`
- Next, assuming you have [Node](https://nodejs.org/en/) installed, run `npm install` in your terminal to download all the dependencies
- After that, you will need to have [PostgreSQL](https://www.postgresql.org/) installed
- Once you have it installed, run `createdb biztime` in your terminal in order to create the database.
- Then,  run `psql < data.sql` in order to seed the database with information.
- To start the server, run `node server.js`

#### Routes

- Once the server is up, you can hit any of the routes:

  - **GET /companies**

  - **GET /companies/[code]**

  - **POST /companies**

    - Requires {name, description} as JSON
    - A company code will be automatically generated thanks to [slugify](https://www.npmjs.com/package/slugify).
  
  - **PUT /companies/[code]**
  
    - Requires {name, description} as JSON
  
  - **DELETE /companies/[code]**
  
  - **GET /invoices**
  
  - **GET /invoices/[id]**
  
  - **POST /invoices**
  
    - Requires {comp_code, amt} as JSON
  
  - **PUT /invoices/[id]**
  
    - Requires {amt} as JSON
  
  - **DELETE /invoices/[id]**
  
    

