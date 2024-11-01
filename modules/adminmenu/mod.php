<?php
class adminmenuPtw extends modulePtw {
	protected $_mainSlug = 'pricing-table-for-woo';
	private $_mainCap = 'manage_options';
    public function init() {
        parent::init();
		add_action('admin_menu', array($this, 'initMenu'), 9);
		$plugName = plugin_basename(PTW_DIR. PTW_MAIN_FILE);
		add_filter('plugin_action_links_'. $plugName, array($this, 'addSettingsLinkForPlug') );
    }
	public function addSettingsLinkForPlug($links) {
		$mainLink = 'http://woobewoo.com/';
		$twitterStatus = sprintf(__('Cool WordPress plugins from woobewoo.com developers. I tried %s - and this was what I need! #woobewoo.com', PTW_LANG_CODE), PTW_WP_PLUGIN_NAME);
		array_unshift($links, '<a href="'. $this->getMainLink(). '">'. __('Settings', PTW_LANG_CODE). '</a>');
		array_push($links, '<a title="'. __('More plugins for your WordPress site here!', PTW_LANG_CODE). '" href="'. $mainLink. '" target="_blank">woobewoo.com</a>');
		array_push($links, '<a title="'. __('Spread the word!', PTW_LANG_CODE). '" href="https://www.facebook.com/sharer/sharer.php?u='. urlencode($mainLink). '" target="_blank" class="dashicons-before dashicons-facebook-alt"></a>');
		array_push($links, '<a title="'. __('Spread the word!', PTW_LANG_CODE). '" href="https://twitter.com/home?status='. urlencode($twitterStatus). '" target="_blank" class="dashicons-before dashicons-twitter"></a>');
		array_push($links, '<a title="'. __('Spread the word!', PTW_LANG_CODE). '" href="https://plus.google.com/share?url='. urlencode($mainLink). '" target="_blank" class="dashicons-before dashicons-googleplus"></a>');
		return $links;
	}
	public function initMenu() {
		$mainCap = $this->getMainCap();
		$mainSlug = dispatcherPtw::applyFilters('adminMenuMainSlug', $this->_mainSlug);
		$mainMenuPageOptions = array(
			'page_title' => PTW_WP_PLUGIN_NAME,
			'menu_title' => PTW_WP_PLUGIN_NAME,
			'capability' => $mainCap,
			'menu_slug' => $mainSlug,
			'function' => array(framePtw::_()->getModule('options'), 'getAdminPage'));
		$mainMenuPageOptions = dispatcherPtw::applyFilters('adminMenuMainOption', $mainMenuPageOptions);
        add_menu_page($mainMenuPageOptions['page_title'], $mainMenuPageOptions['menu_title'], $mainMenuPageOptions['capability'], $mainMenuPageOptions['menu_slug'], $mainMenuPageOptions['function'], 'dashicons-tickets-alt');
		//remove duplicated WP menu item
		add_submenu_page($mainMenuPageOptions['menu_slug'], '', '', $mainMenuPageOptions['capability'], $mainMenuPageOptions['menu_slug'], $mainMenuPageOptions['function']);
		$tabs = framePtw::_()->getModule('options')->getTabs();
		$subMenus = array();
		foreach($tabs as $tKey => $tab) {
			//if($tKey == 'main_page') continue;	// Top level menu item - is main page, avoid place it 2 times
			if((isset($tab['hidden']) && $tab['hidden'])
				|| (isset($tab['hidden_for_main']) && $tab['hidden_for_main'])	// Hidden for WP main
				|| (isset($tab['is_main']) && $tab['is_main'])) continue;
			$subMenus[] = array(
				'title' => $tab['label'], 'capability' => $mainCap, 'menu_slug' => 'admin.php?page='. $mainSlug. '&tab='. $tKey, 'function' => '',
			);
		}
		$subMenus = dispatcherPtw::applyFilters('adminMenuOptions', $subMenus);
		foreach($subMenus as $opt) {
			add_submenu_page($mainSlug, $opt['title'], $opt['title'], $opt['capability'], $opt['menu_slug'], $opt['function']);
		}
	}
	public function getMainLink() {
		return uriPtw::_(array('baseUrl' => admin_url('admin.php'), 'page' => $this->getMainSlug()));
	}
	public function getMainSlug() {
		return $this->_mainSlug;
	}
	public function getMainCap() {
		return dispatcherPtw::applyFilters('adminMenuAccessCap', $this->_mainCap);
	}
}

