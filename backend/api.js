//api.js
const express = require('express');
const router = express.Router();
const pgp = require('pg-promise')();
const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

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

// toy example
//db.any('select * from users')
//    .then(data => {
//        console.log('DATA:', data); // print data;
//    })
//    .catch(error => {
//        console.log('ERROR:', error); // print the error;
//    });



router.get('/edit', (req, res) => {
	res.render('edit-profile', {
		name: "Office Gnome",
		email: "office.gnome@company.com",
		phone: "1234567890"
	});
});


router.get('/take', (req, res) => {
	res.render('take-products', {
		products: [
			{
				product: "Office Gnome",
				price: "1.00"
			},
			{
				product: "asdf",
				price: "1.00"
			}
		]
	});
});

//needed functions:
//  addEvent (take item, login, logout)
//	getUsers
//	editUser
//	getEventsByDatetimeRange
//	getProductStats
//
//	addUser
//	deleteUser ??

// addEvent
router.post('/api/events', (req, res) => {
	const data = req.body;
	const vals = [ data["username"], data["eventtype"], data["eventtime"], data["amount"], data["product"] ];
	db.none(`INSERT INTO events (username, eventtype, eventtime, amount, product)
			     VALUES ($1, $2, $3, $4, $5)`, vals)
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});

//	getEventsByDatetimeRange
//	example: GET http://127.0.0.1:3000/usage/2022-05-01:12:00/2022-05-01:13:00
router.get('/api/usage/:from/:to', (req, res) => {
	const [from, to] = [ req.params["from"], req.params["to"] ];
	db.any(`SELECT product, sum(amount)
	        FROM events
	        WHERE eventype = 'take' AND eventtime BETWEEN $1 AND $2
	        GROUP BY product
	        ORDER BY sum(amount) DESC`, [from, to])
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});


// getUsers
router.get('/api/users', (req, res) => {
	db.any(`SELECT userid, username, email, name, phone
	        FROM users`)
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});

//getUser (with id)
router.get('/api/users/:userId', (req, res) => {
	const uid = req.params["userId"];
	db.any(`SELECT userid, username, email, name, phone
	        FROM users
	        WHERE userid = $1`, uid)
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});


// editUser
router.put('/api/users/:userId', (req, res) => {
	const data = req.body;
	const uid = req.params["userId"];
	const vals = [ data["username"], data["email"], data["name"], data["phone"] ];
	db.none(`UPDATE users
	         SET username = $1, email = $2, name = $3, phone = $4
			     WHERE userid = $5`, [...vals, uid])
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});

//	getProductStats
//	example: GET http://127.0.0.1:3000/product-stats
router.get('/api/product-stats', (req, res) => {
	db.any(`SELECT username, product, sum(amount)
	        FROM events
	        WHERE eventtype = 'take'
	        GROUP BY username, product
	        ORDER BY username, sum(amount) DESC`)
	  .then(data => {
			console.log(data);
			res.send(data);
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});


/*
router.get('/jobs', cors(corsOptions), (req, res) => {
	  res.send({
	  	job: "mcdonalds",
	  	tier: "shit"
	  });
});

router.get('/users', cors(corsOptions), (req, res) => {
	  res.send([
	 	  {
				id: 1,
	    	email: "asdf@email.com",
	  	  name: "John Doe",
	  	  phone: "123-456-7890"
	  	},
	  	{
				id: 2,
				email: "mail@jimmy.net",
				name: "Jimmy",
	  	  phone: "123-456-7890"
	  	}
		]);
});

router.get('/users/:userId', cors(corsOptions), (req, res) => {
	  res.send({
			id: 1,
			email: "asdf@email.com",
			name: "John Doe",
			phone: "123-456-7890"
	  });
});

// this should return a list of 'transactions' for the specified user id: 
//   user created, purchases, etc.
router.get('/history/:userId', cors(corsOptions), (req, res) => {
	  res.send({
			id: 1,
			email: "asdf@email.com",
			name: "John Doe",
			phone: "123-456-7890"
	  });
});


// usage stats (amount of products taken) by datetime range
router.get('/usage/:from/:until', cors(corsOptions), (req, res) => {
	  res.send([
	    {
				product: "prod name",
				amount: 2
			},
			{
				product: "another product",
				amount: 1
			}
		]);

});
*/

module.exports = router;
