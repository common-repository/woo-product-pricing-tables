<section>
	<div class="supsystic-item supsystic-panel">
		<div id="containerWrapper">
			<ul id="ptwPagesTblNavBtnsShell" class="supsystic-bar-controls">
				<li title="<?php _e('Delete selected', PTW_LANG_CODE)?>">
					<button class="button" id="ptwPagesRemoveGroupBtn" disabled data-toolbar-button>
						<i class="fa fa-fw fa-trash-o"></i>
						<?php _e('Delete selected', PTW_LANG_CODE)?>
					</button>
				</li>
				<li title="<?php _e('Search', PTW_LANG_CODE)?>">
					<input id="ptwPagesTblSearchTxt" type="text" name="tbl_search" placeholder="<?php _e('Search', PTW_LANG_CODE)?>">
				</li>
			</ul>
			<div id="ptwPagesTblNavShell" class="supsystic-tbl-pagination-shell"></div>
			<div style="clear: both;"></div>
			<hr />
			<table id="ptwPagesTbl"></table>
			<div id="ptwPagesTblNav"></div>
			<div id="ptwPagesTblEmptyMsg" style="display: none;">
				<h3><?php printf(__('You have no Tables for now. <a href="%s" style="font-style: italic;">Create</a> your First Table!', PTW_LANG_CODE), $this->addNewLink)?></h3>
			</div>
		</div>
		<div style="clear: both;"></div>
	</div>
</section>