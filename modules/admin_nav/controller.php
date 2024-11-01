<?php
class admin_navControllerPtw extends controllerPtw {
	public function getPermissions() {
		return array(
			PTW_USERLEVELS => array(
				PTW_ADMIN => array()
			),
		);
	}
}