<?php
class tablesPtw extends modulePtw {
	private $_assetsUrl = '';
	private $_oldAssetsUrl = 'http://woobewoo.com/_assets/tables/';
	
	public function init() {
		dispatcherPtw::addFilter('mainAdminTabs', array($this, 'addAdminTab'));
		add_filter('wp_footer', array($this, 'assignRenderedTables'));
		add_shortcode(PTW_SHORTCODE, array($this, 'showPriceTable'));
		// Add to admin bar new item
		add_action('admin_bar_menu', array($this, 'addAdminBarNewItem'), 300);
		if(is_admin()) {
			add_action('admin_notices', array($this, 'showAdminErrors'));
		}
	}
	public function addAdminTab($tabs) {
		$tabs[ $this->getCode(). '_add_new' ] = array(
			'label' => __('Add New Table', PTW_LANG_CODE), 'callback' => array($this, 'getAddNewTabContent'), 'fa_icon' => 'fa-plus-circle', 'sort_order' => 10, 'add_bread' => $this->getCode(),
		);
		$tabs[ $this->getCode(). '_edit' ] = array(
			'label' => __('Edit', PTW_LANG_CODE), 'callback' => array($this, 'getEditTabContent'), 'sort_order' => 20, 'child_of' => $this->getCode(), 'hidden' => 1, 'add_bread' => $this->getCode(),
		);
		$tabs[ $this->getCode() ] = array(
			'label' => __('Show All Tables', PTW_LANG_CODE), 'callback' => array($this, 'getTabContent'), 'fa_icon' => 'fa-list', 'sort_order' => 20, //'is_main' => true,
		);
		$tabs[ $this->getCode() . '_import_export' ] = array(
			'label' => __('Tables Import / Export', PTW_LANG_CODE), 'callback' => array($this, 'getImportExportTab'), 'fa_icon' => 'fa-upload', 'sort_order' => 30, //'is_main' => true,
		);
		return $tabs;
	}
	public function getImportExportTab() {
		return $this->getView()->getImportExportTab();
	}
	public function getTabContent() {
		return $this->getView()->getTabContent();
	}
	public function getAddNewTabContent() {
		return $this->getView()->getAddNewTabContent();
	}
	public function getEditTabContent() {
		$id = (int) reqPtw::getVar('id', 'get');
		return $this->getView()->getEditTabContent( $id );
	}
	public function getEditLink($id) {
		$link = framePtw::_()->getModule('options')->getTabUrl( $this->getCode(). '_edit' );
		$link .= '&id='. $id;
		return $link;
	}
	public function getAssetsUrl() {
		if(empty($this->_assetsUrl)) {
			$this->_assetsUrl = framePtw::_()->getModule('templates')->getCdnUrl(). '_assets/tables/';
		}
		return $this->_assetsUrl;
	}
	public function getOldAssetsUrl() {
		return $this->_oldAssetsUrl;
	}
	public function assignRenderedTables() {
		$tables = $this->getView()->getRenderedTables();
		if(!empty($tables)) {
			framePtw::_()->addJSVar('frontend.tables', 'ptwTables', $tables);
		}
	}
	public function showPriceTable($params) {
		return do_shortcode($this->getView()->showTable($params));
	}
	public function addAdminBarNewItem( $wp_admin_bar ) {
		$mainCap = framePtw::_()->getModule('adminmenu')->getMainCap();
		if(!current_user_can( $mainCap) || !$wp_admin_bar || !is_object($wp_admin_bar)) {
			return;
		}
		$wp_admin_bar->add_menu(array(
			'parent'    => 'new-content',
			'id'        => PTW_CODE. '-admin-bar-new-item',
			'title'     => __('Pricing Table', PTW_LANG_CODE),
			'href'      => framePtw::_()->getModule('options')->getTabUrl( $this->getCode(). '_add_new' ),
		));
	}
	public function showAdminErrors() {
		// check WooCommerce is installed and activated
		if(!$this->isWooCommercePluginActivated()) {
			// WooCommerce install url
			$wooCommerceInstallUrl = add_query_arg(
				array(
					's' => 'WooCommerce',
					'tab' => 'search',
					'type' => 'term',
				),
				admin_url( 'plugin-install.php' )
			);
			$tableView = $this->getView();
			$tableView->assign('errorMsg',
				$this->translate('For work with "')
				. PTW_WP_PLUGIN_NAME
				. $this->translate('" plugin, You need to install and activate <a target="_blank" href="' . $wooCommerceInstallUrl . '">WooCommerce</a> plugin')
			);
			// check current module
			if(isset($_GET['page']) && $_GET['page'] == PTW_SHORTCODE) {
				// show message
				echo $tableView->getContent('showAdminNotice');
			}
		}
	}

	public function isWooCommercePluginActivated() {
		return class_exists('WooCommerce');
	}
}

