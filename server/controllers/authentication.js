const jwt = require('jwt-simple');
const User = require('../models/user');
const crypto = require('crypto');
const Token = require('../models/token');
const nodemailer = require('nodemailer');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, "");
}

exports.signin = function(req, res, next) {
  res.send({ token: tokenForUser(req.user), email: req.user.email });
}

exports.signup = function(req, res, next) {
  const fullName = req.body.firstName + ' ' + req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password'});
  }

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // const domain = email.split("@")[1];
    // if (domain !== 'scarletmail.rutgers.edu' || domain !== 'rutgers.edu' ) {
    //   return res.status(422).send({ error: 'Invalid email' });
    // }

    const user = new User({
      fullName: fullName,
      email: email,
      password: password
    });

    user.save(function(err, createdUser ) {
      if (err) { return next(err); }

      var token = new Token({ userId: createdUser._id, token: crypto.randomBytes(16).toString('hex') });
      token.save(function(err) {
        var transporter = nodemailer.createTransport('');
        var mailOptions = {
          from: '"RU Study Buddy" <rustudybuddy@gmail.com>',
          to: user.email,
          subject: 'verify ru studdy buddy account',
          text: 'http:\/\/localhost:8080\/confirmation\/' + token.token,
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
            res.send({status: 'success'});
        });
      });
    });
  });
}
