'use strict';

exports.init = function(req, res){

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
                }, {'projects.$.team.username': 1}).exec(function (err, res)
					{
						if (err)
							isLoggedInUserTeamMember = false;
						else if (res.length > 0)
						{
							for (var i = res[0].projects[0].team.length - 1; i >= 0; i--) {
								if (res[0].projects[0].team[i].username === outcome.username) {
									isLoggedInUserTeamMember = { 'approved' : res[0].projects[0].team[i].approved, 'since' : require('time-ago')().ago(res[0].projects[0].team[i].joindate) };
									workflow.emit('getProject');
								}
							};
						}
						else {
							isLoggedInUserTeamMember = false;
							workflow.emit('getProject');
						}
					}
				);
	  else {
	  	isLoggedInUserTeamMember = false;
	  	workflow.emit('getProject');
	  }

	});

	workflow.on('getProject', function() {

		req.app.db.models.ProjectAccount.find({ 'user.name': outcome.req.owner,
					'projects.name' : outcome.req.name },
				  { 'projects.$': 1	}).limit(1).exec(function (err, projectAccount) {

	  		if (err) {
				console.log(err);
				require('../http/index.js').http500(req,res);
	  		}
			else if (projectAccount.length !== 0) //{'projects.$': 1}
			{ 
					outcome.project = {
									user: {
										created: projectAccount[0].projects[0].userCreated.name,
										createdId: projectAccount[0].projects[0].userCreated.id.toString(),
										isTeamMember: isLoggedInUserTeamMember
									},
									project: {
										createdTime: require('time-ago')().ago(projectAccount[0].projects[0].userCreated.time),
										name: projectAccount[0].projects[0].name,
										language: projectAccount[0].projects[0].language,
										description: projectAccount[0].projects[0].description,
										markdownLongDescription: projectAccount[0].projects[0].markdownLongDescription,
										url: projectAccount[0].projects[0].url,
										team: projectAccount[0].projects[0].team
									}
							  };
						res.render('project/project', outcome);

			} else require('../http/index.js').http404(req,res);

			
		});

	});

	workflow.on('getProject_isProjectOwner', function() {

		req.app.db.models.ProjectAccount.find({ 'user.name': outcome.req.owner,
					'projects.name' : outcome.req.name },
				  { 'projects.$': 1	}).limit(1).exec(function (err, projectAccount) {

	  		if (err) {
				console.log(err);
				require('../http/index.js').http500(req,res);
	  		}
			else if (projectAccount.length !== 0) //{'projects.$': 1}
			{ 
					outcome.project = {
									user: {
										created: projectAccount[0].projects[0].userCreated.name,
										createdId: projectAccount[0].projects[0].userCreated.id.toString(),
										isTeamMember: isLoggedInUserTeamMember
									},
									project: {
										createdTime: require('time-ago')().ago(projectAccount[0].projects[0].userCreated.time),
										name: projectAccount[0].projects[0].name,
										language: projectAccount[0].projects[0].language,
										description: projectAccount[0].projects[0].description,
										markdownLongDescription: projectAccount[0].projects[0].markdownLongDescription,
										url: projectAccount[0].projects[0].url,
										team: projectAccount[0].projects[0].team
									}
							  };
					
					res.render('project/projectIsProjectOwner', outcome);


			} else require('../http/index.js').http404(req,res);

			
		});

	});

	if (outcome.req.owner === outcome.username) //is a project leader and it's his project?
		workflow.emit('getProject_isProjectOwner');
	else if (outcome.role == "researcher")
		workflow.emit('isTeamMember_Researcher');
	else
		workflow.emit('getProject');

};

exports.join = function(req, res) {

	var workflow = req.app.utility.workflow(req, res);
	var outcome = {};

	if (req.isAuthenticated()) {
	  	outcome.username = req.user.username;
	  	outcome.userid = req.user.id;
	} else {
     	res.redirect('/');
  	}

	outcome.req = {
		owner: req.params.projectOwner,
		name: req.params.projectName
	};


	workflow.on('duplicateMemberCheck', function() {
		//check for the existance of the same username or uid in team before adding
		req.app.db.models.ProjectAccount.find({ 
		      'user.name': outcome.req.owner,
			  'projects.name' : outcome.req.name,
              'projects.team.username' : outcome.username
			}, {'projects.$.team' : 1}, function(err, res) {
				if (err)
					console.log(err);
				else if (res.length === 0)
					workflow.emit('addMemberToTeam');
				else {
					workflow.outcome.errfor.request = 'Member already present.';
					return workflow.emit('response');
				}
			});
	});

	workflow.on('addMemberToTeam', function() {

		req.app.db.models.ProjectAccount.update(
		    { 
		      'user.name': outcome.req.owner,
			  'projects.name' : outcome.req.name
			},
		    { 
		    	$addToSet: { 'projects.$.team':
			    			    {
			    					'memberId': req.user.id,
			    					'username': req.user.username,
			    					'joindate': new Date().toISOString()
			    				}
		    			   }
		    },
		    { new: true },
		    function (err, res)
		    {
		    	if (err)
		    		console.log(err);
		    	else if (res) {
		    		workflow.outcome.defaultReturnUrl = req.user.defaultReturnUrl();
		    		workflow.emit('response');
		    	}
		    }
		);
	});

	if (req.user.canPlayRoleOf('researcheraccount'))
		workflow.emit('duplicateMemberCheck');
	else 
		require('../http/index.js').http500(req,res);
};

exports.editLongDescription = function(req, res) {

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

	if (outcome.req.owner === outcome.username) //is a project leader and it's his project?
	{

		req.app.db.models.ProjectAccount.findOneAndUpdate(
				{ 
			      'user.name': outcome.req.owner,
				  'projects' : {
				  	'$elemMatch' : { 
				  		'name' : outcome.req.name
					  	}
					  }
				},
			    { 
			       "$set": { 'projects.$.markdownLongDescription':  req.body.newLongDescription }
			    },
			    {
			    	"new" : false,
			    	"upsert": false
				},
		    function (err, results)
		    {
		    	if (err)
		    		console.log(err);
		    	else if (res) {
		    		res.send("New markdown description saved.")
		    	}
		    }
		);

			


	} else require('../http/index.js').http500(req,res);
};


exports.acceptTeamMember = function(req, res) {

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
 
 	if (outcome.req.owner === outcome.username) //is a project leader and it's his project?
 	{
 		var setModifier = { $set: {} };
 		var approvedField = 'projects.$.team.'+req.body.memberIndexing+'.approved';
 		setModifier.$set[approvedField] = true;
		req.app.db.models.ProjectAccount.update({ 
			      'user.name': outcome.req.owner,
			      'projects': { $elemMatch : { 'name': outcome.req.name }}
                },
                setModifier,
			    function (err, teamres)
			    {
			    	if (err) {
			    		console.log(err);
			    		require('../http/index.js').http500(req,res);
			    	}
			    	else if (teamres) {
			    		res.send();
			    		}
			    }
			    );
	}
	else
		require('../http/index.js').http500(req,res);

}

exports.declineTeamMember = function(req, res) {
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
 
 	if (outcome.req.owner === outcome.username) //is a project leader and it's his project?
 	{
 		var setModifier = { $set: {} };
 		var approvedField = 'projects.$.team.'+req.body.memberIndexing+'.approved';
 		setModifier.$set[approvedField] = false;
		req.app.db.models.ProjectAccount.update({ 
			      'user.name': outcome.req.owner,
			      'projects': { $elemMatch : { 'name': outcome.req.name }}
                },
                setModifier,
			    function (err, teamres)
			    {
			    	if (err) {
			    		console.log(err);
			    		require('../http/index.js').http500(req,res);
			    	}
			    	else if (teamres) {
			    		res.send();
			    		}
			    }
			    );
	}
	else
		require('../http/index.js').http500(req,res);
}

exports.removeTeamMember = function(req, res) {
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
 
 	if (outcome.req.owner === outcome.username) //is a project leader and it's his project?
 	{
 		var setModifier = { $set: {} };
 		var approvedField = 'projects.$.team.'+req.body.memberIndexing+'.approved';
 		setModifier.$set[approvedField] = false;
		req.app.db.models.ProjectAccount.update({ 
			      'user.name': outcome.req.owner,
			      'projects': { $elemMatch : { 'name': outcome.req.name }}
                },
                setModifier,
			    function (err, teamres)
			    {
			    	if (err) {
			    		console.log(err);
			    		require('../http/index.js').http500(req,res);
			    	}
			    	else if (teamres) {
			    		res.send();
			    		}
			    }
			    );
	}
	else
		require('../http/index.js').http500(req,res);
}

