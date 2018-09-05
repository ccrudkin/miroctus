var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
const murl = process.env.mongodbUrl; // from .env file -- change one place for whole app
const dbName = 'miroctus';
const { check, validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

router.get('/', ensureAuthenticated, function(req, res) {
    getProfileData(req.user)
    .then((data) => { res.render('account', { title: 'Account - Miroctus', headline: 'See your financial future.', data: data, msg: '' }); })
    .catch((err) => { res.render('/logout') }); // change to be more useful!
});

router.get('/reset', ensureNotAuthenticated, (req, res) => {
    res.render('reset', { title: 'Reset password - Miroctus', headline: 'See your financial future.' });
});

router.post('/', [ 
    check('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long.'),
    check('newPassword2').isLength({ min: 6 }).withMessage('Please confirm new password.')
        .custom((value, { req }) => value === req.body.newPassword).withMessage('Passwords must match.'),
    ], ensureAuthenticated, function(req, res) {
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
            return `${msg}`;
        };
        const result = validationResult(req).formatWith(errorFormatter);
        if (!result.isEmpty()) {
            console.log(result.array());
            res.send({ 'status': 'error', 'msg': result.array() });
        } else {
            changePassword(req.user, req.body.oldPassword, req.body.newPassword)
            .then((msg) => { res.send({ 'status': 'success', 'msg': msg }) })
            .catch((err) => { res.send({ 'status': 'error', 'msg': err }) });
        }
});

router.post('/reset', ensureNotAuthenticated, (req, res) => {
    resetPassword(req.body.email)
    .then((msg) => { res.send({ 'status': 'success', 'msg': msg }) })
    .catch((err) => { res.send({ 'status': 'error', 'msg': [err] }); });
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
                    resolve(profileData);
                }
            });
        });
    });
    return prom;
}

function changePassword(user, oldPass, newPass) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made -- changing password.');

            const db = client.db(dbName);

            db.collection('users').find( {'user.email': `${user}` }).toArray((err, result) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject('User location error.');
                } else {
                    bcrypt.compare(oldPass, result[0].user.password, (err, res) => {
                        if (err) {
                            console.log(err);
                            client.close();
                            reject( [ '# - Password update error.' ]);
                        } else {
                            if (res) {
                                bcrypt.genSalt(10, function(err, salt) {
                                    bcrypt.hash(newPass, salt, function(err, hash) {
                                        if (err) {
                                            console.log(err);
                                            client.close();
                                            reject([ '# - Password encryption error.' ]);
                                        } else {
                                            db.collection('users').updateOne(
                                                { 'user.email': `${user}` },
                                                { $set: { 'user.password': hash } },
                                                (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                        reject([ 'DB - Password update error.' ]);
                                                    } else {
                                                        // console.log(JSON.stringify(result, null, 2));
                                                        resolve('Password updated.');
                                                    }
                                                }
                                            );
                                        }
                                    });
                                });                         
                            } else {
                                console.log('Old passwords not matched.');
                                client.close();
                                reject([ 'Old password is incorrect.' ]);
                            }
                        }
                    });
                }
            });
        });
    });
    return prom;
}

function resetPassword(user) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            console.log('Database connection made -- changing password.');

            const db = client.db(dbName);

            db.collection('users').find( {'user.email': `${user}` }).toArray((err, docs) => {
                if (err) {
                    console.log(err);
                    client.close();
                    reject('User location error.');
                } else {
                    if (docs.length === 0) {
                        console.log('User not found.');
                        client.close();
                        reject('User not found.');
                    } else if (docs.length > 1) {
                        console.log('ERROR: Duplicate/multiple accounts found.');
                        client.close();
                        reject('Account conflicts.');
                    } else if (docs.length === 1) {
                        sendPass(genPass(), user)
                        .then((credentials) => { resetDBPass(credentials[0], credentials[1])
                                                .then((msg) => { resolve(msg) })
                                                .catch((err) => { reject(err) });
                        })
                        .catch((err) => { reject(err) });
                    }
                }
            });
        });
    });
    return prom;
}

function genPass() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let newPass = [];
    for (let i = 0; i < 10; i++) {
        let c = Math.floor(Math.random() * chars.length); // change to more secure method before deploy
        newPass.push(chars[c]);
    }
    return newPass.join('');
}

function resetDBPass(pass, user) {
    let prom = new Promise((resolve, reject) => {
        MongoClient.connect(murl, { useNewUrlParser: true }, function(err, client) {
            const db = client.db(dbName);

            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(pass, salt, function(err, hash) {
                    // store hash
                    if (err) { 
                        client.close();
                        reject(err);
                    } else {
                        db.collection('users').updateOne(
                            { 'user.email': `${user}` },
                            {
                                $set: {
                                    'user.password': `${hash}`
                                }
                            }, (err, result) => {
                                if (err) {
                                    client.close();
                                    console.log(err);
                                    reject('Password reset error. Please try again.');
                                } else {
                                    client.close();
                                    console.log('Password reset successful.');
                                    resolve('Please check your email and follow the instructions.');
                                }
                            }
                        )
                    }
                });
            });
        });
    });
    return prom;
}

// BUILD OUT FUNCTION TO SEND NEW PASSWORD TO USER EMAIL WITH NODEMAILER
function sendPass(pass, email) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.emailuser, // email service user
            pass: process.env.emailpass // email service password
        }
    });

    let todate = new Date();

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Password manager" <sitehost@engineer.com>', // sender address
        to: email, // receiver(s)
        subject: `Password reset from Miroctus - ${todate.toString().slice(4, 24)}`, // Subject line
        // text: 
        html: `<p>The password associated with this email account at Miroctus has been reset.</p>
                <p>Please log in using the following password. Then navigate to your Account 
                (<a href="/account">miroctus.herokuapp.com/account</a>) and choose a new password.</p>
                <p>Temporary password: <strong>${pass}</strong></p>
                <br>
                <p>Thanks!</p>
                <br>
                <p>--</p>
                <p>The Miroctus Team</p>`
    };
    // send mail with defined transport object and return promise
    let prom = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject('There was an error. Please try again.');
            } else {
                resolve([ pass, email ]);
            }
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

function ensureNotAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        res.redirect('/register/loggedin');
    } else {
        return next();
    }
}

module.exports = router;