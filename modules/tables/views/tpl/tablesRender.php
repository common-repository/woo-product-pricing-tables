<?php
	$alignClass = '';
	if($this->table && $this->table['params'] && isset($this->table['params']['align']) && !empty($this->table['params']['align']['val'])) {
		$alignClass = 'ptwAlign_'. $this->table['params']['align']['val'];
	}
?>
<div id="{{table.view_id}}" data-original-id="{{table.original_id}}" class="ptwBlock <?php echo $alignClass?>" data-id="<?php echo $this->table ? $this->table['id'] : 0?>">
	<?php if(!$this->table || (isset($this->table['css']) && !empty($this->table['css']))) { ?>
		<style type="text/css" class="ptwBlockStyle"><?php echo $this->table ? $this->table['css'] : ''?></style>
	<?php }?>
	<?php if(!$this->table || (isset($this->table['html']) && !empty($this->table['html']))) { ?>
		<div class="ptwBlockContent"><?php echo $this->table ? $this->table['html'] : ''?></div>
	<?php }?>
	<?php dispatcherPtw::doAction('tableEnd');?>
</div>