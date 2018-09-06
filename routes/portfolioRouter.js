var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');
var formulas = require('./routes_data/formulas');
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';


// GET portfolio page
router.get('/', ensureAuthenticated, function(req, res) {
    generateReport(req.user)
    .then((data) => { res.render('portfolio', { title: 'Portfolio report - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('/profile') }); // change to be more useful!
});




function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/logout');
	}
}

module.exports = router;