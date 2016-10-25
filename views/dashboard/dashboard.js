'use strict';

exports.init = function(req, res){

var workflow = req.app.utility.workflow(req, res);
  
 
  if (req.isAuthenticated()) {

  	var outcome = {};

  	outcome.username = req.user.username;
  	outcome.userid = req.user.id;
  	outcome.role = req.user.canPlayRoleOf('projectaccount') ? "project" : "researcher";

  	var projects = [];

	workflow.on('dashboardResearcher', function() {
		req.app.db.models.ProjectAccount.find('name project').limit(10).exec(function (err, projectsAccount) {
	  		if (err)
				console.log(err);
			else 
				for (var i = 0; i < projectsAccount.length; i++) {
					for (var j = 0; j < projectsAccount[i].projects.length; j++)
						projects.push({
										user: {
											created: projectsAccount[i].projects[j].userCreated.name,
											createdId: projectsAccount[i].projects[j].userCreated.id.toString()
										},
										project: {
											createdTime: require('time-ago')().ago(projectsAccount[i].projects[j].userCreated.time),
											name: projectsAccount[i].projects[j].name,
											language: projectsAccount[i].projects[j].language,
											description: projectsAccount[i].projects[j].description,
											url: projectsAccount[i].projects[j].url
											//href: projectsAccount[i].projects[j].url.replace(/https:\/\/github.com\//,'')
										}
									});
					if (i === projectsAccount.length-1) {
						outcome.projects = projects;
						res.render('dashboard/dashboardResearcher', outcome);
					}
				};
		});
	});

	workflow.on('dashboardProjectManager', function() {
	 	req.app.db.models.ProjectAccount.find(req.user.roles.projectaccount).limit(1).exec(function (err, userprojects) {
		  		if (err)
					console.log(err);
				else 
					for (var j = 0; j < userprojects[0].projects.length; j++) {
							projects.push({
											user: {
												created: userprojects[0].projects[j].userCreated.name,
												createdId: userprojects[0].projects[j].userCreated.id.toString()
											},
											project: {
												createdTime: require('time-ago')().ago(userprojects[0].projects[j].userCreated.time),
												name: userprojects[0].projects[j].name,
												language: userprojects[0].projects[j].language,
												description: userprojects[0].projects[j].description,
												url: userprojects[0].projects[j].url
												//href: projectsAccount[i].projects[j].url.replace(/https:\/\/github.com\//,'')
												}
										});
						if (j === userprojects.length-1) {
							outcome.projects = projects;
							workflow.emit('getSubmissions')
						}
					};
			});
	});

	workflow.on('getSubmissions', function() {
	 	req.app.db.models.Submission.find({"project.owner" : outcome.username}).limit(10).exec(function (err, userSubmissions) {
	 		if (err)
	 			workflow.emit('exception', err);
	 		else {
	 			var mappedSubmissions = [];
				for (var i = 0; i < userSubmissions.length; i++) {
					mappedSubmissions.push({
						_id : userSubmissions[i]._id,
						title : userSubmissions[i].title,
						userCreated: {
							id: userSubmissions[i].userCreated.id,
							time: require('time-ago')().ago(userSubmissions[i].userCreated.time),
							name: userSubmissions[i].userCreated.name
						},
						details: {
							replicationsteps: userSubmissions[i].details.replicationsteps,
							description: userSubmissions[i].details.description,
							affectedfiles: userSubmissions[i].details.affectedfiles,
							bugtype: userSubmissions[i].details.bugtype
						},
						project: {
							owner: userSubmissions[i].project.owner,
							name: userSubmissions[i].project.name
						},
						status : userSubmissions[i].status
					});
				}

	 			outcome.submissions = mappedSubmissions;
	 			res.render('dashboard/dashboardProjectOwner', outcome);
	 		} 
	 	});
	});

  	if (outcome.role === 'researcher') {
	  	workflow.emit('dashboardResearcher');
    } else { //is a project account
    	workflow.emit('dashboardProjectManager');
    }
  }
  else {
     res.redirect('/');
  }
};

exports.search = function(req,res){
	  if (req.isAuthenticated()) {
	  	var queryRegex = new RegExp("^"+req.params.projectName, 'i');
	  	var outcome = {
	  		query: queryRegex
	  	};

	  	var projects = [];

	  	req.app.db.models.ProjectAccount.find({
	  		"$or": [{
	  				   "projects.name": outcome.query
			    	},
			    	{
			     	   "user.name": outcome.query
			    	}]
			}).limit(10).exec(function (err, projectsAccount) {
		  		if (err)
					console.log(err);
				else
					{
						res.setHeader('Content-Type', 'application/json');
						if (projectsAccount.length === 0) {
							res.status(404);
	    	 				res.send(JSON.stringify({ error : "No results found" }, null, 3));
						} else
	    	 				for (var i = 0; i < projectsAccount.length; i++) {
	    	 					for (var j = 0; j < projectsAccount[i].projects.length; j++)
								projects.push({
												user: {
													created: projectsAccount[i].projects[j].userCreated.name,
													createdId: projectsAccount[i].projects[j].userCreated.id.toString()
												},
												project: {
													createdTime: require('time-ago')().ago(projectsAccount[i].projects[j].userCreated.time),
													name: projectsAccount[i].projects[j].name,
													language: projectsAccount[i].projects[j].language,
													description: projectsAccount[i].projects[j].description,
													url: projectsAccount[i].projects[j].url
													//href: projectsAccount[i].projects[0].url.replace(/https:\/\/github.com\//,'')
													}
											});
								if (i === projectsAccount.length-1) {
									outcome.projects = projects;
	    	 						res.send(JSON.stringify(outcome, null, 3));
								}
							};
					}					
			});
	    
	  }
	  else {
	  	 res.status(401);
	     res.setHeader('Content-Type', 'application/json');
    	 res.send(JSON.stringify({ error : "You must be authenticated to search." }, null, 3));
	  }
}