jQuery(document).ready(function(){
	var tblId = 'ptwPagesTbl';
	jQuery('#'+ tblId).jqGrid({ 
		url: ptwTblDataUrl
	,	datatype: 'json'
	,	autowidth: true
	,	shrinkToFit: true
	,	colNames:[toeLangPtw('ID'), toeLangPtw('Label'), toeLangPtw('Date Created')]
	,	colModel:[
			{name: 'id', index: 'id', searchoptions: {sopt: ['eq']}, width: '50', align: 'center'}
		,	{name: 'label', index: 'label', searchoptions: {sopt: ['eq']}, align: 'center'}
		,	{name: 'date_created', index: 'date_created', searchoptions: {sopt: ['eq']}, align: 'center'}
		//,	{name: 'actions', index: 'actions', searchoptions: {sopt: ['eq']}, align: 'center'}
		]
	,	postData: {
			search: {
				text_like: jQuery('#'+ tblId+ 'SearchTxt').val()
			}
		}
	,	rowNum:10
	,	rowList:[10, 20, 30, 1000]
	,	pager: '#'+ tblId+ 'Nav'
	,	sortname: 'id'
	,	viewrecords: true
	,	sortorder: 'desc'
	,	jsonReader: { repeatitems : false, id: '0' }
	,	caption: toeLangPtw('Current Table')
	,	height: '100%' 
	,	emptyrecords: ''//toeLangPtw('You have no Tables for now.')
	,	multiselect: true
	,	onSelectRow: function(rowid, e) {
			var tblId = jQuery(this).attr('id')
			,	selectedRowIds = jQuery('#'+ tblId).jqGrid ('getGridParam', 'selarrrow')
			,	totalRows = jQuery('#'+ tblId).getGridParam('reccount')
			,	totalRowsSelected = selectedRowIds.length;
			if(totalRowsSelected) {
				jQuery('#ptwPagesRemoveGroupBtn').removeAttr('disabled');
				if(totalRowsSelected == totalRows) {
					jQuery('#cb_'+ tblId).prop('indeterminate', false);
					jQuery('#cb_'+ tblId).attr('checked', 'checked');
				} else {
					jQuery('#cb_'+ tblId).prop('indeterminate', true);
				}
			} else {
				jQuery('#ptwPagesRemoveGroupBtn').attr('disabled', 'disabled');
				jQuery('#cb_'+ tblId).prop('indeterminate', false);
				jQuery('#cb_'+ tblId).removeAttr('checked');
			}
			ptwCheckUpdate(jQuery(this).find('tr:eq('+rowid+')').find('input[type=checkbox].cbox'));
			ptwCheckUpdate('#cb_'+ tblId);
		}
	,	gridComplete: function(a, b, c) {
			var tblId = jQuery(this).attr('id');
			jQuery('#ptwPagesRemoveGroupBtn').attr('disabled', 'disabled');
			jQuery('#cb_'+ tblId).prop('indeterminate', false);
			jQuery('#cb_'+ tblId).removeAttr('checked');
			// Custom checkbox manipulation
			ptwInitCustomCheckRadio('#'+ jQuery(this).attr('id') );
			ptwCheckUpdate('#cb_'+ jQuery(this).attr('id'));
		}
	,	loadComplete: function() {
			var tblId = jQuery(this).attr('id');
			if (this.p.reccount === 0) {
				jQuery(this).hide();
				jQuery('#'+ tblId+ 'Nav_right').hide();
				jQuery('#'+ tblId+ 'EmptyMsg').show();
			} else {
				jQuery(this).show();
				jQuery('#'+ tblId+ 'EmptyMsg').hide();
			}
		}
	});
	jQuery('#'+ tblId+ 'NavShell').append( jQuery('#'+ tblId+ 'Nav') );
	jQuery('#'+ tblId+ 'Nav').find('.ui-pg-selbox').insertAfter( jQuery('#'+ tblId+ 'Nav').find('.ui-paging-info') );
	jQuery('#'+ tblId+ 'Nav').find('.ui-pg-table td:first').remove();
	// Make navigation tabs to be with our additional buttons - in one row
	jQuery('#'+ tblId+ 'Nav_center').prepend( jQuery('#'+ tblId+ 'NavBtnsShell') ).css({
		'width': '80%'
	,	'white-space': 'normal'
	,	'padding-top': '8px'
	});
	jQuery('#'+ tblId+ 'SearchTxt').keyup(function(){
		var searchVal = jQuery.trim( jQuery(this).val() );
		if(searchVal && searchVal != '') {
			ptwGridDoListSearch({
				text_like: searchVal
			}, tblId);
		}
	});
	
	jQuery('#'+ tblId+ 'EmptyMsg').insertAfter(jQuery('#'+ tblId+ '').parent());
	jQuery('#'+ tblId+ '').jqGrid('navGrid', '#'+ tblId+ 'Nav', {edit: false, add: false, del: false});
	jQuery('#cb_'+ tblId+ '').change(function(){
		jQuery(this).attr('checked') 
			? jQuery('#ptwPagesRemoveGroupBtn').removeAttr('disabled')
			: jQuery('#ptwPagesRemoveGroupBtn').attr('disabled', 'disabled');
	});
	jQuery('#ptwPagesRemoveGroupBtn').click(function(){
		var selectedRowIds = jQuery('#ptwPagesTbl').jqGrid ('getGridParam', 'selarrrow')
		,	listIds = [];
		for(var i in selectedRowIds) {
			var rowData = jQuery('#ptwPagesTbl').jqGrid('getRowData', selectedRowIds[ i ]);
			listIds.push( rowData.id );
		}
		var popupLabel = '';
		if(listIds.length == 1) {	// In table label cell there can be some additional links
			var labelCellData = ptwGetGridColDataById(listIds[0], 'label', 'ptwPagesTbl');
			popupLabel = jQuery(labelCellData).text();
		}
		var confirmMsg = listIds.length > 1
			? toeLangPtw('Are you sur want to remove '+ listIds.length+ ' Tables?')
			: toeLangPtw('Are you sure want to remove "'+ popupLabel+ '" Table?')
		if(confirm(confirmMsg)) {
			jQuery.sendFormPtw({
				btn: this
			,	data: {mod: 'tables', action: 'removeGroup', listIds: listIds}
			,	onSuccess: function(res) {
					if(!res.error) {
						jQuery('#ptwPagesTbl').trigger( 'reloadGrid' );
					}
				}
			});
		}
		return false;
	});
	ptwInitCustomCheckRadio('#'+ tblId+ '_cb');
});
