<?php
class mailControllerPtw extends controllerPtw {
	public function testEmail() {
		$res = new responsePtw();
		$email = reqPtw::getVar('test_email', 'post');
		if($this->getModel()->testEmail($email)) {
			$res->addMessage(__('Now check your email inbox / spam folders for test mail.'));
		} else 
			$res->pushError ($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function saveMailTestRes() {
		$res = new responsePtw();
		$result = (int) reqPtw::getVar('result', 'post');
		framePtw::_()->getModule('options')->getModel()->save('mail_function_work', $result);
		$res->ajaxExec();
	}
	public function saveOptions() {
		$res = new responsePtw();
		$optwModel = framePtw::_()->getModule('options')->getModel();
		$submitData = reqPtw::get('post');
		if($optwModel->saveGroup($submitData)) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
		} else
			$res->pushError ($optwModel->getErrors());
		$res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			PTW_USERLEVELS => array(
				PTW_ADMIN => array('testEmail', 'saveMailTestRes', 'saveOptions')
			),
		);
	}
}
