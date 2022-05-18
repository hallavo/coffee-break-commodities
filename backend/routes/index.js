//index.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}



router.post('/test', (req, res) => {
	console.log(req.body);
	res.send(req.body);
});


router.get('/edit', (req, res) => {
	db.one(`SELECT userid, username, email, phone, name
	         FROM users
	         WHERE username = $1`, `senior-office-gnome`)
	  .then(data => {
	  	res.render('edit-profile', {
	  		userid: data["userid"],
	  		username: data["username"],
	  		email: data["email"],
	  		phone: data["phone"],
	  		name: data["name"]
	  	});
	  })
	  .catch(error => {
			console.log('ERROR:', error);
		});
});


router.get('/take', (req, res) => {
	db.many(`SELECT name
	         FROM products`)
	  .then(data => {
	  	res.render('take-products', {products: data});
	  })
	  .catch(error => {
			console.log('ERROR:', error);
		});
});


router.post('/api/events', (req, res) => {
	const data = req.body;
	const vals = [ data["username"], data["eventtype"], data["eventtime"], data["amount"], data["product"] ];
	db.one(`INSERT INTO events (username, eventtype, eventtime, amount, product)
			     VALUES ($1, $2, $3, $4, $5)
			     RETURNING eventid`, vals)
	  .then(data => {
			console.log(data);
			res.send(data);
			res.status(201).end();
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});


//	getEventsByDatetimeRange
//	example: GET http://127.0.0.1:3000/api/usage/2022-05-01:12:00/2022-05-01:13:00
router.get('/api/usage/:from/:to', (req, res) => {
	const [from, to] = [ req.params["from"], req.params["to"] ];
	db.any(`SELECT product, sum(amount)
	        FROM events
	        WHERE eventtype = 'take' AND eventtime BETWEEN $1 AND $2
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
	console.log(data);
	const uid = req.params["userId"];
	const vals = [ data["email"], data["name"], data["phone"] ];
	db.none(`UPDATE users
	         SET email = $1, name = $2, phone = $3
			     WHERE userid = $4`, [...vals, uid])
	  .then(data => {
			console.log(data); // update queries never return data!!!!!
			res.send(data);    // only error handling required
		})
	  .catch(error => {
			console.log('ERROR:', error);
	  });
});


//	getProductStats
//	example: GET http://127.0.0.1:3000/api/product-stats
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


module.exports = router;
