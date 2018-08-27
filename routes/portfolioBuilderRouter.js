var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');

// GET basic profile page
router.get('/', ensureAuthenticated, function(req, res) {
    res.render('profile', { title: 'Build portfolio - Miroctus', headline: 'See your financial future.' });
});

// GET portfolio builder page
router.get('/portfolio', ensureAuthenticated, function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus', headline: 'See your financial future.' });
});

router.get('/portfolio/:portfolio', ensureAuthenticated, function(req, res) {
    // console.log(portfolios[req.params.portfolio])
    res.send(portfolios[req.params.portfolio]);
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/logout');
	}
}

module.exports = router;