<!--Block menus example-->
<div id="ptwBlockMenuExl" class="ptwBlockMenu">
	<div class="ptwBlockMenuEl" data-menu="align">
		<div class="ptwBlockMenuElTitle ptwBlockMenuElAlignTitle">
			<?php _e('Content align', PTW_LANG_CODE)?>
		</div>
		<div class="ptwBlockMenuElAlignContent row">
			<div class="col-sm-4 ptwBlockMenuElElignBtn" data-align="left">
				<i class="tables-icon tables-icon-2x icon-aligne-left"></i>
			</div>
			<div class="col-sm-4 ptwBlockMenuElElignBtn" data-align="center">
				<i class="tables-icon tables-icon-2x icon-aligne-center"></i>
			</div>
			<div class="col-sm-4 ptwBlockMenuElElignBtn" data-align="right">
				<i class="tables-icon tables-icon-2x icon-aligne-right"></i>
			</div>
		</div>
		<?php echo htmlPtw::hidden('params[align]')?>
	</div>
	<div class="ptwBlockMenuEl" data-menu="add_slide">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-image ptwChangeImgBtnIcon"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Add Slide', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="add_gal_item">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-image ptwChangeImgBtnIcon"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Add Image', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="add_menu_item">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-plus-s"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Add Menu Item', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="edit_slides">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-manage ptwChangeImgBtnIcon"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Manage Slides', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="fill_color">
		<div class="ptwBlockMenuElAct">
			<?php echo htmlPtw::checkbox('params[fill_color_enb]')?>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Fill Color', PTW_LANG_CODE)?>
		</div>
<!--		<div class="ptwBlockMenuElRightAct">-->
<!--            --><?php //echo htmlPtw::hidden('params[fill_color]', array(
//                'attrs' => 'class="ptwColorPickInput"'
//            ));?>
<!--            <div class="ptwTear ptwColorPickInputTear"></div>-->
<!--		</div>-->
	</div>
	<div class="ptwBlockMenuEl" data-menu="bg_img">
		<div class="ptwBlockMenuElAct">
			<?php echo htmlPtw::checkbox('params[bg_img_enb]')?>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Background Image...', PTW_LANG_CODE)?>
		</div>
		<div class="ptwBlockMenuElRightAct">
			<i class="tables-icon tables-icon-lg icon-image"></i>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="add_field">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-plus-s"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Add Field', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="sub_settings">
		<div class="ptwBlockMenuElAct">
			<i class="glyphicon glyphicon-send"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Subscribe Settings', PTW_LANG_CODE)?>
		</div>
	</div>
	<div class="ptwBlockMenuEl" data-menu="add_grid_item">
		<div class="ptwBlockMenuElAct">
			<i class="tables-icon tables-icon-lg icon-image"></i>
		</div>
		<div class="ptwBlockMenuElTitle">
			<?php _e('Add Column', PTW_LANG_CODE)?>
		</div>
	</div>
</div>
<!--Image menu-->
<div id="ptwElMenuImgExl" class="ptwElMenu" style="min-width: 330px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn ptwImgChangeBtn">
				<label>
					<?php echo htmlPtw::radiobutton('type', array('value' => 'img'))?>
					<?php _e('Select image', PTW_LANG_CODE)?>
					<i class="glyphicon glyphicon-picture"></i>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwImgVideoSetBtn" data-sub-panel-show="video">
				<label>
					<?php echo htmlPtw::radiobutton('type', array('value' => 'video'))?>
					<?php _e('Video', PTW_LANG_CODE)?>
					<i class="fa fa-video-camera ptwOptIconBtn"></i>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwLinkBtn" data-sub-panel-show="imglink">
				<label>
					<i class="glyphicon glyphicon-link"></i>
					<?php _e('Link', PTW_LANG_CODE); ?>
				</label>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="video">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('video_link')?>
			</label>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="imglink">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_link');?>
			</label>
			<div style="display: none;" class="ptwPostLinkDisabled" data-postlink-to=":parent label [name='icon_item_link']"></div>
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_title');?>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', PTW_LANG_CODE)?></span>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_rel_nofollow')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('add nofollow attribute', PTW_LANG_CODE)?></span>
			</label>
		</div>
	</div>
</div>
<!--Standart Button menu-->
<div id="ptwElMenuBtnExl" class="ptwElMenu" style="min-width: 160px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
<!--			<div class="ptwElMenuBtn ptwLinkBtn" data-sub-panel-show="link">-->
<!--				<label>-->
<!--					<i class="glyphicon glyphicon-link"></i>-->
<!--					--><?php //_e('Link', PTW_LANG_CODE)?>
<!--				</label>-->
<!--			</div>-->
<!--			<div class="ptwElMenuBtnDelimiter"></div>-->
			<div class="ptwElMenuBtn ptwColorBtn" data-sub-panel-show="color-pick-button-txt">
				<label>
					<?php _e('Color', PTW_LANG_CODE)?>
					<div class="ptwTear ptwColorPickInputTear"></div>
				</label>
			</div>
			<div class="ptwElMenuBtn ptwSpecColorCell" data-sub-panel-show="color-pick-button-bg" data-cp-code="background-color">
				<label>
					<?php _e('Bg Color', PTW_LANG_CODE)?>
					<div class="ptwTear ptwColorPickSpecInputTear"></div>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="link">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('btn_item_link')?>
			</label>
			<div style="display: none;" class="ptwPostLinkDisabled" data-postlink-to=":parent label [name='btn_item_link']"></div>
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('btn_item_title')?>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('btn_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', PTW_LANG_CODE)?></span>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('btn_item_link_rel_nofollow')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('add nofollow attribute', PTW_LANG_CODE)?></span>
			</label>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-button-txt">
			<div class="ptwInlineColorPicker"></div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-button-bg">
			<div class="ptwInlineSpecColorPicker"></div>
		</div>
	</div>
</div>
<!--Image menu-->
<div id="ptwElMenuImgExl" class="ptwElMenu" style="min-width: 260px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn ptwImgChangeBtn">
				<label>
					<?php echo htmlPtw::radiobutton('type', array('value' => 'img'))?>
					<?php _e('Select image', PTW_LANG_CODE)?>
					<i class="glyphicon glyphicon-picture"></i>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwImgVideoSetBtn" data-sub-panel-show="video">
				<label>
					<?php echo htmlPtw::radiobutton('type', array('value' => 'video'))?>
					<?php _e('Video', PTW_LANG_CODE)?>
					<i class="fa fa-video-camera ptwOptIconBtn"></i>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="video">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('video_link')?>
			</label>
		</div>
	</div>
</div>
<!--Grid Column menu-->
<div id="ptwElMenuGridColExl" class="ptwElMenu" style="min-width: 370px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn">
				<?php echo htmlPtw::checkbox('enb_fill_color')?>
			</div>
			<div class="ptwElMenuBtn ptwColorBtn" data-sub-panel-show="color-pick-table-cell">
				<label>
					<?php _e('Fill Color', PTW_LANG_CODE)?>
					<div class="ptwTear ptwColorPickInputTear"></div>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn">
				<?php echo htmlPtw::checkbox('enb_bg_img')?>
			</div>
			<div class="ptwElMenuBtn ptwImgChangeBtn">
				<label>
					<?php _e('Background Image', PTW_LANG_CODE)?>
					<i class="glyphicon glyphicon-picture"></i>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-table-cell">
			<div class="ptwInlineColorPicker"></div>
		</div>
	</div>
</div>
<!--Table Column menu-->
<div id="ptwElMenuTableColExl" class="ptwElMenu" style="min-width: 200px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn">
				<?php echo htmlPtw::checkbox('enb_fill_color')?>
			</div>
			<div class="ptwElMenuBtn ptwColorBtn" data-sub-panel-show="color-pick-table-cell">
				<label>
					<?php _e('Fill Color', PTW_LANG_CODE)?>
					<?php echo htmlPtw::hidden('color', array(
						'attrs' => 'class="ptwColorPickInput"'
					));?>
					<div class="ptwTear ptwColorPickInputTear"></div>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn">
				<?php echo htmlPtw::checkbox('enb_badge_col')?>
			</div>
			<div class="ptwElMenuBtn ptwColBadgeBtn">
				<?php _e('Badge for Column', PTW_LANG_CODE)?>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-table-cell">
			<div class="ptwInlineColorPicker"></div>
		</div>
	</div>
</div>
<!--Table Cell menu-->
<div id="ptwElMenuTableCellExl" class="ptwElMenu" style="min-width: 170px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn ptwSpecColorCell" data-sub-panel-show="color-pick-cell-color" data-cp-code="color">
				<label>
					<?php _e('Color', PTW_LANG_CODE)?>
					<div class="ptwTear ptwColorPickSpecInputTear"></div>
				</label>
			</div>
			<div class="ptwElMenuBtn ptwSpecColorCell" data-sub-panel-show="color-pick-cell-background-color" data-cp-code="background-color">
				<label>
					<?php _e('Bg Color', PTW_LANG_CODE)?>
					<div class="ptwTear ptwColorPickSpecInputTear"></div>
				</label>
			</div>
		</div>
		<!-- sub panels -->
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-cell-color">
			<div class="ptwInlineSpecColorPicker"></div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-cell-background-color">
			<div class="ptwInlineSpecColorPicker"></div>
		</div>
	</div>
</div>
<!-- Icon menu -->
<div id="ptwElMenuIconExl" class="ptwElMenu" style="min-width: 290px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn ptwIconLibBtn" data-sub-panel-show="link">
				<i class="fa fa-lg fa-pencil ptwOptIconBtn"></i>
				<?php _e('Change Icon', PTW_LANG_CODE)?>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwColorBtn" data-sub-panel-show="color-pick-table-cell">
				<?php _e('Color', PTW_LANG_CODE)?>
				<div class="ptwTear ptwColorPickInputTear"></div>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwLinkBtn" data-sub-panel-show="iconlink">
				<i class="glyphicon glyphicon-link"></i>
				<?php _e('Link', PTW_LANG_CODE)?>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="iconlink">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_link');?>
			</label>
			<div style="display: none;" class="ptwPostLinkDisabled" data-postlink-to=":parent label [name='icon_item_link']"></div>
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_title');?>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', PTW_LANG_CODE)?></span>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_rel_nofollow')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('add nofollow attribute', PTW_LANG_CODE)?></span>
			</label>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-table-cell">
			<div class="ptwInlineColorPicker"></div>
		</div>
	</div>
</div>
<!-- Table Cell Icon menu -->
<div id="ptwElMenuTableCellIconExl" class="ptwElMenu" style="min-width: 250px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
			<div class="ptwElMenuBtn ptwIconLibBtn" data-sub-panel-show="link">
				<i class="fa fa-lg fa-pencil ptwOptIconBtn"></i>
				<?php _e('Change Icon', PTW_LANG_CODE)?>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn"  data-sub-panel-show="size">
				<i class="glyphicon glyphicons-resize-small"></i>
				<?php _e('Icon Size', PTW_LANG_CODE)?>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwColorBtn" data-sub-panel-show="color-pick-table-cell">
				<?php _e('Color', PTW_LANG_CODE)?>
				<div class="ptwTear ptwColorPickInputTear"></div>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwLinkBtn" data-sub-panel-show="iconlink">
				<label>
					<i class="glyphicon glyphicon-link"></i>
					<?php _e('Link', PTW_LANG_CODE)?>
				</label>
			</div>
			<div class="ptwElMenuBtnDelimiter"></div>
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
		<div class="ptwElMenuSubPanel ptwElMenuSubPanelIconSize" data-sub-panel="size">
			<span data-size="fa-lg">lg</span>
			<span data-size="fa-2x">2x</span>
			<span data-size="fa-3x">3x</span>
			<span data-size="fa-4x">4x</span>
			<span data-size="fa-5x">5x</span>
		</div>
		<div class="ptwElMenuSubPanel" data-sub-panel="iconlink">
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('link', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_link')?>
			</label>
			<div style="display: none;" class="ptwPostLinkDisabled" data-postlink-to=":parent label [name='icon_item_link']"></div>
			<label class="ptwElMenuSubPanelRow">
				<span class="mce-input-name-txt"><?php _e('title', PTW_LANG_CODE)?></span>
				<?php echo htmlPtw::text('icon_item_title')?>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_new_wnd')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('open link in a new window', PTW_LANG_CODE)?></span>
			</label>
			<label class="ptwElMenuSubPanelRow">
				<?php echo htmlPtw::checkbox('icon_item_link_rel_nofollow')?>
				<span class="mce-input-name-txt mce-input-name-not-first"><?php _e('add nofollow attribute', PTW_LANG_CODE)?></span>
			</label>
		</div>
		<div class="ptwElMenuSubPanel"></div>
		<div class="ptwElMenuSubPanel" data-sub-panel="color-pick-table-cell">
			<div class="ptwInlineColorPicker"></div>
		</div>
	</div>
</div>
<!--Table Cell Image menu-->
<div id="ptwElMenuTableCellImgExl" class="ptwElMenu" style="min-width: 140px;">
	<div class="ptwElMenuContent">
		<div class="ptwElMenuMainPanel">
<!--			<div class="ptwElMenuBtn ptwLinkBtn" data-sub-panel-show="imagelink">-->
<!--				<label>-->
<!--					<i class="glyphicon glyphicon-link"></i>-->
<!--					--><?php //_e('Link', PTW_LANG_CODE)?>
<!--				</label>-->
<!--			</div>-->
			<div class="ptwElMenuBtn ptwRemoveElBtn">
				<i class="fa fa-trash-o ptwOptIconBtn"></i>
			</div>
		</div>
	</div>
</div>
<!--Icons library wnd-->
<div class="modal fade" id="ptwIconsLibWnd" tabindex="-1" role="dialog" aria-labelledby="ptwIconsLibWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="fa fa-close" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Icons Library', PTW_LANG_CODE)?></h4>
			</div>
			<div class="modal-body ptwElMenuSubPanel">
				<div id="ptwSubSettingsWndTabs">
					<?php echo htmlPtw::text('icon_search', array(
						'attrs' => 'class="ptwIconsLibSearchTxt" placeholder="'. esc_html(__('Search, for example - pencil, music, ...', PTW_LANG_CODE)). '"',
					))?>
					<div class="ptwIconsLibList row"></div>
					<div class="ptwIconsLibEmptySearch alert alert-info" style="display: none;"><?php _e('Nothing found for <span class="ptwNothingFoundKeys"></span>, maybe try to search something else?', PTW_LANG_CODE)?></div>
				</div>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary ptwIconsLibSaveBtn"><?php _e('Close', PTW_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>
<!--Badges library wnd-->
<div class="modal fade" id="ptwBadgesLibWnd" tabindex="-1" role="dialog" aria-labelledby="ptwIconsLibWndLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="button close" data-dismiss="modal" aria-label="Close">
					<i class="fa fa-close" aria-hidden="true"></i>
				</button>
				<h4 class="modal-title"><?php _e('Badges Library', PTW_LANG_CODE)?></h4>
			</div>
			<div class="modal-body ptwElMenuSubPanel">
				<form id="ptwBadgesLibForm">
					<div class="row">
						<div class="col-sm-6">
							<div class="ptwTableSetting row col-sm-12">
								<label>
									<?php _e('Badge Label', PTW_LANG_CODE)?>:
									<?php echo htmlPtw::text('badge_name', array('value' => __('Sale!', PTW_LANG_CODE)))?>
								</label>
							</div>
							<?php /*?><div class="ptwTableSetting row col-sm-12">
								<?php _e('Badge Type', PTW_LANG_CODE)?>:
								<div>
									<label>
										<?php echo htmlPtw::radiobutton('badge_type', array('value' => 'corner', 'checked' => true))?>
										<?php _e('Corner', PTW_LANG_CODE)?>
									</label>
									<label>
										<?php echo htmlPtw::radiobutton('badge_type', array('value' => 'corner_cut'))?>
										<?php _e('Corner Cut', PTW_LANG_CODE)?>
									</label>
									<label>
										<?php echo htmlPtw::radiobutton('badge_type', array('value' => 'rect'))?>
										<?php _e('Rectangle', PTW_LANG_CODE)?>
									</label>
									<label>
										<?php echo htmlPtw::radiobutton('badge_type', array('value' => 'circle'))?>
										<?php _e('Circle', PTW_LANG_CODE)?>
									</label>
								</div>
							</div><?php */?>
							<div class="ptwTableSetting row col-sm-12">
								<?php _e('Badge Background Color', PTW_LANG_CODE)?>:
								<?php echo htmlPtw::hidden('badge_bg_color', array(
									'attrs' => 'class="ptwColorPickInput"',
								));?>
								<div class="ptwTear ptwColorPickInputTear"></div>
							</div>
							<div class="ptwTableSetting row col-sm-12">
								<?php _e('Badge Text Color', PTW_LANG_CODE)?>:
								<?php echo htmlPtw::hidden('badge_txt_color', array(
									'attrs' => 'class="ptwColorPickInput"',
								));?>
								<div class="ptwTear ptwColorPickInputTear"></div>
							</div>
							<div class="ptwTableSetting row ptwTableBadgePositionRow col-sm-12">
								<?php _e('Select position for Badge', PTW_LANG_CODE)?>
								<?php echo htmlPtw::hidden('badge_pos', array('value' => 'left'))?>
								<div class="ptwTableBadgePositionsShell">
									<div class="ptwTableBadgePosition active" data-pos="left"></div>
									<div class="ptwTableBadgePosition" data-pos="left-top"></div>
									<div class="ptwTableBadgePosition" data-pos="top"></div>
									<div class="ptwTableBadgePosition" data-pos="right-top"></div>
									<div class="ptwTableBadgePosition" data-pos="right"></div>
								</div>
							</div>
						</div>
						<div class="col-sm-6">
							<div id="ptwTableBadgeColTest">
								<div id="ptwTableBadgePrev" class="ptwColBadge" style="">
									<div class="ptwColBadgeContent"></div>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
			<div class="modal-footer">
				<button type="button" class="button-primary ptwBadgesLibSaveBtn"><?php _e('Save', PTW_LANG_CODE)?></button>
			</div>
		</div>
	</div>
</div>

<!-- Text align in column -->
<div id="ptwTextAlignColumn" class="ptwTextAlignColumn ptwElMenuBtn">
	<span class="ptwTextAlignSwitch" data-align="left">
		<i class="fa fa-align-left ptwOptIconBtn"></i>
	</span>
	<span class="ptwTextAlignSwitch" data-align="center">
		<i class="fa fa-align-center ptwOptIconBtn"></i>
	</span>
	<span class="ptwTextAlignSwitch" data-align="right">
		<i class="fa fa-align-right ptwOptIconBtn"></i>
	</span>
</div>

<!--Edit Tooltip cell btn-->
<div id="ptwTooltipEditBtnShellExl" class="ptwTooltipEditBtnShell">
	<div class="ptwTooltipEditBtn ptwElMenuBtn ptwAddCellEditBtn" title="<?php _e('Edit Tooltip for Cell', PTW_LANG_CODE)?>">
		<i class="fa fa-info ptwOptIconBtn"></i>
	</div>
	<div class="ptwTooltipEditWnd ptwShowSmooth">
		<textarea name="tooltip"></textarea>
	</div>
</div>
<!--Remove row btn-->
<div id="ptwRemoveRowBtnExl" class="ptwRemoveRowBtn ptwElMenuBtn ptwAddCellEditBtn" title="<?php _e('Remove Row', PTW_LANG_CODE)?>">
	<i class="fa fa-trash-o ptwOptIconBtn"></i>
</div>
<div id="ptwElementButtonDefaultTemplate" class="ptwActBtn ptwEl ptwElInput" data-el="btn">
	<a target="_blank" href="http://woobewoo.com/" class="ptwEditArea ptwInputShell">Text</a>
</div>


<div id="ptwAddHtmlAttribute" class="ptwAddHtmlAttribute" data-sub-panel-show="add_attr">
	<label>
		<i class="mce-ico mce-i-fullpage"></i>
		Attributes
	</label>
</div>

<div id="ptwSubMenyAddHtmlAttr" class="ptwElMenuSubPanel" data-sub-panel="add_attr"></div>

<label id="ptwRowAddHtmlAttr" class="ptwElMenuSubPanelRow" style="display:none;">
	<span class="mce-input-name-txt"></span>
	<input type="text" name="btn_item_link" value="">
</label>

<div id="ptwMceSubMenyAddHtmlAttr">
	<div class="mce-not-inline mce-menu-item mce-menu-item-normal mce-first mce-stack-layout-item mce-link-row">
		<label class="ptwElMenuSubPanelRow" data-id="id">
			<span class="mce-input-name-txt">id</span>
			<input type="text" name="id" value="">
		</label>
	</div>
	<div class="mce-not-inline mce-menu-item mce-menu-item-normal mce-first mce-stack-layout-item mce-link-row">
		<label class="ptwElMenuSubPanelRow" data-id="style">
			<span class="mce-input-name-txt">style</span>
			<input type="text" name="style" value="">
		</label>
	</div>
	<div class="mce-not-inline mce-menu-item mce-menu-item-normal mce-first mce-stack-layout-item mce-link-row">
		<label class="ptwElMenuSubPanelRow" data-id="class">
			<span class="mce-input-name-txt">class</span>
			<input type="text" name="class" value="">
		</label>
	</div>
</div>