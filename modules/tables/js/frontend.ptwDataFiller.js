(function($, ptwData) {

	function ptwInitTablesOnFrontend() {
		var $tableList = $('.ptwBlock:not(.ptwInitedTable)');
		window.ptwTableFiller.init();

		$tableList.each(function(ind, tableItem) {
			var $currTable = $(tableItem)
			,	tableId = $currTable.attr('data-id')
			,	windowData = null
			;
			if(tableId && window['ptwTableFront_' + tableId]) {
				windowData = window['ptwTableFront_' + tableId];
				if(windowData.tableProducts && windowData.tableProductAttr) {

					window.ptwTableFiller.fillTableBy(
						$currTable,
						window.ptwTableFiller.createProductPropFromObj(windowData.tableProductAttr, true),
						windowData.tableProducts
					);
				}
			}
			// need to update pricing values
			window.ptwTableFiller.fillSpecCells($currTable.find('.ptwCol[data-col-product-id]'));

			if(g_ptwBlockFabric && g_ptwBlockFabric._blocks && ind < g_ptwBlockFabric._blocks.length) {
				// refresh cells Height
				setTimeout(function() {
					g_ptwBlockFabric._blocks[ind]._refreshCellsHeight();
				}, 500);
			}
			$currTable.addClass('ptwInitedTable');
		});
	}

	// for init tables loaded from ajax
	$(document).on('ptwInitTableHandler', function(event) {
		ptwInitTablesOnFrontend();
	});

	$(document).ready(function(event) {
		ptwInitTablesOnFrontend();
	});
}) (jQuery, window.ptwcData);