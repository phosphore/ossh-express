
$("#report-reply").markdown({
            autofocus:true,
            savable:true,
            fullscreen: false,
            onSave: function(e) {
                $(".md-editor.active").slideUp('medium');
            }
        });