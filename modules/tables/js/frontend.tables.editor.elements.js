/**
 * Destroy current element
 */
ptwElementBase.prototype.destroy = function(clb) {
	if(this._$) {
		var childElements = this._getChildElements();
		if(childElements) {
			for(var i = 0; i < childElements.length; i++) {
				childElements[ i ]._remove();
			}
		}
		var self = this;
		this._$.slideUp(this._animationSpeed, function(){
			self._remove();
			if(clb && typeof(clb) === 'function') {
				clb();
			}
			// not saving if Many columns removed
			if(!window.ptwNotSavingFlag) {
				_ptwSaveCanvas();
			}
		});
	}
};
ptwElementBase.prototype.getMenuShowEvent = function() {
	return this._showMenuEvent;
};
ptwElementBase.prototype._remove = function() {
	if(this._showMenuEvent === 'click') {
		jQuery(document).unbind('click.menu_el_click_hide_'+ this.getId());
	}
	this._destroyMenu();
	if(this._$) {
		this._$.remove();
		this._$ = null;
	}
	this._afterDestroy();
	this._block.removeElementByIterNum( this.getIterNum() );
};
ptwElementBase.prototype._getChildElements = function() {
	var allFoundHtml = this._$.find('.ptwEl');
	if(allFoundHtml && allFoundHtml.size()) {
		var foundElements = []
		,	selfBlock = this.getBlock();
		allFoundHtml.each(function(){
			var element = selfBlock.getElementByIterNum( jQuery(this).data('iter-num') );
			if(element) {
				foundElements.push( element );
			}
		});
		return foundElements.length ? foundElements : false;
	}
	return false;
};
ptwElementBase.prototype._afterDestroy = function() {
	
};
ptwElementBase.prototype.beforeSave = function() {
	this._destroyMoveHandler();
};
ptwElementBase.prototype.afterSave = function() {
	this._initMoveHandler();
};
ptwElementBase.prototype._initMenu = function() {
	if(this._menuOriginalId && this._menuOriginalId != '') {
		this._initMenuClbs();
		var menuParams = {
			changeable: this._changeable
		,	showEvent: this._showMenuEvent
		};
		this._menu = new window[ this._menuClass ]( this._menuOriginalId, this, this._menuClbs, menuParams );
		
		if(!this._initedComplete) {
			var self = this;
			switch(this._showMenuEvent) {
				case 'hover':
					this._$.hover(function(){
						clearTimeout(jQuery(this).data('hide-menu-timeout'));
						self.showMenu();
					}, function(){
						jQuery(this).data('hide-menu-timeout', setTimeout(function(){
							self.hideMenu();
						}, 1000));	// Let it be visible 1 second more
					});
					this._menu.$().hover(function(){
						clearTimeout(jQuery(self._$).data('hide-menu-timeout'));
					}, function(){
						jQuery(self._$).data('hide-menu-timeout', setTimeout(function(){
							self.hideMenu();
						}, 1000));	// Let it be visible 1 second more
					});
					break;
				case 'click': default:
					this._$.click(function(e){
						// close all prev. opened menus (like this menu)
						jQuery(document).trigger('ptwHideMenus', [self]);
						e.stopPropagation();
						self.showMenu();
					});
					// if user click on document - then hide all menus (like this)
					jQuery(document).on('ptwHideMenus click', function(event, dataArr) {
						if(dataArr && self._id != dataArr._id) {
							self.hideMenu();
						}
					});
					//jQuery(document).bind('click.menu_el_click_hide_'+ this.getId(), jQuery.proxy(this._closeMenuOnDocClick, this));
					break;
			}
		}

		if(this._isMovable) {
			this._initMoveHandler();
			this._initMovableMenu();
		}
	
		this.initPostLinks(this._menu._$);
	}
};
ptwElementBase.prototype.initPostLinks = function($menu) {
	if (! this.includePostLinks) return;

	var $linkTab = $menu.find('.ptwPostLinkList')
	,	$field = null
	,	fieldSelector = $linkTab.attr('data-postlink-to');

	if (!fieldSelector || !fieldSelector.length) return;

	if (fieldSelector.indexOf(':parent') == 0) {
		fieldSelector = fieldSelector.substring(7, fieldSelector.length).trim();

		$field = $linkTab.parent().find(fieldSelector);
	} else {
		$field = jQuery(fieldSelector);
	}

	if (! $field.size()) return;

	this.showPostsLinks($linkTab);

	$linkTab.css({
		height: 120
	});

	$linkTab.on('click', 'li', function () {
		var $item = jQuery(this)
		,	url = $item.attr('data-value');

		if (! url) return;

		$field.val(url);

		$field.change();
	});

	$linkTab.slimScroll({
		height: 120
	,	railVisible: true
	,	alwaysVisible: true
	,	allowPageScroll: true
	,	color: '#f72497'
	,	opacity: 1
	,	distance: 0
	,	borderRadius: '3px'
	});

	$linkTab.parent('.slimScrollDiv')
		.addClass('ptwPostLinkRoot')
		.hide();

	var $rootTab = $linkTab.parent('.ptwPostLinkRoot');

	/** Hide and show handlers **/
	var ignoreHide = false
	,	isFocus = false;

	$field.on('postlink.hide', function () {
		$rootTab.hide();

		$linkTab.hide();

		$field.trigger('postlink.hide:after');
	});

	$field.focus(function () {
		$field.trigger('postlink.show');

		$rootTab.show();

		$linkTab.show();

		isFocus = true;

		$field.trigger('postlink.show:after');
	});

	$rootTab.hover(function () {
		ignoreHide = true;
	}, function () {
		ignoreHide = false;

		if (! isFocus) {
			$field.trigger('postlink.hide');
		}
	});

	$field.blur(function () {
		isFocus = false;

		if (!ignoreHide) {
			$field.trigger('postlink.hide');
		}
	});
};
ptwElementBase.prototype.escapeString = function  (str) {
	return jQuery('<div/>').text(str).html();
}
ptwElementBase.prototype.showPostsLinks = function($tab) {
	if (! $tab.find('ul').size()) {
		$tab.html('<ul></ul>');
	}

	$tab.find('ul').html('');

	for (var i in ptwEditor.posts) {
		$tab.find('ul')
			.append(
				'<li data-value="' + this.escapeString(ptwEditor.posts[i].url) + '">' +
					'<span>' + this.escapeString(ptwEditor.posts[i].title) + '</span>' +
				'</li>'
			);
	}
};
ptwElementBase.prototype._closeMenuOnDocClick = function(e, element) {
	if(!this._menu.isVisible()) return;
	var $target = jQuery(e.target);
	if(!this.$().find( $target ).size() && !this.getMenu().$().find($target).size()) {
		this.hideMenu();
	}
};
ptwElementBase.prototype.getMenu = function() {
	return this._menu;
};
ptwElementBase.prototype._initMovableMenu = function() {
	this._menu.setMovable(true);
	this._menu.$().bind('ptwElMenuReposite', function(e, menu, top, left, useAnimation, setActive){
		/*
		var element = menu.getElement()
		,	$element = element.$()
		,	$menu = menu.$()
		,	elWidth = $element.width()
		,	menuWidth = $menu.width()
		,	menuHeight = $menu.height();
		var placePos = menu.$().find('.ptwElMenuMoveHandlerPlace').position()
		,	moveTop = -1 * menuHeight + placePos.top;
		if($element.hasClass('hover')) {
			moveTop -= g_ptwHoverMargin;
		}

		var elementParams = {
			'top': moveTop
		,	'left': ((elWidth - menuWidth) / 2) + placePos.left - 10
		};

		if(typeof useAnimation != 'undefined' && useAnimation == true) {
			element._moveHandler.animate(elementParams, menu._animationSpeed);
		} else {
			element._moveHandler.css(elementParams);
		}
		if(typeof setActive == 'undefined' || setActive == true) {
			element._moveHandler.addClass('active');
		}
		/**/
	}).bind('ptwElMenuHide', function(e, menu){
		/*
		var element = menu.getElement();
		if(!element._sortInProgress) {
			element._moveHandler.removeClass('active');
		}
		/**/
	});
};
ptwElementBase.prototype.onSortStart = function() {
	this._sortInProgress = true;
	this._moveHandler.addClass('sortInProgress');
	this._menu.hide();
};
ptwElementBase.prototype.onSortStop = function() {
	this._sortInProgress = false;
	this._moveHandler.removeClass('sortInProgress');
	this._menu.show();
};
ptwElementBase.prototype._initMenuClbs = function() {
	var self = this;
	this._menuClbs['.ptwRemoveElBtn'] = function() {
		self.destroy();
	};
	if(this._changeable) {
		this._menuClbs['.ptwTypeTxtBtn'] = function() {
			self.getBlock().replaceElement(self, 'txt_item_html', 'txt');
		};
		this._menuClbs['.ptwTypeImgBtn'] = function() {
			self.getBlock().replaceElement(self, 'img_item_html', 'img');
		};
		this._menuClbs['.ptwTypeIconBtn'] = function() {
			self.getBlock().replaceElement(self, 'icon_item_html', 'icon');
		};
		this._menuClbs['.ptwTypeButtonBtn'] = function() {
			self.getBlock().replaceElement(self, 'icon_item_html', 'btn');
		};
	}
};
ptwElementBase.prototype._initMoveHandler = function() {
	if(this._isMovable && !this._moveHandler) {
		this._moveHandler = jQuery('#ptwMoveHandlerExl').clone().removeAttr('id').appendTo( this._$ );
	}
};
ptwElementBase.prototype._destroyMoveHandler = function() {
	if(this._isMovable) {
		this._moveHandler.remove();
		this._moveHandler = null;
	}
};
ptwElementBase.prototype._afterFullContentLoad = function() {
	//sthis.repositeMenu();
};
ptwElementBase.prototype._destroyMenu = function() {
	if(this._menu) {
		this._menu.destroy();
		this._menu = null;
	}
};
ptwElementBase.prototype.showMenu = function() {
	if(this._menu) {
		this._menu.show();
	}
};
ptwElementBase.prototype.hideMenu = function() {
	if(this._menu) {
		this._menu.hide();
	}
};
ptwElementBase.prototype.menuInAnimation = function() {
	if(this._menu) {
		return this._menu.inAnimation();
	}
	return false;
};
ptwElementBase.prototype.setMovable = function(state) {
	this._isMovable = state;
};
ptwElementBase.prototype.repositeMenu = function() {
	if(this._menu) {
		this._menu.reposite();
	}
};
/**
 * Text element
 */
function ptwElement_txt(jqueryHtml, block) {
	this._elId = null;
	this._editorElement = null;
	this._editor = null;
	this.includePostLinks = true;
	this._editorToolbarBtns = [
		['ptw_editattrs'], ['ptw_fontselect'], ['ptw_fontsizeselect'], ['bold', 'italic', 'strikethrough'], ['ptw_link'], ['forecolor']
	];
	ptwElement_txt.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_txt, ptwElementBase);
ptwElement_txt.prototype._init = function() {
	ptwElement_txt.superclass._init.apply(this, arguments);
	var id = this._$.attr('id')
	,	self = this;
	if(!id || id == '') {
		this._$.attr('id', 'ptwTxt_'+ mtRand(1, 99999));
	}
	var toolbarBtns = false
	,	$parentBl = this._$.parent()
	,	tinyMceParams
	;

	tinyMceParams = {
			inline: true
		,	'toolbar': toolbarBtns
		,	menubar: false
		,	plugins: 'ptw_editattrs ptw_textcolor ptw_link ptw_fontselect ptw_fontsizeselect'
		,	fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt 48pt 64pt 72pt'
		,	skin : 'octo'
		,	convert_urls: false
		,	setup: function(ed) {
			this._editor = ed;

			ed.on('blur', function(e) {
				if(e.target._ptwChanged) {
					e.target._ptwChanged = false;
					_ptwSaveCanvas();
				}
				jQuery('.mce-container.mce-panel.mce-floatpanel.mce-menu:visible').hide();
			});
			ed.on('change', function(e) {
				e.target._ptwChanged = true;
				if(e.target._ptwChangeTimeout) {
					clearTimeout( e.target._ptwChangeTimeout );
				}
				e.target._ptwChangeTimeout = setTimeout(function(){
					self.getBlock().contentChanged();
				}, 1000);
			});
			ed.on('keyup', function(e) {
				var selectionCoords = getSelectionCoords();
				ptwMceMoveToolbar( self._editorElement.tinymce(), selectionCoords.x );
				self.getBlock().hideElementsMenus();
			});
			ed.on('click', function(e) {
				//if(toolbarBtns) {
					ptwMceMoveToolbar( self._editorElement.tinymce(), e.clientX );
					self.getBlock().hideElementsMenus();
					if (ed.theme.panel.hasOwnProperty('isInitPostlinkClick')) return;

					var handler = function () {
						ed.theme.panel.isInitPostlinkClick = true;

						var $fieldWp = jQuery('#' + self._$.attr('id') + 'ptwPostLinkList');

						if ($fieldWp.size()) {
							ed.theme.panel.off('click', handler);

							self.initPostLinks($fieldWp.parents('.mce-container'));
						}
					};
					ed.theme.panel.on('click', handler);
			});
			if(self._afterEditorInit) {
				self._afterEditorInit( ed );
			}
		}
	};

	if(toolbarBtns) {
		this._editorElement = this._$.tinymce(tinyMceParams);
	}

	this._$.removeClass('mce-edit-focus');
	// Do not allow drop anything it text element outside content area
	this._$.bind('dragover drop', function(event){
		event.preventDefault();
	});
};
ptwElement_txt.prototype.getEditorElement = function() {
	return this._editorElement;
};
ptwElement_txt.prototype.getEditor = function() {
	return this._editor;
};
ptwElement_txt.prototype.beforeSave = function() {
	ptwElement_txt.superclass.beforeSave.apply(this, arguments);
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	this._elId = this._$.attr('id');
	if(this._$.attr('contenteditable') == 'true') {
		this._isContentEditable = true;
	}
	this._$
		.removeAttr('id')
		.removeAttr('contenteditable')
		.removeAttr('spellcheck')
		.removeClass('mce-content-body mce-edit-focus');
};
ptwElement_txt.prototype.afterSave = function() {
	ptwElement_txt.superclass.afterSave.apply(this, arguments);
	if(this._elId) {
		this._$
			.attr('id', this._elId)
			// .attr('contenteditable', 'true')
			//.attr('spellcheck', 'false')
			//.addClass('mce-content-body')
		;
		if(this._isContentEditable) {
			this._$.attr('contenteditable', 'true');
		}
	}
};
/**
 * Image element
 */
function ptwElement_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuImgExl';
	}
	this._menuClass = 'ptwElementMenu_img';
	this.includePostLinks = true;
	ptwElement_img.superclass.constructor.apply(this, arguments);
	var self = this;
	this._getImg().load(function(){
		self._block.contentChanged();
	});
}
extendPtw(ptwElement_img, ptwElementBase);
ptwElement_img.prototype._beforeImgChange = function(optw, attach, imgUrl, imgToChange) {
	
};
ptwElement_img.prototype._afterImgChange = function(optw, attach, imgUrl, imgToChange) {
	
};
ptwElement_img.prototype._initMenuClbs = function() {
	ptwElement_img.superclass._initMenuClbs.apply(this, arguments);
	var self = this;
	this._menuClbs['.ptwImgChangeBtn'] = function() {
		self.set('type', 'img');
		self._getImg().show();
		self._getVideoFrame().remove();
		ptwCallWpMedia({
			id: self._$.attr('id')
		,	clb: function(optw, attach, imgUrl) {
				var imgToChange = self._getImg();
				self._block.beforeSave();
				self._innerImgsLoaded = 0;
				self._beforeImgChange( optw, attach, imgUrl, imgToChange );
				imgToChange.attr('src', imgUrl);
				self._afterImgChange( optw, attach, imgUrl, imgToChange );
				self._block.afterSave();
				self._block.contentChanged();
				_ptwSaveCanvas();
			}
		});
	};
	this._menuClbs['.ptwImgVideoSetBtn'] = function() {
		self.set('type', 'video');
		self._buildVideo( self._menu.$().find('[name=video_link]').val() );
	};
};
ptwElement_img.prototype._buildVideo = function(url) {
	url = url ? jQuery.trim( url ) : false;
	if(url) {
		var $editArea = this._getEditArea()
		,	$videoFrame = this._getVideoFrame( $editArea )
		,	$img = this._getImg( $editArea )
		,	src = ptwUtils.urlToVideoSrc( url );
		$videoFrame.attr({
			'src': src
		,	'width': $img.width()
		,	'height': $img.height()
		}).show();
		$img.hide();
	}
};
ptwElement_img.prototype._getVideoFrame = function( editArea ) {
	editArea = editArea ? editArea : this._getEditArea();
	var videoFrame = editArea.find('iframe.ptwVideo');
	if(!videoFrame.size()) {
		videoFrame = jQuery('<iframe class="ptwVideo" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen />').appendTo( editArea );
	}
	return videoFrame;
};
ptwElement_img.prototype._getImg = function(editArea) {
	editArea = editArea ? editArea : this._getEditArea();
	return editArea.find('img:first');
};
ptwElement_img.prototype._initMenu = function() {
	ptwElement_img.superclass._initMenu.apply(this, arguments);
	var self = this;
	if(this._menu) {
		this._menu.$().find('[name=video_link]').change(function(){
			self._buildVideo( jQuery(this).val() );
		}).keyup(function(e){
			if(e.keyCode == 13) {	// Enter
				self._buildVideo( jQuery(this).val() );
			}
		});
	}
};
ptwElement_img.prototype._getLink = function() {
	var $link = this._$.find('a.ptwLink');
	return $link.size() ? $link : false;
};
ptwElement_img.prototype._setLinkAttr = function(attr, val) {
	switch(attr) {
		case 'href':
			if(val) {
				var $link = this._createLink();
				$link.attr(attr, val);
			} else
				this._removeLink();
			break;
		case 'title':
			var $link = this._createLink();
			$link.attr(attr, val);
			break;
		case 'target':
			var $link = this._createLink();
			val ? $link.attr('target', '_blank') : $link.removeAttr('target');
			break;
	}
};
ptwElement_img.prototype._createLink = function() {
	var $link = this._getLink();
	if(!$link) {
		$link = jQuery('<a class="ptwLink" />').append( this._$.find('img') ).appendTo( this._getEditArea() );
		$link.click(function(e){
			e.preventDefault();
		});
	}
	return $link;
};
ptwElement_img.prototype._removeLink = function() {
	var $link = this._getLink();
	if($link) {
		this._getEditArea().append( this._$.find('img') );
		$link.remove();
	}
};
ptwElement_img.prototype._isRelNofollow = function (nofollow) {
	var $link = this._getLink();

	if (!$link)
		$link = this._createLink();

	if (nofollow)
		$link.attr('rel', 'nofollow');
	else
		$link.removeAttr('rel');
};
/**
 * Gallery image element
 */
function ptwElement_gal_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuGalItemExl';
	}
	ptwElement_gal_img.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_gal_img, ptwElement_img);
ptwElement_gal_img.prototype._afterDestroy = function() {
	ptwElement_gal_img.superclass._afterDestroy.apply(this, arguments);
	this._block.recalcRows();
};
ptwElement_gal_img.prototype._afterImgChange = function(optw, attach, imgUrl, imgToChange) {
	ptwElement_gal_img.superclass._afterImgChange.apply(this, arguments);
	imgToChange.attr('data-full-img', attach.url);
	imgToChange.parents('.ptwGalLink:first').attr('href', attach.url);
};
/**
 * Menu item element
 */
function ptwElement_menu_item(jqueryHtml, block) {
	/*if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuGalItemExl';
	}*/
	ptwElement_menu_item.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_menu_item, ptwElement_txt);
ptwElement_menu_item.prototype._afterEditorInit = function(editor) {
	var self = this;
	editor.addButton('tables_remove', {
		title: 'Remove'
	,	onclick: function(e) {
			self.destroy();
		}
	});
};
ptwElement_menu_item.prototype._beforeInit = function() {
	this._editorToolbarBtns.push('tables_remove');
};

/**
 * Menu item image
 */
function ptwElement_menu_item_img(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuMenuItemImgExl';
	}
	ptwElement_menu_item_img.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_menu_item_img, ptwElement_img);
/**
 * Input item
 */
function ptwElement_input(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuInputExl';
	}
	ptwElement_input.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_input, ptwElementBase);
ptwElement_input.prototype._init = function() {
	ptwElement_input.superclass._init.apply(this, arguments);
	var saveClb = function(element) {
		jQuery(element).attr('placeholder', jQuery(element).val());
		jQuery(element).val('');
		_ptwSaveCanvasDelay();
	};
	this._getInput().focus(function(){
		jQuery(this).val(jQuery(this).attr('placeholder'));
	}).blur(function(){
		if(jQuery(this).data('saved')) {
			jQuery(this).data('saved', 0);
			return;
		}
		saveClb(this)
	}).keyup(function(e){
		if(e.keyCode == 13) {	// Enter
			saveClb(this);
			jQuery(this).data('saved', 1).trigger('blur');	// We must blur from element after each save in any case
		}
	});
};
ptwElement_input.prototype._getInput = function() {
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	// TODO: Modify this to return all fields types
	return this._$.find('input');
};
ptwElement_input.prototype._initMenu = function(){
	ptwElement_input.superclass._initMenu.apply(this, arguments);
	if(!this._$) return;	// TODO: Make this work corect - if there are no html (_$) - then this method should not simple triggger. For now - it trigger even if _$ === null
	var self = this
	,	menuReqCheck = this._menu.$().find('[name="input_required"]');
	menuReqCheck.change(function(){
		var required = jQuery(this).attr('checked');
		if(required) {
			self._getInput().attr('required', '1');
		} else {
			self._getInput().removeAttr('required');
		}
		self._block.setFieldRequired(self._getInput().get(0).name, (helperChecked ? 1 : 0));
		_ptwSaveCanvasDelay();
	});
	self._getInput().attr('required')
		? menuReqCheck.attr('checked', 'checked')
		: menuReqCheck.removeAttr('checked');
	ptwCheckUpdate( menuReqCheck );
};
ptwElement_input.prototype.destroy = function() {
	// Remove field from block fields list at first
	var name = this._getInput().attr('name');
	this._block.removeField( name );
	ptwElement_input.superclass.destroy.apply(this, arguments);
};
/**
 * Input button item
 */
function ptwElement_input_btn(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuInputBtnExl';
	}
	ptwElement_input_btn.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_input_btn, ptwElementBase);
ptwElement_input_btn.prototype._getInput = function() {
	// TODO: Modify this to return all fields types
	return this._$.find('input');
};
ptwElement_input_btn.prototype._init = function() {
	ptwElement_input_btn.superclass._init.apply(this, arguments);
	var saveClb = function(element) {
		jQuery(element).attr('type', 'submit');
		_ptwSaveCanvasDelay();
	};
	this._getInput().click(function(){
		return false;
	}).focus(function(){
		var value = jQuery(this).val();
		jQuery(this).attr('type', 'text').val( value );
	}).blur(function(){
		if(jQuery(this).data('saved')) {
			jQuery(this).data('saved', 0);
			return;
		}
		saveClb(this);
	}).keyup(function(e){
		if(e.keyCode == 13) {	// Enter
			saveClb(this);
			jQuery(this).data('saved', 1).trigger('blur');	// We must blur from element after each save in any case
		}
	});
};
/**
 * Standart button item
 */
ptwElement_btn.prototype.beforeSave = function() {
	ptwElement_btn.superclass.beforeSave.apply(this, arguments);
	this._getEditArea().removeAttr('contenteditable');
};
ptwElement_btn.prototype.afterSave = function() {
	ptwElement_btn.superclass.afterSave.apply(this, arguments);
	this._getEditArea().attr('contenteditable', true);
};
ptwElement_btn.prototype._init = function() {
	ptwElement_btn.superclass._init.apply(this, arguments);
	var self = this;
	this._getEditArea().attr('contenteditable', true).blur(function(){
		self._block.contentChanged();
		//_ptwSaveCanvasDelay();
	}).keypress(function(e){
		if(e.keyCode == 13 && window.getSelection) {	// Enter
			document.execCommand('insertHTML', false, '<br>');
			if (typeof e.preventDefault != "undefined") {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
		}
	});
	if(this.get('customhover-clb')) {

	}
};
ptwElement_btn.prototype._setColor = function(color) {
	this.set('bgcolor', color);
	var bgElements = this.get('bgcolor-elements');
	if(bgElements)
		bgElements = this._$.find(bgElements);
	else
		bgElements = this._$;
	switch(this.get('bgcolor-to')) {
		case 'border':	// Change only borders color
			bgElements.css({
				'border-color': color
			});
			break;
		case 'txt':
			bgElements.css({
				'color': color
			});
			break;
		case 'bg':
		default:
			bgElements.css({
				'background-color': color
			});
			break;
	}
	if(this._haveAdditionBgEl === null) {
		this._haveAdditionBgEl = this._$.find('.ptwAddBgEl');
		if(!this._haveAdditionBgEl.size()) {
			this._haveAdditionBgEl = false;
		}
	}
	if(this._haveAdditionBgEl) {
		this._haveAdditionBgEl.css({
			'background-color': color
		});
	}
	if(this.get('bgcolor-clb')) {
		var clbName = this.get('bgcolor-clb');
		if(typeof(this[clbName]) === 'function') {
			this[clbName]( color );
		}
	}
};
/**
 * Icon item
 */
function ptwElement_icon(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuIconExl';
	}
	this._menuClass = 'ptwElementMenu_icon';
	this.includePostLinks = true;
	ptwElement_icon.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_icon, ptwElementBase);
ptwElement_icon.prototype._setColor = function(color) {
	this.set('color', color);
	this._getEditArea().css('color', color);
};
ptwElement_icon.prototype._getLink = function() {
	var $link = this._$.find('a.ptwLink');
	return $link.size() ? $link : false;
};
ptwElement_icon.prototype._setLinkAttr = function(attr, val) {
	switch(attr) {
		case 'href':
			if(val) {
				var $link = this._createLink();
				$link.attr(attr, val);
			} else
				this._removeLink();
			break;
		case 'title':
			var $link = this._createLink();
			$link.attr(attr, val);
			break;
		case 'target':
			var $link = this._createLink();
			val ? $link.attr('target', '_blank') : $link.removeAttr('target');
			break;
	}
};
ptwElement_icon.prototype._createLink = function() {
	var $link = this._getLink();
	if(!$link) {
		$link = jQuery('<a class="ptwLink" />').append( this._$.find('.ptwInputShell') ).appendTo( this._$ );
		$link.click(function(e){
			e.preventDefault();
		});
	}
	return $link;
};
ptwElement_icon.prototype._removeLink = function() {
	var $link = this._getLink();
	if($link) {
		this._$.append( $link.find('.ptwInputShell') );
		$link.remove();
	}
};
ptwElement_icon.prototype._isRelNofollow = function (nofollow) {
	var $link = this._getLink();

	if (!$link)
		$link = this._createLink();

	if (nofollow)
		$link.attr('rel', 'nofollow');
	else
		$link.removeAttr('rel');
};
/**
 * Table column element
 */
ptwElement_table_col.prototype._setColor = function(color) {
	if(color) {
		this.set('color', color);
	} else {
		color = this.get('color');
	}
	var enbColor = parseInt(this.get('enb-color'))
	,	block = this.getBlock()
	,	colNum = this._colNum
	,	cssTag = 'col color '+ colNum
	,	cellColorCss = block.getParam('cell_color_css')
	,	useCss = cellColorCss && cellColorCss !== '';
	if(enbColor) {
		if(useCss) {
			block.setTaggedStyle(block.getParam('cell_color_css'), cssTag, {num: colNum, color: color});
		} else {
			var $bgColorTo = this._$.find('[data-bg-to]')
			,	firstBgColor = this.get('first-bg-color');
			if(!firstBgColor) {
				this.set('first-bg-color', $bgColorTo.css('background-color'));
			}
			$bgColorTo.css('background-color', color);
		}
	} else {
		if(useCss) {
			block.removeTaggedStyle(cssTag);
		} else {
			var $bgColorTo = this._$.find('[data-bg-to]');
			$bgColorTo.css('background-color', this.get('first-bg-color'));
		}
	}
	//_ptwSaveCanvas();
};
ptwElement_table_col.prototype._setColNum = function(num) {
	this._colNum = num;
};
ptwElement_table_col.prototype._afterDestroy = function() {
	ptwElement_table_col.superclass._afterDestroy.apply(this, arguments);
	this._block.checkColWidthPerc();
};
ptwElement_table_col.prototype.destroy = function() {
	// remove items from list
	var productId = this._$.attr('data-col-product-id');
	if(productId) {
		jQuery('.ptwWooProductListWrapper .ptwWplwItemWrapper[data-id="' + productId + '"]').remove();
		if(window.ptwTablesAdmin) {
			window.ptwTablesAdmin.getRefreshedProducts();
		}
	}
	// use parent function
	ptwElement_table_col.superclass.destroy.apply(this, arguments);
};
ptwElement_table_col.prototype._showSelectBadgeWnd = function() {
	this.hideMenu();
	ptwUtils.showBadgesLibWnd( this );
};
ptwElement_table_col.prototype._disableBadge = function() {
	this._getBadgeHtml().hide();
};
ptwElement_table_col.prototype._setBadge = function(data) {
	if(data) {
		for(var key in data) {
			this.set('badge-'+ key, data[ key ]);
		}
	} else {
		data = this._getBadgeData();
	}
	if(!data) return;

	ptwUtils.updateBadgePrevLib( this._getBadgeHtml().show(), data );
	this.set('enb-badge', 1);
	var $enbBadgeCheck = this._menu.$().find('[name=enb_badge_col]');
	$enbBadgeCheck.attr('checked', 'checked');
	ptwCheckUpdate( $enbBadgeCheck );
};
ptwElement_table_col.prototype._getBadgeData = function() {
	var keys = ['badge_name', 'badge_bg_color', 'badge_txt_color', 'badge_pos']
	,	data = {};
	for(var i = 0; i < keys.length; i++) {
		data[ keys[i] ] = this.get('badge-'+ keys[ i ]);
		if(!data[ keys[i] ])
			return false;
	}
	return data;
};
ptwElement_table_col.prototype._getBadgeHtml = function() {
	var $badge = this._$.find('.ptwColBadge');
	if(!$badge.size()) {
		$badge = jQuery('<div class="ptwColBadge"><div class="ptwColBadgeContent"></div></div>').appendTo( this._getEditArea() );
	}
	return $badge;
};
/**
 * Table description column element
 */
ptwElement_table_col_desc.prototype._initMenu = function() {
	ptwElement_table_col_desc.superclass._initMenu.apply(this, arguments);
	// Column description created from usual table column element, with it's menu.
	// But we can't move or remove (we can hide this from block settings) this type of column, so let's just remove it's move handle from menu.
	var $moveHandle = this._menu.$().find('.ptwElMenuMoveHandlerPlace')
	,	$removeBtn = this._menu.$().find('.ptwRemoveElBtn');
	$moveHandle.next('.ptwElMenuBtnDelimiter').remove();
	$moveHandle.remove();
	$removeBtn.prev('.ptwElMenuBtnDelimiter').remove();
	$removeBtn.remove();
	this._menu.$().css('min-width', '130px');
};
/**
 * Table cell element
 */
function ptwElement_table_cell(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuTableCellExl';
	}
	this._menuClass = 'ptwElementMenu_table_cell';
	ptwElement_table_cell.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_table_cell, ptwElementBase);
ptwElement_table_cell.prototype._initMenuClbs = function() {
	ptwElement_table_cell.superclass._initMenuClbs.apply(this, arguments);
	var self = this;
	this._menuClbs['.ptwTypeTxtBtn'] = function() {
		self._replaceElement('txt_cell_item', 'txt');
	};
	this._menuClbs['.ptwTypeImgBtn'] = function() {
		self._replaceElement('img_cell_item', 'img');
	};
	this._menuClbs['.ptwTypeIconBtn'] = function() {
		self._replaceElement('icon_cell_item', 'icon');
	};
	this._menuClbs['.ptwTypeButtonBtn'] = function() {
		self._replaceElement('icon_cell_item', 'btn');
	};

	// check if it 1st row ?
	var $contentDiv = this._$.closest('.ptwTableElementContent')
	,	$firstRowDiv = $contentDiv.find('> div:first-child:visible');
	if($firstRowDiv.length) {
		if($firstRowDiv.get(0) == this._$.get(0)) {
			this._$.data('menu-to-bottom', 9);
		}
	} else {
		// if element hidden in "description" column
		$firstRowDiv = $contentDiv.find('> div:first-child');
		if($firstRowDiv.get(0) == this._$.get(0)) {
			this._$.data('menu-to-bottom', 9);
		}
	}

};
ptwElement_table_cell.prototype._replaceElement = function(toParamCode, type) {
	var editArea = this._getEditArea()
	,	elementIter = editArea.find('.ptwEl').data('iter-num')
	,	block = this.getBlock();
	// Destroy current element in cell
	block.destroyElementByIterNum( elementIter );
	// Add new one
	editArea.html( block.getParam( toParamCode ) );
	block._initElementsForArea( editArea );
	this.set('type', type);
	this._menu.$().find('[name=type]').removeAttr('checked').filter('[value='+ type+ ']').attr('checked', 'checked');
};
/**
 * Table Cell Icon element
 */
function ptwElement_table_cell_icon(jqueryHtml, block) {
	if(typeof(this._menuOriginalId) === 'undefined') {
		this._menuOriginalId = 'ptwElMenuTableCellIconExl';
	}
	this._changeable = true;
	this.includePostLinks = true;
	ptwElement_table_cell_icon.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_table_cell_icon, ptwElement_icon);
/**
 * Table Cell Image element
 */
function ptwElement_table_cell_img(jqueryHtml, block) {
	this._menuOriginalId = null;
	this._menuClass = null;
	ptwElement_table_cell_img.superclass.constructor.apply(this, arguments);
}
extendPtw(ptwElement_table_cell_img, ptwElement_img);
/**
 * Table Cell Image element
 */
function ptwElement_table_cell_txt(jqueryHtml, block) {
	//this._typeBtns = {
	//	ptw_el_menu_type_txt: {
	//		text: toeLangPtw('Text')
	//	,	type: 'txt'
	//	,	checked: true
	//	}
	//,	ptw_el_menu_type_img: {
	//		text: toeLangPtw('Image / Video')
	//	,	type: 'img'
	//	}
	//,	ptw_el_menu_type_icon: {
	//		text: toeLangPtw('Icon')
	//	,	type: 'icon'
	//	}
	//,	ptw_el_menu_type_btn: {
	//		text: toeLangPtw('Button')
	//	,	type: 'btn'
	//	}
	//};
	this.includePostLinks = true;
	ptwElement_table_cell_txt.superclass.constructor.apply(this, arguments);

	if(this._$.hasClass('ptwIsTableCellTxtEdit')) {
		this._$.attr('contenteditable', 'true');
	}
}
extendPtw(ptwElement_table_cell_txt, ptwElement_txt);
ptwElement_table_cell_txt.prototype._afterEditorInit = function(editor) {
	var self = this;

	editor.addButton('remove', {
			_ptwElement: this
		,	icon: 'remove fa fa-trash-o'
		,	classes: 'btn'
		,	onclick: function() {
				self.destroy();
			}
		});
};
ptwElement_table_cell_txt.prototype._beforeInit = function() {
	var btnsPack = [];
	/*
	for(var btnKey in this._typeBtns) {
		btnsPack.push( btnKey );
	}
	/**/
	btnsPack.push( 'remove' );
	this._editorToolbarBtns.push( btnsPack );
};



