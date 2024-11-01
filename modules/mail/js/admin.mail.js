jQuery(document).ready(function(){
	jQuery('#ptwMailTestForm').submit(function(){
		jQuery(this).sendFormPtw({
			btn: jQuery(this).find('button:first')
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('#ptwMailTestForm').slideUp( 300 );
					jQuery('#ptwMailTestResShell').slideDown( 300 );
				}
			}
		});
		return false;
	});
	jQuery('.ptwMailTestResBtn').click(function(){
		var result = parseInt(jQuery(this).data('res'));
		jQuery.sendFormPtw({
			btn: this
		,	data: {mod: 'mail', action: 'saveMailTestRes', result: result}
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('#ptwMailTestResShell').slideUp( 300 );
					jQuery('#'+ (result ? 'ptwMailTestResSuccess' : 'ptwMailTestResFail')).slideDown( 300 );
				}
			}
		});
		return false;
	});
	jQuery('#ptwMailSettingsForm').submit(function(){
		jQuery(this).sendFormPtw({
			btn: jQuery(this).find('button:first')
		});
		return false; 
	});
});