jQuery(document).ready(function(){
	// Base init - will work for both page usage: create new from template or change template
	jQuery('.table-list-item .preset-select-btn').click(function(e){
		if(jQuery(this).hasClass('sup-promo')) {
			e.stopPropagation();
		} else {
			e.preventDefault();
		}
	});
	jQuery('.table-list-item.sup-promo').click(function(){
		toeRedirect(jQuery(this).find('.preset-select-btn').attr('href'), true);
	});
	// Init create new one from template, or change template for existing "substance" :)
	if(typeof(ptwOriginalTable) !== 'undefined') {	// Just changing template - for existing table
		ptwInitChangeTableDialog();
	} else {			// Creating new table
		ptwInitCreateTableDialog();
	}
	if(jQuery('.ptwTplPrevImg').size()) {	// If on creation page
		ptwAdjustPreviewSize();
		jQuery(window).resize(function(){
			ptwAdjustPreviewSize();
		});
	}

});

function ptwAdjustPreviewSize() {
	var shellWidth = parseInt(jQuery('.table-list').width())
	,	initialMaxWidth = 400
	,	startFrom = 860
	,	endFrom = 500;
	if(shellWidth < startFrom && shellWidth > endFrom) {
		jQuery('.ptwTplPrevImg').css('max-width', initialMaxWidth - Math.floor((startFrom - shellWidth) / 2));
	} else if(shellWidth < endFrom || shellWidth > startFrom) {
		jQuery('.ptwTplPrevImg').css('max-width', initialMaxWidth);
	}
}
function ptwInitChangeTableDialog() {
	var $container = jQuery('#ptwChangeTplWnd').dialog({
		modal:    true
	,	autoOpen: false
	,	width: 460
	,	height: 180
	,	buttons:  {
			OK: function() {
				jQuery('#ptwChangeTplForm').submit();
			}
		,	Cancel: function() {
				$container.dialog('close');
			}
		}
	});
	jQuery('.table-list-item[data-id='+ ptwOriginalTable.original_id+ ']')
		.addClass('active')
		.find('.preset-select-btn').each(function(){
			jQuery(this).html( jQuery(this).data('txt-active') );
	});
	jQuery('.table-list-item:not(.sup-promo)').click(function(){
		var id = jQuery(this).data('id');
		if(ptwOriginalTable.original_id == id) {
			var dialog = jQuery('<div />').html(toeLangPtw('This is same template that was used for Table before')).dialog({
				modal:    true
			,	width: 480
			,	height: 180
			,	buttons: {
					OK: function() {
						dialog.dialog('close');
					}
				}
			,	close: function() {
					dialog.remove();
				}
			});
			return false;
		}
		jQuery('#ptwChangeTplForm').find('[name=id]').val( ptwOriginalTable.id );
		jQuery('#ptwChangeTplForm').find('[name=new_tpl_id]').val( id );
		jQuery('#ptwChangeTplNewLabel').html( jQuery(this).find('.ptwTplLabel').html() )
		jQuery('#ptwChangeTplMsg').html('');
		$container.dialog('open');
		return false;
	});
	jQuery('#ptwChangeTplForm').submit(function(){
		jQuery(this).sendFormPtw({
			msgElID: 'ptwChangeTplMsg'
		,	onSuccess: function(res) {
				if(!res.error && res.data.edit_link) {
					toeRedirect( res.data.edit_link );
				}
			} 
		});
		return false;
	});
}
function ptwInitCreateTableDialog() {
	jQuery('.table-list-item:not(.sup-promo)').click(function(){
		jQuery('.table-list-item')
			.removeClass('active')
			.find('.preset-select-btn').each(function(){
				jQuery(this).html( jQuery(this).data('txt') );
			});
		jQuery(this).addClass('active')
			.find('.preset-select-btn').each(function(){
				jQuery(this).html( jQuery(this).data('txt-active') );
			});
		jQuery('#ptwCreateTableForm').find('[name=original_id]').val( jQuery(this).data('id') );
		return false;
	});
	jQuery('#ptwCreateTableForm').submit(function(){
		jQuery(this).sendFormPtw({
			btn: jQuery(this).find('button')
		,	onSuccess: function(res) {
				if(!res.error && res.data.edit_link) {
					toeRedirect( res.data.edit_link );
				}
			} 
		});
		return false;
	});
}
function ptwTableRemoveRow(id, link) {
	var tblId = jQuery(link).parents('table.ui-jqgrid-btable:first').attr('id');
	if(confirm(toeLangPtw('Are you sure want to remove "'+ ptwGetGridColDataById(id, 'label', tblId)+ '" Table?'))) {
		jQuery.sendFormPtw({
			btn: link
		,	data: {mod: 'tables', action: 'remove', id: id}
		,	onSuccess: function(res) {
				if(!res.error) {
					jQuery('#'+ tblId).trigger( 'reloadGrid' );
				}
			}
		});
	}
}