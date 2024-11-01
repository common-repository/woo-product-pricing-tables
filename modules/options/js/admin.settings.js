jQuery(document).ready(function(){
	jQuery('#ptwSettingsSaveBtn').click(function(){
		jQuery('#ptwSettingsForm').submit();
		return false;
	});
	jQuery('#ptwSettingsForm').submit(function(){
		jQuery(this).sendFormPtw({
			btn: jQuery('#ptwSettingsSaveBtn')
		});
		return false;
	});
});