var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';

// GET registration page
router.get('/', ensureNotAuthenticated, (req, res) => {
    res.render('register', { title: 'Miroctus - Register', headline: 'See your financial future.' });
});

// GET "You're logged in already." page.
router.get('/loggedin', ensureAuthenticated, (req, res) => {
    res.render('loginCheck', { title: 'Miroctus', headline: 'See your financial future.' } );
});

router.post('/createuser', (req, res) => {
    // console.log(JSON.parse(req.body.data));
    let data = JSON.parse(req.body.data);
    newUser(data)
    .then((msg) => { res.send({ 'status': 'success', 'msg': msg }) })
    .catch((err) => { res.send({ 'status': 'error', 'msg': err }) });
});

// create new user
function newUser(data) {
    let formData = data.formData;
    let sessionData = data.sessionData;

    console.log(formData);
    console.log(sessionData);

    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made.');
    
            const db = client.db(dbName);
    
            db.collection('users').find({ 'email': `${formData.email}` }).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject('Database error.');
                } else if (docs.length > 0) {
                    console.log('Creation error - user already exists.');
                    client.close();
                    reject('An account is already associated with that email.');
                }
                else {
                    console.log('Creating new user document.');
    
                    db.collection('users').insertOne({
    
                        'email': `${formData.email}`,
                        'firstName': `${formData.firstName}`,
                        'lastName': `${formData.lastName}`,
                        'password': `${formData.password}`,
                        'birthYear': `${formData.birthYear}`,
                        'annualIncome': `${formData.annualIncome}`,
                        'netWorth': `${formData.netWorth}`,
                        'age': `${2018 - parseInt(formData.birthYear)}`,
                        'retireAge': `${sessionData[1]}`,
                        'initInvest': `${sessionData[2]}`,
                        'monthlySave': `${sessionData[3]}`,
                        'monthlyExpenses': `${sessionData[5]}`,
                        'riskWilling': `${sessionData[7]}`
    
                    }, (err, result) => {
                        if (err) {
                            console.log(err);
                            client.close();
                            reject('User document creation error.');
                        } else {
                            console.log('Insert success.');
                            client.close();
                            resolve('User profile created.');
                        }
                    });
                }
            });
        });
    });
    return prom;
}


function ensureNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        res.redirect('/register/loggedin');
    } else {
        return next();
    }
}

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect('/logout');
	}
}

module.exports = router;