&laquo;<span id="ptwTableEditableLabelShell" title="<?php _e('Click to Edit', PTW_LANG_CODE)?>">
	<span id="ptwTableEditableLabel"><?php echo $this->table['label']?></span>
	<?php echo htmlPtw::text('table_label', array(
		'attrs' => 'id="ptwTableEditableLabelTxt"'
	))?>
	<i id="ptwTableLabelEditMsg" class="fa fa-fw fa-pencil"></i>
</span>&raquo;&nbsp;
<span>
	<?php echo htmlPtw::selectbox('shortcode_example', array('options' => array(
			'shortcode' => __('Shortcode', PTW_LANG_CODE),
			'php_code' => __('PHP code', PTW_LANG_CODE),
		), 'attrs' => 'class="chosen" style="width:100px;" id="ptwTableShortcodeExampleSel"',
	))?>:
	<span id="ptwTableShortcodeShell" style="display: none;">
		<?php echo htmlPtw::text('ptwCopyTextCode', array(
			'value' => esc_html('['. PTW_SHORTCODE. ' id='. $this->table['id']. ']'),
			'attrs' => 'class="ptwCopyTextCode"'));?>
	</span>
	<span id="ptwTablePhpCodeShell" style="display: none;">
		<?php echo htmlPtw::text('ptwCopyTextCode', array(
			'value' => esc_html('<?php echo do_shortcode("['. PTW_SHORTCODE. ' id=\''. $this->table['id']. '\']");?>'),
			'attrs' => 'class="ptwCopyTextCode"'));?>
	</span>
</span>
<span id="ptwTableMainControllsShell" style="float: right; padding-right: 15px;">
	<button class="button button-primary ptwTableSaveBtn" title="<?php _e('Save all changes', PTW_LANG_CODE)?>">
		<i class="fa fa-fw fa-save"></i>
		<?php _e('Save', PTW_LANG_CODE)?>
	</button>
	<button class="button button-primary ptwTablePreviewBtn">
		<i class="fa fa-fw fa-eye"></i>
		<?php _e('Preview', PTW_LANG_CODE)?>
	</button>
	<a href="<?php echo $this->ptwAddNewUrl. '&change_for='. $this->table['id']?>" class="button button-primary ptwTableChangeTplBtn">
		<i class="fa fa-fw fa-repeat"></i>
		<?php _e('Change Template', PTW_LANG_CODE)?>
	</a>
	<a href="#" class="button button-primary ptwTableEditCssBtn" title="<?php _e('Edit Css', PTW_LANG_CODE)?>">
		<i class="fa fa-fw fa-css3"></i>
		<?php _e('Edit Css', PTW_LANG_CODE)?>
	</a>
	<a href="#" class="button button-primary ptwTableCloneBtn" title="<?php _e('Clone to New Table', PTW_LANG_CODE)?>">
		<i class="fa fa-fw fa-files-o"></i>
		<?php _e('Clone', PTW_LANG_CODE)?>
	</a>
	<?php /*?><button class="button button-primary ptwPopupSwitchActive" data-txt-off="<?php _e('Turn Off', PTW_LANG_CODE)?>" data-txt-on="<?php _e('Turn On', PTW_LANG_CODE)?>">
		<i class="fa fa-fw"></i>
		<span></span>
	</button><?php */?>
	<button class="button button-primary ptwTableRemoveBtn">
		<i class="fa fa-fw fa-trash-o"></i>
		<?php _e('Delete', PTW_LANG_CODE)?>
	</button>
</span>
<div style="clear: both; height: 0;"></div>
<div id="ptwTableSaveAsCopyWnd" style="display: none;" title="<?php _e('Clone Table', PTW_LANG_CODE)?>">
	<form id="ptwTableSaveAsCopyForm">
		<label>
			<?php _e('New Name', PTW_LANG_CODE)?>:
			<?php echo htmlPtw::text('copy_label', array('value' => $this->table['label']. ' '. __('Copy', PTW_LANG_CODE), 'required' => true))?>
		</label>
		<div id="ptwTableSaveAsCopyMsg"></div>
		<?php echo htmlPtw::hidden('mod', array('value' => 'tables'))?>
		<?php echo htmlPtw::hidden('action', array('value' => 'saveAsCopy'))?>
		<?php echo htmlPtw::hidden('id', array('value' => $this->table['id']))?>
	</form>
</div>
<div id="ptwTableInitEditCssDlg" style="display: none;" title="<?php _e('Edit Css', PTW_LANG_CODE)?>">
	<?php echo htmlPtw::textarea('css', array(
		'value' => $this->table['id'] ? $this->table['css'] : '',
		'attrs' => 'id="ptwBbCssInp" class="ptwCssBlockEditor"'
	))?>
</div>
