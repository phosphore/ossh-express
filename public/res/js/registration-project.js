$(window).load(function() {
    NProgress.done();
});

$(document).ready(function() {
    NProgress.start();
    var tags = $('#languages').tags({
		//readOnly: true,
        tagData: [],
        tagSize: "lg",
        caseInsensitive: true,
        suggestions: ["PHP", "JavaScript", "Python", "C#", "C++", "C", "Scala", "Lua", "Perl", "Java", "ABAP", "Delphi", "Bash", "Go", "Ruby", "Visual Basic", "Haskell", "R", "Clojure", "Lisp", "Objective-C", "ActionScript", "F#", "Groovy", "Delphi", "Erlang", "ColdFusion", "Assembly", "Shell", "Swift"],
        promptText: "   Enter the project language...", 
        readOnlyEmptyMessage: '<input type="text" name="projectlanguage" id="projectlanguage" class="form-control input-lg" style="width:100% !important;" placeholder="Project language">',
        maxNumTags: 2,
        exclude: ["CSS", "CSS3", "HTML", "HTML5", "NodeJs", "SQL", "Makefile"]
    });
    
    var isnotgithubuser = false;
	var isstartedtypegit = false;
	
    $("#btn-steptwo").click(function(e) {
        e.preventDefault();
        if(checkformone())
        {	
			$("#languages input").css("width", "100%");
			$("#languages input").css("height", "46px");
			$("#languages input").css("padding", "0px 6px"); //css fix, i hate bootstrap-tags.
			$("html, body").animate({ scrollTop: 0 }, 350);
		}
    });
    
    $("#btn-stepthree").click(function(e) {
        e.preventDefault();
        //TODO: check if user inputted a programming language, but didn't press enter or ,
        if(checkformtwo())
        {	//githubajax(projecturl);
			$("html, body").animate({ scrollTop: 0 }, 350);
		}
    });

    function checkformone() {
        //reset error class (if password didn't match but now they do)
        $('#password,#password_confirmation,#email,#display_name').removeClass("inputerror");
		var emailre = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i;
        if (($('#password').val() === "") || ($('#password').val() !== $('#password_confirmation').val()) || ($('#password').val().length < 8)) {
			$.snackbar({content: 'Please make sure your passwords match and at least 8 characters long!', style: 'toast'});
            $('#password,#password_confirmation').addClass("inputerror").val("");
            $('#password').focus();
		}
        if ($('#email').val() === "" || !emailre.test($('#email').val())) {
			$.snackbar({content: 'Make sure your email is correct!', style: 'toast'});
            $('#email').addClass("inputerror").val("").focus();
		 }
        
        if ($("#display_name").val() === "")
            $('#display_name').addClass("inputerror").val("").focus();
            
          if ($(".inputerror")[0]) //there are errors
          {
            //shake animation for the 1st step button
            $('#btn-steptwo').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('shake animated');
            });
            
            return false;
        } else { //good to go!

            // change the heading p
            $('#headingtext').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).text("Add a project").removeClass().addClass('fadeIn animated');
            });

            // push up already compiled inputs
            $('#stepone').addClass('fadeOutUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).hide();
                $("#steptwo").removeClass("hide").addClass('fadeInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $("#github").focus();
                });
            });

            // change nav opacity
            $("#navfirst").animate({
                backgroundColor: "rgba(255,255,255,0)"
            }, 1000, function() {
                $(this).removeClass("navhover")
            });
            $("#navsecond").animate({
                backgroundColor: "rgba(255,255,255,0.2)"
            }, 1000, function() {
                $(this).addClass("navhover")
            });
			return true;
        } //end else

    }

	function checkformtwo() {
        //reset error class (if password didn't match but now they do)
        $('#projectname,#github,#languages input').removeClass("inputerror");
		var urlre = /^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\/\S*)?$/;
        if (($('#github').val() === "") || !(urlre.test($('#github').val()))) {
				$.snackbar({content: 'Please paste a valid url', style: 'toast'});
				$('#github').addClass("inputerror").val("").focus();
			}
		
        if ($('#projectname').val() === "") {
			$('#projectname').addClass("inputerror").val("").focus();
			$.snackbar({content: 'Please provide a name for your project!', style: 'toast'});
		}
        if (tags.getTags().length === 0) {
			$('#languages input').addClass("inputerror").val("").focus();
		}

			
			
          if ($(".inputerror")[0]) //there are errors
          {
            //shake animation for the 2st step button
            $('#btn-stepthree').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('shake animated');
            });
            
            return false;
        } else { //good to go!
        	var errorfor = sendform();
        	if (errorfor !== false) { //I try to complete the registration if there are no errors

	            // change the heading p
	            $('#headingtext').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
	                $(this).text("Almost done...").removeClass().addClass('fadeIn animated');
	            });
	            
	            //check mark animation
				$(".sweet-alert").show();			
				$(".icon.success").addClass('animate');
				$(".tip").addClass('animateSuccessTip');
				$(".long").addClass('animateSuccessLong');
				
	            // push up already compiled inputs
	            $('#steptwo').addClass('fadeOutUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
	                $(this).hide();
	                $("#stepthree").removeClass("hide").addClass('fadeInUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {

	                });
	            });

	            // change nav opacity
	            $("#navsecond").animate({
	                backgroundColor: "rgba(255,255,255,0)"
	            }, 1000, function() {
	                $(this).removeClass("navhover")
	            });
	            $("#navthird").animate({
	                backgroundColor: "rgba(255,255,255,0.2)"
	            }, 1000, function() {
	                $(this).addClass("navhover")
	            });
				return true;
			} else {
                for (a in errorfor)
                    $.snackbar({content: a, style: 'toast'});
                    

				//shake animation for the 2st step button
	            $('#btn-stepthree').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
	                $(this).removeClass('shake animated');
	            });
	            return false;
			}

        } //end else

    }

    function githubajax(projecturl) {
		projecturl = typeof projecturl !== 'undefined' ? projecturl : $("#github").val().replace(/\/\s*$/, "").trim();
        
        //$("#github").val("");
        $("#languages input").css("padding-bottom", "0px"); //css tag fix
        $("#projectname").val("");
        $("#projectdescription").val("");
        $(".note").html("<small>I try to guess a few things from this.</small>");
        removetags();
        //ajax attempt to get repository info
        //var email = $('#email').val().trim().toLowerCase();
        var repourl = "https://api.github.com/repos/" + projecturl;
        //GET programming languages
        $.ajax({
            type: 'GET',
            url: repourl,
            crossDomain: true,
            statusCode: {
                404: function() {
                //    if (!$("#languages input").width())
                //        $("#languages input").width("100%"); //fix for bootstrap-tags bug
                }
            },
            success: function(data) {
				if (typeof data.name !== "undefined" && data.name !== "" && data.name !== null) 
                    $('#projectname').val(data.name);
                if (typeof data.description !== "undefined" && data.description !== "" && data.description !== null)
                    $('#projectdescription').val(data.description);
				if (typeof data.language !== "undefined" && data.language !== "" && data.language !== null) 
                    tags.addTag(data.language);
                    $('.note').fadeOut(400, function() {
					  $(this).html('<i class="fa fa-star"></i>&nbsp;'+data.stargazers_count+'&nbsp;  <i class="fa fa-code-fork"></i>&nbsp;'+data.forks_count+'&nbsp;  <i class="fa fa-eye"></i>&nbsp;'+data.subscribers_count).fadeIn();
					});
                    
				
             /*   var unique = [];
                for (var i = 0; i < data.length; i++)
                    if (($.inArray(data[i].language, unique) === -1) && (data[i].language !== null) && (data[i].language !== "CSS")) unique.push(data[i].language);

                for (var i = 0; i < unique.length; i++)
                    tags.addTag(unique[i]);

                if (!$("#languages input").width())
                    $("#languages input").width("100%"); //fix for bootstrap-tags bug
			*/
            },
            error: function(data) {
                console.log(data);
            }
        });
    
        var projectOwnerProfileUrl = "https://api.github.com/users/"+projecturl.match(/([^\/]*)/)[0]; //.match(/^(https?:\/\/)?(www\.)?(github\.com\/(.+)\/)/)[4];

        //GET user info git-avatar git-name
        $.ajax({
            type: 'GET',
            url: projectOwnerProfileUrl,
            crossDomain: true,
            statusCode: {
                404: function() {
                    /*
                    $("#git-avatar").attr({
                        src: 'http://www.gravatar.com/avatar/' + md5(email) + '?s=130&d=identicon'
                    });
                    $("#git-name").html("You don't seem registered to github, maybe you got a different username?&nbsp;&nbsp;<i class=\"fa fa-hand-o-right\"></i>");
                    $("#different-username").text("I'm not on github.");
                    */
                }
            },
            success: function(data) {
                $('#ownerAvatarUrl').val(data.avatar_url);
            },
            error: function(data) {
                console.log(data);
            }
        });



    }

    function bitbucketajax(projecturl) {
		projecturl = typeof projecturl !== 'undefined' ? projecturl : $("#github").val().trim();
        $("#languages input").css("padding-bottom", "0px"); //css tag fix
        $("#projectname").val("");
        $("#projectdescription").val("");
        $(".note").html("<small>I try to guess a few things from this.</small>");
        $('#ownerAvatarUrl').val("https://bitbucket.org/"+projecturl+"/avatar/32/");
        removetags();
        //ajax attempt to get repository info
        //var email = $('#email').val().trim().toLowerCase();
        var repourl = "https://api.bitbucket.org/1.0/repositories/" + projecturl + "?callback=bbfetched";
        //GET programming languages [JSONP]
		$.ajax({
			url: repourl,
			jsonp: "callback",
			dataType: "jsonp",
			success: function(data) {
				console.log(data);
				if (typeof data.name !== "undefined" && data.name !== "" && data.name !== null) 
                    $('#projectname').val(data.name);
                if (typeof data.description !== "undefined" && data.description !== "" && data.description !== null)
                    $('#projectdescription').val(data.description); 
				if (typeof data.language !== "undefined" && data.language !== "" && data.language !== null) 
                    tags.addTag(data.language);
                $('.note').fadeOut(400, function() {
					  $(this).html('<i class="fa fa-code-fork"></i>&nbsp;'+data.forks_count+'&nbsp;  <i class="fa fa-eye"></i>&nbsp;'+data.followers_count).fadeIn();
				});
			}
		});
        }


    //detect the 'Enter' key pressed
    $(document).keypress(function(e) {
        if (e.which == 13) {
            if ($("#password_confirmation").is(":focus") || $("#email").is(":focus") || $("#display_name").is(":focus"))
                $('#btn-steptwo').click();
            else if ($("#github").is(":focus")) {
				if (/^(https?:\/\/)?(www\.)?github\.com\/.+\/.+$/.test($("#github").val().replace(/\/\s*$/, ""))) {
					//$("#git-name").html('<i class="fa fa-refresh fa-spin"></i>');
					githubajax($("#github").val().replace(/\/\s*$/, "").replace(/(https?:\/\/)?(www\.)?github\.com\//,''));
				}
				if (/^(https?:\/\/)?(www\.)?bitbucket\.org\/.+\/.+$/.test($("#github").val())) {
					bitbucketajax($("#github").val().replace(/\/\s*$/, "").replace(/(https?:\/\/)?(www\.)?bitbucket\.org\//,'').replace(/\/wiki\/.+/,'') );
				}
			}
			else if ($("#projectdescription").is(":focus") || $("#projectname").is(":focus"))
				$('#btn-stepthree').click();
			
        }
    });
    
    //detect if user start typing his github address
    
     $("#github").on("input", function() {
		if (/(https?:\/\/)?(www\.)?github\.com\//.test($("#github").val().replace(/\/\s*$/, ""))) {
			//$("#git-name").html('<i class="fa fa-refresh fa-spin"></i>');
			githubajax($("#github").val().replace(/\/\s*$/, "").replace(/(https?:\/\/)?(www\.)?github\.com\//,''));
		} else if (/^(https?:\/\/)?(www\.)?bitbucket\.org\/.+\/.+$/.test($("#github").val().replace(/\/\s*$/, ""))) {
			bitbucketajax($("#github").val().replace(/\/\s*$/, "").replace(/(https?:\/\/)?(www\.)?bitbucket\.org\//,'').replace(/\/wiki\/.+/,''));
		} else if ($("#github").val() === "") {
			$("#projectname").val("");
			$("#projectdescription").val("");
			$(".note").html("<small>I try to guess a few things from this.</small>");
			removetags();
		}
	}); 

    // that's not me!
   /*
    $("#different-username").click(function(e) {
        if (!isnotgithubuser)
            resetnotme();
        else
            idonthavegithub();
    }); */

    //reset function 
    /*
    function resetnotme() {
        $("#github").focus();
        $("#github").val("http://github.com/");
        $("#different-username, #git-name").fadeOut(800, function() {
            $("#git-name").text($("#display_name").val().trim()).fadeIn(800);
            $("#different-username").html("<i class=\"fa fa-exclamation-circle\"></i>&nbsp;I don't have github.").fadeIn(800);
        });
        $(".fa-map-marker").addClass("hide");
        $("#git-location").text("");
        $("#website").text("");
        $("#git-avatar").fadeOut(500, function() {
            $("#git-avatar").attr({
                src: '../img/unknown.png'
            });
            $("#git-avatar").fadeIn(500);
        });

        removetags();

        isnotgithubuser = true;

    }
 */
    //I don't have a github account.
    /*
    function idonthavegithub() {
		removetags()
		$("#gihub-name").text($("#display_name").val().trim());
        $("#github").fadeOut(800, function() {
            $("#github").val("false");
        });

        $("#git-avatar").fadeOut(500, function() {
            $("#git-avatar").attr({
                src: 'http://www.gravatar.com/avatar/' + md5($('#email').val().trim().toLowerCase()) + '?s=130&d=identicon'
            });
            $("#git-avatar").fadeIn(500);
        });
        $("#different-username").fadeOut(800);
        $(".note").parent().fadeOut(800);
        if ($(window).width() > 700)
			$("#user-card").animate({
				left: "40%",
			}, 1000);
    }
    */
    function removetags() {
		 for (var i = tags.getTags().length - 1; i >= 0; i--)
            tags.removeTag(tags.getTags()[i]);
	}

	function sendform() { // method that will gather form data, sending them to the project registration endpoint
		NProgress.start();
		var ajaxerror = false;
		var name = $("#first_name").val();
		var surname = $("#last_name").val();
		var username = $("#display_name").val();
		var email = $("#email").val();
		var password = $("#password").val();
		var projecturl = $("#github").val();
		var projectname = $("#projectname").val();
		var projectdescription = $("#projectdescription").val();
		var projectlanguage = tags.getTags();
        var projectavatar = $('#ownerAvatarUrl').val();
		var registrationendpoint = "/join/project";

		var postdata = { "userinfo": {"name": name,
										"surname": surname,
                                        "username": username,
										"email": email,
										"password": password
									  },
					  "projectinfo": {"name": projectname,
					  				   "url": projecturl,
					  				   "description": projectdescription,
					  				   "language": projectlanguage,
                                       "avatar": projectavatar
									 }
						};
		//var postdata = JSON.parse(formdata);
		//console.log(postdata);
        //POST registration info
        var result = $.ajax({
            type: 'POST',
            beforeSend: function(xhr){xhr.setRequestHeader('x-csrf-token', $.cookie('_csrfToken'));},
            url: registrationendpoint,
            dataType: "json",
            data: postdata,
            async: false,
            error: function(xhr, error){
             console.debug(xhr); console.debug(error);
            },
            statusCode: { //xhr.status
                404: function() {
                	ajaxerror = true;
                	$.snackbar({content: 'There was an error completing your registration!', style: 'toast'});
                },
                500: function() {
                	ajaxerror = true;
                	$.snackbar({content: 'There seems to be a problem with our server. Try again later!', style: 'toast'});
                	NProgress.remove();
                }
            },
            success: function(res) { ajaxerror = res; }
        }).done(function() {NProgress.done();});

        	console.log(result);
            return ajaxerror;
        
	}


});
