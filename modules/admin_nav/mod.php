<?php
class admin_navPtw extends modulePtw {
	public function getBreadcrumbsList() {
		$res = array(
			array('label' => PTW_WP_PLUGIN_NAME, 'url' => framePtw::_()->getModule('adminmenu')->getMainLink()),
		);
		// Try to get current tab breadcrumb
		$activeTab = framePtw::_()->getModule('options')->getActiveTab();
		if(!empty($activeTab) && $activeTab != 'main_page') {
			$tabs = framePtw::_()->getModule('options')->getTabs();
			if(!empty($tabs) && isset($tabs[ $activeTab ])) {
				if(isset($tabs[ $activeTab ]['add_bread']) && !empty($tabs[ $activeTab ]['add_bread'])) {
					if(!is_array($tabs[ $activeTab ]['add_bread']))
						$tabs[ $activeTab ]['add_bread'] = array( $tabs[ $activeTab ]['add_bread'] );
					foreach($tabs[ $activeTab ]['add_bread'] as $addForBread) {
						$res[] = array(
							'label' => $tabs[ $addForBread ]['label'], 'url' => $tabs[ $addForBread ]['url'],
						);
					}
				}
				if($activeTab == 'popup_edit') {
					$id = (int) reqPtw::getVar('id', 'get');
					if($id) {
						$tabs[ $activeTab ]['url'] .= '&id='. $id;
					}
				}
				$res[] = array(
					'label' => $tabs[ $activeTab ]['label'], 'url' => $tabs[ $activeTab ]['url'],
				);
				if($activeTab == 'statistics') {
					$statTabs = framePtw::_()->getModule('statistics')->getStatTabs();
					$currentStatTab = framePtw::_()->getModule('statistics')->getCurrentStatTab();
					if(isset($statTabs[ $currentStatTab ])) {
						$res[] = array(
							'label' => $statTabs[ $currentStatTab ]['label'], 'url' => $statTabs[ $currentStatTab ]['url'],
						);
					}
				}
			}
		}
		return $res;
	}
}

