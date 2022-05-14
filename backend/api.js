//api.js
const express = require('express');
const router = express.Router();
const cors = require('cors');

//var con = mysql.createConnection({
//    host: "database",
//    user: "root",
//    port: '3306',
//    password: "somePassword",
//    database: "mydb",
//    charset  : 'utf8'
//});
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}
//// initial connection
//con.connect(function(err) {
//    if(err) console.log(err);
//});
// our simple get /jobs API

//router.get('/jobs', cors(corsOptions), (req, res) => {
//    con.query("SELECT * FROM jobs", function (err, result, fields) {
//        if (err) res.send(err);
//        res.send(result);
//        console.log(result);
//    });
//});

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

module.exports = router;
