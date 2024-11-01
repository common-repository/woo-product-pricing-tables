<section class="supsystic-bar">
	<ul class="supsystic-bar-controls">
		<li title="<?php _e('Save all options')?>">
			<button class="button button-primary" id="ptwSettingsSaveBtn" data-toolbar-button>
				<i class="fa fa-fw fa-save"></i>
				<?php _e('Save', PTW_LANG_CODE)?>
			</button>
		</li>
	</ul>
	<div style="clear: both;"></div>
	<hr />
</section>
<section>
	<form id="ptwSettingsForm" class="ptwInputsWithDescrForm">
		<div class="supsystic-item supsystic-panel">
			<div id="containerWrapper">
				<table class="form-table">
					<?php foreach($this->options as $optCatKey => $optCatData) { ?>
						<?php if(isset($optCatData['optw']) && !empty($optCatData['optw'])) { ?>
							<?php foreach($optCatData['optw'] as $optKey => $opt) { ?>
								<?php
									$htmlType = isset($opt['html']) ? $opt['html'] : false;
									if(empty($htmlType)) continue;
									$htmlOptw = array('value' => $opt['value'], 'attrs' => 'data-optkey="'. $optKey. '"');
									if(in_array($htmlType, array('selectbox', 'selectlist')) && isset($opt['options'])) {
										if(is_callable($opt['options'])) {
											$htmlOptw['options'] = call_user_func( $opt['options'] );
										} elseif(is_array($opt['options'])) {
											$htmlOptw['options'] = $opt['options'];
										}
									}
									if(isset($opt['pro']) && !empty($opt['pro'])) {
										$htmlOptw['attrs'] .= ' class="ptwProOpt"';
									}
								?>
								<tr>
									<th scope="row" class="col-w-30perc">
										<?php echo $opt['label']?>
										<?php if(!empty($opt['changed_on'])) {?>
											<br />
											<span class="description">
												<?php 
												$opt['value'] 
													? printf(__('Turned On %s', PTW_LANG_CODE), datePtw::_($opt['changed_on']))
													: printf(__('Turned Off %s', PTW_LANG_CODE), datePtw::_($opt['changed_on']))
												?>
											</span>
										<?php }?>
										<?php if(isset($opt['pro']) && !empty($opt['pro'])) { ?>
											<span class="ptwProOptMiniLabel">
												<a href="<?php echo $opt['pro']?>" target="_blank">
													<?php _e('PRO option', PTW_LANG_CODE)?>
												</a>
											</span>
										<?php }?>
									</th>
									<td class="col-w-1perc">
										<i class="fa fa-question supsystic-tooltip" title="<?php echo $opt['desc']?>"></i>
									</td>
									<td class="col-w-1perc">
										<?php echo htmlPtw::$htmlType('opt_values['. $optKey. ']', $htmlOptw)?>
									</td>
									<td class="col-w-60perc">
										<div id="ptwFormOptDetails_<?php echo $optKey?>" class="ptwOptDetailsShell">
										<?php switch($optKey) {

										}?>
										<?php
											if(isset($opt['add_sub_optw']) && !empty($opt['add_sub_optw'])) {
												if(is_string($opt['add_sub_optw'])) {
													echo $opt['add_sub_optw'];
												} elseif(is_callable($opt['add_sub_optw'])) {
													echo call_user_func_array($opt['add_sub_optw'], array($this->options));
												}
											}
										?>
										</div>
									</td>
								</tr>
							<?php }?>
						<?php }?>
					<?php }?>
				</table>
				<div style="clear: both;"></div>
			</div>
		</div>
		<?php echo htmlPtw::hidden('mod', array('value' => 'options'))?>
		<?php echo htmlPtw::hidden('action', array('value' => 'saveGroup'))?>
	</form>
</section>