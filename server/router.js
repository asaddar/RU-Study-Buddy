const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');
const request = require('request');
const nodemailer = require('nodemailer');
const _ = require('lodash');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

const User = require('./models/user');
const Token = require('./models/token');
const Post = require('./models/post');

var transporter = nodemailer.createTransport('');

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({ message: '' });
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  app.get('/departments', requireAuth, function(req, res) {
  	var rutgersDepartmentsUrl = 'https://sis.rutgers.edu/soc/subjects.json?semester=92017&campus=NB&level=U';
  	request(rutgersDepartmentsUrl, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
  				 res.send(body);
  			}
  	});
  });

  app.get('/departments/:id/courses', requireAuth, function(req, res) {
  	var departmentCoursesUrl = 'http://sis.rutgers.edu/soc/courses.json?subject=' + req.params.id + '&semester=92017&campus=NB&level=U';
  	request(departmentCoursesUrl, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
  				 res.send(body);
  			}
  	});
  });

  app.get('/courses/:id/posts', requireAuth, function(req, res) {
  	Post.find({courseId: req.params.id}).sort('-datePosted').populate('author').exec(function(err, posts) {
        if (err) {
          res.send(err);
        }
        
        res.send(posts);
    });

  });

  app.get('/courses/:id/professors', requireAuth, function(req, res) {
  	var courseId = req.params.id
  	var departmentCoursesUrl = 'http://sis.rutgers.edu/soc/courses.json?subject=' + courseId.substring(0, 3) + '&semester=92017&campus=NB&level=U';
  	request(departmentCoursesUrl, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
  				 var courseSections = _.find(JSON.parse(body), { 'courseNumber': courseId.substring(3, 6) }).sections;
  				 var response = { professors: [] };
  				 courseSections.forEach(function(section){
  				 	if(section.instructors.length != 0 && response.professors.indexOf(section.instructors[0].name) == -1){
  				 		response.professors.push(section.instructors[0].name);
  				 	}
  				 });
  				 res.send(response);
  			}
  	});

  });

  app.post('/courses/:id/posts', requireAuth, function(req, res) {
  	var post = new Post({ message: req.body.message, author: req.user._id, professor: req.body.professor, courseId: req.params.id });
  	post.save(function(err, doc) {
  		if (err) {
  			res.send(err);
  		}
  		Post.populate(doc, {path:"author"}, function(err, savedPost) { res.send(savedPost); });
  	});
  });

  app.delete('/posts/:id', requireAuth, function(req, res) {
  	Post.findOneAndRemove({_id: req.params.id, author: req.user._id}, function(err, doc) {
      if (err) {
  			res.send(err);
  		}
  		res.send(doc);
    });
  });

  app.put('/verify', function(req, res) {
  	Token.findOne({ token: req.body.token }, function(err, token) {
  		if (err) {
  			res.send(err);
  		}

  		User.update({ _id: token.userId }, { $set: { isVerified: true }}, function(err) {
  			if (err) {
  				res.send(err);
  			}

  				Token.findOneAndRemove({token: token.token}, function(err, doc) {
  					if (err) {
  						res.send(err);
  					}
  					res.send(doc);
  				});
  		});
  	});

  });

  app.put('/connect', requireAuth, function(req, res) {
    Post.findById(req.body.id).populate('author').exec(function (err, post) {
  		if (err) {
  			res.send(err);
		  }

  		var postAuthor = post.author.email;
  		post.connectedUsers.push(req.user.email);
  		post.save(function(err, updatedPost) {
  			if (err) {
  				res.send(err);
  			}
  			
  			var toEmails = req.user.email + ', ' + postAuthor;
        var subjectLine = 'Connection made for ' + updatedPost.courseId + '!';
        var emailBody = 'Hey, ' + req.user.email + ' (' + req.user.email + ') and ' + postAuthor + ' (' + postAuthor + ')! You two have connected on RU Study Buddy for ' + updatedPost.courseId + '! Feel free to email each other and plan out a date/time/place to study!';

        var mailOptions = {
    			from: '"RU Study Buddy" <rustudybuddy@gmail.com>',
    			to: toEmails,
    			subject: subjectLine,
    			text: emailBody,
  			};

  			transporter.sendMail(mailOptions, function(error, info){
    			if(error){
        			return console.log(error);
    			}
    			console.log('Message sent: ' + info.response);
  			});

  			res.send(updatedPost);
  		})
	})

  });

}
