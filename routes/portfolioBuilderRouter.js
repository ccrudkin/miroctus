var express = require('express');
var router = express.Router();

// GET portfolio builder page
router.get('/:0/:1/:2/:3/:4/:5/:6/:7', function(req, res) {
    console.log(req.params);
    res.render('portfoliobuilder', { title: 'Build portfolio - Miroctus', userData: `Portfolio: ${req.params[7]}` });
});

module.exports = router;