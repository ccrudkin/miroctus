var express = require('express');
var router = express.Router();

// GET portfolio builder page
router.get('/', function(req, res) {
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus' });
    // probably will store user info in a database in the future
});

module.exports = router;