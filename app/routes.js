var User = require('./models/user');
var request = require('request');
var Post = require('./models/post');
var nodemailer = require('nodemailer');
var configMailer = require('../config/mailer.js');

var transporter = nodemailer.createTransport('smtps://rustudybuddy%40gmail.com:' + configMailer.password + '@smtp.gmail.com');

module.exports = function(app, passport){
	app.get('/', function(req, res){
		if(req.isAuthenticated()){
			res.redirect('/coursesofstudy');
		}else{
			res.render('index.ejs');
		}

	});

	app.get('/coursesofstudy', isLoggedIn, function(req, res){
		var rutgers_subjects_endpoint = 'https://sis.rutgers.edu/soc/subjects.json?semester=92016&campus=NB&level=U';
		request(rutgers_subjects_endpoint, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
   				 var subjectsList = JSON.parse(body);
   				 res.render('coursesofstudy.ejs', {subjectsList: subjectsList});
  			}
		})
	});

	app.get('/selecteddept/:deptnum/', isLoggedIn, function(req, res){
		var dept_num = req.params.deptnum;
		var dept_name = req.params.deptname;
		var rutgers_soc_endpoint = 'http://sis.rutgers.edu/soc/courses.json?subject=' + dept_num + '&semester=92016&campus=NB&level=U';
		request(rutgers_soc_endpoint, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
   				 var courseList = JSON.parse(body);
   				 res.render('courses.ejs', {courseList: courseList, dept_num: dept_num});
  			}
		})
	});

	app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

	app.get('/auth/facebook/callback', 
	  passport.authenticate('facebook', { successRedirect: '/coursesofstudy',
	                                      failureRedirect: '/' }));


	app.get('/course/:subjectID/:courseID/:courseName', isLoggedIn, function(req, res){
		var courseID = req.params.courseID;
		var courseName = req.params.courseName;
		var subjectID = req.params.subjectID;
		Post.find({classID: courseID}, function(err, posts) {
        if (err) {
            res.send('ERROR. Try going back or reloading the page! If error persists contact asad7dar@gmail.com');
        } else {
            res.render('coursepage.ejs', {courseID: courseID, courseName: courseName, posts: posts, userData: req.user, subjectID: subjectID, clickHandler:"func1();"});
		}
    });

	});

	app.post('/course/:subjectID/:courseID/:courseName', isLoggedIn, function(req, res){
		var courseID = req.params.courseID;
		var courseName = req.params.courseName;
		var subjectID = req.params.subjectID;
		var prof = req.body.professor;
		if(prof === undefined){
			prof = 'NONE'
		}else if(prof.indexOf(',') > -1){
			prof = prof.substring(0, prof.indexOf(','));
		}
		
		var post = new Post();
		post.postedByProfileId = req.user.profileID;
		post.postedByFullName = req.user.fullName;
		post.postedByProfilePic = req.user.profilePic;
		post.postedByEmail = req.user.email;
		post.classID = req.params.courseID;
		post.professor = prof;
		post.postMessage = req.body.message;
		
		post.save(function(err){
			if(err)
				res.send('ERROR. Try going back or reloading the page! If error persists contact asad7dar@gmail.com');;

			res.redirect('/course/' + subjectID + '/' + courseID + '/' + courseName);
	    });
	});

	app.get('/course/delete/:subjectID/:courseID/:courseName/:postID', isLoggedIn, function(req, res){
		var courseID = req.params.courseID;
		var courseName = req.params.courseName;
		var postID = req.params.postID;
		var subjectID = req.params.subjectID;
		Post.remove({_id: postID}, function(err, posts) {
        if (err) {
            res.send('ERROR. Try going back or reloading the page! If error persists contact asad7dar@gmail.com');;
        } else {
        	res.redirect('/course/' + subjectID + '/' + courseID + '/' + courseName);
		}
    });

	});

	app.get('/course/connect/:subjectID/:courseID/:courseName/:userID', isLoggedIn, function(req, res){
		var courseID = req.params.courseID;
		var courseName = req.params.courseName;
		var userID = req.params.userID;
		var subjectID = req.params.subjectID;
		User.find({profileID: userID}, function(err, postPublisher) {
        if (err) {
            res.send('ERROR. Try going back or reloading the page! If error persists contact asad7dar@gmail.com');;
        } else {
        	var toEmails = req.user.email + ', ' + postPublisher[0].email;
        	var subjectLine = 'Connection made for ' + courseName + '!';
        	var emailBody = 'Hey, ' + req.user.fullName + ' (' + req.user.email + ') and ' + postPublisher[0].fullName + ' (' + postPublisher[0].email + ')! You two have connected on RU Study Buddy for ' + courseName + '! Feel free to email each other and plan out a date/time/place to study!';

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

        	res.render('connected.ejs', {courseID: courseID, courseName: courseName, subjectID: subjectID, postPublisher: postPublisher[0]});
		}
    });

	});


	app.get('/course/post/:subjectID/:courseID/:courseName', isLoggedIn, function(req, res){
		var courseID = req.params.courseID;
		var courseName = req.params.courseName;
		var subjectID = req.params.subjectID;
		var courseNumber = courseID.replace(subjectID, '');
		
		var rutgers_soc_endpoint = 'http://sis.rutgers.edu/soc/courses.json?subject=' + subjectID + '&semester=92016&campus=NB&level=U';
		var professorList = [];
		request(rutgers_soc_endpoint, function (error, response, body) {
  			if (!error && response.statusCode == 200) {
   				 var courseList = JSON.parse(body);
   				 for(var i = 0; i < courseList.length; i++){
   				 	if(courseList[i].courseNumber === courseNumber){
   				 		for(var j = 0; j < courseList[i].sections.length; j++){
   				 			if(courseList[i].sections[j].instructors.length != 0 && professorList.indexOf(courseList[i].sections[j].instructors[0].name) == -1){
   				 				professorList.push(courseList[i].sections[j].instructors[0].name);
   				 			}
   				 		}
   				 	}
   				 }
   				 res.render('coursepost.ejs', {courseID: courseID, courseName: courseName, subjectID: subjectID, professorList: professorList});
  			}
		})
	});

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/');
}