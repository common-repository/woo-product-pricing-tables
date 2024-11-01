<section>
	<div class="supsystic-item supsystic-panel">
		<h3 style="line-height: 30px;">
			<?php if($this->changeFor) {
				printf(__('Change Template to any other from list below or <a class="button" href="%s">return to Table edit</a>', PTW_LANG_CODE), $this->editLink);
			} else {
				_e('Choose Table Template. You can change it later.', PTW_LANG_CODE);	// Add here wording " You can change it later." after this will be really possible
			}?>
		</h3>
		<hr />
		<div id="containerWrapper" style="width: 90%; margin: 40px auto;">
			<?php if(!$this->changeFor) { ?>
				<div class="supsystic-bar supsystic-sticky sticky-padd-next sticky-save-width sticky-base-width-auto">
					<form id="ptwCreateTableForm">
						<label>
							<h3 style="float: left; margin: 10px;"><?php _e('Table Name', PTW_LANG_CODE)?>:</h3>
							<?php echo htmlPtw::text('label', array('attrs' => 'style="float: left; width: 60%;"', 'required' => true))?>
						</label>
						<button class="button button-primary" style="margin-top: 1px;">
							<i class="fa fa-check"></i>
							<?php _e('Save', PTW_LANG_CODE)?>
						</button>
						<?php echo htmlPtw::hidden('original_id')?>
						<?php echo htmlPtw::hidden('mod', array('value' => 'tables'))?>
						<?php echo htmlPtw::hidden('action', array('value' => 'createFromTpl'))?>
					</form>
					<div style="clear: both;"></div>
					<div id="ptwCreateTableMsg"></div>
				</div>
			<?php }?>
			<div  class="table-list row">
				<?php foreach($this->list as $table) { ?>
					<?php $isPromo = isset($table['promo']) && $table['promo'];?>
					<?php $promoClass = $isPromo ? 'sup-promo' : '';?>
					<!-- remove this condition for PRO -->
					<?php if(!$isPromo) : ?>
					<div class="col-md-4 table-list-item preset <?php echo $promoClass;?>" data-id="<?php echo $isPromo ? 0 : $table['id']?>">
						<img src="<?php echo $table['img_url']?>" class="ptwTplPrevImg" />
						<?php if($isPromo) { ?>
							<a href="<?php echo $table['promo_link']?>" target="_blank" class="button button-primary preset-select-btn <?php echo $promoClass;?>"><?php _e('Get in PRO', PTW_LANG_CODE)?></a>
						<?php } else { ?>
							<a href="#" class="button button-primary preset-select-btn" data-txt="<?php _e('Select', PTW_LANG_CODE)?>" data-txt-active="<?php _e('Selected', PTW_LANG_CODE)?>"><?php _e('Select', PTW_LANG_CODE)?></a>
						<?php }?>
						<div class="preset-overlay">
							<h3>
								<span class="ptwTplLabel"><?php echo $table['label']?></span><br />
							</h3>
						</div>
					</div>
					<!-- remove this condition for PRO -->
					<?php endif;?>
				<?php }?>
				<div style="clear: both;"></div>
			</div>
		</div>
	</div>
</section>
<!--Change tpl wnd-->
<div id="ptwChangeTplWnd" title="<?php _e('Change Template', PTW_LANG_CODE)?>" style="display: none;">
	<form id="ptwChangeTplForm">
		<?php _e('Are you sure want to change your current template - to ')?><span id="ptwChangeTplNewLabel"></span>?
		<?php echo htmlPtw::hidden('id')?>
		<?php echo htmlPtw::hidden('new_tpl_id')?>
		<?php echo htmlPtw::hidden('mod', array('value' => 'tables'))?>
		<?php echo htmlPtw::hidden('action', array('value' => 'changeTpl'))?>
	</form>
	<div id="ptwChangeTplMsg"></div>
</div>
<!---->