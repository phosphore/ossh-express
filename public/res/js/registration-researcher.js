$(window).load(function() {
    NProgress.done();
});

$(document).ready(function() {
    NProgress.start();
    var tags = $('#languages').tags({
        tagData: [],
        caseInsensitive: true,
        suggestions: ["PHP", "JavaScript", "Python", "C#", "C++", "C", "Scala", "Lua", "Perl", "Java", "ABAP", "Delphi", "Bash", "Go", "Ruby", "Visual Basic", "Haskell", "R", "Clojure", "Lisp", "Objective-C", "ActionScript", "F#", "Groovy", "Delphi", "Erlang", "ColdFusion", "Assembly", "Shell", "Swift"],
        promptText: "   Enter your programming languages...",
        maxNumTags: 16,
        exclude: ["CSS", "CSS3", "HTML", "HTML5", "NodeJs", "SQL", "Makefile"]
    });
    var isnotgithubuser = false;
	var isstartedtypegit = false;
	
    $("#btn-steptwo").click(function(e) {
        e.preventDefault();
        if(checkformone())
        {	
			githubajax();
			$("html, body").animate({ scrollTop: 0 }, 350);
		}
    });
    
    $("#btn-stepthree").click(function(e) {
        e.preventDefault();
        if(checkformtwo())
        {	
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
                $(this).text("What are your skills?").removeClass().addClass('fadeIn animated');
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
        $('#website,#ISC2,#languages input').removeClass("inputerror");
		var idre = /^[0-9]*$/;
		var urlre = /^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(\/\S*)?$/;
        if ($('#website').val() !== "")
			if (!urlre.test($('#website').val())) {
				$.snackbar({content: 'Please paste a valid url', style: 'toast'});
				$('#website').addClass("inputerror").val("").focus();
			}
        if ($('#ISC2').val() !== "") 
           if (!idre.test($('#ISC2').val())) {
			    $.snackbar({content: 'Please provide a valid (ISC)&sup2; id, if any', style: 'toast', htmlAllowed: true});
				$('#ISC2').addClass("inputerror").val("").focus();
			}
	    if (tags.getTags().length == 0) {
			$.snackbar({content: 'Don\'t you know any programming language?', style: 'toast'});
			$('#languages input').addClass("inputerror").focus();
		}
			
          if ($(".inputerror")[0]) //there are errors
          {
            //shake animation for the 1st step button
            $('#btn-stepthree').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass('shake animated');
            });
            
            return false;
        } else { //good to go!
            
            if (!sendform()) { //I try to complete the registration if there are no errors
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
                //shake animation for the 2st step button
                $('#btn-stepthree').addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                    $(this).removeClass('shake animated');
                });
                return false;
            }
        } //end else

    }

    function githubajax(user) {
		user = typeof user !== 'undefined' ? user : $("#display_name").val().trim();
		$(".fa-map-marker").addClass("hide");
		$("#git-location").text("");
        $("#website").val("");
        removetags();
        //ajax attempt to get user's info
        $("#github").val("http://github.com/" + user);
        var email = $('#email').val().trim().toLowerCase();
        var repourl = "https://api.github.com/users/" + user + "/repos";
        var profileurl = "https://api.github.com/users/" + user;
        //GET programming languages
        $.ajax({
            type: 'GET',
            url: repourl,
            crossDomain: true,
            data: {
                sort: "pushed"
            },
            statusCode: {
                404: function() {
                    if (!$("#languages input").width())
                        $("#languages input").width("100%"); //fix for bootstrap-tags bug
                }
            },
            success: function(data) {
                var unique = [];
                for (var i = 0; i < data.length; i++)
                    if (($.inArray(data[i].language, unique) === -1) && (data[i].language !== null) && (data[i].language !== "CSS")) unique.push(data[i].language);

                for (var i = 0; i < unique.length; i++)
                    tags.addTag(unique[i]);

                if (!$("#languages input").width())
                    $("#languages input").width("100%"); //fix for bootstrap-tags bug

            },
            error: function(data) {
                console.log(data);
            }
        });

        //GET user info git-avatar git-name
        $.ajax({
            type: 'GET',
            url: profileurl,
            crossDomain: true,
            statusCode: {
                404: function() {
                    $("#git-avatar").attr({
                        src: 'http://www.gravatar.com/avatar/' + md5(email) + '?s=130&d=identicon'
                    });
                    $("#git-name").html("You don't seem registered to github, maybe you got a different username?&nbsp;&nbsp;<i class=\"fa fa-hand-o-right\"></i>");
                    $("#different-username").text("I'm not on github.");
                }
            },
            success: function(data) {
                $('#git-avatar').attr("src", data.avatar_url);
                //is there a name set?
                if (typeof data.name === "undefined" || data.name === "" || data.name === null)
                    $('#git-name').text(user);
                else
                    $('#git-name').text(data.name);
                //is there a location set?
                if (typeof data.location !== "undefined" && data.location !== "" && data.location !== null) {
                    $('.fa-map-marker').removeClass("hide");
                    $('#git-location').text(data.location);
                }
                //is there a personal website?
                if (typeof data.blog !== "undefined" && data.blog !== "" && data.blog !== null) {
                    $('#website').val(data.blog);
                }
            },
            error: function(data) {
                console.log(data);
            }
        });



    }

    //detect the 'Enter' key pressed
    $(document).keypress(function(e) {
        if (e.which == 13) {
            if ($("#password_confirmation").is(":focus") || $("#email").is(":focus") || $("#display_name").is(":focus"))
                $('#btn-steptwo').click();
            else if ($("#github").is(":focus"))
				if (/https?:\/\/(www\.)?github\.com\//.test($("#github").val())) {
					$("#git-name").html('<i class="fa fa-refresh fa-spin"></i>');
					githubajax($("#github").val().replace(/https?:\/\/(www\.)?github\.com\//,''));
				}
			else if ($("#website").is(":focus") || $("#ISC2").is(":focus") || $("#certifications").is(":focus"))
				$('#btn-stepthree').click();
			
        }
    });
    
    //detect if user start typing his github address
    $("#github").on("input", function() {
		if (!isstartedtypegit) {
			 resetnotme();
			 isstartedtypegit = true;
		 }
	});

    // that's not me!
    $("#different-username").click(function(e) {
        if (!isnotgithubuser)
            resetnotme();
        else
            idonthavegithub();
    });

    //reset function
    function resetnotme() {
        $("#github").focus();
        $("#github").val("http://github.com/");
        $("#different-username, #git-name, .note").fadeOut(800, function() {
            $("#git-name").text($("#display_name").val().trim()).fadeIn(800);
            $("#different-username").html("<i class=\"fa fa-exclamation-circle\"></i>&nbsp;I don't have github.").fadeIn(800);
            $(".note").html("<small>Press Enter to reload your info.</small>").fadeIn(800);
        });
        $(".fa-map-marker").addClass("hide");
        $("#git-location").text("");
        $("#website").text("");
        $("#git-avatar").fadeOut(500, function() {
            $("#git-avatar").attr({
                src: '/avatar/generate'
            });
            $("#git-avatar").fadeIn(500);
        });

        removetags();

        isnotgithubuser = true;

    }

    //I don't have a github account.
    function idonthavegithub() {
		removetags();
		$('#git-name').addClass('fadeOut animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).text($("#display_name").val().trim()).removeClass().addClass('fadeIn animated');
            });
		
        $("#github").fadeOut(800, function() {
            $("#github").val("false");
        });

        $("#git-avatar").fadeOut(500, function() {
            //genAvatar
            $.ajax({ //cache: false,
                    url: 'http://www.gravatar.com/avatar/' + md5($('#email').val().trim().toLowerCase()) + '?s=130&d=404',
                    success: function (data) {
                        $("#git-avatar").attr({
                            src: 'http://www.gravatar.com/avatar/' + md5($('#email').val().trim().toLowerCase()) + '?s=130&d=identicon'
                        });
                    },
                    error:function (xhr, ajaxOptions, thrownError){
                        if(xhr.status==404) {
                         $("#git-avatar").attr({
                            src: '/avatar/generate'
                         });
                        }
                    }
                });

            $("#git-avatar").fadeIn(500);
        });
        $("#different-username").fadeOut(800);
        $("#git-location").fadeOut(800);
        $(".fa-map-marker").fadeOut(800);
        $(".note").parent().fadeOut(800);
        if ($(window).width() > 700)
			$("#user-card").animate({
				left: "40%",
			}, 1000);
    }
    
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
        var githuburl = $("#github").val();
        var website = $("#website").val();
        var researcherbio = $("#bio").val();
        var certifications = $("#certifications").val();
        var iscnumber = $("#ISC2").val();
        var researcherlanguage = tags.getTags();
        var researcheravatar = $("#git-avatar").attr("src");
        var registrationendpoint = "/join/researcher";
        var postdata = { "userinfo": {"name": name,
                                        "surname": surname,
                                        "username": username,
                                        "email": email,
                                        "password": password
                                      },
                 "researcherinfo": {   "website": website,
                                       "url": githuburl,
                                       "bio": researcherbio,
                                       "language": researcherlanguage,
                                       "certifications": certifications,
                                       "iscnumber": iscnumber,
                                       "avatar": researcheravatar
                                     }
                        };
        //var postdata = JSON.parse(formdata);
        //console.log(postdata);
        //POST registration info
        $.ajax({
            type: 'POST',
            beforeSend: function(xhr){xhr.setRequestHeader('x-csrf-token', $.cookie('_csrfToken'));},
            url: registrationendpoint,
            dataType: "json",
            data: postdata,
            async: false,
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
            }
        }).done(function() {NProgress.done();});

            return ajaxerror;
        
    }
});
