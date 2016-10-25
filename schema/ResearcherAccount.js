'use strict';

exports = module.exports = function(app, mongoose) {
  var accountSchema = new mongoose.Schema({
    user: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' }
    },
    isVerified: { type: String, default: '' },
    verificationToken: { type: String, default: '' },
    name: {
      first: { type: String, default: '' },
      last: { type: String, default: '' }
    },
    background: {
      website: { type: String, default: '' },
      url: { type: String, default: '' },
      bio: { type: String, default: '' },
      language: { type: String, default: '' },
      certifications: { type: String, default: '' },
      iscnumber: { type: String, default: '' }
    },
    status: {
      id: { type: String, ref: 'Status' },
      name: { type: String, default: '' },
      userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, default: '' },
        time: { type: Date, default: Date.now }
      }
    },
    statusLog: [mongoose.modelSchemas.StatusLog],
    notes: [mongoose.modelSchemas.Note],
    userCreated: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: '' },
      time: { type: Date, default: Date.now }
    },
    search: [String]
  });
  accountSchema.plugin(require('./plugins/pagedFind'));
  accountSchema.index({ user: 1 });
  accountSchema.index({ 'status.id': 1 });
  accountSchema.index({ search: 1 });
  accountSchema.set('autoIndex', (app.get('env') === 'development'));
  app.db.model('ResearcherAccount', accountSchema);
};
