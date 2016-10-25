'use strict';

exports = module.exports = function(app, mongoose) {
  //embeddable docs first
  require('./schema/Note')(app, mongoose);
  require('./schema/Status')(app, mongoose);
  require('./schema/StatusLog')(app, mongoose);
  require('./schema/Category')(app, mongoose);
  require('./schema/Project')(app, mongoose);
  require('./schema/Submission')(app, mongoose);

  //then regular docs
  require('./schema/User')(app, mongoose);
  require('./schema/Admin')(app, mongoose);
  require('./schema/AdminGroup')(app, mongoose);
  require('./schema/ProjectAccount')(app, mongoose);
  require('./schema/ResearcherAccount')(app, mongoose);
  require('./schema/LoginAttempt')(app, mongoose);
};
