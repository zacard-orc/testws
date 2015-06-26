var express = require('express');
var router = express.Router();

/* GET home page. */


router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res) {
  res.render('home');
});

router.get('/adpic', function(req, res) {
  res.render('adpic');
});


module.exports = router;
