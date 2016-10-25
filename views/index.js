'use strict';

exports.init = function(req, res){

if (req.isAuthenticated()) {
    res.redirect('/dashboard/');
  }
  else {
     res.render('index');
  }
  
};
