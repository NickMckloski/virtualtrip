var express = require('express');
var router = express.Router();

/* home page. */
router.get('/', function(req, res) {
    res.render('index', { title: 'Home' });
});

/* output page. */
router.post('/output', function(req, res) {
    console.log(req.body)
    res.render('output', { title: 'Output', start: req.body.start, end: req.body.end });
});

/* about page. */
router.get('/about', function(req, res) {
  res.render('about', { title: 'About' });
});

module.exports = router;
