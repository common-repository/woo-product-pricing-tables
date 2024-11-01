/**
 * Base block object - for extending
 * @param {object} blockData all block data from database (block database row)
 */
function ptwBlockBase(blockData) {
	this._data = blockData;
	this._$ = null;
	this._original$ = null;
	this._id = 0;
	this._iter = 0;
	this._elements = [];
	this._animationSpeed = 300;
	this._disableContentChange = false;
	//this._oneTimeElementsInited = false;
}
ptwBlockBase.prototype.get = function(key) {
	return this._data[ key ];
};
ptwBlockBase.prototype.getParam = function(key) {
	return this._data.params[ key ] ? this._data.params[ key ].val : false;
};
ptwBlockBase.prototype.setParam = function(key, value) {
	if(!this._data.params[ key ]) this._data.params[ key ] = {};
	this._data.params[ key ].val = value;
};
ptwBlockBase.prototype.getRaw = function() {
	return this._$;
};
/**
 * Alias for getRaw method
 */
ptwBlockBase.prototype.$ = function() {
	return this.getRaw();
};
ptwBlockBase.prototype.setRaw = function(jqueryHtml) {
	this._$ = jqueryHtml;
	this._resetElements();
	this._initHtml();
	if(this.getParam('font_family')) {
		this._setFont( this.getParam('font_family') );
	}
};
ptwBlockBase.prototype._initElements = function() {
	this._initElementsForArea( this._$ );
};
ptwBlockBase.prototype._initOneElement = (function(htmlEl, block) {
	var elementCode = jQuery(htmlEl).data('el')
	,	elementClass = window[ 'ptwElement_'+ elementCode ];
	if(elementClass) {
		var newElement = new elementClass(jQuery(htmlEl), block);
		newElement._setCode(elementCode);
		var newIterNum = block._elements.push( newElement );
		newElement.setIterNum( newIterNum - 1 );	// newIterNum == new length of _elements array, iterator number for element - is new length - 1
		return newElement;
	} else {
		if(g_ptwEdit) {
			console.log('Undefined Element ['+ elementCode+ '] !!!');
		}
	}
	return null;
});
ptwBlockBase.prototype._initElementsForArea = function(area) {
	var block = this
	,	addedElements = [];
	var initElement = function(htmlEl) {
		var newElement = block._initOneElement(htmlEl, block);
		if(newElement) {
			addedElements.push( newElement );
		}
	};
	jQuery( area ).find('.ptwEl').each(function(){
		initElement(this);
	});
	// only in admin
	if(g_ptwEdit) {
		// init table_cell elements
		var selectorElement = '.ptwCol .ptwRows .ptwCell,' +
			'.ptwCol .ptwColHeader,' +
			'.ptwCol .ptwColDesc,' +
			'.ptwCol .ptwColFooter'
		;
		jQuery(area).find(selectorElement).each(function() {
			var $currCell = jQuery(this);
			$currCell.attr('data-el', 'table_cell');
			initElement(this);
		});
	}
	if(jQuery( area ).hasClass('ptwEl')) {
		initElement( area );
	}
	this._afterInitElements();
	return addedElements;
};
ptwBlockBase.prototype._afterInitElements = function() {
};
ptwBlockBase.prototype._resetElements = function() {
	this._clearElements();
	this._initElements();
};
ptwBlockBase.prototype._clearElements = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].destroy();
		}
		this._elements = [];
	}
};
ptwBlockBase.prototype.getElements = function() {
	return this._elements;
};
ptwBlockBase.prototype.getElementByAttr = function(attrName, attrVal) {
	var isFind = null
	,	idxNum = 0
	,	idxAttrVal
	,	currElem;
	if(attrName) {
		while(!isFind && idxNum < this._elements.length) {
			currElem = this._elements[idxNum];
			if(currElem && currElem._$) {
				idxAttrVal = currElem._$.attr(attrName);
				if(idxAttrVal == attrVal) {
					isFind = currElem;
				}
			}
			idxNum++;
		}
	}

	return isFind;
};
ptwBlockBase.prototype._initHtml = function() {

};
/**
 * ID number in list of canvas elements
 * @param {numeric} iter Iterator - number in all blocks array - for this element
 */
ptwBlockBase.prototype.setIter = function(iter) {
	this._iter = iter;
};
ptwBlockBase.prototype.showLoader = function(txt) {
	var loaderHtml = jQuery('#ptwBlockLoader');
	txt = txt ? txt : loaderHtml.data('base-txt');
	loaderHtml.find('.ptwBlockLoaderTxt').html( txt );
	loaderHtml.css({
		'height': this._$.height()
	,	'top': this._$.offset().top
	}).addClass('active');
};
ptwBlockBase.prototype.hideLoader = function() {
	var loaderHtml = jQuery('#ptwBlockLoader');
	loaderHtml.removeClass('active');
};
ptwBlockBase.prototype._setFont = function(fontFamily) {
	var $fontLink = this._getFontLink();
	// If this is not standard font - it should be Google font, so - load it from Google Fonts server here

	if(toeInArrayPtw(fontFamily, ptwBuildConst.standardFonts) === false) {
		$fontLink.attr({
			'href': 'https://fonts.googleapis.com/css?family='+ encodeURIComponent(fontFamily)
		//,	'data-font-family': fontFamily
		});
	}
	this._$.css({
		'font-family': fontFamily
	});
	this.setParam('font_family', fontFamily);
};
ptwBlockBase.prototype._getFontLink = function() {
	var $link = this._$.find('link.ptwFont');
	if(!$link.size()) {
		$link = jQuery('<link class="ptwFont" rel="stylesheet" type="text/css"/>').appendTo( this._$ );
	}
	return $link;
};
/**
 * Price table block base class
 */
function ptwBlock_price_table(blockData) {
	this._increaseHoverFontPerc = 20;	// Increase font on hover effect, %
	this._$lastHoveredCol = null;
	this._refreshColsBinded = false;
	this._onloadHandle = false;
	this._isAlreadyShowed = false;
	this._isResponsiveDescInit = false;
	ptwBlock_price_table.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwBlock_price_table, ptwBlockBase);
ptwBlock_price_table.prototype._getColsContainer = function() {
	return this._$.find('.ptwColsWrapper:first');
};
ptwBlock_price_table.prototype._getCols = function(includeDescCol) {
	return this._getColsContainer().find('.ptwCol'+ (includeDescCol ? '' : ':not(.ptwTableDescCol)'));
};
ptwBlock_price_table.prototype._afterInitElements = function() {
	ptwBlock_price_table.superclass._afterInitElements.apply(this, arguments);
	if(parseInt(this.getParam('enb_hover_animation'))) {
		this._initHoverEffect();
	}
	if (this.getParam('table_align'))
		this._$.addClass('ptwTableAlign_' + this.getParam('table_align'));
	if (this.getParam('text_align'))
		this._$.addClass('ptwAlign_' + this.getParam('text_align'));
	if(!this._disableContentChange) {
		this._refreshCellsHeight();
	}
	if(!this._refreshColsBinded) {
		this._$.bind('ptwBlockContentChanged', jQuery.proxy(function(){
			this._refreshCellsHeight();
		}, this));
		this._refreshColsBinded = true;
	}
	if(!_ptwIsEditMode()) { // Not for edit mode unfortunatelly ....
		var $tooltipstedCells = this._$.find('.ptwCell[title]');

		if(this.getParam('disable_custom_tooltip_style') != '1') {
			if($tooltipstedCells && $tooltipstedCells.size()) {
				// TODO: Move this to Options and make this part more flexible
				var tooltipsterSettings = {
					contentAsHTML: true
					,	interactive: true
					,	speed: 250
					,	delay: 0
					,	animation: 'swing'
					,	maxWidth: 450
					,	position: 'top'
				};
				$tooltipstedCells.tooltipster( tooltipsterSettings );
			}
		}
		var self = this
		,	PTW_VISIBLE_SET_HEIGHT_KEY = 'PTW-VISIBLE-SET-HEIGHT-KEY';

		this._fixResponsive();

		jQuery(window).resize(function(){
			if (! self._$.is(':visible')) {
				self._$.data(PTW_VISIBLE_SET_HEIGHT_KEY, false);
			} else {
				self._fixResponsive();
				self._refreshCellsHeight();
			}
		});

		jQuery(function () {
			var isEnableLazyLoad = function () { 
				return self._$.find('img[data-lazy-src]:not(.lazyloaded)').size() > 0;
			}, checkedLazyLoadLib = false;

			if (isEnableLazyLoad())
				checkedLazyLoadLib = true;

			document.body.addEventListener("DOMSubtreeModified", function (e) {
				if (checkedLazyLoadLib 
					&& e.target.nodeType == 1 
					&& e.target.nodeName == "IMG" 
					&& jQuery.contains(self._$.get(0), e.target)
				) {
					var isLoadedImages = true;

					self._$.find('img[data-lazy-src]').each(function () {
						var $this = jQuery(this);

						if (!$this.hasClass('lazyloaded') && !$this.hasClass('lazyload'))
							isLoadedImages = false;
					});

					if (isLoadedImages) {
						checkedLazyLoadLib = false;

						self._$.find('img[data-lazy-src]').on('load', function () {
							self._fixResponsive();
							self._refreshCellsHeight();
						});
					}
				}

				if (self._isAlreadyShowed || ! self._$) return;

				if (self._$.visible()) {
			  		self._isAlreadyShowed = true;
			  		self._fixResponsive();
			  		self._refreshCellsHeight();
			  	}
			}, false);

			self.setCalcWidth();
		});
	} else {
		this.columnChidrensWidthCalc();
	}

	var self = this;

	if (! this._onloadHandle) {
		this._onloadHandle  = true;
		jQuery(window).load(function(){
			self._refreshCellsHeight();
		});
	}
};
ptwBlock_price_table.prototype._initHoverEffect = function() {
	if(_ptwIsEditMode()) {
		this.setParam('enb_hover_animation', 1);
		return;
	}
	var $cols = this._getCols()
	,	self = this;
	this._disableHoverEffect( $cols );
	$cols.bind('hover.animation', function(e){
		switch(e.type) {
			case 'mouseenter': case 'mousein':
				self._increaseHoverFont( jQuery(this) );
				break;
			case 'mouseleave': case 'mouseout':
				self._backHoverFont( jQuery(this) );
				break;
		}
	});
	this.setParam('enb_hover_animation', 1);
};
ptwBlock_price_table.prototype._increaseHoverFont = function($col) {
	var self = this;
	if(_ptwIsEditMode()) return;	// Not for edit mode unfortunatelly ....
	var $descCell = $col.find('.ptwColDesc');
	$col.height($col.height()); // Reset height on frontend.tables.js (listeners: window resize)
	$descCell.find('span').each(function(){
		var newFontSize = jQuery(this).data('new-font-size');
		if(!newFontSize) {
			var prevFontSize = jQuery(this).css('font-size')
			,	fontUnits = prevFontSize.replace(/\d+/, '')
			,	fontSize = parseInt(str_replace(prevFontSize, fontUnits, ''));
			if(fontSize && fontUnits) {
				newFontSize = Math.ceil(fontSize + (self._increaseHoverFontPerc * fontSize / 100));
				jQuery(this)
					.data('prev-font-size', prevFontSize)
					.data('font-units', fontUnits)
					.data('new-font-size', newFontSize);
			}
		}
		if(newFontSize) {
			jQuery(this).css('font-size', newFontSize+ jQuery(this).data('font-units'));
		}
	});
	if(this.getParam('is_horisontal_row_type') != '1') {
		var descHeight = $descCell.outerHeight();
		$descCell.data('prev-height', descHeight);
		$descCell.css({
			'min-height': descHeight
			,	'height': 'auto'
		});
	}
	$col.addClass('hover');
	if(_ptwIsEditMode()) {
		setTimeout(function(){
			var colElement = self.getElementByIterNum($col.data('iter-num'));
			if(colElement) {
				colElement.repositeMenu();
			}
		}, g_ptwHoverAnim);	// 300 - standard animation speed
	}
};
ptwBlock_price_table.prototype._backHoverFont = function($col) {
	if(_ptwIsEditMode()) return;	// Not for edit mode unfortunatelly ....
	$col.removeClass('hover');
	var $descCell = $col.find('.ptwColDesc');
	$descCell.find('span').each(function(){
		var prevFontSize = jQuery(this).data('prev-font-size');
		if(prevFontSize) {
			jQuery(this).css('font-size', prevFontSize);
		}
	});
	setTimeout(function(){
		$descCell.outerHeight( $descCell.data('prev-height') );
	}, 300);	// time is set in css styles, but it always is something around 300ms
};
ptwBlock_price_table.prototype._disableHoverEffect = function($cols) {
	this.setParam('enb_hover_animation', 0);
	if(_ptwIsEditMode()) return;	// Not for edit mode unfortunatelly ....
	$cols = $cols ? $cols : this._getCols();
	$cols.unbind('hover.animation');
};
ptwBlock_price_table.prototype.getColSelectors = function() {
	return {
			header: {sel: '.ptwColHeader'}
		,	desc: {sel: '.ptwColDesc'}
		,	rows: {sel: '.ptwRows'}
		,	cells: {sel: '.ptwCell'}
		,	footer: {sel: '.ptwColFooter'}
	};
};
ptwBlock_price_table.prototype.getMaxColsSizes = function( widthDesc ) {
	var $cols = this._getCols( widthDesc )
	,	sizes = this.getColSelectors();

	$cols.each(function(){
		for(var key in sizes) {
			if(key == 'rows') continue;
			var $entity = jQuery(this).find(sizes[ key ].sel);
			if($entity && $entity.size()) {
				if(key == 'cells') {
					if(!sizes[ key ].height)
						sizes[ key ].height = [];
					var cellNum = 0;
					$entity.each(function(){
						var prevHeight = jQuery(this).outerHeight();

						jQuery(this).css('height', 'auto');
						var height = jQuery(this).outerHeight();

						if(!sizes[ key ].height[ cellNum ] || sizes[ key ].height[ cellNum ] < height) {
							sizes[ key ].height[ cellNum ] = height;
						}
						jQuery(this).outerHeight( prevHeight );
						cellNum++;
					});
				} else {
					var prevHeight = $entity.outerHeight();

					$entity.css('height', 'auto');
					var height = $entity.outerHeight();

					if(!sizes[ key ].height || sizes[ key ].height < height) {
						sizes[ key ].height = height;
					}
					$entity.outerHeight( prevHeight );
				}
			}
		}
	});
	return sizes;
};
ptwBlock_price_table.prototype.getColumnWithInfo = function(strWidthAttr) {
	var trimAttr = strWidthAttr.trim();
	var number = trimAttr.match('\\d+');
	var isPerc = trimAttr.match('%');
	var isPx = trimAttr.match('\\d+');
	if(number === null || (isPerc === null && isPx === null)) {
		return null;
	}
	return new Object({
		'num': (number.length && number.length > 0 && !isNaN(parseInt(number[0]))) ? parseInt(number[0]) : null,
		'isPerc': isPerc === null ? false : true
	});
};
ptwBlock_price_table.prototype.setColsWidth = function(width, perc) {
	var thatObj = this;
	if(thatObj.getParam('is_horisontal_row_type') != '1') {
		if (this.getParam('dsbl_responsive') === '1') {
			var tableWidth = this._$.width(),
				fixedValueTableWidth = this._$.width(),
				$cols = this._getCols(true),
				notSettedColumnWidthArr = new Array();
			$cols.each(function () {
				var col1 = jQuery(this);
				if (col1.length > 0 && col1[0].style && col1[0].style.width) {
					var colWidthObj = thatObj.getColumnWithInfo(col1[0].style.width);
					if (colWidthObj && 'num' in colWidthObj && 'isPerc' in colWidthObj) {
						var calcColWidth = 0;
						if (colWidthObj.isPerc) {
							calcColWidth = fixedValueTableWidth * colWidthObj.num / 100;
						} else {
							calcColWidth = colWidthObj.num;
						}
						var colPdL = parseFloat(col1.css('padding-left')),
							colPdR = parseFloat(col1.css('padding-right')),
							colMgL = parseFloat(col1.css('margin-left')),
							colMgR = parseFloat(col1.css('margin-right')),
							colSumMarginPadding = 0;
						if (!isNaN(colPdL)) {
							colSumMarginPadding += colPdL;
						}
						if (!isNaN(colPdR)) {
							colSumMarginPadding += colPdR;
						}
						if (!isNaN(colMgL)) {
							colSumMarginPadding += colMgL;
						}
						if (!isNaN(colMgR)) {
							colSumMarginPadding += colMgR;
						}
						tableWidth -= calcColWidth;
						calcColWidth = Math.floor(calcColWidth - colSumMarginPadding);
						if (calcColWidth < 0) {
							calcColWidth = 0;
						}
						col1.width(calcColWidth);
					} else {
						notSettedColumnWidthArr[notSettedColumnWidthArr.length] = col1;
					}
				} else {
					notSettedColumnWidthArr[notSettedColumnWidthArr.length] = col1;
				}
			});
			if (tableWidth > 0 && notSettedColumnWidthArr.length > 0) {
				var calcWidthForNsCol = Math.round(tableWidth / notSettedColumnWidthArr.length);
				for (var oneNsColumn in notSettedColumnWidthArr) {
					// set width for Other columns
					notSettedColumnWidthArr[oneNsColumn].width(calcWidthForNsCol);
				}
			}
		} else {
			width = parseFloat(width);
			if (width) {
				if (!perc) {
					this.setParam('col_width', width);
				}
				var $cols = this._getCols(true);
				if (perc) {
					width += '%';
				} else {
					width += 'px';
				}
				$cols.css({
					'width': width
				});
			}
		}
	} else {
		this.columnChidrensWidthCalc();
	}
};
ptwBlock_price_table.prototype.columnChidrensWidthCalc = function() {
	if(this.getParam('is_horisontal_row_type') != '1') {
		return;
	}
	// only for HORIZONTAL ROW
	var $cols = this._getCols(true);
	$cols.each(function (ind, oneCol) {
		var currColumn = jQuery(oneCol)
		,	emptyChilds = currColumn.find('.ptwTableElementContent').children(':not(:has(">div")):not(".ptwColBadge")')
		,	level1Childs = currColumn.find('.ptwTableElementContent').children(':has(">div"):not(".ptwColBadge")')
		,	level1ChildRows = currColumn.find('.ptwTableElementContent').children('.ptwRows')
		,	level2ChildRows = level1ChildRows.children()
		,	allChildCount = level1Childs.length
		,	level2ChildCount = 1;

		if(level1ChildRows.length > 0 && level2ChildRows.length > 0) {
			allChildCount += level2ChildRows.length -1;
			level2ChildCount = level2ChildRows.length;
		}
		//
		emptyChilds.css({
			'width': "0%",
			'margin': '0',
			'padding': '0',
		});
		var oneChildWidth = Math.floor(95 / allChildCount);

		level1Childs.css('width', oneChildWidth + '%');
		var widthInPixel = level1Childs.css('width');
		level1ChildRows.css('width', (level2ChildCount*oneChildWidth+2) + '%');
		level2ChildRows.css('width', widthInPixel);
	});
}
ptwBlock_price_table.prototype.checkColWidthPerc = function() {
	if(this.getParam('calc_width') === 'table') {
		this.setColWidthPerc();
	}
};
ptwBlock_price_table.prototype.setColWidthPerc = function() {
	var $cols = this._getCols( parseInt(this.getParam('enb_desc_col')) );
	this.setColsWidth( 100 / $cols.size(), true );
};
ptwBlock_price_table.prototype.setTableWidth = function(width, measure) {
	if(width && parseInt(width)) {
		width = parseInt(width);
		this.setParam('table_width', width);
	} else {
		width = this.getParam('table_width');
	}
	if(measure) {
		this.setParam('table_width_measure', measure);
	} else {
		measure = this.getParam('table_width_measure');
	}
	this._$.width( width+ measure );

};
ptwBlock_price_table.prototype.setTableVertPadding = function(padding, measure) {
	var tmpVal = parseInt(padding);
	if(padding && !isNaN(tmpVal)) {
		padding = tmpVal;
		this.setParam('vert_padding', padding);
	} else {
		padding = this.getParam('vert_padding');
	}
	if(measure) {
		this.setParam('vert_padding_measure', measure);
	} else {
		measure = this.getParam('vert_padding_measure');
	}
	this._$.find('.ptwCol').css('paddingBottom', padding + 'px');
};
ptwBlock_price_table.prototype.setCalcWidth = function(type) {
	if(type) {
		this.setParam('calc_width', type);
	} else {
		type = this.getParam('calc_width');
	}
	switch(type) {
		case 'table':
			this.setTableWidth();
			this.setColWidthPerc();
			break;
		case 'col':
			var enb_desc_col = this.getParam('enb_desc_col')  != 0 ? true : false;
			this._$.width(this._getCols(enb_desc_col).size() * this.getParam('col_width') );
			this.setColsWidth( this.getParam('col_width') );
			break;
	}
};
ptwBlock_price_table.prototype._fixResponsive = function() {
	if(this.getParam('is_horisontal_row_type') == '1') {
		return;
	}
	var $parent = this._$.parents('.ptwTableFrontedShell:first').parent()
	,	parentWidth = $parent.width()
	,	widthMeasure = this.getParam('table_width_measure')
	,	calcWidth = this.getParam('calc_width')
	,	includeDesc = parseInt(this.getParam('enb_desc_col'))
	,	$cols = this._getCols( includeDesc )
	,	actualTblWidth = this._$.width()
	,	criticalColWidth = isNaN(parseInt(this.getParam('resp_min_col_width'))) ? 150 : parseInt(this.getParam('resp_min_col_width'))
	,	dsblResponsive = parseInt(this.getParam('dsbl_responsive'));
	this._$.removeClass('ptwBlockMobile');

	switch(calcWidth) {
		case 'table':
			switch(widthMeasure) {
				case '%':
					var self =  this
					,	removeOtherDescCol = function () {
						if (!dsblResponsive 
							&& !_ptwIsEditMode()
							&& self._$.find('.ptwTableDescCol').size() > 1
							&& includeDesc) 
						{
							var $descCols = self._$.find('.ptwTableDescCol')
							,	firstCol = false;


							$descCols.each(function () {
								var $this = jQuery(this);

								if (! firstCol) {
									firstCol = true;

									return;
								}

								$this.remove();
							});
						}
					};

					removeOtherDescCol();

					$cols = this._getCols( includeDesc );

					var colsNum = $cols.size()
					,	currWidth = actualTblWidth / colsNum;

					if(currWidth <= criticalColWidth && !dsblResponsive) {
						$cols.css('width', '100%');

						if (!_ptwIsEditMode() && includeDesc) {
							var $descColumn = this._$.find('.ptwTableDescCol')
							,	$columns = this._$.find('.ptwCol:not(.ptwTableDescCol)')
							,	firstCol = false;

							$columns.each(function () {
								var $this = jQuery(this);

								if (! firstCol) {
									firstCol = true;
									return;
								}

								$descColumn.clone()
									.insertBefore($this);
							});

							this._isResponsiveDescInit = true;
							this._$.find('.ptwCol').css('width', '50%');
						}

						this._$.addClass('ptwBlockMobile');
						this.setParam('went_to_responsive', 1);
					} else {
						if(this.getParam('went_to_responsive')) {
							this.setColWidthPerc();
							this.setParam('went_to_responsive', 0);
						}
					}
					break;
				case 'px':
					if(actualTblWidth > parentWidth) {
						this.setParam('went_to_responsive', this.getParam('table_width'));
						this.setTableWidth(100, '%');	// make it 100% in this case
						this._fixResponsive();	// Repeat - to check case '%':
					} else if(this.getParam('went_to_responsive')) {
						this.setTableWidth(this.getParam('went_to_responsive'), 'px');	// Back to px width
						this.setParam('went_to_responsive', 0);
					}
					break;
			}
			break;
		case 'col':
			var colsNum = $cols.size()
			,	currWidth = parseFloat(this.getParam('col_width'));
			if(currWidth * colsNum >= parentWidth) {
				this.setParam('went_to_responsive', currWidth);
				this.setParam('table_width', 100);	// Set table width to 100%
				this.setParam('table_width_measure', '%');
				this.setCalcWidth('table');
				this._fixResponsive();	// Repeat - to check case '%':
			} else if(this.getParam('went_to_responsive')) {
				this.setCalcWidth('col');
				this.setParam('col_width', this.getParam('went_to_responsive'));	// Back to px width
				this.setParam('went_to_responsive', 0);
			}
			break;
	}
};
ptwBlock_price_table.prototype._refreshCellsHeight = function() {
	// Really important  - keep all this functionality as light as possible, as it can slow down whole builder work
	//console.time('_refreshCellsHeight');
	var $cols = this._getCols( true )
	,	self = this
	,	sizes = this.getMaxColsSizes( true );
	$cols.each(function(){
		for(var key in sizes) {
			var $entity = jQuery(this).find(sizes[ key ].sel);
			if(self.getParam('is_horisontal_row_type') == '1') {
				$entity.css({'height': 'auto'});
			} else {
				if(key == 'rows') {
					$entity.css({'height': 'auto'});
					continue;
				}
				if($entity && $entity.size()) {
					if(key == 'cells') {
						var cellNum = 0;
						$entity.each(function(){
							jQuery(this).css('height', sizes[ key ].height[ cellNum ] );
							cellNum++;
						});
					} else {
						$entity.outerHeight( sizes[ key ].height );

						if ($entity.outerHeight() != sizes[ key ].height) {
							$entity.css('height', sizes[ key ].height);
						}
					}
				}
			}
		}
	});
	//console.timeEnd('_refreshCellsHeight');
};