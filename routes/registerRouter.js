var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';

// GET registration page
router.get('/', (req, res) => {
    res.render('register', { title: 'Miroctus - Register', headline: 'See your financial future.' });
});

router.post('/createuser', (req, res) => {
    // console.log(JSON.parse(req.body.data));
    let data = JSON.parse(req.body.data);
    newUser(data);
    res.send('Some stuff happened.');
    // all the action with the DB happens here
    // send error status?
});

// create new user -- really needs refactoring, promises, etc.
function newUser(data) {
    let formData = data.formData;
    let sessionData = data.sessionData;

    console.log(formData);
    console.log(sessionData);

    MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
        console.log('Database connection made.');

        const db = client.db(dbName);

        db.collection('users').find({ 'email': `${formData.email}` }).toArray((err, docs) => {
            if (err) {
                console.log(err);
            } else if (docs.length > 0) {
                console.log('Creation error - user already exists.');
                client.close();
                return 'User already exists.';
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
                        return 'Error.';
                    } else {
                        console.log('Insert success.');
                        client.close();
                        return 'Success.'
                    }
                });
            }
        });
    });
}

module.exports = router;