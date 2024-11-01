var g_ptwMainMenu = null
,	g_ptwFileFrame = null	// File frame for wp media uploader
,	g_ptwEdit = true
,	g_ptwTopBarH = 32		// Height of the Top Editor Bar
,	g_ptwSortInProgress = false
,	g_ptwEditMode = true	// If this script is loaded - this mean that we in edit mode
,	g_ptwVandColorPickerOptions = {
		'altAlpha': false,
		'showOn': 'alt',
		'altProperties': 'background-color',
		'altColorFormat': 'rgba(rd,gd,bd,af)',
		'okOnEnter': true,
		'mode': 's',
		'alpha': true,
		'color': 'rgba(255, 255, 255, 0.8)',
		'colorFormat': 'RGBA',
		'title': 'Pick a color',
		'part': { 'map': { size: 128 }, 'bar': { size: 128 } },
		'parts': [ 'map', 'bar', 'rgb', 'alpha', 'hex', 'preview' ],
		'layout': {'map':		[0, 0, 1, 4],'bar':		[1, 0, 1, 4],'preview':	[2, 0, 1, 1],'rgb':		[2, 1, 1, 1],'alpha':  	[2, 2, 1, 1],'hex':		[2, 3, 1, 1],},
};
jQuery(document).ready(function(){
	_ptwInitTwig();
	// Prevent all default browser event - such as links redirecting, forms submit, etc.
	jQuery('#ptwCanvas').on('click', 'a', function(event){
		event.preventDefault();
	});
	jQuery('.ptwMainSaveBtn').click(function(){
		_ptwSaveCanvas();
		return false;
	});
});
function _ptwSaveCanvasDelay(delay) {
	delay = delay ? delay : 200;
	setTimeout(_ptwSaveCanvas, delay);
}
function _ptwSaveCanvas(params, byHands) {
	if(!!parseInt(toeOptionPtw('disable_autosave')) && 'undefined' == typeof byHands) {
		return;	// Autosave disabled in admin area
	}

	if(typeof(ptwTables) === 'undefined' || !ptwTables || !ptwTables.length || (typeof(g_ptwIsTableBuilder) !== 'undefined' && g_ptwIsTableBuilder)) {
		return;
	}
	params = params || {};
	var dataForSave = {
		mod: 'tables'
	,	action: 'save'
	,	data: ptwGetFabric().getDataForSave()[0]	//[0] - is because only one block (table) is in this plugin saved
	};
	if(params.sendData) {
		for(var key in params.sendData) {
			dataForSave.data[ key ] = params.sendData[ key ];
		}
	}
	// save other properties
	if(window.ptwTablesAdmin && window.ptwTablesAdmin.getPropertyListForSave && window.ptwTablesAdmin.getProdListForSave) {
		window.ptwTablesAdmin.getRefreshedProdProps();
		dataForSave.data.wcProdProps = window.ptwTablesAdmin.getPropertyListForSave();
		window.ptwTablesAdmin.getRefreshedProducts();
		dataForSave.data.wcProducts = window.ptwTablesAdmin.getProdListForSave();
	}
	jQuery.sendFormPtw({
		btn: jQuery('.ptwTableSaveBtn')
	,	data: dataForSave
	,	onSuccess: function(res){
			if(!res.error) {
				
			}
		}
	});
}
function _ptwSortInProgress() {
	return g_ptwSortInProgress;
}
function _ptwSetSortInProgress(state) {
	g_ptwSortInProgress = state;
}
function _ptwInitTwig() {
	Twig.extendFunction('adjBs', function(hex, steps) {
		if(!hex)
			return hex;
		var isRgb = hex.indexOf('rgb') !== -1;
		if(isRgb) {
			var colorObj = tinycolor( hex );
			hex = colorObj.toHex();
		}
		// Steps should be between -255 and 255. Negative = darker, positive = lighter
		steps = Math.max(-255, Math.min(255, steps));
		// Normalize into a six character long hex string
		hex = str_replace(hex, '#', '');
		if (hex.length == 3) {
			hex = str_repeat(hex.substr(0, 1), 2)+ str_repeat(hex.substr(1, 1), 2)+ str_repeat(hex.substr(2, 1), 2);
		}
		// Split into three parts: R, G and B
		var color_parts = str_split(hex, 2);
		var res = '#';
		for(var i in color_parts) {
			var color = color_parts[ i ];
			color   = hexdec(color); // Convert to decimal
			color   = Math.max(0, Math.min(255, color + steps)); // Adjust color
			res += str_pad(dechex(color), 2, '0', 'STR_PAD_LEFT'); // Make two char hex code
		}
		if(isRgb) {
			return tinycolor( res ).setAlpha( colorObj.getAlpha() );
		}
		return res;
	});
}