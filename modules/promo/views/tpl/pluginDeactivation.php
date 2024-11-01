<style type="text/css">
	.ptwDeactivateDescShell {
		display: none;
		margin-left: 25px;
		margin-top: 5px;
	}
	.ptwDeactivateReasonShell {
		display: block;
		margin-bottom: 10px;
	}
	#ptwDeactivateWnd input[type="text"],
	#ptwDeactivateWnd textarea {
		width: 100%;
	}
	#ptwDeactivateWnd h4 {
		line-height: 1.53em;
	}
	#ptwDeactivateWnd + .ui-dialog-buttonpane .ui-dialog-buttonset {
		float: none;
	}
	.ptwDeactivateSkipDataBtn {
		float: right;
		margin-top: 15px;
		text-decoration: none;
		color: #777 !important;
	}
	
	.ptwDeactivateReasonShell input[type="radio"]:checked::before {
		width: 6px !important;
	}
</style>
<div id="ptwDeactivateWnd" style="display: none;" title="<?php _e('Your Feedback', PTW_LANG_CODE)?>">
	<h4><?php printf(__('If you have a moment, please share why you are deactivating %s', PTW_LANG_CODE), PTW_WP_PLUGIN_NAME)?></h4>
	<form id="ptwDeactivateForm">
		<label class="ptwDeactivateReasonShell">
			<?php echo htmlPtw::radiobutton('deactivate_reason', array(
				'value' => 'not_working',
			))?>
			<?php _e('Couldn\'t get the plugin to work', PTW_LANG_CODE)?>
			<div class="ptwDeactivateDescShell">
				<?php printf(__('If you have a question, <a href="%s" target="_blank">contact us</a> and will do our best to help you'), 'https://woobewoo.com/contact-us/')?>
			</div>
		</label>
		<label class="ptwDeactivateReasonShell">
			<?php echo htmlPtw::radiobutton('deactivate_reason', array(
				'value' => 'found_better',
			))?>
			<?php _e('I found a better plugin', PTW_LANG_CODE)?>
			<div class="ptwDeactivateDescShell">
				<?php echo htmlPtw::text('better_plugin', array(
					'placeholder' => __('If it\'s possible, specify plugin name', PTW_LANG_CODE),
				))?>
			</div>
		</label>
		<label class="ptwDeactivateReasonShell">
			<?php echo htmlPtw::radiobutton('deactivate_reason', array(
				'value' => 'not_need',
			))?>
			<?php _e('I no longer need the plugin', PTW_LANG_CODE)?>
		</label>
		<label class="ptwDeactivateReasonShell">
			<?php echo htmlPtw::radiobutton('deactivate_reason', array(
				'value' => 'temporary',
			))?>
			<?php _e('It\'s a temporary deactivation', PTW_LANG_CODE)?>
		</label>
		<label class="ptwDeactivateReasonShell">
			<?php echo htmlPtw::radiobutton('deactivate_reason', array(
				'value' => 'other',
			))?>
			<?php _e('Other', PTW_LANG_CODE)?>
			<div class="ptwDeactivateDescShell">
				<?php echo htmlPtw::text('other', array(
					'placeholder' => __('What is the reason?', PTW_LANG_CODE),
				))?>
			</div>
		</label>
		<?php echo htmlPtw::hidden('mod', array('value' => 'promo'))?>
		<?php echo htmlPtw::hidden('action', array('value' => 'saveDeactivateData'))?>
	</form>
	<a href="" class="ptwDeactivateSkipDataBtn"><?php _e('Skip & Deactivate', PTW_LANG_CODE)?></a>
</div>