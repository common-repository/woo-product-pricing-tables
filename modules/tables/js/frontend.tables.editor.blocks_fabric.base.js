/**
 * Blocks fabric - main object for whole blocks manipulations
 */
function ptwBlockFabric() {
	this._blocks = [];
	this._isSorting = false;
	this._animationSpeed = g_ptwAnimationSpeed;
}
ptwBlockFabric.prototype.addFromHtml = function(blockData, jqueryHtml) {
	var block = this.add( blockData );
	block.setRaw( jqueryHtml );
};
ptwBlockFabric.prototype.add = function(blockData) {
	var blockData = jQuery.extend({}, blockData);
	if(!blockData.original_id) {
		blockData.original_id = blockData.id;
		blockData.id = 0;
	}
	var blockClass = window[ 'ptwBlock_'+ blockData.cat_code ];
	if(blockClass) {
		var block = new blockClass( blockData );
		var blockIter = this._blocks.push( block );
		block.setIter( blockIter - 1 );
		return block;
	} else {
		console.log('Block Class For '+ blockData.cat_code+ ' Not Found!!!');
	}
};
ptwBlockFabric.prototype.getByViewId = function(viewId) {
	if(this._blocks && this._blocks.length) {
		for(var i = 0; i < this._blocks.length; i++) {
			if(this._blocks[ i ].get('view_id') == viewId) {
				return this._blocks[ i ];
			}
		}
	}
	return false;
};