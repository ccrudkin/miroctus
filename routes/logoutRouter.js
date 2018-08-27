var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    req.logout();
    res.render('logout', { title: 'Miroctus - Logout', headline: 'See your financial future.', msg: 'You are logged out.' } );
});

module.exports = router;