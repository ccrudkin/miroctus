var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';
var passport = require('passport');
var LocalStrategy = require('passport-local');
// var bcrypt = require('bcryptjs');

// GET login page
router.get('/', ensureNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Miroctus - Login', headline: 'See your financial future.', msg: '' });
});

router.get('/retry', (req, res) => {
    res.render('login', { title: 'Miroctus - Login', headline: 'See your financial future.', msg: 'Incorrect email or password. Please try again.' });
});

router.get('/out', (req, res) => {
    res.render('login', { title: 'Miroctus - Login', headline: 'See your financial future.', msg: 'You are logged out.' } );
});

// config passport user/pass strategy
passport.use(new LocalStrategy({
        usernameField: 'userEmail' // different from default 'username'
    },
    function(user, password, done) {

    console.log('Passport authenticating...')

    MongoClient.connect(murl, { useNewUrlParser: true }, (err, client) => {
        if (err) { 
            console.log(err);
            client.close();
            return done(null, false);
        }

        const db = client.db(dbName);

        db.collection('users').find( { email: `${user}` }).toArray((err, result) => {
            if (err) {
                console.log(err);
                client.close();
                return done(null, false);
            } else if (result.length === 0) {
                console.log('User not found.');
                client.close();
                return done(null, false);
            } else {
                if (result[0].password === password) {
                    client.close();
                    return done(null, result[0].email);
                } else {
                    console.log('Password not matched.');
                    client.close();
                    return done(null, false);
                }
            }
        });
    });

}));

passport.serializeUser(function(user, done) {
    console.log('Serializing user ... ');

    return done(null, user);
  });
  
passport.deserializeUser(function(user, done) {

    console.log('Deserializing user ...')

    MongoClient.connect(murl, {useNewUrlParser: true}, (err, client) => {
        if (err) throw err;
        const db = client.db(dbName);

        db.collection('users').find({ email: `${user}` }).toArray((err, result) => {
            if (result.length === 0) {
                console.log('Authentication error.');
                client.close();
                return done(null, false)
            } else {
                client.close();
                return done(null, user);
            }
        });
    });
});

router.post('/', 
    passport.authenticate('local', { successRedirect: '/profile',
    failureRedirect: '/login/retry',
    failureFlash: false })
);

function ensureNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        res.redirect('/');
    } else {
        return next();
    }
}

module.exports = router;