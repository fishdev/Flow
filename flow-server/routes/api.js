const createError = require('http-errors');
const express = require('express');
const checkAuth = require('../util/check-auth');
const smartAI = require('../util/smart-ai');
const sendEmail = require('../util/mailer');

const router = express.Router();

/*
  POST data points for a Flow
    id (of the Flow in question, should be registered)
    timestamp (should be a numerical representation)
    value (should be an int or float)
  timestamp is recorded on the server
*/
router.post('/flow', (req, res, next) => {
  const { id } = req.query;
  const { timestamp, value } = req.body;

  // make sure we have valid params
  if (!id || !timestamp || !value || Number.isNaN(value)) {
    return next(createError(400, 'Provide a Flow ID, timestamp, and value'));
  }

  // check for Flow membership in db
  req.db.get(`flowu:${id}`, (err, reply) => {
    // make sure the Flow exists
    if (err) return next(createError(500, err));
    if (!reply) return next(createError(404, 'Flow not found'));

    // insert data into sorted set for this Flow (include timestamp)
    req.db.zadd([`flow:${id}`, timestamp, value], (addErr) => {
      if (addErr) return next(createError(500, err));
      res.status(200).send(`Recorded data for Flow ${id} at ${timestamp}`);

      // check if value is over limit and send email
      req.db.hgetall(`user:${reply}`, (userErr, userReply) => {
        if (!userErr && userReply.limit && userReply.limit > 0
          && value > userReply.limit) {
          sendEmail(userReply.email, { id }, 'limit');
        }
      });
    });
  });
});

/*
  POST register a Flow
    id (of the Flow in question, should be unregistered)
  username inferred from auth
*/
router.post('/register', checkAuth, (req, res, next) => {
  const { id } = req.body;
  const { username } = req.user;

  // make sure we have valid params
  if (!id || !username) {
    return next(createError(400, 'Provide a Flow ID and username'));
  }

  // make sure user doesn't already have a Flow
  if (req.user.flow) {
    return next(createError(409, 'User already has a Flow registered'));
  }

  // make sure Flow is not registered already
  req.db.exists(`flowu:${id}`, (err, reply) => {
    if (err) return next(createError(500, err));
    if (reply) return next(createError(409, 'Flow already registered'));

    // enroll this Flow for the user
    req.db.hset(`user:${username}`, 'flow', id, (regErr) => {
      if (regErr) return next(createError(500, err));

      // mark flow as registered in db set
      req.db.set(`flowu:${id}`, username, (addErr) => {
        if (addErr) return next(createError(500, err));
        res.status(200).send(`Registered Flow ${id} to ${username}`);
      });
    });
  });
});

/*
  POST deregister a Flow
  username inferred from auth
  id based on user's current flow
*/
router.post('/deregister', checkAuth, (req, res, next) => {
  const { username } = req.user;
  const id = req.user.flow;

  // make sure we have valid params
  if (!id || !username) {
    return next(createError(400, 'Provide a Flow ID and username'));
  }

  // make sure Flow is marked as registered
  req.db.exists(`flowu:${id}`, (err) => {
    if (err) return next(createError(500, err));

    // disenroll this Flow from the user
    req.db.hdel(`user:${username}`, 'flow', (derErr) => {
      if (derErr) return next(createError(500, err));

      // remove Flow registration in db
      req.db.del(`flowu:${id}`, (remErr) => {
        if (remErr) return next(createError(500, err));
        res.status(200).send(`Deregistered Flow ${id} from ${username}`);
      });
    });
  });
});

/*
  POST set a limit on water consumption
    value (should be an int or float)
  username inferred from auth
*/
router.post('/setlimit/', checkAuth, (req, res, next) => {
  const { username } = req.user;
  const { value } = req.body;

  // make sure we have valid params
  if (!username || Number.isNaN(value)) {
    return next(createError(400, 'Provide a username and value'));
  }

  // set limit if value is provided
  if (value && value > 0) {
    req.db.hset(`user:${username}`, 'limit', value, (err) => {
      if (err) return next(createError(500, err));
      res.status(200).send(`Set water limit to ${value} for ${username}`);
    });
  // otherwise remove limit for this user
  } else {
    req.db.hdel(`user:${username}`, 'limit', (err) => {
      if (err) return next(createError(500, err));
      res.status(200).send(`Removed water limit for ${username}`);
    });
  }
});

/*
  POST set user email
    address
  username inferred from auth
*/
router.post('/setemail/', checkAuth, (req, res, next) => {
  const { username } = req.user;
  const { value } = req.body;

  // make sure we have valid params
  if (!username || !value) {
    return next(createError(400, 'Provide a username and email address'));
  }

  // set new email address
  req.db.hset(`user:${username}`, 'email', value, (err) => {
    if (err) return next(createError(500, err));
    res.status(200).send(`Set water limit to ${value} for ${username}`);
  });
});

/*
  GET current user data
*/
router.get('/my', checkAuth, (req, res) => {
  res.json(req.user);
});

/*
  GET data points for a Flow
  must be logged in to access
*/
router.get('/myflow', checkAuth, (req, res, next) => {
  const id = req.user.flow;
  let { num, futureTime } = req.query;

  // fill in some args if necessary
  if (!num || num < 0) num = 0;
  if (!futureTime || Number.isNaN(futureTime) || futureTime <= Date.now()) {
    futureTime = new Date().setDate(new Date().getDate() + 7);
  }

  // make sure we have a valid param
  if (!id) return next(createError(400, 'Provide a Flow ID'));

  // get values with timestamps
  req.db.zrange([`flow:${id}`, -num, -1, 'withscores'], (err, reply) => {
    if (err) return next(createError(500, err));
    const data = smartAI.toPlotPoints(reply);
    res.json({
      collected_data: data.length > 0 ? data : [],
      smart_ai: data.length > 0 ? smartAI.predict(data, futureTime) : [],
    });
  });
});

module.exports = router;
