'use strict';

exports = module.exports = function(app, mongoose) {
  var projectSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    url: { type: String, default: '' },
    description: { type: String, default: '' },
    markdownLongDescription: { type: String, default: ''},
    language: { type: String, default: '' },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },  
    team: [ { 
              memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'ResearcherAccount', index: true, unique: true},
              username: { type: String, default: ''},
              joindate: { type: Date, default: Date.now },
              approved: { type: Boolean, default: false }
            } 
          ]
  });
  //app.db.collection.ensureIndex( { 'team.key': 1 }, { unique: true } );
  app.db.model('Project', projectSchema);
};
