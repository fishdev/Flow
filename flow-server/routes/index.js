const express = require('express');

const router = express.Router();

/*
  GET home/landing page
*/
router.get('/', (req, res) => {
  res.render('index', {
    logged_in: req.user && req.user.username,
  });
});

module.exports = router;
