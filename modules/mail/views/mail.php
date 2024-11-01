<?php
class mailViewPtw extends viewPtw {
	public function getTabContent() {
		framePtw::_()->getModule('templates')->loadJqueryUi();
		framePtw::_()->addScript('admin.'. $this->getCode(), $this->getModule()->getModPath(). 'js/admin.'. $this->getCode(). '.js');
		
		$this->assign('options', framePtw::_()->getModule('options')->getCatOptw( $this->getCode() ));
		$this->assign('testEmail', framePtw::_()->getModule('options')->get('notify_email'));
		return parent::getContent('mailAdmin');
	}
}
