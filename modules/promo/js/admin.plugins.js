jQuery(document).ready(function(){
	var $deactivateLnk = jQuery('#the-list tr[data-plugin="'+ ptwPluginsData.plugName+ '"] .row-actions .deactivate a');
	if($deactivateLnk && $deactivateLnk.length > 0) {
		var $deactivateForm = jQuery('#ptwDeactivateForm');
		var $deactivateWnd = jQuery('#ptwDeactivateWnd').dialog({
			modal:    true
		,	autoOpen: false
		,	width: 500
		,	height: 390
		,	buttons:  {
				'Submit & Deactivate': function() {
					$deactivateForm.submit();
				}
			}
		});
		var $wndButtonset = $deactivateWnd.parents('.ui-dialog:first')
			.find('.ui-dialog-buttonpane .ui-dialog-buttonset')
		,	$deactivateDlgBtn = $deactivateWnd.find('.ptwDeactivateSkipDataBtn')
		,	deactivateUrl = $deactivateLnk.attr('href');
		$deactivateDlgBtn.attr('href', deactivateUrl);
		$wndButtonset.append( $deactivateDlgBtn );
		$deactivateLnk.click(function(){
			$deactivateWnd.dialog('open');
			return false;
		});
		
		$deactivateForm.submit(function(){
			var $btn = $wndButtonset.find('button:first');
			$btn.width( $btn.width() );	// Ha:)
			$btn.showLoaderPtw();
			jQuery(this).sendFormPtw({
				btn: $btn
			,	onSuccess: function(res) {
					toeRedirect( deactivateUrl );
				}
			});
			return false;
		});
		$deactivateForm.find('[name="deactivate_reason"]').change(function(){
			jQuery('.ptwDeactivateDescShell').slideUp( g_ptwAnimationSpeed );
			if(jQuery(this).prop('checked')) {
				var $descShell = jQuery(this).parents('.ptwDeactivateReasonShell:first').find('.ptwDeactivateDescShell');
				if($descShell && $descShell.size()) {
					$descShell.slideDown( g_ptwAnimationSpeed );
				}
			}
		});
	}
});