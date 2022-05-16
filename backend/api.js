//api.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const cors = require('cors');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}


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


module.exports = router;
