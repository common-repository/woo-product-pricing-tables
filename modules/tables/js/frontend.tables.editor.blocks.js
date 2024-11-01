/**
 * Base block object - for extending
 * @param {object} blockData all block data from database (block database row)
 */
ptwBlockBase.prototype.destroy = function() {
	this._clearElements();
	this._$.slideUp(this._animationSpeed, jQuery.proxy(function(){
		this._$.remove();
		g_ptwBlockFabric.removeBlockByIter( this.getIter() );
		_ptwSaveCanvas();
	}, this));
};
ptwBlockBase.prototype.build = function(params) {
	params = params || {};
	var innerHtmlContent = '';
	if(this._data.css && this._data.css != '') {
		innerHtmlContent += '<style type="text/css" class="ptwBlockStyle">'+ this._data.css+ '</style>';
	}
	if(this._data.html && this._data.html != '') {
		innerHtmlContent += '<div class="ptwBlockContent">'+ this._data.html+ '</div>';
	}
	innerHtmlContent = '<div class="ptwBlock" id="{{block.view_id}}">'+ innerHtmlContent+ '</div>';
	if(!this._data.session_id) {
		this._data.session_id = mtRand(1, 999999);
	}
	if(!this._data.view_id) {
		this._data.view_id = 'ptwBlock_'+ this._data.session_id;
	}
	var template = twig({
		data: innerHtmlContent
	});
	var generatedHtml = template.render({
		block: this._data
	});
	this._$ = jQuery(generatedHtml);
	if(params.insertAfter) {
		this._$.insertAfter( params.insertAfter );
	}
	this._initElements();
	this._initHtml();
};
ptwBlockBase.prototype.set = function(key, value) {
	this._data[ key ] = value;
};
ptwBlockBase.prototype.setData = function(data) {
	this._data = data;
};
ptwBlockBase.prototype.getData = function() {
	return this._data;
};
ptwBlockBase.prototype.appendToCanvas = function() {
	this._$.appendTo('#ptwCanvas');
};
ptwBlockBase.prototype.getElementByIterNum = function(iterNum) {
	return this._elements[ iterNum ];
};
ptwBlockBase.prototype.removeElementByIterNum = function(iterNum) {
	this._elements.splice( iterNum, 1 );
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].setIterNum( i );
		}
	}
};
ptwBlockBase.prototype.destroyElementByIterNum = function(iterNum, clb) {
	this.getElementByIterNum( iterNum ).destroy( clb );	// It will call removeElementByIterNum() inside element destroy method
};
ptwBlockBase.prototype._initHtml = function() {
	this._beforeInitHtml();
};
ptwBlockBase.prototype._beforeInitHtml = function() {
	
};
ptwBlockBase.prototype._rebuildCss = function() {
	var template = twig({
		data: this._data.css
	});
	var generatedHtml = template.render({
		table: this._data
	});
	this.getStyle().html( generatedHtml );
};
ptwBlockBase.prototype.getStyle = function() {
	return this._$.find('style.ptwBlockStyle');
};
ptwBlockBase.prototype.setTaggedStyle = function(style, tag, elData) {
	this.removeTaggedStyle( tag );
	var $style = this.getStyle()
	,	styleHtml = $style.html()
	,	tags = this._getTaggedStyleStartEnd( tag );
	
	var template = twig({
		data: style
	});
	var generatedStyle = template.render({
		el: elData
	,	table: this._data
	}),	fullGeneratedStyleTag = tags.start+ "\n"+ generatedStyle+ "\n"+ tags.end;
	if (generatedStyle == undefined || !generatedStyle) return;
	$style.html(styleHtml+ fullGeneratedStyleTag);
	this.set('css', this.get('css')+ this._revertReplaceContent(fullGeneratedStyleTag));
};
ptwBlockBase.prototype.removeTaggedStyle = function(tag, params) {
	params = params || {};
	var tags = this._getTaggedStyleStartEnd(tag, true)
	,	$style = params.$style ? params.$style : this.getStyle()
	,	styleHtml = params.styleHtml ? params.styleHtml : $style.html()
	,	replaceRegExp = new RegExp(tags.start+ '(.|[\n\r])+'+ tags.end, 'gmi');
	$style.html( styleHtml.replace(replaceRegExp, '') );
	this.set('css', this.get('css').replace(replaceRegExp, ''));
};
ptwBlockBase.prototype.getTaggedStyle = function(tag) {
	// TODO: Finish this method
	var tags = typeof(tag) === 'string' ? this._getTaggedStyleStartEnd(tag) : tag;
};
ptwBlockBase.prototype._getTaggedStyleStartEnd = function(tag, forRegExp) {
	return {
		start: forRegExp ? '\\/\\*start for '+ tag+ '\\*\\/' : '/*start for '+ tag+ '*/'
	,	end: forRegExp ? '\\/\\*end for '+ tag+ '\\*\\/' : '/*end for '+ tag+ '*/'
	};
};
ptwBlockBase.prototype._initMenuItem = function(newMenuItemHtml, item) {
	if(this['_initMenuItem_'+ item.type] && typeof(this['_initMenuItem_'+ item.type]) === 'function') {
		var menuItemName = this.getParam('menu_item_name_'+ item.type);
		if(menuItemName && menuItemName != '') {
			newMenuItemHtml.find('.ptwBlockMenuElTitle').html( menuItemName );
		}
		this['_initMenuItem_'+ item.type]( newMenuItemHtml, item );
	}
};
ptwBlockBase.prototype._initMenuItem_align = function(newMenuItemHtml, item) {
	if(this._data.params && this._data.params.align) {
		//newMenuItemHtml.find('input[name="params[align]"]').val( this._data.params.align.val );
		//newMenuItemHtml.find('.ptwBlockMenuElElignBtn').removeClass('active');
		//newMenuItemHtml.find('.ptwBlockMenuElElignBtn[data-align="'+ this._data.params.align.val+ '"]').addClass('active');
		this._setAlign( this._data.params.align.val, true, newMenuItemHtml );
	}
	var self = this;
	newMenuItemHtml.find('.ptwBlockMenuElElignBtn').click(function(){
		self._setAlign( jQuery(this).data('align') );
	});
};
ptwBlockBase.prototype._clickMenuItem_align = function(options) {
	return false;
};
ptwBlockBase.prototype._setAlign = function( align, ignoreAutoSave, menuItemHtml ) {
	var possibleAligns = ['left', 'center', 'right'];
	for(var i in possibleAligns) {
		this._$.removeClass('ptwAlign_'+ possibleAligns[ i ]);
	}
	this._$.addClass('ptwAlign_'+ align);
	this.setParam('align', align);
	
	if(!menuItemHtml) {
		var menuOpt = this._$.data('_contentMenuOpt');
		menuItemHtml = menuOpt.items.align.$node;
	}
	menuItemHtml.find('input[name="params[align]"]').val( align );
	menuItemHtml.find('.ptwBlockMenuElElignBtn').removeClass('active');
	menuItemHtml.find('.ptwBlockMenuElElignBtn[data-align="'+ align+ '"]').addClass('active');
	
	if(!ignoreAutoSave) {
		_ptwSaveCanvas();
	}
};
ptwBlockBase.prototype._initMenuItem_bg_img = function(newMenuItemHtml, item) {
	if(this._data.params && this._data.params.bg_img_enb && parseInt(this._data.params.bg_img_enb.val)) {
		newMenuItemHtml.find('input[name="params[bg_img_enb]"]').attr('checked', 'checked');
	}
	var self = this;
	newMenuItemHtml.find('input[name="params[bg_img_enb]"]').change(function(){
		self.setParam('bg_img_enb', jQuery(this).attr('checked') ? 1 : 0);
		self._updateBgImg();
	});
};
ptwBlockBase.prototype._clickMenuItem_bg_img = function(options) {
	var self = this;
	ptwCallWpMedia({
		id: this._$.attr('id')
	,	clb: function(optw, attach, imgUrl) {
			// we will use full image url from attach.url always here (not image with selected size imgUrl) - as this is bg image
			// but if you see really big issue with this - just try to do it better - but don't broke everything:)
			self.setParam('bg_img', attach.url);
			self._updateBgImg();
		}
	});
};
ptwBlockBase.prototype._updateBgImg = function( ignoreAutoSave ) {
	this._rebuildCss();

	if(!ignoreAutoSave) {
		_ptwSaveCanvas();
	}
};
ptwBlockBase.prototype._clickMenuItem = function(key, options) {
	if(this['_clickMenuItem_'+ key] && typeof(this['_clickMenuItem_'+ key]) === 'function') {
		return this['_clickMenuItem_'+ key]( options );
	}
};
ptwBlockBase.prototype.getContent = function() {
	return this._$.find('.ptwBlockContent:first');
};
ptwBlockBase.prototype._revertReplaceContent = function(content) {
	var revertReplace = [
		{key: 'view_id'}
	];
	for(var i = 0; i < revertReplace.length; i++) {
		var key = revertReplace[ i ].key
		,	value = this.get( key )
		,	replaceFrom = [ value ]
		,	replaceTo = revertReplace[i].raw ? '{{table.'+ key+ '|raw}}' : '{{table.'+ key+ '}}';
		if(typeof(value) === 'string' && revertReplace[i].raw) {
			replaceFrom.push( value.replace(/\s+\/>/g, '>') );
		}
		for(var j = 0; j < replaceFrom.length; j++) {
			content = str_replace(content, replaceFrom[ j ], replaceTo);
		}
	}
	return content;
};
ptwBlockBase.prototype.getHtml = function() {
	var $content = this.getContent().clone();
	var html = $content.html();
	return this._revertReplaceContent( html );
};
ptwBlockBase.prototype.getCss = function() {
	var css = this.getStyle().html();
	return this._revertReplaceContent( css );
};
ptwBlockBase.prototype.getIter = function() {
	return this._iter;
};
ptwBlockBase.prototype.beforeSave = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].beforeSave();
		}
	}
};
ptwBlockBase.prototype.afterSave = function() {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			this._elements[ i ].afterSave();
		}
	}
};
ptwBlockBase.prototype.mapElementsFromHtml = function($html, clb) {
	var self = this
	,	mapCall = function($el) {

		var element = self.getElementByIterNum( jQuery($el).data('iter-num') );
		if(element && element[ clb ]) {
			element[ clb ]();
		}
	};
	$html.find('.ptwEl').each(function(){
		mapCall( this );
	});
	if($html.hasClass('ptwEl')) {
		mapCall( $html );
	}
};
ptwBlockBase.prototype.replaceElement = function(element, toParamCode, type) {
	// Save current element content - in new element internal data
	var oldElContent = element.$().get(0).outerHTML
	,	oldElType = element.get('type')
	,	savedContent = element.$().data('pre-el-content');
	if(!savedContent)
		savedContent = {};
	savedContent[ oldElType ] = oldElContent;
	// Check if there are already saved prev. data for this type of element

	var newHtmlContent = '';

	if (type == 'btn') {
		var existsBtnHTML = null;

		for (var i in this._elements) {
			if (this._elements[i] instanceof ptwElement_btn && this._elements[i]._$.size()) {
				existsBtnHTML = this._elements[i]._$.get(0).outerHTML;

				break;
			}
		}

		if (existsBtnHTML)
			newHtmlContent = existsBtnHTML;
		else
			newHtmlContent = jQuery('#ptwElementButtonDefaultTemplate').removeAttr('id').get(0).outerHTML;
	} else {
		newHtmlContent = savedContent[ type ] ? savedContent[ type ] : this.getParam( toParamCode );
	}

	// Create and append new element HTML after current element
	var $newHtml = jQuery( newHtmlContent );
	$newHtml.insertAfter( element.$() );
	// Destroy current element
	var self = this;
	this.destroyElementByIterNum(element.getIterNum(), function(){
		self._disableContentChange = true;
		// Init new element after prev. one was removed
		var newElements = self._initElementsForArea( $newHtml );
		for(var i = 0; i < newElements.length; i++) {
			// Save prev. updated content info - in new elements $()
			newElements[ i ].$().data('pre-el-content', savedContent);
		}
		self._disableContentChange = false;
		self.contentChanged();
	});
};
ptwBlockBase.prototype.contentChanged = function() {
	if(!this._disableContentChange) {
		this._$.trigger('ptwBlockContentChanged', this);
	}
};
ptwBlockBase.prototype.hideElementsMenus = function( showEvent ) {
	if(this._elements && this._elements.length) {
		for(var i = 0; i < this._elements.length; i++) {
			if(this._elements[ i ].menuInAnimation()) return;	// Menu is in animation - so we don't need to hide it
			if(showEvent && showEvent != this._elements[ i ].getMenuShowEvent()) continue;
			this._elements[ i ].hideMenu();
		}
	}
};
/**
 * Price table block base class
 */
ptwBlock_price_table.prototype.addColumn = function() {
	var $colsWrap = this._getColsContainer()
	,	$cols = this._getCols()
	,	$col = null
	,	self = this;
	if($cols.size()) {
		var $lastCol = $cols.last();
		this.mapElementsFromHtml($lastCol, 'beforeSave');
		$col = $cols.last().clone();
		this.mapElementsFromHtml($lastCol, 'afterSave');
	} else {
		$col = jQuery( this.getParam('new_column_html') );
	}
	$col.removeAttr('data-col-product-id');
	$colsWrap.append( $col );
	this._initElementsForArea( $col );
	this._initCellsEdit( $col.find('.ptwCell') );
	this._switchHeadRow({ $cols: $col });
	this._switchDescRow({ $cols: $col });
	this._switchFootRow({ $cols: $col });
	this._initCellsMovable( $col );
	this._refreshColNumbers();
	$cols = this._getCols();
	$cols.each(function(){
		var element = self.getElementByIterNum( jQuery(this).data('iter-num') );
		if(element) {
			// Update CSS style if required for updated classes
			element._setColor();
		}
	});
	this.checkColWidthPerc();
};
ptwBlock_price_table.prototype._initCellsEdit = function( $cell ) {
	var block = this;
    // #215
    jQuery('.ptwColHeader').addClass('ptwCell');
	// #215
	$cell = $cell ? $cell : this._$.find('.ptwCell, .ptwColHeader');
	$cell.each(function(){
		var $currentCell = jQuery(this);

		// Append cell buttons
		var $btnsShell = jQuery(this).find('.ptwCellEditBtnsShell');
		if($btnsShell.size()) {
			$btnsShell.html('');
		} else {
			$btnsShell = jQuery('<div class="ptwCellEditBtnsShell ptwShowSmooth" />').appendTo( this );
		}
		jQuery(this).on('click', function() {
			clearTimeout(jQuery(this).data('btn-shell-hide-timeout'));
			$btnsShell.addClass('active');

			$btnsShell.find('.ptwTextAlignColumn .ptwTextAlignSwitch.active')
				.removeClass('active');

			switch ($currentCell.css('text-align')) {
				case 'left':
					$btnsShell.find('.ptwTextAlignColumn .ptwTextAlignSwitch[data-align="left"]')
						.addClass('active');
				break;
				case 'center':
					$btnsShell.find('.ptwTextAlignColumn .ptwTextAlignSwitch[data-align="center"]')
						.addClass('active');
				break;
				case 'right':
					$btnsShell.find('.ptwTextAlignColumn .ptwTextAlignSwitch[data-align="right"]')
						.addClass('active');
				break;
			}
		});
		jQuery(this).hover(function(){}, function() {
			$currentCell.data('btn-shell-hide-timeout', setTimeout(function(){
				$btnsShell.removeClass('active');
				$btnsShell.find('.ptwTooltipEditWnd').removeClass('active');
			}, 150));
		});
		// Move cell btn
		jQuery('#ptwMoveCellBtnExl').clone().removeAttr('id').appendTo( $btnsShell );
 
		jQuery('#ptwTextAlignColumn')
			.clone()
			.removeAttr('id')
			.appendTo( $btnsShell )
			.on('click', '.ptwTextAlignSwitch', function () {
				var $this = jQuery(this)
				,	$cell = jQuery(this).parents('.ptwCell:first')
				,	align = $this.attr('data-align');

				align = align.charAt(0).toUpperCase() + align.substr(1);

				$this.parent()
					.find('.ptwTextAlignSwitch')
					.removeClass('active');

				$this.addClass('active');

				$cell.removeClassWild('ptwCellAlign*');

				$cell.addClass('ptwCellAlign' + align);
			});

		// Add row after btn
		jQuery('#ptwAddRowAfterBtnExl').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			block.addRow( jQuery(this).parents('.ptwCell:first').index(), true );
			return false;
		});
		// Add row before btn
		jQuery('#ptwAddRowBeforeBtnExl').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			block.addRow( jQuery(this).parents('.ptwCell:first').index(), false );
			return false;
		});
		
		jQuery('#ptwAddOneCellInColumn').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			var cell = jQuery(this).parents('.ptwCell:first').index()
			,	col = jQuery(this).closest('.ptwCol').index();
			
			block.addOneRow(cell, col, true);

			return false;
		});

		// Combining rows
		jQuery('#ptwCombiningPrevBtnExl').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			var cell = jQuery(this).closest('.ptwCol')
									.find('.ptwRows .ptwCell')
									.get(
										jQuery(this)
											.parents('.ptwCell:first')
											.index()
			);

			block.combiningRow(cell);
			return false;
		});
		jQuery('#ptwCombiningNextBtnExl').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			var cell = jQuery(this).closest('.ptwCol')
									.find('.ptwRows .ptwCell')
									.get(
										jQuery(this)
											.parents('.ptwCell:first')
											.index()
			);

			block.combiningRow(cell, true);
			return false;
		});

		// Tooltips edit buttons manipulations
		var $tooltipBtnShell = jQuery('#ptwTooltipEditBtnShellExl').clone().removeAttr('id').appendTo( $btnsShell );
		$tooltipBtnShell.find('.ptwTooltipEditBtn').click(function(){
			var $tooltipWnd = $tooltipBtnShell.find('.ptwTooltipEditWnd');
			if($tooltipWnd.hasClass('active')) {
				$tooltipWnd.removeClass('active') 
			} else {
				$tooltipWnd.find('[name=tooltip]').val( jQuery(this).parents('.ptwCell:first').attr('title') );
				$tooltipWnd.addClass('active');
			}
			return false;
		});
		$tooltipBtnShell.find('[name=tooltip]').change(function(){
			var tooltip = jQuery.trim( jQuery(this).val() );
			if(tooltip && tooltip != '') {
				jQuery(this).parents('.ptwCell:first').attr('title', tooltip);
			} else {
				jQuery(this).parents('.ptwCell:first').removeAttr('title');
			}
		});
		// Remove btn
		jQuery('#ptwRemoveRowBtnExl').clone().removeAttr('id').appendTo( $btnsShell ).click(function(){
			block.removeRow( jQuery(this).parents('.ptwCell:first') );
			return false;
		});
	});
};
ptwBlock_price_table.prototype._destroyCellsEdit = function( $cell ) {
	this._$.find('.ptwCellEditBtnsShell').remove();
};
ptwBlock_price_table.prototype.getColsNum = function() {
	return this._getCols().size();
};
ptwBlock_price_table.prototype.addPtwEl = function(parent) {
	var $cellAppend = jQuery(this.getParam('new_cell_html'));
	parent.before($cellAppend);
	this._disableContentChange = true;
	this._initElementsForArea($cellAppend);
	this._initCellsEdit($cellAppend);
	this._disableContentChange = false;
	this.contentChanged();
};
ptwBlock_price_table.prototype.addOneRow = function (positionCell, positionCol, isAfter) {
	var $cellAppend = jQuery(this.getParam('new_cell_html'))
	,	columnObject
	, 	$cellElement;

	for (var i in this._elements) {
		var elementObject = this._elements[i];

		if (elementObject instanceof ptwElement_table_col && elementObject._colNum == positionCol) {
			columnObject = elementObject;

			break;
		}
	}

	if (! columnObject) return;

	$cellElement = columnObject._$.find(this.getColSelectors().cells.sel).eq(positionCell);

	if (! $cellElement) return;

	this._disableContentChange = true;
	
	if (isAfter)
		$cellAppend.insertAfter($cellElement);
	else
		$cellAppend.insertBefore($cellElement);

	this._initElementsForArea($cellAppend);
	
	this._initCellsEdit($cellAppend);

	this._disableContentChange = false;

	this.contentChanged();
};
ptwBlock_price_table.prototype.addRow = function(positionIndex, after) {
	this._disableContentChange = true;
	var $cols = this._getCols( true )
	,	self = this;
	$cols.each(function(){
		var $rowsWrap = jQuery(this).find('.ptwRows')
		,	$cell = null;
		if(typeof(positionIndex) === 'undefined') {
			$cell = jQuery( self.getParam('new_cell_html') );
			$rowsWrap.append( $cell );
		} else {
			var $positionCell = $rowsWrap.find('.ptwCell:eq('+ positionIndex+ ')');
			self.mapElementsFromHtml($positionCell, 'beforeSave');
			$cell = $positionCell.clone();
			self.mapElementsFromHtml($positionCell, 'afterSave');
			after 
				? $positionCell.after( $cell )
				: $positionCell.before( $cell );
		}
		self._initElementsForArea( $cell );
		self._initCellsEdit( $cell );
	});
	this._disableContentChange = false;
	this.contentChanged();
};
ptwBlock_price_table.prototype.addRowToOneColumn = function($columnTo, positionIndex, after) {
	this._disableContentChange = true;

	var $rowsWrap = $columnTo.find('.ptwRows')
	,	$cell = null;
	if(typeof(positionIndex) === 'undefined') {
		$cell = jQuery( this.getParam('new_cell_html') );
		$rowsWrap.append( $cell );
	} else {
		var $positionCell = $rowsWrap.find('.ptwCell:eq('+ positionIndex+ ')');
		this.mapElementsFromHtml($positionCell, 'beforeSave');
		$cell = $positionCell.clone();
		this.mapElementsFromHtml($positionCell, 'afterSave');
		after
			? $positionCell.after( $cell )
			: $positionCell.before( $cell );
	}
	this._initElementsForArea( $cell );
	this._initCellsEdit( $cell );

	this._disableContentChange = false;
	this.contentChanged();
};
ptwBlock_price_table.prototype.combiningRow = function (cell1, next) {
	var $cell1 = jQuery(cell1);
	var $cell2 = next ? jQuery($cell1.next('.ptwCell')) : jQuery($cell1.prev('.ptwCell'));

	if ($cell2.length == 0) return;

	this._disableContentChange = true;
	var c1, c2;

	if (next) {
		c1 = $cell1;
		c2 = $cell2;
	} else {
		c1 = $cell2;
		c2 = $cell1;
	}

	this.mapElementsFromHtml(c1, 'beforeSave');
	this.mapElementsFromHtml(c2, 'beforeSave');

	c1.find('.ptwCellEditBtnsShell').remove();
	c2.find('.ptwCellEditBtnsShell').remove();
	c1.html(c1.html() + c2.html());
	c2.remove();
	
	this.mapElementsFromHtml(c1, 'afterSave');
	this.mapElementsFromHtml(c2, 'afterSave');

	this._initElementsForArea( c1 );
	this._initCellsEdit( c1 );

	this._disableContentChange = false;
	this.contentChanged();
};
ptwBlock_price_table.prototype.removeRow = function( $cell ) {
	var block = this
	,	cellIndex = $cell && typeof($cell) === 'object' ? $cell.index() : false
	,	$cols = this._getCols( true );
	if(cellIndex === false) {
		cellIndex = typeof($cell) === 'number' ? $cell : $cols.last().find('.ptwCell').size() - 1;
	}
	if(block._data && block._data.params && block._data.params.is_horisontal_row_type && block._data.params.is_horisontal_row_type.val && block._data.params.is_horisontal_row_type.val == 1) {
		setTimeout(function(){
			$cell.animateRemovePtw( g_ptwAnimationSpeed );
		}, g_ptwAnimationSpeed);
	} else {
		$cols.each(function(){
			var $rowsWrap = jQuery(this).find('.ptwRows')
				,	$removeCell = $rowsWrap.find('.ptwCell:eq('+ cellIndex+ ')');
			if($removeCell && $removeCell.size()) {
				var $elements = $removeCell.find('.ptwEl');
				$elements.each(function(){
					block.removeElementByIterNum( jQuery(this).data('iter-num') );
				});
				setTimeout(function(){
					$removeCell.animateRemovePtw( g_ptwAnimationSpeed );
				}, g_ptwAnimationSpeed);	// Wait animation speed time to finally remove cell html element
			}
		});
	}
	setTimeout(function(){
		block.contentChanged();
	}, 2 * g_ptwAnimationSpeed + 50);	// See prev lines - timeout for g_ptwAnimationSpeed + animation remove for same time g_ptwAnimationSpeed
};
ptwBlock_price_table.prototype.removeCol = function( $col ) {
	var $cols = this._getCols();
	if($cols.size()) {
		var $removeCol = null;
		if(typeof($col) === 'object') {	// Colum jquery obj specified
			$removeCol = $col;
		} else if(typeof($col) === 'number') {	// Column item number specified
			$removeCol = $cols.filter(':eq('+ $col+ ')');
		} else {	// Nothing was specified - remove last column in set
			$removeCol = $cols.last();
		}
		var colElement = this.getElementByIterNum( $removeCol.data('iter-num') );
		if(colElement) {
			var self = this;
			colElement.destroy(function(){
				self.contentChanged();
			});
		}
	}
};
ptwBlock_price_table.prototype.getRowsNum = function() {
	return this._getCols().first().find('.ptwRows').find('.ptwCell').size();
};
ptwBlock_price_table.prototype._initHtml = function() {
	ptwBlock_price_table.superclass._initHtml.apply(this, arguments);
	var $colsWrap = this._getColsContainer()
	,	self = this
	,   original_id = self._data.original_id
	,   axis = 'x';
	
	if(original_id == '39'){
		axis = 'y';
	}
	
	$colsWrap.sortable({
		items: '.ptwCol:not(.ptwTableDescCol)'
	,	axis: axis
	,	handle: '.ptwMoveHandler'
	,	start: function(e, ui) {
			_ptwSetSortInProgress( true );
			var dragElement = self.getElementByIterNum( ui.item.data('iter-num') );
			if(dragElement) {
				dragElement.onSortStart();
			}
		}
	,	stop: function(e, ui) {
			_ptwSetSortInProgress( false );
			var dragElement = self.getElementByIterNum( ui.item.data('iter-num') );
			if(dragElement) {
				dragElement.onSortStop();
			}

			var desiredOrder = [],
				unsortedCols = [];

			var $cols = self._getCols(),
				num = 1;

			$cols.each(function(){
				var element = self.getElementByIterNum( jQuery(this).data('iter-num') );
				
				if(element) {
					if (element._colNum != num) {
						desiredOrder.push(num);
						unsortedCols.push(element);
					}
					var classes = jQuery(this).attr('class')
					,	newClasses = '';
					newClasses = (classes.replace(/ptwCol\-\d+/g, '')+ ' ptwCol-'+ num).replace(/\s+/g, ' ');
					jQuery(this).attr('class', newClasses);
				}

				num++;
			});

			var blockCss = self.get('css'),
				resultCss = '';
			for (var i = 0; i < unsortedCols.length; i++) {
				var el = unsortedCols[i],
					newNum = desiredOrder[i],
					num = unsortedCols[i]._colNum,
					mark = self._getTaggedStyleStartEnd('col color ' + unsortedCols[i]._colNum),
					colCss = '';

				el._setColNum( newNum );

				if (blockCss.indexOf(mark.start) > -1 && blockCss.indexOf(mark.end) > -1) {
					colCss = blockCss.substring(blockCss.indexOf(mark.start), blockCss.indexOf(mark.end) + mark.end.length);
				}

				if (! colCss.length)
					continue;
				var s = mark.start.replace('col color ' + num, 'col color ' + newNum);
				var e = mark.end.replace('col color ' + num, 'col color ' + newNum);

				colCss = colCss.replace(mark.start, s);
				colCss = colCss.replace(mark.end, e);
				colCss = str_replace_all(colCss, '.ptwCol-' + num, '.ptwCol-' + newNum);
				self.removeTaggedStyle('col color ' + num);
				resultCss += colCss;
			}
			if (!resultCss.length) return;
			self.set('css', self.get('css') + resultCss);
			self._rebuildCss();
			self.contentChanged();
		}
	});
	// Set cols numbers for all columns

	this._refreshColNumbers();
	this._initCellsEdit();
	this._initCellsMovable();
};
ptwBlock_price_table.prototype._refreshColNumbers = function() {
	var	self = this
	,	$cols = this._getCols()
	,	num = 1;
	$cols.each(function(){
		var element = self.getElementByIterNum( jQuery(this).data('iter-num') );
		if(element) {
			element._setColNum( num );
			var classes = jQuery(this).attr('class')
			,	newClasses = '';
			newClasses = (classes.replace(/ptwCol\-\d+/g, '')+ ' ptwCol-'+ num).replace(/\s+/g, ' ');
			jQuery(this).attr('class', newClasses);
		}
		num++;
	});
};
ptwBlock_price_table.prototype._setColorFromColorpicker = function( pcColor, ignoreAutoSave ) {
	this.setParam('bg_color', pcColor.formatted);
	this._updateFillColor( ignoreAutoSave );
};
ptwBlock_price_table.prototype._updateFillColor = function( ignoreAutoSave ) {
	this._rebuildCss();
	if(!ignoreAutoSave) {
		_ptwSaveCanvas();
	}
};
ptwBlock_price_table.prototype._getDescCol = function() {
	return this._$.find('.ptwTableDescCol');
};
ptwBlock_price_table.prototype.switchDescCol = function(state) {
	var $descCol = this._getDescCol();
	this.setParam('enb_desc_col', state ? 1 : 0);
	state 
		? $descCol.show()
		: $descCol.hide();
	this.checkColWidthPerc();
};
ptwBlock_price_table.prototype._switchHeadRow = function(params) {
	params = params || {};
	if(typeof(params.state) === 'undefined') {
		params.state = !parseInt(this.getParam('hide_head_row'));	// "!" here is because option is actually for hide
	} else {
		this.setParam('hide_head_row', params.state ? 0 : 1);
	}
	if(typeof(params.$cols) === 'undefined') {
		params.$cols = this._getCols( true );
	}
	params.$cols.each(function(){
		var $cell = jQuery(this).find('.ptwColHeader');
		if($cell && $cell.size()) {
			params.state 
				? $cell.show()
				: $cell.hide();
		}
	});
};
ptwBlock_price_table.prototype._switchDescRow = function(params) {
	params = params || {};
	if(typeof(params.state) === 'undefined') {
		params.state = ! parseInt(this.getParam('hide_desc_row'));	// "!" here is because option is actually for hide
	} else {
		this.setParam('hide_desc_row', params.state ? 0 : 1);
	}
	if(typeof(params.$cols) === 'undefined') {
		params.$cols = this._getCols( true );
	}
	params.$cols.each(function(){
		var $cell = jQuery(this).find('.ptwColDesc');
		if($cell && $cell.size()) {
			params.state 
				? $cell.show()
				: $cell.hide();
		}
	});
};
ptwBlock_price_table.prototype._switchFootRow = function(params) {
	params = params || {};
	if(typeof(params.state) === 'undefined') {
		params.state = !parseInt(this.getParam('hide_foot_row'));	// "!" here is because option is actually for hide
	} else {
		this.setParam('hide_foot_row', params.state ? 0 : 1);
	}
	if(typeof(params.$cols) === 'undefined') {
		params.$cols = this._getCols( true );
	}
	params.$cols.each(function(){
		var $cell = jQuery(this).find('.ptwColFooter');
		if($cell && $cell.size()) {
			params.state 
				? $cell.show()
				: $cell.hide();
		}
	});
};
ptwBlock_price_table.prototype.beforeSave = function() {
	ptwBlock_price_table.superclass.beforeSave.apply(this, arguments);
	var $hoveredCol = this._getCols().filter('.hover');
	if($hoveredCol && $hoveredCol.size()) {
		this._backHoverFont( $hoveredCol );
		this._$lastHoveredCol = $hoveredCol;
	}
	this._destroyCellsEdit();
};
ptwBlock_price_table.prototype.afterSave = function() {
	ptwBlock_price_table.superclass.afterSave.apply(this, arguments);
	if(this._$lastHoveredCol) {
		this._increaseHoverFont( this._$lastHoveredCol );
		this._$lastHoveredCol = null;
	}
	this._initCellsEdit();
};
ptwBlock_price_table.prototype._initCellsMovable = function($cols) {
	$cols = $cols ? $cols : this._getCols( true );
	var block = this;
	$cols.each(function(){
		jQuery(this).find('.ptwRows').sortable({
			items: '.ptwCell'
		,	axis: 'y'
		,	handle: '.ptwMoveCellBtn'
		// No placeholder for now - it is look nice now without it too
		//,	placeholder: 'ptwCellDragHolder'
		,	stop: function(event, ui) {
				block._refreshCellsHeight();
			}
		});
	});
};
