
const pgp = require('pg-promise')();
const conn = {
	    host: 'db-container', 
	    port: 5432, 
	    database: 'postgres',
	    user: 'postgres',
	    password: 'postgres',

	    // to auto-exit on idle, without having to shut-down the pool;
	    // see https://github.com/vitaly-t/pg-promise#library-de-initialization
      allowExitOnIdle: true
};
const db = pgp(conn); // database instance;

module.exports = db;
