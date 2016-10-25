'use strict';

exports.init = function(req, res){
  if (req.isAuthenticated()) {
    res.redirect(req.user.defaultReturnUrl());
  }
  else {
    res.render('join/project/index', {
      oauthMessage: ''
    });
  }
};

exports.signup = function(req, res){
  var workflow = req.app.utility.workflow(req, res);

  workflow.on('validate', function() {
    /*
    if (!req.body.userinfo.name) {
      workflow.outcome.errfor.userinfo.name = 'required';
    }
    if (!req.body.userinfo.surname) {
      workflow.outcome.errfor.userinfo.surname = 'required';
    } */
    var validgithubAvatar = /https?:\/\/avatars\d?.githubusercontent.com\/u\/\d+/;
    var validbitbucketAvatar = /https?:\/\/bitbucket.org\/.*\/avatar\/32\/?/;

    if (!req.body.userinfo.username) {
      workflow.outcome.errfor.userinfo.username = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_]+$/.test(req.body.username))
      workflow.outcome.errfor.userinfo.username = 'only use letters, numbers, \'-\', \'_\'';
    
    if (!req.body.userinfo.email) {
      workflow.outcome.errfor.userinfo.email = 'required';
    }
    else if (!/^[a-zA-Z0-9\-\_\.\+]+@[a-zA-Z0-9\-\_\.]+\.[a-zA-Z0-9\-\_]+$/.test(req.body.userinfo.email)) {
      workflow.outcome.errfor.userinfo.email = 'invalid email format';
    }
    if (!req.body.userinfo.password) {
      workflow.outcome.errfor.userinfo.password = 'required';
    } else if (!/.{8,}/.test(req.body.userinfo.password)) {
      workflow.outcome.errfor.userinfo.password = 'password must be over 8 characters';
    }
    if (!req.body.projectinfo.name) {
      workflow.outcome.errfor.projectinfo.name = 'required';
    }
    if (!req.body.projectinfo.url) {
      workflow.outcome.errfor.projectinfo.url = 'required';
    }
    if (!req.body.projectinfo.description) {
      workflow.outcome.errfor.projectinfo.description = 'required';
    }
    if (!req.body.projectinfo.language) { // TODO: better validation in the future
      workflow.outcome.errfor.projectinfo.language = 'required';
    }
    if (!validgithubAvatar.test(req.body.projectinfo.avatar) && !validbitbucketAvatar.test(req.body.projectinfo.avatar)) {
      workflow.outcome.errfor.projectinfo.avatar = 'required';
    }
    
    if (workflow.hasErrors()) {
      return workflow.emit('response');
    }

    workflow.emit('duplicateUsernameCheck');
  });

  workflow.on('duplicateUsernameCheck', function() {
    req.app.db.models.User.findOne({ username: req.body.userinfo.username }, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        workflow.outcome.errfor.userinfo.username = 'username already taken';
        return workflow.emit('response');
      }

      workflow.emit('duplicateEmailCheck');
    });
  });

  workflow.on('duplicateEmailCheck', function() {
    req.app.db.models.User.findOne({ email: req.body.userinfo.email.toLowerCase() }, function(err, user) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (user) {
        workflow.outcome.errfor.userinfo.email = 'email already registered';
        return workflow.emit('response');
      }

      workflow.emit('createUser');
    });
  });

  workflow.on('createUser', function() {
    req.app.db.models.User.encryptPassword(req.body.userinfo.password, function(err, hash) {
      if (err) {
        return workflow.emit('exception', err);
      }

      var fieldsToSet = {
        isActive: 'yes',
        username: req.body.userinfo.username,
        email: req.body.userinfo.email.toLowerCase(),
        password: hash,
        search: [
          req.body.userinfo.username,
          req.body.userinfo.email
        ]
      };
      req.app.db.models.User.create(fieldsToSet, function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        workflow.user = user;
        workflow.emit('createAccount');
      });
    });
  });

  workflow.on('createAccount', function() {
    var fieldsToSet = {
      isVerified: req.app.config.requireAccountVerification ? 'no' : 'yes',
      'name.full': workflow.user.username,
      user: {
        id: workflow.user._id,
        name: workflow.user.username
      },
      name: {
        first: req.body.userinfo.name,
        last: req.body.userinfo.surname
      },
      projects: {
        name: req.body.projectinfo.name,
        url: req.body.projectinfo.url,
        description: req.body.projectinfo.description,
        markdownLongDescription: req.body.projectinfo.description,
        language: req.body.projectinfo.language,
        userCreated: {
          id: workflow.user._id,
          name: workflow.user.username,
          time: new Date().toISOString()
        },
        team : []
      },
      search: [
        workflow.user.username
      ]
    };



    req.app.db.models.ProjectAccount.create(fieldsToSet, function(err, account) {
      if (err) {
        return workflow.emit('exception', err);
      }

      //update user with account
      workflow.user.roles.projectaccount = account._id;
      workflow.user.save(function(err, user) {
        if (err) {
          return workflow.emit('exception', err);
        }

        //workflow.emit('sendWelcomeEmail'); //TODO welcome email
        workflow.emit('saveUserAvatar');
      });
    });
  });

 workflow.on('saveUserAvatar', function() {
      var fs = require('fs'),
      request = require('request');

      var download = function(uri, filename, callback){
        request.head(uri, function(err, res, body){
          var ext = "";
          switch (res.headers['content-type']) {
            case "image/png":
              ext = ".png";
              break;
            case "image/jpeg":
              ext = ".jpg";
              break;
            case "image/svg+xml":
              ext = ".svg";
              break;
            case "image/bmp":
              ext = ".bmp";
              break;
            case "image/gif":
              ext = ".gif";
              break;
            default:
              ext = "";

          }
          request(uri).pipe(fs.createWriteStream(filename+ext)).on('close', callback);
        });
      };

      download(req.body.projectinfo.avatar, "./public/avatars/"+workflow.user._id, function(){
      });

      workflow.emit('logUserIn');
  });




  workflow.on('sendWelcomeEmail', function() {
    req.app.utility.sendmail(req, res, {
      from: req.app.config.smtp.from.name +' <'+ req.app.config.smtp.from.address +'>',
      to: req.body.email,
      subject: 'Your '+ req.app.config.projectName +' Account',
      textPath: 'signup/email-text',
      htmlPath: 'signup/email-html',
      locals: {
        username: req.body.username,
        email: req.body.email,
        loginURL: req.protocol +'://'+ req.headers.host +'/login/',
        projectName: req.app.config.projectName
      },
      success: function(message) {
        workflow.emit('logUserIn');
      },
      error: function(err) {
        console.log('Error Sending Welcome Email: '+ err);
        workflow.emit('logUserIn');
      }
    });
  });

  workflow.on('logUserIn', function() {
    req._passport.instance.authenticate('local', function(err, user, info) {
      if (err) {
        return workflow.emit('exception', err);
      }

      if (!user) {
        workflow.outcome.errors.push('Login failed. That is strange.');
        return workflow.emit('response');
      }
      else {
        req.login(user, function(err) {
          if (err) {
            return workflow.emit('exception', err);
          }

          workflow.outcome.defaultReturnUrl = user.defaultReturnUrl();
          workflow.emit('response');
        });
      }
    })(req, res);
  });

  workflow.emit('validate');
};
