var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';
const { body, check, validationResult } = require('express-validator/check');

// GET basic profile page
router.get('/', ensureAuthenticated, function(req, res) {
    getProfileData(req.user)
    .then((data) => { res.render('profile', { title: 'View profile - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('/logout') }); // change to be more useful!
});

router.get('/details', ensureAuthenticated, function(req, res) {
    // get user details from database
    console.log(`Fetching details for user: ${req.user}`);
    getProfileData(req.user)
    .then((data) => { res.send(data) })
    .catch((err) => { res.send(err) });
});

/* // Deprecated, now /profile
// GET portfolio builder page
router.get('/portfolio', ensureAuthenticated, function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus', headline: 'See your financial future.' });
});
*/

router.get('/portfolio/:portfolio', ensureAuthenticated, function(req, res) {
    // console.log(portfolios[req.params.portfolio])
    res.send(portfolios[req.params.portfolio]);
});

// GET portfolio builder page
router.get('/edit', ensureAuthenticated, function(req, res) {
    getProfileData(req.user)
    .then((data) => { res.render('profileEdit', { title: 'Edit profile - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('logout') }); // change to be more useful!
});

router.post('/edit', ensureAuthenticated, [
    check('firstName').isLength({ min: 1 }).withMessage('First name is required.'),
    check('lastName').isLength({ min: 1 }).withMessage('Last name is required.'),
    check('birthYear').custom((value, { req }) => parseFloat(value) > 1899).withMessage('Valid birth year is required.'),
    check('initInvest').isLength({ min: 1 }).withMessage('Portfolio value is required.'),
    check('retireAge').isLength({ min: 1 }).withMessage('Retirement age is required.'),
    check('annualIncome').isLength({ min: 1 }).withMessage('Annual income is required.')
        .custom((value, { req }) => parseFloat(value) > 0 ).withMessage('Annual income must be greater than 0.'),
    check('netWorth').exists().withMessage('Net worth is required.'),
    check('monthlyExpenses').isLength({ min: 1 }).withMessage('Monthly expenses are required.'),
    check('monthlySave').isLength({ min: 1 }).withMessage('Monthly savings is required.'),
    check('riskWilling').isLength({ min: 1 }).withMessage('Risk willingness is required.')
        .custom((value, { req }) => ['1', '2', '3', '4', '5'].includes(value)).withMessage('Risk willingness must be an integer from 1 to 5.')
    ],
    (req, res) => {
        console.log(req.body);
        console.log(typeof(req.body));
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            console.log(result.array());
            res.send({ 'status': 'error', 'msg': result.array() });
        } else {
            // console.log(JSON.parse(req.body.data));
            let data = req.body;
            let user = req.user;
            editUser(data, user)
            .then((msg) => { res.send({ 'status': 'success', 'msg': [msg] }) })
            .catch((err) => { res.send({ 'status': 'error', 'msg': [err] }) });
        }
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
                    resolve(docs[0].profile); // shouldn't send all data -- some is sensitive
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

function editUser(data, user) {

    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made.');
    
            const db = client.db(dbName);
    
            db.collection('users').updateOne(
                { 'user.email': `${user}` },
                {
                    $set: {
                        'profile.firstName': `${data.firstName}`,
                        'profile.lastName': `${data.lastName}`,
                        'profile.birthYear': `${data.birthYear}`,
                        'profile.initInvest': `${data.initInvest}`,
                        'profile.retireAge': `${data.retireAge}`,
                        'profile.annualIncome': `${data.annualIncome}`,
                        'profile.netWorth': `${data.netWorth}`,
                        'profile.monthlyExpenses': `${data.monthlyExpenses}`,
                        'profile.monthlySave': `${data.monthlySave}`,
                        'profile.riskWilling': `${data.riskWilling}`
                    }
                }, (err, result) => {
                    if (err) {
                        client.close();
                        console.log(err);
                        reject('Profile update error. Please try again.');
                    } else {
                        client.close();
                        console.log('Successful profile update.');
                        // console.log(JSON.stringify(result, null, 2));
                        resolve('Profile updated.');
                    }
                }
            )
        });
    });
    return prom;
}

module.exports = router;