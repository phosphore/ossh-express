	 new WOW().init();
	 $(document).ready(function() {
		 $('.popup-with-move-anim').magnificPopup({
				type: 'inline',
				focus: '#inputEmail',
				fixedContentPos: false,
				fixedBgPos: true,

				overflowY: 'auto',

				closeBtnInside: true,
				preloader: false,
				
				midClick: true,
				removalDelay: 300,
				mainClass: 'my-mfp-slide-bottom',
				callbacks: {
					beforeOpen: function() {
						if($(window).width() < 700) {
							this.st.focus = false;
						} else {
							this.st.focus = '#inputEmail';
						}
					}
				 }
				
			});
		});
		
		function join() {
			$("html, body").animate({ scrollTop: 0 }, 350);
			$("body").addClass("modal-open");
			
			$('.brand-heading, .intro-text').addClass('fadeOutUp animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			  /*$(this).hide();*/
			});
			$('.page-scroll').addClass('fadeOutDown animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
			 /* $(this).hide(); */
			});
			if ($(window).width() < 700)
				$('.join-btns-container').animate({ 'marginTop' : "-=115px" }, {queue: false, duration: 800});
			else
				$('.join-btns-container').animate({ 'marginTop' : "-=220px" }, {queue: false, duration: 800});
				
			$('.join-btns').animate({ 'fontSize' : "20px", 'zIndex' : 1043 }, 
									{ complete: function() {
										$( this ).after( '<div class="mfp-bg my-mfp-slide-bottom mfp-ready"></div>')}
									});
			$('.join-btns').css( "position","relative" );
			
		  };