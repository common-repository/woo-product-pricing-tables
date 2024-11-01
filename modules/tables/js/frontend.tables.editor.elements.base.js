function ptwElementBase(jqueryHtml, block) {
	this._iterNum = 0;
	this._id = 'el_'+ mtRand(1, 999999);
	this._animationSpeed = g_ptwAnimationSpeed;
	this._$ = jqueryHtml;
	this._block = block;
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = '';
	}
	this._innerImgsCount = 0;
	this._innerImgsLoaded = 0;
	//this._$menu = null;
	this._menu = null;
	this._menuClbs = {};
	if(typeof(this._menuClass) === 'undefined') {
		this._menuClass = 'ptwElementMenu';
	}
	this._menuOnBottom = false;
	this._code = 'base';

	this._initedComplete = false;
	this._editArea = null;
	if(typeof(this._isMovable) === 'undefined') {
		this._isMovable = false;
	}
	this._moveHandler = null;
	this._sortInProgress = false;
	if(typeof(this._showMenuEvent) === 'undefined') {
		this._showMenuEvent = 'click';
	}
	if(typeof(this._changeable) === 'undefined') {
		this._changeable = false;
	}
	if(g_ptwEdit) {
		this._init();
		this._initMenuClbs();
		this._initMenu();

		var images = this._$.find('img');
		if(images && (this._innerImgsCount = images.size())) {
			this._innerImgsLoaded = 0;
			var self = this;
			images.load(function(){
				self._innerImgsLoaded++;
				if(self._$.find('img').size() == self._innerImgsLoaded) {
					self._afterFullContentLoad();
				}
			});
		}
	}
	this._onlyFirstHtmlInit();
	this._initedComplete = true;
}
ptwElementBase.prototype.getId = function() {
	return this._id;
};
ptwElementBase.prototype.getBlock = function() {
	return this._block;
};
ptwElementBase.prototype._onlyFirstHtmlInit = function() {
	if(this._$ && !this._$.data('first-inited')) {
		this._$.data('first-inited', 1);
		return true;
	}
	return false;
};
ptwElementBase.prototype.setIterNum = function(num) {
	this._iterNum = num;
	this._$.data('iter-num', num);
};
ptwElementBase.prototype.getIterNum = function() {
	return this._iterNum;
};
ptwElementBase.prototype.$ = function() {
	return this._$;
};
ptwElementBase.prototype.getCode = function() {
	return this._code;
};
ptwElementBase.prototype._setCode = function(code) {
	this._code = code;
};
ptwElementBase.prototype._init = function() {
	this._beforeInit();
};
ptwElementBase.prototype._beforeInit = function() {
	
};
ptwElementBase.prototype.destroy = function() {
	
};
ptwElementBase.prototype.get = function(opt) {
	return jQuery('<div/>').html(this._$.attr( 'data-'+ opt )).text();	// not .data() - as it should be saved even after page reload, .data() will not create element attribute
};
ptwElementBase.prototype.set = function(opt, val) {
	this._$.attr( 'data-'+ opt, jQuery('<div/>').text(val).html() );	// not .data() - as it should be saved even after page reload, .data() will not create element attribute
};
ptwElementBase.prototype._getEditArea = function() {
	if(!this._editArea) {
		this._editArea = this._$.children('.ptwElArea');
		if(!this._editArea.size()) {
			this._editArea = this._$.find('.ptwInputShell');
		}
	}
	return this._editArea;
};
ptwElementBase.prototype._getOverlay = function() {
	return this._$.find('.ptwElOverlay');
};
/**
 * Standart button item
 */
function ptwElement_btn(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuBtnExl';
	}
	this._menuClass = 'ptwElementMenu_btn';
	this._haveAdditionBgEl = null;
	this._changeable = true;
	this.includePostLinks = true;
	ptwElement_btn.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_btn, ptwElementBase);
ptwElement_btn.prototype._onlyFirstHtmlInit = function() {
	if(ptwElement_btn.superclass._onlyFirstHtmlInit.apply(this, arguments)) {
		if(this.get('customhover-clb')) {
			var clbName = this.get('customhover-clb');
			if(typeof(this[clbName]) === 'function') {
				var self = this;
				this._getEditArea().hover(function(){
					self[clbName](true, this);
				}, function(){
					self[clbName](false, this);
				});
			}
		}
	}
};
ptwElement_btn.prototype._hoverChangeFontColor = function( hover, element ) {
	if(hover) {
		jQuery(element)
			.data('original-color', this._getEditArea().css('color'))
			.css('color', jQuery(element).parents('.ptwEl:first').attr('data-bgcolor'));	// Ugly, but only one way to get this value in dynamic way for now
	} else {
		jQuery(element)
			.css('color', jQuery(element).data('original-color'));
	}
};
ptwElement_btn.prototype._hoverChangeBgColor = function( hover, element ) {
};
ptwElement_btn.prototype._hoverBorderColor = function( hover, element ) {
	//var parentElement = jQuery(element).parents('.ptwEl:first');	// Actual element html
	if(hover) {
		jQuery(element)
			.data('original-color', jQuery(element).css('border-color'))
			.css('border-color', jQuery(element).parents('.ptwEl:first').attr('data-bgcolor'));	// Ugly, but only one way to get this value in dynamic way for now
	} else {
		jQuery(element)
			.css('border-color', jQuery(element).data('original-color'));
	}
};
/**
 * Table column element
 */
function ptwElement_table_col(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuTableColExl';
	}
	if(typeof(this._menuClass) === 'undefined') {
		this._menuClass = 'ptwElementMenu_table_col';
	}
	if(typeof(this._isMovable) === 'undefined') {
		this._isMovable = true;
	}
	this._showMenuEvent = 'hover';
	this._colNum = 0;
	ptwElement_table_col.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_table_col, ptwElementBase);
/**
 * Table description column element
 */
function ptwElement_table_col_desc(jqueryHtml, block) {
	this._isMovable = false;
	ptwElement_table_col_desc.superclass.constructor.apply(this, arguments);
	//this.refreshHeight();
	//var self = this;
	/*this.getBlock().$().bind('ptwBlockContentChanged', function(){
		self.refreshHeight();
	});*/
}
extendPtw(ptwElement_table_col_desc, ptwElement_table_col);
/*ptwElement_table_col_desc.prototype.refreshHeight = function() {
	var sizes = this.getBlock().getMaxColsSizes();
	for(var key in sizes) {
		var $entity = this._$.find(sizes[ key ].sel);
		if($entity && $entity.size()) {
			if(key == 'cells' &&  sizes[ key ].height) {
				var cellNum = 0;
				$entity.each(function(){
					if(typeof(sizes[ key ].height[ cellNum ]) !== 'undefined') {
						jQuery(this).css('height', sizes[ key ].height[ cellNum ]);
					}
					cellNum++;
				});
			} else {
				$entity.css('height', sizes[ key ].height);
			}
		}
	}
};*/

/**
 * Text element
 */
function ptwElement_table_cell_txt(jqueryHtml, block) {
	if (block.getParam('responsive_text')) {
		jqueryHtml.find('span, p').responsiveText({ minFontSize: 14 });
	}
	this.includePostLinks = true;
	ptwElement_table_cell_txt.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_table_cell_txt, ptwElementBase);