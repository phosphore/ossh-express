'use strict';

exports.init = function(req, res){

      var fs = require("fs");
      var filepath = __dirname.replace(/views\/avatar/,'')+'public/avatars/'+req.params.id;

      var serveFile = function(basepath) {

        var files = [".png",".svg",".jpg"];
        for (var i = 0; i < files.length; i++) {
          files[i] = filepath+files[i];
          if (i === 2)
            require('async').filter(files, fs.exists, function(results){
              if (results.length != 0)
                  res.sendFile(results[0]);
                else
                  res.redirect('/avatar/generate');
            });
        };
      }

      serveFile(filepath);

};