
$('.projects-list').on('click', '.row.project', function() {
    var d = $(this).data("href");
    window.location.href = d;
});

$('.projects-list').on('click', '.row.submission', function() {
    var d = $(this).data("href");
    window.location.href = d;
});




$(function() {
    var sampleProjects=[
      "Discourse",
      "Prototype",
      "Linux",
      "Django-Python"
    ];

      /* <type text simulation> */
        var currentsampleProject=sampleProjects[0];
        var autoTypingActive=true;
        var transitionDelayTime=0;
        var sampleProjectLength=0;
        var typingNow=false;
        var sampleProjectTimer=0;
        var timer=null;

        /* <blinking cursor> */
          setInterval(function() {
                if(autoTypingActive) {
              if($('#proj').val().substr(-1)=='|') {
                $('#proj').val($('#proj').val().substr(0,$('#proj').val().length-1)+' ');
              }
              else if($('#proj').val().substr(-1)==' ') {
                $('#proj').val($('#proj').val().substr(0,$('#proj').val().length-1)+'|');
              }
              else {
                $('#proj').val($('#proj').val()+'|');
              }
            }
          },500);
        /* </blinking cursor> */

          /* <let user disable simulator> */
            var prevValue;
            $('#proj').bind('focus',function() {
              if(autoTypingActive) {
              $(this).val('');
              clearTimeout(timer);
              autoTypingActive=false;
            }
            });
              $('#proj').bind('click keyup',function() {
                if(autoTypingActive) {
              $(this).val('');
              clearTimeout(timer);
              autoTypingActive=false;
            }
            if(prevValue!=$(this).val()) {
              //$(this).val(ucfirst($(this).val()));
              prevValue=$(this).val();
            }
          });
          /*
          $('#proj').bind('blur',function(e) {
            if($(this).val()=='') {
              sampleProjectLength=0;
              typingNow=false;
              autoTypingActive=true;
              nextsampleProject(true);
            }
          }); */
          /* </let user disable simulator> */

          /* <typeText> */
          typeText=function() {
            displaysampleProject=currentsampleProject.substr(0, sampleProjectLength++);
            if(empty(displaysampleProject)) {
              $('#proj').val(' ');
            }
            else {
              $('#proj').val(displaysampleProject);
              //$('#proj').focus();
            }
              if(sampleProjectLength < currentsampleProject.length+1) {
                // next letter
                  typingNow=true;
                  randomMultiplier=80;
                  random=Math.floor(Math.random()*(randomMultiplier*2));
                    timer=setTimeout(typeText, random);
              } else {
                // start backspacing
                    sampleProjectLength = 0;
                    currentsampleProject = '';
                    typingNow=false;
                    timer=setTimeout(backspaceText,3250+250*Math.random());
              }
          }
          /* </typeText> */

          /* <backspaceText> */
          backspaceText=function() {
            displaysampleProject=$('#proj').val().slice(0, -1);

            /* avoid empty div */
            if(empty(displaysampleProject)) {
              $('#proj').val(' ');
            }
            else {
              $('#proj').val(displaysampleProject);
            }


            if(!empty(displaysampleProject)) {
              // backspace again
                  randomMultiplier=80;
                  random=Math.floor(Math.random()*(randomMultiplier*1.5));
                timer=setTimeout(backspaceText, random);
                //$('#proj').focus();
            }
            else {
              // next sampleProject
                nextsampleProject();
            }
          }
          /* </backspaceText> */

          /* <nextsampleProject> */
          nextsampleProject=function(instantly) {
            sampleProjectTimer++;
            // if last sampleProject, reset to first
                if(sampleProjectTimer>(sampleProjects.length-1)) {
                  sampleProjectTimer=0;
                }
                currentsampleProject=sampleProjects[sampleProjectTimer];
                if(instantly) {
                  typeText();
                }
                else {
              timer=setTimeout(typeText,500);
            }
          }
          /* </nextsampleProject> */

          typeText();

      /* </type text simulation> */
});


function empty(mixed_var) {
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, '', '0'];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixed_var === emptyValues[i]) {
      return true;
    }
  }

  if (typeof mixed_var === 'object') {
    for (key in mixed_var) {
      // TODO: should we check for own properties only?
      //if (mixed_var.hasOwnProperty(key)) {
      return false;
      //}
    }
    return true;
  }

  return false;
}

$.fn.enterKey = function (fnc) {
    return this.each(function () {
        $(this).keypress(function (ev) {
            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
            if (keycode == '13') {
                fnc.call(this, ev);
            }
        })
    }) };

function searchStringBuilder() {
	newResults = false; //reset the flag for new and different results
	if ($(this).val() !== "") {
		search($(this).val());
	} else {
		search(".+");
	}
};

$('#proj').keyup( $.debounce( 250, searchStringBuilder ) );


var searchAnimation = function(action, set) {
	var marginleft, op;
	if (action === 'show') {
		marginleft = '-=50';
		op = 1;
	}
	else if (action === 'hide')
	{
		marginleft = '+=50';
		op = 0;
	}

	if (set)
	{
		$('.project h3').css( "margin-left", marginleft );
		$('.project').css( "opacity", op );
		return;
	}


	for (var i = 0; i < $('.project h3').length; i++) {
			$($('.project h3').get(i)).delay( 30*(i+1) ).animate({
    			marginLeft: marginleft
			}, 200);
			$($('.project').get(i)).delay( 30*(i+1) ).animate({
    			opacity: op
			}, 200);
	}

}

var newResults = null;
var lastQueryResult = null;

function search(query) {
	var baseSearchUrl = "/search/project/"+encodeURIComponent(query);
        $.ajax({
            type: 'GET',
            url: baseSearchUrl,
            crossDomain: true,
            statusCode: {
                404: function() { //no results found
                	var errorHtml = "<div class=\"row project error\" style=\"opacity: 0\"><h5>We couldn’t find any projects or users matching the query.</h5>"+
									"<i><b>Tip:</b> You can search by languages too!</i>";

               		$('.projects-list').html(errorHtml);
               		$('.error').animate({ opacity: 1 }, 200);
               		lastQueryResult = null;

               }
            },
            success: function(data) {
            	if (JSON.stringify(lastQueryResult) !== JSON.stringify(data)) {
					searchAnimation("hide");
            		newResults = true;
            	}
            	lastQueryResult = data;

            	if (newResults) {
		            	var projectsListHtml = "";
		            	for (var i = 0; i < data.projects.length; i++) {
		            		var key = data.projects[i];
		            		var gitHoster = RegExp(/github.com\//).test(key.project.url) ? "/res/img/languages/git/github.svg" : "/res/img/languages/git/bitbucket.svg";

			            	var project = '<div data-href="/project/'+key.user.created+'/'+key.project.name+'" class="row project">' +
										    '<div class="project-image col-xs-3 col-md-1"><img style="float:right;" src="/avatar/'+key.user.createdId+'?br34k-01">' +
										    '</div>' +
										    '<div class="project-titledescription col-xs-9 col-md-5">' +
										        '<h3>'+key.project.name+' <small>by '+key.user.created+'</small></h3><i>'+key.project.description+'</i>' +
										    '</div>' +
										    '<div class="project-stats col-xs-4 col-md-2">' +
										        '<a href="'+key.project.url+'" target="_blank"><img src="'+gitHoster+'" title="Go to the '+key.project.name+' git page">' +
										        '</a>' +
										    '</div>' +
										    '<div class="project-languages col-xs-4 col-md-1"><img src="/res/img/languages/'+key.project.language.toLowerCase().replace('-','')+'.svg" alt="'+key.project.language+'" title="'+key.project.language+'">' +
										    '</div>' +
										    '<div class="project-age col-xs-4 col-md-1"><span>'+key.project.createdTime+'</span>' +
										    '</div>' +
										    '<div class="project-join col-xs-12 col-md-2"><a href="/project/'+key.user.created+'/'+key.project.name+'" class="btn btn-default btn-md">More</a>' +
										    '</div>' +
										'</div>\n';
							projectsListHtml += project;
						};

						$('.projects-list').html(projectsListHtml);
	            		searchAnimation("hide", true); // we need to reset elements with the correct hidden opacity: 0 and marginLeft.
				}

            	},
            error: function(data) {
            	if (data.status !== 404)
                	console.log(data);
            },
            complete: function() {
            	if (newResults)
            		searchAnimation("show");
            }
        });

}

