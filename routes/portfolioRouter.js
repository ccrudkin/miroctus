var express = require('express');
var router = express.Router();
var portfolios = require('./routes_data/portfolio_profiles');
var formulas = require('./routes_data/backendFormulas');
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';

let cYear = parseFloat(new Date().getFullYear());
console.log('Bonjour! It is ' + cYear)

// GET portfolio page
router.get('/', ensureAuthenticated, function(req, res) {
    generateReport(req.user)
    .then((data) => { res.render('portfolio', { title: 'Portfolio report - Miroctus', headline: 'See your financial future.', data: data }); })
    .catch((err) => { res.render('portfolio', { title: 'View profile - Miroctus', headline: 'See your financial future.', data: err }) }); // change to be more useful!
});

function generateReport(user) {
    let prom = new Promise((resolve, reject) => {
        getProfileData(user)
        .then((data) => { 
            calcuateReport(data)
            .then((reportData) => { resolve(reportData) })
            .catch((err) => { reject(err) });
        })
        .catch((err) => { reject(err) });
    })
    return prom;
}

function calcuateReport(data) {
    let prom = new Promise((resolve, reject) => {
        // console.log(`User data:\n${JSON.stringify(data, null, ' ')}`);

        let reportData = {
            'preRetire': {},
            'postRetire': {}
        };

        let preRetireGrowth = formulas.totalGrowth(data.retireAge - (cYear - data.birthYear), data.initInvest, 
            data.monthlySave * 12, formulas.riskReturn[data.riskWilling]);
        
        // console.log(`Pre-retire growth:\n${JSON.stringify(preRetireGrowth, null, ' ')}`);

        for (let key in preRetireGrowth) {
            reportData['preRetire'][parseInt(key) + parseInt(cYear - data.birthYear)] = preRetireGrowth[key];
        }

        let postRetire = postRetirement(data, reportData['preRetire'][data.retireAge - 1]['end']);
        
        for (let key in postRetire) {
            reportData['postRetire'][parseInt(key) + parseInt(data.retireAge)] = postRetire[key];
        }

        if (reportData) {
            resolve(reportData);
        } else {
            reject('No data.');
        }
    });
    return prom;
}

function postRetirement(userData, nestEgg) {
    let iyears = userData.retireAge - (cYear - userData.birthYear); // years to retirement from now
    let ryears = 85 - userData.retireAge;
    let salary = userData.annualIncome;
    let withDrawRate = userData.retireIncome;
    let growthRate = formulas.riskReturn[3];

    let postRetire = formulas.totalWithDraw(iyears, ryears, nestEgg, salary, withDrawRate, growthRate);

    return postRetire;
}

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

module.exports = router;