<?php
class optionsControllerPtw extends controllerPtw {
	public function saveGroup() {
		$res = new responsePtw();
		if($this->getModel()->saveGroup(reqPtw::get('post'))) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
		} else
			$res->pushError ($this->getModel('options')->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			PTW_USERLEVELS => array(
				PTW_ADMIN => array('saveGroup')
			),
		);
	}
}

