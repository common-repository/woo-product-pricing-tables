var g_ptwTableBlock = null;
var ptwBlockCssEditor = (function(){
	var object = {},
		cssField = jQuery('#ptwBbCssInp').get(0),
		editBlock = null;
	var cssEditor = CodeMirror.fromTextArea(cssField, {
			mode: 'css'
		,	lineWrapping: true
		,	lineNumbers: true
		,	matchBrackets: true
	    ,	autoCloseBrackets: true
	    ,	autofocus: false
	});
	
	cssField.CodeMirrorEditor = cssEditor;
	
	var $container = jQuery('#ptwTableInitEditCssDlg').dialog({
			modal:    true
		,	autoOpen: false
		,	width: '90%'
		,	height: (jQuery(window).height() / 10) * 8.5
		,	show: {
	            effect: "fade",
	            duration: 1000
	        }
	    ,   hide: {
	            effect: "fade",
	            duration: 500
	        }
		,	buttons:  [
				{
					text: 'Ok'
				,	class: 'button button-sup-small'
				,	click: function() {
					var newCode = cssField.CodeMirrorEditor.getValue();

					if (editBlock != null) {
						editBlock._data.css = newCode;
						editBlock._rebuildCss();
						editBlock.contentChanged();
					}
					
					$container.dialog('close');
					editBlock = null;
				}
			}
			,	{
					text: 'Cancel'
				,	class: 'button button-sup-small'
				,	click: function() {
						$container.dialog('close');
						editBlock = null;
					}
				}
			]
		});

	// methods
	object.show = function (block) {
		cssField.CodeMirrorEditor.setValue(block._data.css);
		editBlock = block;
		$container.dialog('open');
		cssField.CodeMirrorEditor.refresh();
	};

	return object;
})();

jQuery(document).ready(function(){
	g_ptwTableBlock = ptwGetFabric().getBlocks()[0];
	jQuery('.ptwTableSaveBtn').click(function(){
		_ptwSaveCanvas(false, true);
		return false;
	});

	// If user has been deleted a cell, then system add new ptwEl by click.
	(function($){
		var root = '#ptwCanvas';
		$(root + ' .ptwCell,' +
			root + ' .ptwColDesc,' +
			root + ' .ptwColFooter,' +
			root + ' .ptwColHeader').on('click', function(){

			var self = $(this);
			if (0 == self.children().length
				|| (self.hasClass('ptwCell') && 1 == self.children().length) ) {

				var block = false;
				for(var i = 0; i < ptwTables.length; i++) {
					block = ptwGetFabric().getByViewId( ptwTables[i].view_id );
					if(block) {
						break;
					}
				}
				block.addPtwEl(self);
            	//#212
				if(self.hasClass('ptwColFooter')) {
                    self.prev().addClass('ptwColFooter')
                }
				self.remove();
			}
		});
	})(jQuery);

	// Delete btn init
	jQuery('.ptwTableRemoveBtn').click(function(){
		if(confirm(toeLangPtw('Are you sure want to remove this Table?'))) {
			jQuery.sendFormPtw({
				btn: this
			,	data: {mod: 'tables', action: 'remove', id: ptwGetFabric().getBlocks()[0].get('id')}	//[0] - we have only one block in this plugin - table block
			,	onSuccess: function(res) {
					if(!res.error) {
						toeRedirect( ptwAddNewUrl );
					}
				}
			});
		}
		return false;
	});
	jQuery('.ptwAddColumnBtn').click(function(){
		for(var i = 0; i < ptwTables.length; i++) {
			var block = ptwGetFabric().getByViewId( ptwTables[i].view_id );
			if(block) {
				block.addColumn();
				_ptwSetColsNumSetting(block);
			}
		}
		return false;
	});
	jQuery('.ptwAddRowBtn').click(function(){
		for(var i = 0; i < ptwTables.length; i++) {
			var block = ptwGetFabric().getByViewId( ptwTables[i].view_id );
			if(block) {
				block.addRow();
				_ptwSetRowsNumSetting(block);
			}
		}
		return false;
	});
	for(var i = 0; i < ptwTables.length; i++) {
		var block = ptwGetFabric().getByViewId( ptwTables[i].view_id );
		_ptwSetColsNumSetting(block);
		_ptwSetRowsNumSetting(block);
	}
	// Bg color input init
	_ptwCreateColorPickerFrom('.ptwColorPickBgColor', function(pcColor) {
		_ptwCheckBgColorNotice();
		_ptwGetTableBlock().setParam('bg_color', pcColor.formatted);
		_ptwGetTableBlock()._rebuildCss();
	});
	// Enable / disable description column
	jQuery('.ptwTableSettingsShell input[name="params[enb_desc_col]"]').change(function(){
		_ptwGetTableBlock().switchDescCol( jQuery(this).attr('checked') );
		_ptwGetTableBlock().contentChanged();
	});
	// Columns width manipulation
	jQuery('.ptwTableSettingsShell input[name="params[col_width]"]').change(function(){
		_ptwGetTableBlock().setColsWidth( jQuery(this).val() );
		_ptwGetTableBlock().contentChanged();
	});
	// Columns vertical padding manipulation
	jQuery('.ptwTableSettingsShell input[name="params[vert_padding]"]').change(function(){
		_ptwGetTableBlock().setTableVertPadding( jQuery(this).val() );
		_ptwGetTableBlock().contentChanged();
	});
	// Table calc width type change
	jQuery('.ptwTableSettingsShell input[name="params[calc_width]"]').change(function(){
		if(!jQuery(this).attr('checked')) return;
		_ptwGetTableBlock().setCalcWidth( jQuery(this).val() );
		_ptwGetTableBlock().contentChanged();
	});
	// Table width manipulation
	jQuery('.ptwTableSettingsShell input[name="params[table_width]"]').change(function(){
		_ptwGetTableBlock().setTableWidth( jQuery(this).val() );
		_ptwGetTableBlock().contentChanged();
	});
	jQuery('.ptwTableSettingsShell input[name="params[table_width_measure]"]').change(function(){
		if(!jQuery(this).attr('checked')) return;
		if(_ptwGetTableBlock().getParam('calc_width') !== 'table') return;
		var newMeasure = jQuery(this).val();
		_ptwGetTableBlock().setTableWidth( false, jQuery(this).val() );
		if(newMeasure == '%') {
			var width = parseFloat(jQuery('.ptwTableSettingsShell input[name="params[table_width]"]').val());
			if(width > 100) {
				jQuery('.ptwTableSettingsShell input[name="params[table_width]"]').val( 100 ).trigger('change');
			}
		}
	});
	// Hover effect animation check
	jQuery('.ptwTableSettingsShell input[name="params[enb_hover_animation]"]').change(function(){
		jQuery(this).attr('checked')
			? _ptwGetTableBlock()._initHoverEffect()
			: _ptwGetTableBlock()._disableHoverEffect();
	});
	jQuery('.ptwTableSettingsShell select[name="params[text_align]"]').change(function(){
		var aligns = ['left', 'right', 'center'];

		for (var i in aligns)
			_ptwGetTableBlock().$().removeClass('ptwAlign_' + aligns[i]);

		_ptwGetTableBlock().$().addClass('ptwAlign_' + jQuery(this).val());
		_ptwGetTableBlock().setParam('text_align', jQuery(this).val());
	});
	jQuery('.ptwTableSettingsShell select[name="params[table_align]"]').change(function(){
		var aligns = ['left', 'right', 'center', 'none'];

		for (var i in aligns)
			_ptwGetTableBlock().$().removeClass('ptwTableAlign_' + aligns[i]);

		_ptwGetTableBlock().$().addClass('ptwTableAlign_' + jQuery(this).val());
		_ptwGetTableBlock().setParam('table_align', jQuery(this).val());
	});
	// Editable PopUp title
	jQuery('#ptwTableEditableLabelShell').click(function(){
		var isEdit = jQuery(this).data('edit-on');
		if(!isEdit) {
			var $labelHtml = jQuery('#ptwTableEditableLabel')
			,	$labelTxt = jQuery('#ptwTableEditableLabelTxt');
			$labelTxt.val( $labelHtml.text() );
			$labelHtml.hide( g_ptwAnimationSpeed );
			$labelTxt.show( g_ptwAnimationSpeed, function(){
				jQuery(this).data('ready', 1).focus();
			});
			jQuery(this).data('edit-on', 1);
		}
	});
	jQuery('#ptwTableEditableLabelTxt').blur(function(){
		ptwFinishEditTableLabel( jQuery(this).val() );
	}).keydown(function(e){
		if(e.keyCode == 13) {	// Enter pressed
			ptwFinishEditTableLabel( jQuery(this).val() );
		}
	});
	// Font family for Table manipulations
	jQuery('.ptwTableSettingsShell select[name="params[font_family]"]').change(function(){
		_ptwGetTableBlock()._setFont( jQuery(this).val() );
	});
	// Text color input init
	_ptwCreateColorPickerFrom('.ptwColorPickTextColor', function(pcColor) {
		_ptwGetTableBlock().setParam('text_color', pcColor.formatted);
		_ptwGetTableBlock()._rebuildCss();
	});
	// Header text color
	_ptwCreateColorPickerFrom('.ptwColorPickTextColorHeader', function(pcColor) {
		_ptwGetTableBlock().setParam('text_color_header', pcColor.formatted);
		_ptwGetTableBlock()._rebuildCss();
	});
	// Desc cell text color
	_ptwCreateColorPickerFrom('.ptwColorPickTextColorDesc', function(pcColor) {
		_ptwGetTableBlock().setParam('text_color_desc', pcColor.formatted);
		_ptwGetTableBlock()._rebuildCss();
	});
	// End/dsbl Head row check
	jQuery('.ptwTableSettingsShell input[name="params[enb_head_row]"]').change(function(){
		_ptwGetTableBlock()._switchHeadRow({ state: jQuery(this).prop('checked') });	//"!" here is because option is actually for hide
	});
	// End/dsbl Desc row check
	jQuery('.ptwTableSettingsShell input[name="params[enb_desc_row]"]').change(function(){
		_ptwGetTableBlock()._switchDescRow({ state: jQuery(this).prop('checked') });	//"!" here is because option is actually for hide
	});
	// End/dsbl Foot row check
	jQuery('.ptwTableSettingsShell input[name="params[enb_foot_row]"]').change(function(){
		_ptwGetTableBlock()._switchFootRow({ state: jQuery(this).prop('checked') });	//"!" here is because option is actually for hide
	});
	// End/dsbl responsive mode
	jQuery('.ptwTableSettingsShell input[name="params[enb_responsive]"]').change(function(){
		// As prameter is disable, but option - is enable, this was done for more user-friendly options names in admin area
		_ptwGetTableBlock().setParam('dsbl_responsive', jQuery(this).prop('checked') ? 0 : 1);
		_ptwSetResponsiveMinColWidth();
	});
	// Responsive columns width manipulation
	jQuery('.ptwTableSettingsShell input[name="params[resp_min_col_width]"]').change(function(){
		_ptwGetTableBlock().setParam('resp_min_col_width', jQuery('.ptwTableSettingsShell input[name="params[resp_min_col_width]"]').val());
	});
	_ptwSetResponsiveMinColWidth();
	jQuery('.ptwTableSettingsShell input[name="params[disable_custom_tooltip_style]"]').change(function(){
		_ptwGetTableBlock().setParam('disable_custom_tooltip_style', jQuery(this).prop('checked') ? 1 : 0);
	});


	//Enable / disable switch
	jQuery('.ptwTableSettingsShell input[name="params[enable_switch_toggle]"]').change(function(){
		_ptwGetTableBlock().setParam('enable_switch_toggle', jQuery(this).prop('checked') ? 1 : 0);
		//_ptwEnableEditButton();
	});
    /*
    _ptwEnableEditButton();
    //Set switch options
    jQuery('.ptwTableSettingsShell input[name="params[switch_options]"]').change(function(){
        _ptwGetTableBlock().setParam('switch_options', jQuery(this).val());
    });
*/
	//Set switch text
	jQuery('.ptwTableSettingsShell input[name="params[switch_text]"]').change(function(){
        _ptwGetTableBlock().setParam('switch_text', jQuery(this).val());
    });
    //Set switch type
    jQuery('.ptwTableSettingsShell select[name="params[switch_type]"]').change(function(){
        _ptwGetTableBlock().setParam('switch_type', jQuery(this).val());
    });
    //Set switch position
    jQuery('.ptwTableSettingsShell select[name="params[switch_position]"]').change(function(){
    	_ptwGetTableBlock().setParam('switch_position', jQuery(this).val());
    });
    //Set switch options names / selected
    jQuery('.ptwTableSettingsShell input[name="params[option_name_input]"]').change(function(){
        _ptwGetTableBlock().setParam('option_name_input', jQuery(this).val());
    });

    // Border color picker
    _ptwCreateColorPickerFrom('.ptwSwitchColorBorder', function(pcColor) {
        _ptwGetTableBlock().setParam('switch_color_border', pcColor.formatted);
    });
    // Button color picker
    _ptwCreateColorPickerFrom('.ptwSwitchColorButton', function(pcColor) {
        _ptwGetTableBlock().setParam('switch_color_button', pcColor.formatted);
    });
    // Button text color picker
    _ptwCreateColorPickerFrom('.ptwSwitchColorButtonText', function(pcColor) {
        _ptwGetTableBlock().setParam('switch_color_button_text', pcColor.formatted);
    });
    // Button text no active color picker
    _ptwCreateColorPickerFrom('.ptwSwitchColorButtonTextNoactive', function(pcColor) {
        _ptwGetTableBlock().setParam('switch_color_button_text_noactive', pcColor.formatted);
    });


	// always save 'is_horisontal_row_type'
	_ptwGetTableBlock().setParam('is_horisontal_row_type', jQuery('.ptwTableSettingsShell input[name="params[is_horisontal_row_type]"]').val());
	// Preview btn click
	jQuery('.ptwTablePreviewBtn').click(function(){
		jQuery('html, body').animate({
			scrollTop: jQuery("#ptwCanvas").offset().top - jQuery('#wpadminbar').height()
		}, 1000);
		return false;
	});
	// Check old table html, if required - rebuild current right now according to old changes.
	// This required for "Change Template" functionality
	_ptwCheckOldTemplateHtml();
	// Shortcodes example switch
	jQuery('#ptwTableShortcodeExampleSel').change(function(){
		jQuery('#ptwTableShortcodeShell, #ptwTablePhpCodeShell').hide();
		var showId = '';
		switch(jQuery(this).val()) {
			case 'shortcode':
				showId = 'ptwTableShortcodeShell';
				break;
			case 'php_code':
				showId = 'ptwTablePhpCodeShell';
				break;
		}
		jQuery('#'+ showId).show();
	}).trigger('change');
	// Transform al custom chosen selects
	jQuery('.chosen').chosen({
		disable_search_threshold: 5
	});
	_ptwTableInitSaveAsCopyDlg();

	jQuery('.ptwTableEditCssBtn').click(function(){
		ptwBlockCssEditor.show(ptwGetFabric().getBlocks()[0]);

		return false;
	});

	//jQuery('#containerWrapper .ptwSettingsTabs a').on('click', function(){
	//	var tab = $(this)
	//	,	href = tab.attr('data-href');
     //   $('#containerWrapper .ptwSettingsTabs a').removeClass('nav-tab-active');
     //   $('#containerWrapper .ptwSettingsContent div').removeClass('active');
	//
     //   tab.addClass('nav-tab-active');
     //   $('#containerWrapper .ptwSettingsContent .' + href).addClass('active');
	//});

});
function _ptwSetResponsiveMinColWidth() {
	var $ptwRespMinColWidthObj = jQuery(".ptwRespMinColW");
	if(jQuery('.ptwTableSettingsShell input[name="params[enb_responsive]"]').prop("checked")) {
		$ptwRespMinColWidthObj.removeClass("ptwDisplNone");
	} else {
		$ptwRespMinColWidthObj.addClass("ptwDisplNone");
	}
	_ptwGetTableBlock().setParam('resp_min_col_width', jQuery('.ptwTableSettingsShell input[name="params[resp_min_col_width]"]').val());
}
/*
function _ptwEnableEditButton() {
	var $ptwEditButton = jQuery(".ptwSwitchToggleOpt");
	var $toggleButton = jQuery(".ptwSwitchWrapper");

	if(jQuery('.ptwTableSettingsShell input[name="params[enable_switch_toggle]"]').prop("checked")) {
		$ptwEditButton.removeClass("ptwDisplNone");
		$toggleButton.removeClass("ptwDisplNone");
	} else {
		$ptwEditButton.addClass("ptwDisplNone");
		$toggleButton.addClass("ptwDisplNone");
	}

	_ptwGetTableBlock().setParam('resp_min_col_width', jQuery('.ptwTableSettingsShell input[name="params[resp_min_col_width]"]').val());
}
*/
function _ptwTableInitSaveAsCopyDlg() {
	var $container = jQuery('#ptwTableSaveAsCopyWnd').dialog({
		modal:    true
	,	autoOpen: false
	,	width: 460
	,	height: 180
	,	buttons:  {
			OK: function() {
				jQuery('#ptwTableSaveAsCopyForm').submit();
			}
		,	Cancel: function() {
				$container.dialog('close');
			}
		}
	});
	jQuery('#ptwTableSaveAsCopyForm').submit(function(){
		jQuery(this).sendFormPtw({
			msgElID: 'ptwTableSaveAsCopyMsg'
		,	onSuccess: function(res) {
				if(!res.error && res.data.edit_link) {
					toeRedirect( res.data.edit_link );
				}
			}
		});
		return false;
	});
	jQuery('.ptwTableCloneBtn').click(function(){
		$container.dialog('open');
		return false;
	});
}
function _ptwCheckBgColorNotice() {
	var noticeAboutBgColorShown = parseInt(getCookiePtw('ptw_bg_color_notice_shown'));
	if(!noticeAboutBgColorShown) {
		var $cols = _ptwGetTableBlock()._getCols( parseInt(_ptwGetTableBlock().getParam('enb_desc_col')) )
		,	haveColsWithoutFillColor = false;
		if($cols && $cols.size()) {
			$cols.each(function(){
				var colEl = _ptwGetTableBlock().getElementByIterNum( jQuery(this).data('iter-num') );
				if(colEl) {
					var enbFillColor = parseInt(colEl.get('enb-color'));
					if(!enbFillColor) {
						console.log( jQuery(this) );
						haveColsWithoutFillColor = true;
						return false;
					}
				}
			});
		}
		if(!haveColsWithoutFillColor) {	//So, each column have enabled bg color - tell user about this
			jQuery('#ptwTableAllColsHaveBgColorWnd').dialog({
				modal:    true
			,	width: 460
			,	buttons: [
					{
						text: 'OK, got it!',
						"class": 'ui-button ui-state-default',
						click: function() {                     
						   jQuery('#ptwTableAllColsHaveBgColorWnd').dialog('close');
						}
					}
				]
			,	close: function() {
					// Show all this notice - only once
					setCookiePtw('ptw_bg_color_notice_shown', 1, 365);	// Set cookie for one year - why not?:)
				}
			});
		}
	}
}
function ptwFinishEditTableLabel(label) {
	if(jQuery('#ptwTableEditableLabelShell').data('sending')) return;
	if(!jQuery('#ptwTableEditableLabelTxt').data('ready')) return;
	jQuery('#ptwTableEditableLabelShell').data('sending', 1);
	jQuery.sendFormPtw({
		btn: jQuery('#ptwTableEditableLabelShell')
	,	data: {mod: 'tables', action: 'updateLabel', label: label, id: _ptwGetTableBlock().get('id')}
	,	onSuccess: function(res) {
			if(!res.error) {
				var $labelHtml = jQuery('#ptwTableEditableLabel')
				,	$labelTxt = jQuery('#ptwTableEditableLabelTxt');
				$labelHtml.html( jQuery.trim($labelTxt.val()) );
				$labelTxt.hide( g_ptwAnimationSpeed ).data('ready', 0);
				$labelHtml.show( g_ptwAnimationSpeed );
				jQuery('#ptwTableEditableLabelShell').data('edit-on', 0);
			}
			jQuery('#ptwTableEditableLabelShell').data('sending', 0);
		}
	});
}
function _ptwSetColsNumSetting(block) {
	var colsNum = block.getColsNum();
	jQuery('.ptwTableColsNum_'+ block.get('view_id')).html( colsNum );
	block.setParam('cols_num', colsNum);
}
function _ptwSetRowsNumSetting(block) {
	var rowsNum = block.getRowsNum();
	jQuery('.ptwTableRowsNum_'+ block.get('view_id')).html( rowsNum );
	block.setParam('rows_num', rowsNum);
}
function _ptwGetTableBlock() {
	return g_ptwTableBlock;
}
function _ptwCreateColorPickerFrom(selector, callbackFunc) {
	var $input = jQuery(selector);
	var currColorPickerOpt = jQuery.extend({}, g_ptwVandColorPickerOptions, {
		'altField': selector + 'Tear',
		'select': function(event, cpColor) {
			if(callbackFunc && typeof callbackFunc === "function") {
				callbackFunc(cpColor);
			}
		},
		'position': {'my': 'center top', 'at': 'right bottom', 'of': selector + 'Tear'},
	});
	$input.colorpicker(currColorPickerOpt);
}
function _ptwCheckOldTemplateHtml() {
	var oldHtml = _ptwGetTableBlock().getParam('old_html');
	if(oldHtml && oldHtml != '') {
		var table = _ptwGetTableBlock()
		,	$tmpDiv = jQuery('<div style="display: none;" />').appendTo('body').html( oldHtml )
		,	$oldCols = $tmpDiv.find('.ptwCol:not(.ptwTableDescCol)')
		,	oldColsNum = $oldCols.size()
		,	$cols = table._getCols()
		,	colsNum = $cols.size()
		,	$oldFirstCol = $oldCols.first()
		,	oldRowsNum = $oldFirstCol.find('.ptwRows .ptwCell').size()
		,	rowsNum = table.getRowsNum();
		if(oldColsNum != colsNum) {
			var i = oldColsNum - colsNum
			,	currColNum = colsNum;
			while(i) {
				if(i > 0) {
					table.addColumn();
					i--;
				} else {
					table.removeCol( currColNum - 1 );
					currColNum--;
					i++;
				}
			}
		}
		if(oldRowsNum != rowsNum) {
			var i = oldRowsNum - rowsNum
			,	currRowNum = rowsNum;
			while(i) {
				if(i > 0) {
					table.addRow();
					i--;
				} else {
					table.removeRow( currRowNum - 1 );
					currRowNum--;
					i++;
				}
			}
		}
		var $oldColsWithDesc = $tmpDiv.find('.ptwCol')
		,	$newColsWithDesc = table._getCols( true )
		,	colSelectors = table.getColSelectors();
		$newColsWithDesc.each(function(index){
			for(var key in colSelectors) {
				if(key == 'rows') continue;	// Don't replace all rows, let's replace each cell - step-by-step
				var $newItems = jQuery(this).find( colSelectors[key].sel );
				$newItems.each(function(itemIndex){
					var $newItem = jQuery(this);
					$newItem.find('.ptwEl').each(function(){	// Remove all old elements
						table.removeElementByIterNum( jQuery(this).data('iter-num') );
					});
					$newItem.html( $oldColsWithDesc.filter(':eq('+ index+ ')').find( colSelectors[key].sel ).filter(':eq('+ itemIndex+ ')').html() );
					table._initElementsForArea( $newItem );
				});
			}
		});
		$tmpDiv.remove();	// Goodbay old data:)
		setTimeout(function(){	// Re-save new data
			table.contentChanged();
			table._initCellsEdit();	// Let it be here
			table._switchHeadRow();
			table._switchDescRow();
			table._switchFootRow();
			table._initCellsMovable();
			_ptwGetTableBlock().setParam('old_html');
			_ptwSaveCanvas({
				sendData: {remove_old_html: 1}
			});
			// reinit woo comerce data after template changed
			if(window.ptwTablesAdmin && window.ptwTablesAdmin.fillHandler) {
				window.ptwTablesAdmin.fillHandler();
			}
		}, g_ptwAnimationSpeed);
	}
}