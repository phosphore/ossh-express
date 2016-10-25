'use strict';

exports.getSubmission = function(req, res){

	var workflow = req.app.utility.workflow(req, res);
	var outcome = {};
	outcome.req = {
		owner: req.params.projectOwner,
		name: req.params.projectName
	};

	if (req.isAuthenticated()) {
	  	outcome.username = req.user.username;
	  	outcome.userid = req.user.id;
	  	outcome.role = req.user.canPlayRoleOf('projectaccount') ? "project" : "researcher"
		}


	workflow.on('renderSubmission', function() {
	 	req.app.db.models.Submission.findOne({"_id" : req.params.submissionid}).exec(function (err, userSubmissions) {
	 		if (err)
	 			workflow.emit('exception', err);
	 		else {
					outcome.submission = {
						_id : userSubmissions._id,
						title : userSubmissions.title,
						userCreated: {
							id: userSubmissions.userCreated.id,
							time: require('time-ago')().ago(userSubmissions.userCreated.time),
							name: userSubmissions.userCreated.name
						},
						details: {
							replicationsteps: userSubmissions.details.replicationsteps,
							description: userSubmissions.details.description,
							affectedfiles: userSubmissions.details.affectedfiles,
							bugtype: userSubmissions.details.bugtype
						},
						project: {
							owner: userSubmissions.project.owner,
							name: userSubmissions.project.name
						},
						status : userSubmissions.status
					};
				
					res.render('submission/getsubmission', outcome);	
	 		} 
	 	});


	});

	if ((outcome.role === 'project') && (outcome.req.owner === outcome.username)) { 
		workflow.emit('renderSubmission');
	}
	else
		require('../http/index.js').http500(req,res);



}


exports.compileNewSubmission = function(req, res) {

	var workflow = req.app.utility.workflow(req, res);
	var outcome = {};
	outcome.req = {
		owner: req.params.projectOwner,
		name: req.params.projectName
	};

	if (req.isAuthenticated()) {
	  	outcome.username = req.user.username;
	  	outcome.userid = req.user.id;
	  	outcome.role = req.user.canPlayRoleOf('projectaccount') ? "project" : "researcher"
		}

	var isLoggedInUserTeamMember = false;

	workflow.on('isTeamMember_Researcher', function() {

	  if (typeof(outcome.username) !== 'undefined')
		req.app.db.models.ProjectAccount.find({ 'user.name': outcome.req.owner,
										'projects': {
											$elemMatch: {
												'name' : outcome.req.name,     
												'team' : { $elemMatch: { 'username': outcome.username } }
									                    }
									                }
                }, {'projects.$.team.username': 1}).exec(function (err, resp)
					{
						if (err)
							isLoggedInUserTeamMember = false;
						else if (resp.length > 0)
						{
							for (var i = resp[0].projects[0].team.length - 1; i >= 0; i--) {
								if (resp[0].projects[0].team[i].username === outcome.username) {
									isLoggedInUserTeamMember = { 'approved' : resp[0].projects[0].team[i].approved, 'since' : require('time-ago')().ago(resp[0].projects[0].team[i].joindate) };
									
									outcome.user = {
												createdId: resp[0].projects[0].userCreated.id
									  };
									workflow.emit('renderSubmissionForm');
								}
							};
						}
						else {
							isLoggedInUserTeamMember = false;
							workflow.emit('exception', 'You are not in the team');
						}
					}
				);
	  else {
	  	isLoggedInUserTeamMember = false;
	  	workflow.emit('exception', 'You are not in the team');
	  }

	});

	workflow.on('renderSubmissionForm', function() {
			res.render('submission/newsubmission', outcome);	
	});

	if (outcome.role === 'researcher') { 
		workflow.emit('isTeamMember_Researcher');
	}
	else
		require('../http/index.js').http500(req,res);


}


exports.saveNewSubmission = function(req, res) {

	var workflow = req.app.utility.workflow(req, res);
	var outcome = {};
	outcome.req = {
		owner: req.params.projectOwner,
		name: req.params.projectName
	};

	if (req.isAuthenticated()) {
	  	outcome.username = req.user.username;
	  	outcome.userid = req.user.id;
	  	outcome.role = req.user.canPlayRoleOf('projectaccount') ? "project" : "researcher"
		}

	var isLoggedInUserTeamMember = false;


	workflow.on('isTeamMember_Researcher', function() {

	  if (typeof(outcome.username) !== 'undefined')
		req.app.db.models.ProjectAccount.find({ 'user.name': outcome.req.owner,
										'projects': {
											$elemMatch: {
												'name' : outcome.req.name,     
												'team' : { $elemMatch: { 'username': outcome.username } }
									                    }
									                }
                }, {'projects.$.team.username': 1}).exec(function (err, resp)
					{
						if (err)
							isLoggedInUserTeamMember = false;
						else if (resp.length > 0)
						{
							for (var i = resp[0].projects[0].team.length - 1; i >= 0; i--) {
								if (resp[0].projects[0].team[i].username === outcome.username) {
									isLoggedInUserTeamMember = { 'approved' : resp[0].projects[0].team[i].approved, 'since' : require('time-ago')().ago(resp[0].projects[0].team[i].joindate) };
									
									outcome.user = {
												createdId: resp[0].projects[0].userCreated.id
									  };
									workflow.emit('createSubmission');
								}
							};
						}
						else {
							isLoggedInUserTeamMember = false;
							workflow.emit('exception', 'You are not in the team');
						}
					}
				);
	  else {
	  	isLoggedInUserTeamMember = false;
	  	workflow.emit('exception', 'You are not in the team');
	  }

	});


	workflow.on('createSubmission', function() {
			 var fieldsToSet = {
			  	title: req.body.title,
			  	project: {
			  		name: outcome.req.name,
			  		owner: outcome.req.owner
			  	},
			    userCreated: {
			    	id : outcome.userid,
			    	name : outcome.username
			    },
			    details: { 
			    	bugtype: req.body.bugtype,
			    	affectedfiles: req.body.affectedfiles,
			    	description: req.body.description,
			    	replicationsteps: req.body.replicationsteps
			    }
			  };

		   req.app.db.models.Submission.create(fieldsToSet, function(err, submission) {
			   	if (err)
			   		workflow.emit('exception', err);
			   	else {
			   		res.send();
			   	}
		   });
		});

   	if (outcome.role === 'researcher') { 
		workflow.emit('isTeamMember_Researcher');
	}
	else
		workflow.emit('exception', 'You are not a researcher.');
}