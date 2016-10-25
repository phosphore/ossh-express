'use strict';

exports = module.exports = function(app, mongoose) {
  var submissionSchema = new mongoose.Schema({
  	title: { type: String },
  	status: { type: String, default: 'open' },
    project: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
      name: { type: String, default: '' },
      owner: { type: String, default: '' }
    },
    reply: { type: mongoose.Schema.Types.ObjectId, ref: 'Submission' },
    details: { 
    	bugtype: { type: String, default: '' },
    	affectedfiles: { type: String, default: '' },
    	description: { type: String, default: '' },
    	replicationsteps: { type: String, default: '' }
    },
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    }
  });
  submissionSchema.index({ title: 1 });
  submissionSchema.index({ status: 1 });

  submissionSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('Submission', submissionSchema);
};
