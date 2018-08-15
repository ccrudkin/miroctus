var express = require('express');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
    console.log(req.params);
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus', userData: 'Data here!' });
});

module.exports = router;