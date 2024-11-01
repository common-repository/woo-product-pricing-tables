<?php
class admin_navViewPtw extends viewPtw {
	public function getBreadcrumbs() {
		$this->assign('breadcrumbsList', dispatcherPtw::applyFilters('mainBreadcrumbs', $this->getModule()->getBreadcrumbsList()));
		return parent::getContent('adminNavBreadcrumbs');
	}
}
