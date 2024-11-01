(function($, ptwcData) {
	function ptwTablesAdmin() {

	}

	ptwTablesAdmin.prototype.init = (function($table) {
		this.tblFiller = window.ptwTableFiller;
		this.tblFiller.$cellEntryPattern = this.getBlockParam($table, 'txt_item_html');
		this.tblFiller.$cellEntryImgPattern = this.getBlockParam($table, 'img_item_html');

		this.isPropertyListChanged = false;
		this.isProductListChanged = false;
		// product property position for ui-sortable
		this.propertyPosInd = null;
		this.$tableWrapper = $table;

		this.initPropertyList();
		this.initProductList();
	});

	ptwTablesAdmin.prototype.initMenuInCells = (function($cells) {
		var block = ptwGetFabric().getByViewId(this.$tableWrapper.attr('id'));
		if(block) {
			if(!$cells || !$cells.length) {
				$cells = this.$tableWrapper.find('.ptwCell');
			}
			block._disableContentChange = true;
			$cells.each(function(ind1, cellItem) {
				var $cellItem = $(cellItem);
				block._initElementsForArea($cellItem);
				block._initCellsEdit($cellItem);
				block._initOneElement($cellItem[0], block);
			});
			block._disableContentChange = false;
			block.contentChanged();
		}
	});

	ptwTablesAdmin.prototype.getBlockParam = (function($table, paramName) {
		var block = ptwGetFabric().getByViewId($table.attr('id'));
		return jQuery(block.getParam(paramName));
	});

	ptwTablesAdmin.prototype.getRefreshedProdProps = (function() {
		this.productProperties = this.tblFiller.createProductPropFromObj(this.getIdxRowSortOrder());
		return this.productProperties;
	});

	ptwTablesAdmin.prototype.getRefreshedProducts = (function() {
		this.productList = this.tblFiller.getProductsBy(this.getColumnSortOrder());
		return this.productList;
	});

	ptwTablesAdmin.prototype.getProdPropsSortable = (function(reInit) {
		var selfTa = this;
		this.getRefreshedProdProps();

		if(!this.$productPropsSortable) {
			this.$productPropsSortable = $('.ptwWooPropList').sortable({
				'items': '.ptwOnePropItem',
				'handle': '.ptwOnePiHandle',
				'placeholder': 'uiSortablePlaceholder',
				'axis': 'y',
				'cancel': '.ptwUnsortablePropItems',
				'start': function(event, ui) {
					if(ui.item && ui.item.length) {
						selfTa.propertyPosInd = selfTa.$productPropsSortable.find('.ptwOnePropItem').index(ui.item);
					}
				},
				'stop': function(event, ui) {
					if(ui.item && ui.item.length &&  selfTa.tblFiller) {
						var newPosition = selfTa.$productPropsSortable.find('.ptwOnePropItem').index(ui.item)
						,	tblFillerObj = selfTa.tblFiller
						,	$changedCellRows
						,	startInd = newPosition
						,	endInd = selfTa.propertyPosInd
						;
						if(startInd != endInd) {
							selfTa.getRefreshedProdProps();
							if(startInd > endInd) {
								startInd = selfTa.propertyPosInd;
								endInd = newPosition;
							}
							for(startInd; startInd <= endInd; startInd++) {
								$changedCellRows = $('.ptwBlock').find('.ptwCol .ptwRows .ptwCell:nth-of-type(' + (startInd + 1) + ')');
								if($changedCellRows.length && selfTa.productProperties[startInd]) {
									tblFillerObj.fillRowBy($changedCellRows, 1, selfTa.productProperties[startInd], selfTa.getColumnSortOrder(), 0, 2);
								}
								selfTa.initMenuInCells($changedCellRows);
							}
						}
					}
					selfTa.propertyPosInd = null;
				},
			});
		} else {
			this.$productPropsSortable.sortable('refresh');
		}
	});

	ptwTablesAdmin.prototype.addNewRow = (function($currentTable) {
		var $tmplatePropertyItem = $('.ptwOnePropertyItemTemplate .ptwOnePropItem').clone()
		,	$newAddedRowCells = null
		,	blockWhereAdd = ptwGetFabric().getByViewId($currentTable.attr('id'))
		,	currProdPropIdx = mtRand(100000, 999999);
		// add item to Property List
		$('.ptwWooPropList').append($tmplatePropertyItem);
		$tmplatePropertyItem.attr('data-prop-idx', currProdPropIdx);
		//
		if(blockWhereAdd) {
			// add row to table
			blockWhereAdd.addRow();
			_ptwSetRowsNumSetting(blockWhereAdd);

			// get new Values for Product Properties
			this.getRefreshedProdProps();
			$newAddedRowCells = $currentTable.find('.ptwCol .ptwRows .ptwCell:last-child');
			var ppList = this.productProperties;

			if($newAddedRowCells.length && ppList && ppList.length) {
				// fill last added row
				this.tblFiller.fillRowBy($newAddedRowCells, true, ppList[ppList.length - 1], this.getColumnSortOrder(), 0, 1);
			}
			this.initMenuInCells($newAddedRowCells);
		}
		// ReInitialization
		this.proprertyRemoveBtn($tmplatePropertyItem.find('.ptwOnePiTrash'));
		this.onProdPropsSelectorChange($tmplatePropertyItem.find('.ptwPropertySelList'));
	});

	ptwTablesAdmin.prototype.initPropertyList = (function() {
		var selfPta = this
		,	$currentTable = $('.ptwBlock');
		
		this.getRefreshedProducts();
		this.getProdPropsSortable(true);

		$('.ptwAddNewPropertyField').off('click').on('click', function(event) {
			selfPta.addNewRow($currentTable);
		});

		this.onProdPropsSelectorChange();
		this.proprertyRemoveBtn();
	});

	ptwTablesAdmin.prototype.onProdPropsSelectorChange = (function($selector) {
		var selfPta = this;
		if(!$selector || !$selector.length) {
			$selector = $('.ptwWooPropList .ptwPropertySelList');
		}
		$selector.off('change').on('change', function(event) {
			var $currSelector = $(this)
			,	selVal = $currSelector.val()
			,	$ppItem = $currSelector.closest('.ptwOnePropItem')
			,	ppItem = selfPta.getOneProdPropById(selVal, $ppItem.attr('data-prop-idx'), 1)
			,	$rowCellToChange = $('.ptwBlock .ptwCell[data-prop-idx="' + $ppItem.attr('data-prop-idx') + '"]')
			;
			if($rowCellToChange.length && ppItem && ppItem.code) {
				selfPta.tblFiller.fillRowBy($rowCellToChange, true, ppItem, selfPta.getColumnSortOrder(), 0, 2);
				// change "Description" text position
			}
			selfPta.initMenuInCells($rowCellToChange);
		});
	});

	ptwTablesAdmin.prototype.proprertyRemoveBtn = (function($selector) {
		if(!$selector || !$selector.length) {
			$selector = $('.ptwWooPropList .ptwOnePiTrash');
		}
		$selector.off('click').on('click', function(event) {
			var $remBtn = $(this)
			,	$parent = $remBtn.closest('.ptwOnePropItem');
			// remove from Table row
			$('.ptwBlock .ptwCell[data-prop-idx="' + $parent.attr('data-prop-idx') + '"]').remove();
			// remove element From Property list
			$parent.remove();
		});
	});

	ptwTablesAdmin.prototype.initProductItems = (function($selector) {
		var ptaSelf = this;
		if(!$selector || !$selector.length) {
			$selector = $('.ptwWooProductListWrapper .ptwWplwItemWrapper .ptwItemRemoveIcon');
		}
		$selector.off('click').on('click', function(event) {
			var $this = $(this)
			,	$productWrapper = $this.closest('.ptwWplwItemWrapper')
			,	productId = $productWrapper.attr('data-id');
			;
			if(productId) {
				ptaSelf.removeProductsWrById(productId);
			}
		});
	});

	ptwTablesAdmin.prototype.initProductList = (function() {
		var selfPta = this
		,	$prodItemList = $('.ptwAllProductListWrap .ptwAplOneItem')
		;
		selfPta.productsIdsOnWndOpen = {};
		this.getProductSortable();

		this.$addProductToListDialog = $('.ptwProductsDialog').dialog({
			'autoOpen': false,
			'modal': true,
			'width': '400px',
			'closeText': 'x',
			'create': function () {
				$(this).closest('.ui-dialog')
					.find('.ui-dialog-buttonset button')
					.addClass('button');
			},
			'open': function() {
				var productInTbl = selfPta.getColumnSortOrder()
				,	$prodCheckboxes = $('.ptwAllProductListWrap .ptwAplOneItemCheckbox')
				,	pIdx
				;
				selfPta.productsIdsOnWndOpen = {};
				if(productInTbl.length) {
					for(pIdx = 0; pIdx < productInTbl.length; pIdx++) {
						selfPta.productsIdsOnWndOpen[productInTbl[pIdx]] = true;
					}
				}
				// reset checks
				$prodCheckboxes.each(function(chInd, chItem) {
					var $checkBox = $(chItem)
					,	productId = $checkBox.val()
					;
					if(selfPta.productsIdsOnWndOpen[productId]) {
						$checkBox.iCheck('check');
					} else {
						$checkBox.iCheck('uncheck');
					}
				});
			},
			'buttons': {
				'Ok': function() {
					var $checkedInpts = jQuery('.ptwAllProductListWrap .ptwAplOneItemCheckbox:checked')
					,	$productItemWrapp = $('.ptwWooProductListWrapper')
					,	newProductList = {}
					,	productId = null
					,	idsToRemove = []
					,	idsToAdd = []
					,	prevIds = Object.keys(selfPta.productsIdsOnWndOpen)
					;
					if($checkedInpts.length) {
						// get checked ids
						$checkedInpts.each(function(chInd, chItem) {
							var $checkBox = $(chItem);
							productId = $checkBox.val();
							newProductList[productId] = true;
						});

						// check difference
						var tmpInd = 0;
						for(tmpInd; tmpInd < prevIds.length; tmpInd++) {
							productId = prevIds[tmpInd];
							if(newProductList[productId]) {
								// least only ids to add
								delete newProductList[productId];
							} else {
								// prepare ids to remove
								idsToRemove.push(productId);
							}
						}

						idsToAdd = Object.keys(newProductList);
						if(idsToRemove.length || idsToAdd.length) {
							if(idsToRemove.length) {

								window.ptwNotSavingFlag = true;
								for(tmpInd = 0; tmpInd < idsToRemove.length; tmpInd++) {
									// remove from list
									selfPta.removeProductsWrById(idsToRemove[tmpInd]);
								}
								window.ptwNotSavingFlag = null;
							}

							if(idsToAdd.length && ptwcData && ptwcData.products && ptwcData.products) {
								var $nptItemWr
								,	$nptItemText
								,	blockWhereAdd = ptwGetFabric().getByViewId(selfPta.$tableWrapper.attr('id'))
								,	productItem
								,	$addedTblColumn
								,	fillParams = {'isNewColumn':1}
								;
								for(tmpInd = 0; tmpInd < idsToAdd.length; tmpInd++) {
									productId = idsToAdd[tmpInd];
									productItem = ptwcData.products[productId];
									// list
									$nptItemWr = $($('.ptwOneProductTemplate').html()).clone();
									$nptItemText = $nptItemWr.find('.ptwWplItemTitle');
									$productItemWrapp.append($nptItemWr);
									$nptItemWr.attr('data-id', productId);
									$nptItemText.text(productItem.post_title);
									// init delete button
									selfPta.initProductItems($nptItemWr.find('.ptwItemRemoveIcon'));

									// table
									if(blockWhereAdd) {
										// add column
										blockWhereAdd.addColumn();
										_ptwSetColsNumSetting(blockWhereAdd);
										$addedTblColumn = selfPta.$tableWrapper.find('.ptwCol:not(.ptwTableDescCol):not([data-col-product-id])')
										if($addedTblColumn && $addedTblColumn.length) {
											// adding rows to new column!!! (if need columns adding)
											selfPta.addRowsToColumn(blockWhereAdd, $addedTblColumn);
											$addedTblColumn.attr('data-col-product-id', productId);
											// filling data
											selfPta.tblFiller.fillColumnBy([$addedTblColumn], [productItem], selfPta.productProperties, fillParams);
											selfPta.tblFiller.fillSpecCells($addedTblColumn);
										}
										selfPta.initMenuInCells($addedTblColumn.find('.ptwCell'));
										// for price cells
										selfPta.initMenuInCells($addedTblColumn.find('.ptwColDesc'));
									}
								}
							}
							// TODO: save Table
							//_ptwSaveCanvas();
						}
					}

					selfPta.$addProductToListDialog.dialog("close");
				},
				'Cancel': function() {
					selfPta.$addProductToListDialog.dialog("close");
				}
			},
		});
		$('#ptwAddProductBtn').on('click', function(event) {
			selfPta.$addProductToListDialog.dialog('open');
		});
		this.initProductItems();

		// init search
		$('.ptwAplSearchInp').on('keydown', function(event) {
			if(event && event.keyCode == 13) {
				$('.ptwAplSearchBtn').trigger('click');
			}
		});
		$('.ptwAplSearchInp').on('input', function(event) {
			// if search text field is empty - than show all products
			if(!$(this).val().length) {
				$prodItemList.show();
			}
		});
		$('.ptwAplSearchBtn').on('click', function(event) {
			var searchText = $('.ptwAplSearchInp').val()
			;
			if(searchText) {
				$prodItemList.filter(function(fltrInd) {
					var $currProductItem = $(this)
					,	currItemTitle = $currProductItem.attr('data-search-by-name')
					,	isSearched = false
					;
					currItemTitle = decodeURI(currItemTitle);
					if(currItemTitle) {
						var replRe = new RegExp('\\+', 'g');

						currItemTitle = currItemTitle.replace(replRe, ' ');
						currItemTitle = currItemTitle.toLowerCase();
						searchText = searchText.toLowerCase();
						if(currItemTitle.indexOf(searchText) != -1) {
							isSearched = true;
						}
					}
					if(isSearched) {
						$currProductItem.show();
					} else {
						$currProductItem.hide();
					}
				});
			} else {
				$prodItemList.show();
			}
		});
	});

	ptwTablesAdmin.prototype.removeProductsWrById = (function(productId) {
		var	currentBlock = g_ptwBlockFabric.getBlocks();
		// remove from table
		if(currentBlock.length) {
			currentBlock = currentBlock[0];
			var elemInBlock = currentBlock.getElementByAttr('data-col-product-id', productId)
			,	$menuDiv = null;
			if(elemInBlock && elemInBlock.getMenu) {
				$menuDiv = elemInBlock.getMenu();
				$menuDiv._$
					.find('.ptwRemoveElBtn')
					.trigger('click');
			}
		}
	});

	ptwTablesAdmin.prototype.addRowsToColumn = (function(block, $column) {
		// get column Count
		var $descriptionCels = $('.ptwTableDescCol .ptwRows .ptwCell')
		,	columnIdx = 0
		,	currRowCount = $column.find('.ptwRows .ptwCell').length
		;
		currRowCount = $descriptionCels.length - currRowCount;
		for(columnIdx; columnIdx < currRowCount; columnIdx++) {
			block.addRowToOneColumn($column);
		}
	});

	ptwTablesAdmin.prototype.getProductSortable = (function(reInit) {
		var selfPta = this;
		if(!this.$productSortable) {
			this.$productSortable = $('.ptwWooProductListWrapper').sortable({
				'items': '.ptwWplwItemWrapper',
				'handle': '.ptwItemHandlerIcon',
				'placeholder': 'uiProductSortablePlaceholder',
				'axis': 'y',
				'cancel': '.ptwUnsortablePropItems',
				'start': function(event, ui) {
					// get IdProduct for moving element
					selfPta.movedProductItemId = null;
					selfPta.movedProductItemPos = null;
					if(ui.item && ui.item.attr('data-id')) {
						selfPta.movedProductItemId = ui.item.attr('data-id');

						var $sortProductList = $('.ptwWooProductListWrapper .ptwWplwItemWrapper')
						,	$sortMovedItem = $('.ptwWplwItemWrapper[data-id="' + selfPta.movedProductItemId + '"]');
						// save item position in SortableContainer
						selfPta.movedProductItemPos = $sortProductList.index($sortMovedItem)
					}
				},
				'stop': function(event, ui) {
					if(selfPta.movedProductItemId) {
						var $sortProductList = $('.ptwWooProductListWrapper .ptwWplwItemWrapper')
						,	$sortMovedItem = $('.ptwWplwItemWrapper[data-id="' + selfPta.movedProductItemId + '"]')
						,	newPos = $sortProductList.index($sortMovedItem)
						,	product2Id = null
						,	$tableCol1
						,	$tableCol2
						;
						if(newPos != -1 && selfPta.movedProductItemPos != -1
							&& newPos != selfPta.movedProductItemPos
							&& $sortProductList.length > 1
						) {
							var $prevItem = $sortMovedItem.prev();
							// check if item place is First?
							if(!$prevItem.length) {
								var $nextItem = $sortMovedItem.next();
								if($nextItem.length) {
									product2Id = $nextItem.attr('data-id');
									// change columns position
									$tableCol1 = $('.ptwCol[data-col-product-id="' + product2Id + '"]');
									$tableCol2 = $('.ptwCol[data-col-product-id="' + selfPta.movedProductItemId + '"]');
									$tableCol1.before($tableCol2);
								}
							} else {
								// change columns position
								product2Id = $prevItem.attr('data-id');
								$tableCol1 = $('.ptwCol[data-col-product-id="' + product2Id + '"]');
								$tableCol2 = $('.ptwCol[data-col-product-id="' + selfPta.movedProductItemId + '"]');
								$tableCol1.after($tableCol2);
							}
						}
					}
				},
			});
		} else {
			this.$productSortable.sortable('refresh');
		}
	});

	//ptwTablesAdmin.prototype.getProductPropsIds = (function() {
	//	var resArr = []
	//	,	ppInd = 0;
	//	if(this.productProperties && this.productProperties.length) {
	//		for(ppInd; ppInd < this.productProperties.length; ppInd++) {
	//			resArr.push(this.productProperties[ppInd].id);
	//		}
	//	}
	//	return resArr;
	//});

	ptwTablesAdmin.prototype.getProductPropBy = (function(paramNameStr, paramValue) {
		var foundRes = false
		,	ppInd = 0
		,	allPpList = ptwcData.productAttributes
		,	allPpListKeys = Object.keys(allPpList)
		;
		while(!foundRes && ppInd < allPpListKeys.length) {
			if(allPpList[allPpListKeys[ppInd]][paramNameStr] == paramValue) {
				foundRes = allPpList[allPpListKeys[ppInd]];
			}
			ppInd++;
		}
		return foundRes;
	});

	ptwTablesAdmin.prototype.getOneProdPropById = (function(idStr, ppIdx, isReplace) {
		var foundRes = false
		,	ppInd = 0
		,	xFind = false
		;
		foundRes = this.getProductPropBy('id', idStr);
		if(foundRes) {
			ppInd = 0;
			while(xFind === false && ppInd < this.productProperties.length) {
				if(this.productProperties[ppInd].uIdx == ppIdx) {
					xFind = ppInd;
				}
				ppInd++;
			}
			if(xFind !== false) {
				this.productProperties[xFind].id = foundRes.id;
				this.productProperties[xFind].code = foundRes.code;
				this.productProperties[xFind].ptwType = foundRes.ptwType;
			}
		}
		return foundRes;
	});

	ptwTablesAdmin.prototype.getProdListForSave = (function() {
		var resArr = []
		,	objKeys = Object.keys(this.productList)
		,	pInd = 0
		;
		if(this.productList && objKeys.length) {
			for(pInd; pInd < objKeys.length; pInd++) {
				resArr.push(this.productList[objKeys[pInd]].id);
			}
		}
		return resArr;
	});

	ptwTablesAdmin.prototype.getPropertyListForSave = (function() {
		var resArr = []
		,	ppInd = 0;
		if(this.productProperties && this.productProperties.length) {
			for(ppInd; ppInd < this.productProperties.length; ppInd++) {
				resArr.push({
					'property_id': this.productProperties[ppInd].id,
					'order': ppInd,
				});
			}
		}
		return resArr;
	});

	ptwTablesAdmin.prototype.getColumnSortOrder = (function() {
		var columnSortOrderArr = [];
		$('.ptwWooProductListWrapper .ptwWplwItemWrapper').each(function(ind, item) {
			var $oneItem = $(item);
			columnSortOrderArr.push($oneItem.attr('data-id'));
		});
		return columnSortOrderArr;
	});

	ptwTablesAdmin.prototype.getIdxRowSortOrder = (function() {
		var rowsSortOrder = [];
		$('.ptwWooPropList .ptwOnePropItem .ptwPropertySelList').each(function(ind, item) {
			var $oneItem = $(item)
			,	itemPropIdx = $oneItem.parent().attr('data-prop-idx')
			,	itemId = $oneItem.val();
			if(itemPropIdx) {
				rowsSortOrder.push({
					'idx': itemPropIdx,
					'id': itemId
				});
			}
		});
		return rowsSortOrder;
	});

	ptwTablesAdmin.prototype.contentChanged = (function(timeAfterRefresh) {
		if(!timeAfterRefresh) {
			timeAfterRefresh = 1000;
		}
		var blockWhereAdd = ptwGetFabric().getByViewId($('.ptwBlock').attr('id'));
		if(blockWhereAdd) {
			// need to change image height, while image not loaded
			setTimeout(function() {
				blockWhereAdd._refreshCellsHeight();
			}, timeAfterRefresh);
		}
	});

	ptwTablesAdmin.prototype.fillHandler = (function() {
		var $tableList = $('.ptwBlock');
		this.init($tableList);
		this.tblFiller.fillTableBy($tableList, this.productProperties, this.getColumnSortOrder());
		this.initMenuInCells();
		this.tblFiller.markColumnsAsProducts($tableList, this.getColumnSortOrder());
		this.tblFiller.fillSpecCells($tableList.find('.ptwCol[data-col-product-id]'));
	});

	var ptwTa = new ptwTablesAdmin();
	window.ptwTablesAdmin = ptwTa;

	$(document).ready(function(event) {
		ptwTa.fillHandler();
	});
})(jQuery, window.ptwcData);