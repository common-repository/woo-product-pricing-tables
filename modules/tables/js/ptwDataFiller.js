(function($, ptwData) {

	function ptwTableFiller() {
	}

	ptwTableFiller.prototype.init = (function() {
		this.$cellEntryPattern = $('<div class="ptwEl mce-content-body"  style=""><p><span class="ptwCellTextEntry" style="font-size: 12pt;" data-mce-style="font-size: 12pt;"></span></p></div>');
		this.$cellEntryImgPattern = $('<div class="ptwEl mce-content-body"  style=""><p><img src="" alt="" class="ptwCellTextEntry" data-type="img"/></p></div>');
	});

	ptwTableFiller.prototype.createProductPropFromObj = (function(idxObj, isFrontend) {
		var prodAttributesArr = []
		,	objKeys = Object.keys(idxObj)
		;
		if(ptwData && ptwData.productAttributes && objKeys && objKeys.length) {
			var keyInd
			,	propIdx
			,	itemToAdd
			,	propId
			,	propUidx
			;
			for(keyInd = 0; keyInd < objKeys.length; keyInd++) {
				propIdx = objKeys[keyInd];
				if(isFrontend) {
					propId = idxObj[propIdx].property_id;
					propUidx = idxObj[propIdx].uIdx;
				} else {
					propId = idxObj[propIdx].id;
					propUidx = idxObj[propIdx].idx;
				}
				if(propId in ptwData.productAttributes) {
					itemToAdd = $.extend({}, ptwData.productAttributes[propId]);
					itemToAdd['uIdx'] = propUidx;
					prodAttributesArr.push(itemToAdd);
				}
			}
		}
		return prodAttributesArr;
	});

	ptwTableFiller.prototype.getProductsBy = (function(ids) {
		var products = {};
		if(ptwData && ptwData.products && ids && ids.length) {
			var keyInd;

			for(keyInd = 0; keyInd < ids.length; keyInd++) {
				var prodInd = ids[keyInd];
				if(prodInd in ptwData.products) {
					products[keyInd] = ptwData.products[prodInd];
				}
			}
		}
		return products;
	});

	ptwTableFiller.prototype.getProductPropBy = (function(paramNameStr, paramValue) {
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

	ptwTableFiller.prototype.fillRowBy = (function($cellsInRow, fillDescr, prodPropertyObj, productIds, responsiveMode, replaceDescrEntry) {
		var selfPtf = this
		,	columnInd = 0
		,	$currentCell
		,	currentProductList = selfPtf.getProductsBy(productIds)
		,	currProdListKeys = Object.keys(currentProductList)
		;
		if($cellsInRow.length && prodPropertyObj && prodPropertyObj.code) {
			columnInd = 0;
			$cellsInRow.each(function(ind, item) {
				$currentCell = $(item);
				// fill data in description column
				if(!responsiveMode) {
					if(fillDescr && columnInd == 0) {
						if(replaceDescrEntry == 1) {
							// replace cell entry
							selfPtf.addCellEntry($currentCell, 'some-property', '', prodPropertyObj.uIdx);
							$currentCell.find('.ptwCellTextEntry').html(prodPropertyObj.title);
							$currentCell.find('.ptwEl')
								.addClass('ptwIsTableCellTxtEdit')
								.attr('contenteditable', 'true')
								.attr('spellcheck', 'false')
							;
						} else if(replaceDescrEntry == 2) {
							// change only title and idxNumber
							$currentCell.attr('data-prop-idx', prodPropertyObj.uIdx);
							$currentCell.find('.ptwCellTextEntry').html(prodPropertyObj.title);
						}
						fillDescr = false;
					} else {
						if(currentProductList && currProdListKeys.length && columnInd < currProdListKeys.length) {
							selfPtf.fillCellBy(prodPropertyObj, currentProductList[columnInd], $currentCell);
						}
						columnInd++;
					}
				} else {
					if(fillDescr) {
						if(replaceDescrEntry == 1) {
							// replace cell entry
							selfPtf.addCellEntry($currentCell, 'some-property', '', prodPropertyObj.uIdx);
							$currentCell.find('.ptwCellTextEntry').html(prodPropertyObj.title);
							$currentCell.find('.ptwEl')
								.addClass('ptwIsTableCellTxtEdit')
								.attr('contenteditable', 'true')
								.attr('spellcheck', 'false')
							;
						} else if(replaceDescrEntry == 2) {
							// change only title and idxNumber
							$currentCell.attr('data-prop-idx', prodPropertyObj.uIdx);
							$currentCell.find('.ptwCellTextEntry').html(prodPropertyObj.title);
						}
						fillDescr = false;
					} else {
						if(currentProductList && currProdListKeys.length && columnInd < currProdListKeys.length) {
							selfPtf.fillCellBy(prodPropertyObj, currentProductList[columnInd], $currentCell);
						}
						columnInd++;
						fillDescr = true;
					}
				}

			});
		}
	});

	/**
	 * Filling "Product Name", "Product Price" and "Product url" cells
	 * @type {Function}
	 */
	ptwTableFiller.prototype.fillSpecCells = (function($columns) {
		var selfPtf = this
		,	params = {}
		,	propObj = false
		//,	headerTypes = ['_price', 'post_title', 'post_url']
		,	$priceColumns = []
		,	$nameColumns = []
		,	$linkColumns = []
		;
		params['fillType'] = 'srcItem';

		$columns.each(function(index2, item2) {
			var $column2 = $(item2)
			,	productId = $column2.attr('data-col-product-id')
			,	productItem = ptwData.products[productId]
			;
			if(productItem) {
				propObj = $.extend({}, selfPtf.getProductPropBy('code', '_price'));
				propObj['uIdx'] = mtRand(100000, 999999);
				$priceColumns = $column2.find('.ptwPropAttrPrice .ptwEl');
				selfPtf.fillColumnBy([$priceColumns], [productItem], [propObj], params);

				propObj = $.extend({}, selfPtf.getProductPropBy('code', 'post_title'));
				propObj['uIdx'] = mtRand(100000, 999999);
				$nameColumns = $column2.find('.ptwPropAttrName .ptwPropValAttrName');
				selfPtf.fillColumnBy([$nameColumns], [productItem], [propObj], params);

				propObj = $.extend({}, selfPtf.getProductPropBy('code', 'post_url'));
				propObj['uIdx'] = mtRand(100000, 999999);
				$linkColumns = $column2.find('.ptwPropAttrLink .ptwPropValAttrLink');
				selfPtf.fillColumnBy([$linkColumns], [productItem], [propObj], params);
			}
		});
	});

	ptwTableFiller.prototype.fillColumnBy = (function(columnsArr, productItemArr, propertyArr, params) {
		var ptfSelf = this
		,	pAttributesKeys = Object.keys(propertyArr)
		,	pAttrKeyIdx
		,	columnIdx
		,	rowIdx
		,	$columnCells
		,	currProduct
		;
		if(columnsArr.length > 0) {
			for(columnIdx = 0; columnIdx < columnsArr.length; columnIdx++) {
				if(columnIdx < productItemArr.length) {
					if(params && params.isNewColumn == 1) {
						$columnCells = columnsArr[columnIdx].find('.ptwRows .ptwCell');
					} else if(columnsArr && columnsArr[columnIdx] && columnsArr[columnIdx].length) {
						$columnCells = columnsArr[columnIdx];
					} else {
						$columnCells = columnsArr[columnIdx].find('.ptwRows .ptwCell');
					}
					currProduct = productItemArr[columnIdx];

					for(rowIdx = 0; rowIdx < $columnCells.length; rowIdx++) {
						if(rowIdx < pAttributesKeys.length) {
							pAttrKeyIdx = pAttributesKeys[rowIdx];
							this.fillCellBy(propertyArr[pAttrKeyIdx], currProduct, $columnCells.eq(rowIdx), params);
						}
					}
				}
			}
		}
	});

	ptwTableFiller.prototype.fillTableBy = (function($tableWrapper, propertyList, productList) {
		var selfPtf = this;

		var $rowsCount = $tableWrapper.find('.ptwCol:first .ptwRows .ptwCell');
		if($rowsCount.length) {
			var rowInd;
			for(rowInd = 0; rowInd < $rowsCount.length && rowInd < propertyList.length; rowInd++) {
				var $currCellsInRow = null
				,	descrColumnCount = $tableWrapper.find('.ptwCol.ptwTableDescCol').length
				,	responsiveMode = 0;
				// check responsive mode?
				responsiveMode = descrColumnCount > 1;
				$currCellsInRow = $tableWrapper.find('.ptwCol .ptwRows .ptwCell:nth-of-type(' + (rowInd + 1) + ')');
				selfPtf.fillRowBy($currCellsInRow, descrColumnCount != 0, propertyList[rowInd], productList, responsiveMode, 1);
			}
		}
	});

	ptwTableFiller.prototype.fillCellBy = (function(currPropObj, currProduct, $currCell, params) {
		var $ptwCellTextEntry
		,	productValue
		;
		if(params && params['fillType'] == 'srcItem') {
			$ptwCellTextEntry = $currCell;
		} else {
			this.addCellEntry($currCell, currPropObj.code, currProduct['id'], currPropObj['uIdx']);
			$ptwCellTextEntry = $currCell.find('.ptwCellTextEntry');
		}
		productValue = currProduct[currPropObj.code];
		this.fillCellHtml($ptwCellTextEntry, productValue, currPropObj.code);
	});

	ptwTableFiller.prototype.fillCellHtml = (function($htmlItem, htmlValue, itemType) {
		if($htmlItem && $htmlItem.length) {
			if(!htmlValue) {
				htmlValue = '';
			}
			// specific filling for images
			if(itemType == 'post_thumbnail_url') {
				$htmlItem.attr('src', htmlValue[0]);
			} else if(itemType == 'post_url') {
				if($htmlItem.prop('tagName') != 'A') {
					// if it a <span> (cell in simple row)
					//$htmlItem.parent().html('<a target="_blank" class="ptwCellTextEntry ptwPostLinkForProduct" href="' + htmlValue + '">Buy</a>');
					$htmlItem.html(htmlValue);
				} else {
					// if it a <button> ?
					$htmlItem.attr('href', htmlValue)
				}
			} else {
				// specific filling for arrays
				if(htmlValue.join) {
					$htmlItem.html(htmlValue.join('; '));
				} else {
					$htmlItem.html(htmlValue);
				}
			}
		} else {
			console.log('Error. Incorrect ProductAttribute Code or Value!');
		}
	});

	ptwTableFiller.prototype.addCellEntry = (function($currCell, currAttrCode, productId, propertyIdx) {
		var $newCellEntry;
		// check cell type
		if(currAttrCode != 'post_thumbnail_url') {
			$newCellEntry = this.$cellEntryPattern.clone();
		} else {
			$newCellEntry = this.$cellEntryImgPattern.clone();
		}
		$currCell.html($newCellEntry);
		$currCell.attr('data-prop-id', currAttrCode);
		$currCell.attr('data-prop-idx', propertyIdx);
		if(productId) {
			$currCell.attr('data-product-id', productId);
		}
	});

	ptwTableFiller.prototype.markColumnsAsProducts = function($tableWrapper, productList) {
		var $columns = $tableWrapper.find('.ptwCol')
		,	tmpIdx = 0
		;
		if($columns.length && productList.length) {
			for(tmpIdx; tmpIdx < productList.length; tmpIdx++) {
				if((tmpIdx + 1) < $columns.length) {
					$columns.eq(tmpIdx + 1).attr('data-col-product-id', productList[tmpIdx]);
				}
			}
		}
	};

	// create new object
	var ptwTfItem = new ptwTableFiller();
	window.ptwTableFiller = ptwTfItem;
	$(document).ready(function(event) {
		var $tableList = $('.ptwBlock');
		ptwTfItem.init();
	});

}) (jQuery, window.ptwcData);