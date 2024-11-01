var g_ptwEdit = false
,	g_ptwBlockFabric = null
,	g_ptwHoverAnim = 300	// Table hover animation lenght, ms - hardcoded for now
,	g_ptwHoverMargin = 20;	// Table hover margin displace, px - hardcoded for now
jQuery(document).ready(function(){
	_ptwInitFabric();
	if(typeof(ptwTables) !== 'undefined' && ptwTables && ptwTables.length) {
		for(var i = 0; i < ptwTables.length; i++) {
			g_ptwBlockFabric.addFromHtml(ptwTables[ i ], jQuery('#'+ ptwTables[ i ].view_id));
			jQuery('body').trigger('set_default_position');
			//for fix horizontal element size bugs frontend.pro.tables.js
			if(ptwTables[i].unique_id === "7m6k5X0i"){
				jQuery('#'+ ptwTables[ i ].view_id).attr('data-unique_id', ptwTables[i].unique_id);
			}
		}
	}
	

	
	jQuery(window).on('resize', function(){
		
		var $cols = jQuery('.ptwEl.ptwCol[data-el="table_col"]');
		$cols.height('auto');
		
		//Fixed bug with different column heights on hover in table #3 "Gradient Standard"
		if(typeof(ptwTables) !== 'undefined' && ptwTables && ptwTables.length) {
			for (var i = 0; i < ptwTables.length; i++) {
				if (parseInt(ptwTables[i].original_id) === 3) {
					jQuery('#' + ptwTables[i].view_id).each(function () {
						var highestBox = 0;
						var paddingBottom = 0;
						jQuery('.ptwCol', this).each(function () {
							if (jQuery(this).height() > highestBox) {
								highestBox = jQuery(this).height();
							}
							if (parseInt(jQuery(this).css('paddingBottom')) > paddingBottom) {
								paddingBottom = parseInt(jQuery(this).css('paddingBottom'));
							}
						});
						var colHeight = highestBox + paddingBottom;
						jQuery('.ptwCol', this).css('minHeight', colHeight + 'px');
					});
				}
			}
		}
	});
});
jQuery(window).load(function() {
	jQuery('body').trigger('resize');
});
//in case images are loading dynamically
jQuery('.ptwEl.ptwCol[data-el="table_col"] img').on('load', function() {
	jQuery('body').trigger('resize');
});
function _ptwInitFabric() {
	g_ptwBlockFabric = new ptwBlockFabric();
}
function ptwGetFabric() {
	return g_ptwBlockFabric;
}
function _ptwIsEditMode() {
	return (typeof(g_ptwEditMode) !== 'undefined' && g_ptwEditMode);
}