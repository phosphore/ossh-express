$('#sendsubmissions').click(function(e) {
	e.preventDefault();
	var errors = false;
	if (($('#report-title').val() === "")) {
			$.snackbar({content: 'Please make sure to give a proper title!', style: 'toast'});
            $('#report-title').focus();
            errors = true;
	} else if ($('#report-type').val() === "Select bug type...") {
			$.snackbar({content: 'Please make sure to classify a bug type!', style: 'toast'});
            $('#report-type').focus();
            errors = true;
	} else if ($('#report-description').val().length < 20) {
			$.snackbar({content: 'Please make sure to give a proper description!', style: 'toast'});
            $('#report-type').focus();
            errors = true;
	} else if (($('#report-steps').val() !== "") && ($('#report-steps').val().length < 20)) {
			$.snackbar({content: 'Please make sure to give a proper description of the replication steps!', style: 'toast'});
            $('#report-steps').focus();
            errors = true;
	} else if (($('#report-affectedfiles').val() !== "") && ($('#report-affectedfiles').val().length < 5)) {
			$.snackbar({content: 'Please make sure to give a proper url or location for the affected files!', style: 'toast'});
            $('#report-affectedfiles').focus();
            errors = true;
	} else if ($('.form-check-input').val() !== 'on') {
		    $.snackbar({content: 'You must accept the terms and conditions!', style: 'toast'});
            $('.form-check-input').focus();
            errors = true;
	}
	if (!errors)
		sendsubmission($(this).data('href'), $(this).data('redirect'));
	else return false;
});


function sendsubmission(baseURL, redirectURL) {
	var submissionData = {
		title : $('#report-title').val(),
		bugtype: $('#report-type').val(),
		description: $('#report-description').val(),
		replicationsteps: $('#report-steps').val(),
		affectedfiles: $('#report-affectedfiles').val()
	};

	var baseProjectUrl = baseURL;
        $.ajax({
            type: 'POST',
            url: baseProjectUrl,
            data: submissionData,
            crossDomain: true,
            statusCode: {
                404: function() { //err

               }
            },
            success: function(data) {
                	window.location.replace(redirectURL);
                },
            error: function(data) {
                if (data.status !== 404)
                    console.log(data);
            },
            complete: function() {
                
            }
        });
}