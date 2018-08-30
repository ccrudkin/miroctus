var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';

router.get('/', ensureAuthenticated, function(req, res) {
    getProfileData(req.user)
    .then((data) => { res.render('account', { title: 'Account - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('/logout') }); // change to be more useful!
});

function getProfileData(user) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made.');
    
            const db = client.db(dbName);
    
            db.collection('users').find({ 'user.email': `${user}` }).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject('Database error.');
                } else {
                    // send data
                    client.close();
                    // extract and format data
                    let profileData = {
                        'email': docs[0].user.email,
                        'name': `${docs[0].profile.firstName} ${docs[0].profile.lastName}`
                    };
                    resolve(profileData); // shouldn't send all data -- some is sensitive
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