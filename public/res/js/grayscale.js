/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
    $(".navbar-collapse").collapse('hide');
    $("ul.sub-menu").collapse('hide');
});


// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

/*
// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});
*/
$('.usercaret').click(function() {
     $("ul.sub-menu").collapse('toggle');
});

//Scrollup button
$(document).ready(function() { 
        $(window).scroll(function(){
            if ($(this).scrollTop() > 1000) {
                $('.scrollup').fadeIn(300);
            } else {
                $('.scrollup').fadeOut(300);
            }
        }); 
 
        $('.scrollup').click(function(){
            $("html, body").animate({ scrollTop: 0 }, 600);
            return false;
        });
	});

$(document).on('click','.navbar-toggle',function(e) {
        $(".navbar-collapse").collapse('toggle');
});