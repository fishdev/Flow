const createError = require('http-errors');
const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const checkAuth = require('../util/check-auth');
const sendEmail = require('../util/mailer');

const router = express.Router();

/*
  POST do a login
    username (user:id in db)
    password (salted hash)
*/
router.post('/', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

/*
  GET dashboard page
  must be logged into access
*/
router.get('/dashboard', checkAuth, (req, res) => {
  res.render('dashboard');
});

/*
  POST create an account
    username (should not be duplicate)
    password (salted hash)
    email (not verified)
*/
router.post('/signup', (req, res, next) => {
  const { username, password, email } = req.body;

  // make sure we have valid params
  if (!username || !password || !email) {
    return next(createError(400, 'Provide username, password hash, and email'));
  }

  // check if user exists already
  req.db.exists(`user:${username}`, (err, reply) => {
    if (err) return next(createError(500, err));
    if (reply) return next(createError(409, 'Username taken'));

    // create user account
    req.db.hmset(`user:${username}`, {
      username,
      password: bcrypt.hashSync(password, 16),
      email,
    }, (createErr) => {
      if (createErr) return next(createError(500, err));
      res.status(200).send(`Created user ${username} with email ${email}`);

      // send email welcome
      sendEmail(email, { username }, 'signup');
    });
  });
});

/*
  GET check if a username is taken (for sign up form)
*/
router.get('/usercheck', (req, res, next) => {
  const { username } = req.query;

  // check if the user exists already
  req.db.exists(`user:${username}`, (err, reply) => {
    if (err) return next(createError(500, err));
    if (reply) return res.sendStatus(409);
    res.sendStatus(200);
  });
});

/*
  GET logout (poof!)
*/
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
