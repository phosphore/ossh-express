'use strict';

exports.init = function(req, res){

      var fs = require('fs');

         var pastelColors = function(){
              var r = (Math.round(Math.random()* 127) + 127).toString(16);
              var g = (Math.round(Math.random()* 127) + 127).toString(16);
              var b = (Math.round(Math.random()* 127) + 127).toString(16);
              return '#' + r + g + b;
          }

         var readTwoFiles = function(file1, file2, callback) {
                require("async").parallel([
                    fs.readFile.bind(fs, file1),
                    fs.readFile.bind(fs, file2),
                ], callback);
            }

          readTwoFiles("./public/avatars/base_avatar.1", "./public/avatars/base_avatar.2", function(err, files) {
              var content = files[0]+pastelColors()+files[1];
              res.writeHead(200, { "Content-Type": "image/svg+xml" });
  			  res.end(content); 
          });
      

};