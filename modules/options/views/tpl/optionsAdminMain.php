<style type="text/css">
	.ptwAdminMainLeftSide {
		width: 56%;
		float: left;
	}
	.ptwAdminMainRightSide {
		width: <?php echo (empty($this->optwDisplayOnMainPage) ? 100 : 40)?>%;
		float: left;
		text-align: center;
	}
	#ptwMainOccupancy {
		box-shadow: none !important;
	}
</style>
<section>
	<div class="supsystic-item supsystic-panel">
		<div id="containerWrapper">
			<?php _e('Main page Go here!!!!', PTW_LANG_CODE)?>
		</div>
		<div style="clear: both;"></div>
	</div>
</section>