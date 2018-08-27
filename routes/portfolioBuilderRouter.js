var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';

// GET basic profile page
router.get('/', ensureAuthenticated, function(req, res) {
    getProfileData(req.user)
    .then((data) => { res.render('profile', { title: 'Build portfolio - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('/logout') }); // change to be more useful!
});

router.get('/details', ensureAuthenticated, function(req, res) {
    // get user details from database
    console.log(`Fetching details for user: ${req.user}`);
    getProfileData(req.user)
    .then((data) => { res.send(data) })
    .catch((err) => { res.send(err) });

});

// GET portfolio builder page
router.get('/portfolio', ensureAuthenticated, function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus', headline: 'See your financial future.' });
});

router.get('/portfolio/:portfolio', ensureAuthenticated, function(req, res) {
    // console.log(portfolios[req.params.portfolio])
    res.send(portfolios[req.params.portfolio]);
});

function getProfileData(user) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made.');
    
            const db = client.db(dbName);
    
            db.collection('users').find({ 'email': `${user}` }).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject('Database error.');
                } else {
                    // send data
                    client.close();
                    resolve(docs[0]); // shouldn't send all data -- some is sensitive
                }
            });
        });
    });
    return prom;
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/logout');
	}
}

module.exports = router;