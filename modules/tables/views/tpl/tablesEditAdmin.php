<?php $isPro = framePtw::_()->getModule('promo')->isPro(); ?>
<?php
	$productPropSelValues = array();
	if(count($this->allProdAttrs)) {
		foreach($this->allProdAttrs as $oneProdAttr) {
			$productPropSelValues[$oneProdAttr['id']] = $oneProdAttr['title'];
		}
	}
?>
<section>
	<div class="supsystic-item supsystic-panel" style="padding-left: 10px;">
		<div id="containerWrapper">
			<div class="ptwTableSettingsShell row">
                <div class="ptwSettingsContent">
					<div class="ptwWooImportWrapper">
						<div class="ptwWooProductsWrapper">
							<p class="ptwWooProductPropCapt2"><?php _e('Products', PTW_LANG_CODE); ?></p>
							<div class="ptwWooPropListBorder">
								<button class="button" id="ptwAddProductBtn">
									<i class="fa fa-plus"></i>
									<?php echo __('Add product to pricing table', PTW_LANG_CODE); ?>
								</button>
								<div class="ptwProductsDialog" title="<?php echo "Select the products for table"; ?>" style="display:none;">
									<div class="ptwAplSearchContainer">
										<label for="ptwAplSearchInpId" class="ptwAplSearchLabel">
											<?php echo __('Product name:', PTW_LANG_CODE); ?>
										</label>
										<input type="text" class="ptwAplSearchInp" value="" id="ptwAplSearchInpId"/>
										<button class="ptwAplSearchBtn button"><?php echo __('Search', PTW_LANG_CODE); ?></button>
									</div>
									<div class="ptwAllProductListWrap">
										<?php if(count($this->allProductList)) :
											foreach($this->allProductList as $oneProduct):
										?>
											<div class="ptwAplOneItem" data-search-by-name="<?php echo urlencode($oneProduct['title']); ?>">
												<label class="ptwAplOneItemLabel">
													<input class="ptwAplOneItemCheckbox" type="checkbox" id="ptwTblProdChBox-<?php echo $oneProduct['id']; ?>" value="<?php echo $oneProduct['id']; ?>"/>
													<?php echo $oneProduct['title']; ?>
												</label>
											</div>
										<?php
											endforeach;
											endif;
										?>
									</div>
									<div class="ptwOneProductTemplate" style="display: none;">
										<div class="ptwWplwItemWrapper" data-id="">
											<i class="fa fa-arrows-v ptwItemHandlerIcon"></i>
											<div class="ptwWplItemTitle"></div>
											<i class="fa fa-trash ptwItemRemoveIcon"></i>
										</div>
									</div>
								</div>
								<div class="ptwWooProductListWrapper">
									<?php
										if(isset($this->productList) && count($this->productList)):
											foreach($this->productList as $productId):
									?>
												<div class="ptwWplwItemWrapper" data-id="<?php echo $productId; ?>">
													<i class="fa fa-arrows-v ptwItemHandlerIcon"></i>
													<div class="ptwWplItemTitle">
														<?php echo $this->allProductList[$productId]['title']; ?>
													</div>
													<i class="fa fa-trash ptwItemRemoveIcon"></i>
												</div>
									<?php
											endforeach;
										endif;
									?>
								</div>
							</div>
						</div>

						<div class="ptwWooProductPropertyWrapper">
							<p class="ptwWooProductPropCapt2"><?php _e('Product properties', PTW_LANG_CODE); ?></p>
							<div class="ptwWooPropListBorder">
								<button class="ptwAddNewPropertyField button">
									<i class="fa fa-plus"></i>
									<?php echo __('Add New Field', PTW_LANG_CODE); ?>
								</button>
								<div class="ptwWooPropList">
									<?php
										if(isset($this->productAttributes) && count($this->productAttributes)):
											foreach($this->productAttributes as $tempKey => $oneProdAttr):
									?>
												<div class="ptwOnePropItem" data-prop-idx="<?php echo $oneProdAttr['uIdx'];?>">
													<i class="fa fa-arrows-v ptwOnePiHandle"></i>
													<?php
														echo htmlPtw::selectbox('productProperty[]', array(
															'attrs' => ' class="ptwPropertySelList" ',
															'options' => $productPropSelValues,
															'value' => $oneProdAttr['property_id'],
														));
													?>
													<i class="fa fa-trash ptwOnePiTrash"></i>
												</div>
									<?php
											endforeach;
										endif;
									?>
								</div>
							</div>
						</div>
						<div class="ptwOnePropertyItemTemplate" style="display: none;">
							<div class="ptwOnePropItem">
								<i class="fa fa-arrows-v ptwOnePiHandle"></i>
								<?php
								echo htmlPtw::selectbox('productProperty[]', array(
									'attrs' => ' class="ptwPropertySelList" ',
									'options' => $productPropSelValues,
								));
								?>
								<i class="fa fa-trash ptwOnePiTrash"></i>
							</div>
						</div>
					</div>

					<div id="#main" class="main">
						<?php echo htmlPtw::hidden('params[is_horisontal_row_type]', array(
							'value' => isset($this->table['params']['is_horisontal_row_type']) ? $this->table['params']['is_horisontal_row_type']['val'] : '0',
						)); ?>

						<div class="ptwTableSetting col-md-3">
							<label style="float: left; padding-right: 5px;">
								<?php echo htmlPtw::radiobutton('params[calc_width]', array(
									'value' => 'table',
									'checked' => (isset($this->table['params']['calc_width']) && $this->table['params']['calc_width']['val'] == 'table'),
								))?>
								<span class="sup-complete-txt"><?php _e('Table Width', PTW_LANG_CODE)?>:</span>
								<span class="sup-reduce-txt"><?php _e('Tbl. Width', PTW_LANG_CODE)?>:</span>
								<?php echo htmlPtw::text('params[table_width]', array(
									'value' => (isset($this->table['params']['table_width']) ? $this->table['params']['table_width']['val'] : 0),
									'attrs' => 'style="width: 50px"',
								))?>
							</label>
							<span style="display: table; float: left;">
                                <label style="display: table-row;">
                                    <?php echo htmlPtw::radiobutton('params[table_width_measure]', array(
										'value' => 'px',
										'checked' => (isset($this->table['params']['table_width_measure']) && $this->table['params']['table_width_measure']['val'] == 'px'),
									))?>px
                                </label>
                                <label style="display: table-row;">
                                    <?php echo htmlPtw::radiobutton('params[table_width_measure]', array(
										'value' => '%',
										'checked' => (isset($this->table['params']['table_width_measure']) && $this->table['params']['table_width_measure']['val'] == '%'),
									))?>%
                                </label>
					        </span>
							<i style="margin-top: 12px;" class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Set width for table. Width for each column in this case will be calculated as width of whole table divided for total columns number.', PTW_LANG_CODE))?>"></i>
						</div>
						<?php if(isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] != 1) { ?>
							<div class="ptwTableSetting col-md-3">
								<label>
									<?php echo htmlPtw::radiobutton('params[calc_width]', array(
										'value' => 'col',
										'checked' => (!isset($this->table['params']['calc_width']) || $this->table['params']['calc_width']['val'] == 'col'),
									))?>
									<?php _e('Column Width', PTW_LANG_CODE)?>:
									<?php echo htmlPtw::text('params[col_width]', array(
										'value' => (isset($this->table['params']['col_width']) ? $this->table['params']['col_width']['val'] : 186),	//186 - normal, default col width
										'attrs' => 'style="width: 50px"',
									))?>
									px
									<i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Set width for each column. Total table width in this case will be calculated as sum of all your columns width.', PTW_LANG_CODE))?>"></i>
								</label>
							</div>
						<?php } ?>
						<div class="ptwTableSetting col-md-3">
							<label>
								<?php _e('Text Align', PTW_LANG_CODE)?>
								<?php echo htmlPtw::selectbox('params[text_align]', array(
									'options' => array('left' => 'left', 'center' => 'center', 'right' => 'right'),
									'value' => (isset($this->table['params']['text_align']['val']) ? $this->table['params']['text_align']['val'] : 'center'),
									'attrs' => 'class="chosen"'
								))?>
								<i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Text align in table: left, center, right', PTW_LANG_CODE))?>"></i>
							</label>
						</div>
						<div class="ptwTableSetting col-md-3">
							<label>
								<!-- Here we used Enable as option even for hide param - to make it more user-friendly - Like It:) -->
								<?php echo htmlPtw::checkbox('params[enb_responsive]', array(
									'checked' => !(isset($this->table['params']['dsbl_responsive']) ? (int) $this->table['params']['dsbl_responsive']['val'] : 0)
								))?>
								<span class="sup-complete-txt"><?php _e('Enable Responsivity', PTW_LANG_CODE)?></span>
								<span class="sup-reduce-txt"><?php _e('Enb. Responsivity', PTW_LANG_CODE)?></span>
								<i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('When device screen is small (mobile device or some tablets) usually table will go into responsive mode: all columns will be shown one-by-one below each other. But if you need to disable this feature - you can do this with this option. This feature influences only on frontend table view.', PTW_LANG_CODE))?>"></i>
							</label>
						</div>
						<?php if(isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] != 1) { ?>
							<div class="ptwTableSetting col-md-3 ptwRespMinColW ptwDisplNone">
								<label>
									<?php _e('Min Column Width', PTW_LANG_CODE)?>
									<?php echo htmlPtw::text('params[resp_min_col_width]', array(
										'value' => (isset($this->table['params']['resp_min_col_width']) ? $this->table['params']['resp_min_col_width']['val'] : 150),
										'attrs' => 'style="width: 50px"',
									))?>
									<?php _e('px', PTW_LANG_CODE)?>
									<i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Column width (is indicated in pixels by default) at which table will go to responsive mode', PTW_LANG_CODE))?>"></i>
								</label>
							</div>
						<?php } ?>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php _e('Font', PTW_LANG_CODE)?>:
                                <?php echo htmlPtw::fontsList('params[font_family]', array(
                                    'value' => isset($this->table['params']['font_family']) ? $this->table['params']['font_family']['val'] : '',
                                    'attrs' => 'class="chosen"'
                                ))?>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Font for table. You can always set other font for any text element using text editor tool. Just click on text - and start edit it!', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php _e('Table Align', PTW_LANG_CODE)?>
                                <?php echo htmlPtw::selectbox('params[table_align]', array(
                                    'options' => array('left' => 'left', 'center' => 'center', 'right' => 'right', 'none' => 'none'),
                                    'value' => (isset($this->table['params']['table_align']['val']) ? $this->table['params']['table_align']['val'] : 'none'),
                                    'attrs' => 'class="chosen"'
                                ))?>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Table align in page: left, center, right, none', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <span class="sup-complete-txt"><?php _e('Description Text Color', PTW_LANG_CODE)?>:</span>
                                <span class="sup-reduce-txt"><?php _e('Desc. Text Color', PTW_LANG_CODE)?>:</span>
                                <?php echo htmlPtw::hidden('params[text_color_desc]', array(
                                    'attrs' => 'class="ptwColorPickTextColorDesc"',
                                    'value' => isset($this->table['params']['text_color_desc']) ? $this->table['params']['text_color_desc']['val'] : '',
                                ));?>
                                <div class="ptwTear ptwColorPickTextColorDescTear"></div>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Text color for table columns description element. You can always specify text color for any text element inside table using text editor.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php _e('Background Color', PTW_LANG_CODE)?>:
                                <?php echo htmlPtw::hidden('params[bg_color]', array(
                                    'attrs' => 'class="ptwColorPickBgColor"',
                                    'value' => (isset($this->table['params']['bg_color']) ? $this->table['params']['bg_color']['val'] : '#fff'),
                                ));?>
                                <div class="ptwTear ptwColorPickBgColorTear"></div>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Common background color for table.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php _e('Header Text Color', PTW_LANG_CODE)?>:
                                <?php echo htmlPtw::hidden('params[text_color_header]', array(
                                    'attrs' => 'class="ptwColorPickTextColorHeader"',
                                    'value' => isset($this->table['params']['text_color_header']) ? $this->table['params']['text_color_header']['val'] : '',
                                ));?>
                                <div class="ptwTear ptwColorPickTextColorHeaderTear"></div>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Text color for table columns header element. You can always specify text color for any text element inside table using text editor.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label style="float: left; padding-right: 5px;">
                                <span class="sup-complete-txt"><?php _e('Vertical Padding', PTW_LANG_CODE)?>:</span>
                                <span class="sup-reduce-txt"><?php _e('Vert. Padding', PTW_LANG_CODE)?>:</span>
                                <?php echo htmlPtw::text('params[vert_padding]', array(
                                    'value' => (isset($this->table['params']['vert_padding']) ? $this->table['params']['vert_padding']['val'] : 0),
                                    'attrs' => 'style="width: 50px"',
                                ))?>
                                <span> <?php _e('px', PTW_LANG_CODE)?></span>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Vertical padding for column.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php _e('Rows Text Color', PTW_LANG_CODE)?>:
                                <?php echo htmlPtw::hidden('params[text_color]', array(
                                    'attrs' => 'class="ptwColorPickTextColor"',
                                    'value' => isset($this->table['params']['text_color']) ? $this->table['params']['text_color']['val'] : '',
                                ));?>
                                <div class="ptwTear ptwColorPickTextColorTear"></div>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Common text color for table. You can always specify text color for any text element inside table using text editor.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php echo htmlPtw::checkbox('params[enb_desc_col]', array(
                                    'checked' => (isset($this->table['params']['enb_desc_col']) ? (int) $this->table['params']['enb_desc_col']['val'] : 0)
                                ))?>
                                <span class="sup-complete-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ?
                                        _e('Enable Price Row', PTW_LANG_CODE) : _e('Enable Description Column', PTW_LANG_CODE)
                                    ?></span>
                                <span class="sup-reduce-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ? _e('Enb. Desc. Row', PTW_LANG_CODE) : _e('Enb. Desc. Col', PTW_LANG_CODE) ?>
                        </span>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Add additional description column into table. You can add there descriptions for your rows.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <!-- Here we used Enable as option even for hide param - to make it more user-friendly - Like It:) -->
                                <?php echo htmlPtw::checkbox('params[enb_head_row]', array(
                                    'checked' => !(isset($this->table['params']['hide_head_row']) && (int) $this->table['params']['hide_head_row']['val'])
                                ))?>
                                <span class="sup-complete-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ?
                                        _e('Enable Head Column', PTW_LANG_CODE) : _e('Enable Head Row', PTW_LANG_CODE)
                                    ?></span>
                                <span class="sup-reduce-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ?
                                        _e('Enb. Head Column', PTW_LANG_CODE) : _e('Enb. Head Row', PTW_LANG_CODE)
                                    ?></span>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('By ubchecking the box you hide head row in all columns. Usually it is the first row in table.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <!-- Here we used Enable as option even for hide param - to make it more user-friendly - Like It:) -->
                                <?php echo htmlPtw::checkbox('params[enb_foot_row]', array(
                                    'checked' => !(isset($this->table['params']['hide_foot_row']) && (int) $this->table['params']['hide_foot_row']['val'])
                                ))?>
                                <span class="sup-complete-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ?
                                        _e('Enable Footer Column', PTW_LANG_CODE) : _e('Enable Footer Row', PTW_LANG_CODE)

                                    ?></span>
                                <span class="sup-reduce-txt"><?php
                                    (isset($this->table['params']['is_horisontal_row_type']['val']) && $this->table['params']['is_horisontal_row_type']['val'] == 1) ?
                                        _e('Enb. Footer Column', PTW_LANG_CODE) : _e('Enb. Footer Row', PTW_LANG_CODE)
                                    ?></span>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('By ubchecking the box you hide footer row in all columns. Usually it is last row in table.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>
                        <?php if (!isset($this->table['params']['is_horisontal_row_type']['val']) || $this->table['params']['is_horisontal_row_type']['val'] != 1) { ?>
                            <div class="ptwTableSetting col-md-3">
                                <label>
                                    <!-- Here we used Enable as option even for hide param - to make it more user-friendly - Like It:) -->
                                    <?php echo htmlPtw::checkbox('params[enb_desc_row]', array(
                                        'checked' => !(isset($this->table['params']['hide_desc_row']) && (int) $this->table['params']['hide_desc_row']['val'])
                                    ))?>
                                    <span class="sup-complete-txt"><?php _e('Enable Price Row', PTW_LANG_CODE)?></span>
                                    <span class="sup-reduce-txt"><?php _e('Enb. Price Row', PTW_LANG_CODE)?></span>
                                    <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('By ubchecking the box you hide price row in all columns.', PTW_LANG_CODE))?>"></i>
                                </label>
                            </div>
                        <?php } ?>
                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php echo htmlPtw::checkbox('params[enb_hover_animation]', array(
                                    'checked' => (isset($this->table['params']['enb_hover_animation']) ? (int) $this->table['params']['enb_hover_animation']['val'] : 0)
                                ))?>
                                <?php _e('Enable Hover Animation', PTW_LANG_CODE)?>
                                <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Animate column when mouse is hovering on it. Will work ONLY on frontend, disabled in admin area WySiWyg editor as it can break it in edit mode.', PTW_LANG_CODE))?>"></i>
                            </label>
                        </div>

                        <div class="ptwTableSetting col-md-3">
                            <label>
                                <?php echo htmlPtw::checkbox('params[disable_custom_tooltip_style]', array(
                                    'checked' => (isset($this->table['params']['disable_custom_tooltip_style']) ? (int) $this->table['params']['disable_custom_tooltip_style']['val'] : 0)
                                ))?>
                                <span class="sup-complete-txt"><?php _e('Disable Custom Tooltip Styles', PTW_LANG_CODE)?></span>
                                <span class="sup-reduce-txt"><?php _e('Disable Custom Tooltip Styles', PTW_LANG_CODE)?></span>
                            </label>
                            <i class="fa fa-question supsystic-tooltip" title="<?php echo esc_html(__('Disable supsystic styles for tooltips in your pricing table', PTW_LANG_CODE))?>"></i>
                        </div>
                    </div>
                </div>
				<div style="clear: both;"></div>
				<hr />
			</div>
			<div id="ptwCanvas" class="clearfix">
				<?php echo $this->renderedTable?>
			</div>
		</div>
	</div>
</section>
<div id="ptwTableEditorFooter">
	<?php echo $this->editorFooter; ?>
</div>
<div id="ptwTableAllColsHaveBgColorWnd" style="display: none;" title="<?php _e('Notice', PTW_LANG_CODE)?>">
	<p><?php _e('Please be adviced that all columns in your table have enabled Fill color feature - so changing background color for table may not influence to all table view, or maybe will not influence to table view at all (depending of template that you selected for your table).', PTW_LANG_CODE)?></p>
</div>

