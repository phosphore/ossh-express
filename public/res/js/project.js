  $(document).ready(function() {
         $('.popup-with-move-anim').magnificPopup({
                type: 'inline',
                fixedContentPos: true,
                fixedBgPos: true,
                overflowY: 'auto',
                closeBtnInside: true,
                preloader: false,
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom',
                callbacks: {
                    beforeOpen: function() {
                        // if($(window).width() < 700) {
                        //     this.st.focus = false;
                        // } else {
                        //     this.st.focus = '#inputEmail';
                        // }
                    }
                 }
                
            });
   });


$('.joinbtn').click(function() {
	join($(this).data('href'));
});

$('.stayinteambtn').click(function() {
    $.magnificPopup.instance.close();
});

$('.leaveteambtn').click(function() {
    manageTeamMember($(this).data('href'), 0, function() {
        console.log('Successfully removed.');
        $.magnificPopup.instance.close();
    });
});



$('.editMD').click(function(e) {
    editMarkDown(e);
    $(this).fadeOut('slow');
});

$('.manageteam-acceptdecline i').click(function() {
    manageTeamMember($(this).data('endpoint'), $(this).data('memberid'), function() {
        console.log('done');
    });
    $(this).parent().parent().fadeOut('slow');
});


var editMarkDown = function(e) {
    e.preventDefault();
    var textArea = $('<textarea name="content" id="markdownLongDescription" data-provide="markdown" rows="10"/>').val(rawMarkdown);
    $('#marked-description').slideUp('slow', function() {
        $('.project-info').append(textArea);
        $("#markdownLongDescription").markdown({
            autofocus:true,
            savable:true,
            fullscreen: false,
            onShow: function(e) {
                $('#markdownLongDescription').hide().slideDown("medium");
            },
            onSave: function(e) {
                $(".md-editor.active").slideUp('medium', function() {
                    $('#markdownLongDescription').remove();
                    rawMarkdown = e.getContent();
                    document.getElementById('marked-description').innerHTML = marked(rawMarkdown);
                    $('#marked-description').slideDown('slow');
                    saveLongDescription(rawMarkdown, $('.editMD').data('endpoint'));
                    $('.editMD').fadeIn('slow');
                });

            }
        });
       
        
    });

}

function saveLongDescription(markdown, baseURL) {
    baseProjectUrl = baseURL;
    $.ajax({
            type: 'POST',
            url: baseProjectUrl,
            crossDomain: true,
            data: { newLongDescription : markdown },
            statusCode: {
                404: function() { //err
                    
               }
            },
            success: function(data) {
                console.log("New description saved.")
                },
            error: function(data) {
                if (data.status !== 404)
                    console.log(data);
            },
            complete: function() {
                
            }
        });
}

function join(query) {
	var baseProjectUrl = query;
        $.ajax({
            type: 'GET',
            url: baseProjectUrl,
            crossDomain: true,
            statusCode: {
                404: function() { //err
                	

               }
            },
            success: function(data) {
            	$('.joinbtn').fadeOut("fast").replaceWith('<span>Your request has been forwarded to the project owner.</span>').fadeIn("fast");
            	},
            error: function(data) {
            	if (data.status !== 404)
                	console.log(data);
            },
            complete: function() {
            	
            }
        });

}


function manageTeamMember(baseURL, memberid, callback) {
    var baseProjectUrl = baseURL;
        $.ajax({
            type: 'PUT',
            url: baseProjectUrl,
            data: { 'memberIndexing' : memberid },
            crossDomain: true,
            statusCode: {
                404: function() { //err
                    

               }
            },
            success: function(data) {
                callback();
                },
            error: function(data) {
                if (data.status !== 404)
                    console.log(data);
            },
            complete: function() {
                
            }
        });

}

