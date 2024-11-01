<?php
class templatesPtw extends modulePtw {
    protected $_styles = array();
	private $_cdnUrl = '';
	
	public function __construct($d) {
		parent::__construct($d);
		$this->getCdnUrl();	// Init CDN URL
	}
	public function getCdnUrl() {
//		if(empty($this->_cdnUrl)) {
//			if((int) framePtw::_()->getModule('options')->get('use_local_cdn')) {
//				$uploadsDir = wp_upload_dir( null, false );
//				$this->_cdnUrl = $uploadsDir['baseurl']. '/'. PTW_CODE. '/';
//				if(uriPtw::isHttps()) {
//					$this->_cdnUrl = str_replace('http://', 'https://', $this->_cdnUrl);
//				}
//				dispatcherPtw::addFilter('externalCdnUrl', array($this, 'modifyExternalToLocalCdn'));
//			} else {
//				$this->_cdnUrl = (uriPtw::isHttps() ? 'https' : 'http'). '://supsystic-42d7.kxcdn.com/';
//			}
//		}
		$this->_cdnUrl = (uriPtw::isHttps() ? 'https' : 'http'). '://woobewoo-14700.kxcdn.com/';
		return $this->_cdnUrl;
	}
	public function modifyExternalToLocalCdn( $url ) {
		$url = str_replace(
			array('https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css'),
			array($this->getModPath(). 'css'),
			$url);
		return $url;
	}
    public function init() {
        if (is_admin()) {
			if($isAdminPlugOptwPage = framePtw::_()->isAdminPlugOptwPage()) {
				$this->loadCoreJs();
				$this->loadAdminCoreJs();
				$this->loadCoreCss();
				$this->loadChosenSelects();
				framePtw::_()->addScript('adminOptionsPtw', PTW_JS_PATH. 'admin.options.js', array(), false, true);
				add_action('admin_enqueue_scriptw', array($this, 'loadMediaScriptw'));
				// Some common styles - that need to be on all admin pages - be careful with them
				framePtw::_()->addStyle('woobewoo-for-all-admin-'. PTW_CODE, PTW_CSS_PATH. 'woobewoo-for-all-admin.css');
			}
		}
        parent::init();
    }
	public function loadMediaScriptw() {
		if(function_exists('wp_enqueue_media')) {
			wp_enqueue_media();
		}
	}
	public function loadTooltipster() {
		framePtw::_()->addScript('tooltipster', $this->getModPath(). 'lib/tooltipster/jquery.tooltipster.min.js');
		framePtw::_()->addStyle('tooltipster', $this->getModPath(). 'lib/tooltipster/tooltipster.css');
	}
	public function loadSlimscroll() {
		framePtw::_()->addScript('jquery.slimscroll', PTW_JS_PATH. 'slimscroll.min.js');
	}
	public function loadCodemirror() {
		framePtw::_()->addStyle('ptwCodemirror', $this->getModPath(). 'lib/codemirror/codemirror.css');
		framePtw::_()->addStyle('codemirror-addon-hint', $this->getModPath(). 'lib/codemirror/addon/hint/show-hint.css');
		framePtw::_()->addScript('ptwCodemirror', $this->getModPath(). 'lib/codemirror/codemirror.js');
		framePtw::_()->addScript('codemirror-addon-show-hint', $this->getModPath(). 'lib/codemirror/addon/hint/show-hint.js');
		framePtw::_()->addScript('codemirror-addon-xml-hint', $this->getModPath(). 'lib/codemirror/addon/hint/xml-hint.js');
		framePtw::_()->addScript('codemirror-addon-html-hint', $this->getModPath(). 'lib/codemirror/addon/hint/html-hint.js');
		framePtw::_()->addScript('codemirror-mode-xml', $this->getModPath(). 'lib/codemirror/mode/xml/xml.js');
		framePtw::_()->addScript('codemirror-mode-javascript', $this->getModPath(). 'lib/codemirror/mode/javascript/javascript.js');
		framePtw::_()->addScript('codemirror-mode-css', $this->getModPath(). 'lib/codemirror/mode/css/css.js');
		framePtw::_()->addScript('codemirror-mode-htmlmixed', $this->getModPath(). 'lib/codemirror/mode/htmlmixed/htmlmixed.js');
	}
	public function loadJqGrid() {
		static $loaded = false;
		if(!$loaded) {
			$this->loadJqueryUi();
			framePtw::_()->addScript('jq-grid', $this->getModPath(). 'lib/jqgrid/jquery.jqGrid.min.js');
			framePtw::_()->addStyle('jq-grid', $this->getModPath(). 'lib/jqgrid/ui.jqgrid.css');
			$langToLoad = utilsPtw::getLangCode2Letter();
			$availableLocales = array('ar','bg','bg1251','cat','cn','cs','da','de','dk','el','en','es','fa','fi','fr','gl','he','hr','hr1250','hu','id','is','it','ja','kr','lt','mne','nl','no','pl','pt','pt','ro','ru','sk','sr','sr','sv','th','tr','tw','ua','vi');
			if(!in_array($langToLoad, $availableLocales)) {
				$langToLoad = 'en';
			}
			framePtw::_()->addScript('jq-grid-lang', $this->getModPath(). 'lib/jqgrid/i18n/grid.locale-'. $langToLoad. '.js');
			$loaded = true;
		}
	}
	public function loadFontAwesome() {
		framePtw::_()->addStyle('font-awesomePtw', 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
	}
	public function loadChosenSelects() {
		framePtw::_()->addStyle('jquery.chosen', $this->getModPath(). 'lib/chosen/chosen.min.css');
		framePtw::_()->addScript('jquery.chosen', $this->getModPath(). 'lib/chosen/chosen.jquery.min.js');
	}
	public function loadJqplot() {
		static $loaded = false;
		if(!$loaded) {
			$jqplotDir = $this->getModPath(). 'lib/jqplot/';

			framePtw::_()->addStyle('jquery.jqplot', $jqplotDir. 'jquery.jqplot.min.css');

			framePtw::_()->addScript('jplot', $jqplotDir. 'jquery.jqplot.min.js');
			framePtw::_()->addScript('jqplot.canvasAxisLabelRenderer', $jqplotDir. 'jqplot.canvasAxisLabelRenderer.min.js');
			framePtw::_()->addScript('jqplot.canvasTextRenderer', $jqplotDir. 'jqplot.canvasTextRenderer.min.js');
			framePtw::_()->addScript('jqplot.dateAxisRenderer', $jqplotDir. 'jqplot.dateAxisRenderer.min.js');
			framePtw::_()->addScript('jqplot.canvasAxisTickRenderer', $jqplotDir. 'jqplot.canvasAxisTickRenderer.min.js');
			framePtw::_()->addScript('jqplot.highlighter', $jqplotDir. 'jqplot.highlighter.min.js');
			framePtw::_()->addScript('jqplot.cursor', $jqplotDir. 'jqplot.cursor.min.js');
			framePtw::_()->addScript('jqplot.barRenderer', $jqplotDir. 'jqplot.barRenderer.min.js');
			framePtw::_()->addScript('jqplot.categoryAxisRenderer', $jqplotDir. 'jqplot.categoryAxisRenderer.min.js');
			framePtw::_()->addScript('jqplot.pointLabels', $jqplotDir. 'jqplot.pointLabels.min.js');
			framePtw::_()->addScript('jqplot.pieRenderer', $jqplotDir. 'jqplot.pieRenderer.min.js');
			$loaded = true;
		}
	}
	public function loadMagicAnims() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addStyle('jquery.jqplot', $this->getModPath(). 'css/magic.min.css');
			$loaded = true;
		}
	}
	public function loadAdminCoreJs() {
		framePtw::_()->addScript('jquery-ui-dialog');
		framePtw::_()->addScript('jquery-ui-slider');
		framePtw::_()->addScript('wp-color-picker');
		framePtw::_()->addScript('icheck', PTW_JS_PATH. 'icheck.min.js');
		$this->loadTooltipster();
	}
	public function loadCoreJs() {
		framePtw::_()->addScript('jquery');

		framePtw::_()->addScript('commonPtw', PTW_JS_PATH . 'common.js');
		framePtw::_()->addScript('icheck', PTW_JS_PATH. 'icheck.min.js');
		framePtw::_()->addStyle('tables.icheck', PTW_CSS_PATH. 'jquery.icheck.css');
		framePtw::_()->addScript('corePtw', PTW_JS_PATH . 'core.js');
		
		$ajaxurl = admin_url('admin-ajax.php');
		$jsData = array(
			'siteUrl'					=> PTW_SITE_URL,
			'imgPath'					=> PTW_IMG_PATH,
			'cssPath'					=> PTW_CSS_PATH,
			'loader'					=> PTW_LOADER_IMG,
			'close'						=> PTW_IMG_PATH. 'cross.gif',
			'ajaxurl'					=> $ajaxurl,
			'options'					=> framePtw::_()->getModule('options')->getAllowedPublicOptions(),
			'PTW_CODE'					=> PTW_CODE,
			//'ball_loader'				=> PTW_IMG_PATH. 'ajax-loader-ball.gif',
			//'ok_icon'					=> PTW_IMG_PATH. 'ok-icon.png',
		);
		if(is_admin()) {
			$jsData['isPro'] = framePtw::_()->getModule('promo')->isPro();
		}
		$jsData = dispatcherPtw::applyFilters('jsInitVariables', $jsData);
		framePtw::_()->addJSVar('corePtw', 'PTW_DATA', $jsData);
	}
	public function loadCoreCss() {
		$this->_styles = dispatcherPtw::applyFilters('coreCssList', array(
			'stylePtw'			=> array('path' => PTW_CSS_PATH. 'style.css', 'for' => 'admin'),
			'supsystic-uiPtw'	=> array('path' => PTW_CSS_PATH. 'supsystic-ui.css', 'for' => 'admin'),
			'dashicons'			=> array('for' => 'admin'),
			'bootstrap-alerts'	=> array('path' => PTW_CSS_PATH. 'bootstrap-alerts.css', 'for' => 'admin'),
			'icheck'			=> array('path' => PTW_CSS_PATH. 'jquery.icheck.css', 'for' => 'admin'),
			'wp-color-picker'	=> array('for' => 'admin'),
		));
		foreach($this->_styles as $s => $sInfo) {
			if(!empty($sInfo['path'])) {
				framePtw::_()->addStyle($s, $sInfo['path']);
			} else {
				framePtw::_()->addStyle($s);
			}
		}
		$this->loadFontAwesome();
	}
	public function loadJqueryUi() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addStyle('jquery-ui', PTW_CSS_PATH. 'jquery-ui.min.css');
			framePtw::_()->addStyle('jquery-ui.structure', PTW_CSS_PATH. 'jquery-ui.structure.min.css');
			framePtw::_()->addStyle('jquery-ui.theme', PTW_CSS_PATH. 'jquery-ui.theme.min.css');
			framePtw::_()->addStyle('jquery-slider', PTW_CSS_PATH. 'jquery-slider.css');
			$loaded = true;
		}
	}
	public function loadDatePicker() {
		framePtw::_()->addScript('jquery-ui-datepicker');
	}
	public function loadBootstrap() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addStyle('bootstrap', framePtw::_()->getModule('tables')->getAssetsUrl(). 'css/bootstrap.min.css');
			framePtw::_()->addStyle('bootstrap-theme', framePtw::_()->getModule('tables')->getAssetsUrl(). 'css/bootstrap-theme.min.css');
			framePtw::_()->addScript('bootstrap', PTW_JS_PATH. 'bootstrap.min.js');
			
			framePtw::_()->addStyle('jasny-bootstrap', PTW_CSS_PATH. 'jasny-bootstrap.min.css');
			framePtw::_()->addScript('jasny-bootstrap', PTW_JS_PATH. 'jasny-bootstrap.min.js');
			$loaded = true;
		}
	}
	public function loadTinyMce() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addScript('ptw.tinymce', PTW_JS_PATH. 'tinymce/tinymce.min.js');
			framePtw::_()->addScript('ptw.jquery.tinymce', PTW_JS_PATH. 'tinymce/jquery.tinymce.min.js');
			$loaded = true;
		}
	}
	public function loadCustomBootstrapColorpicker() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addScript('ptw.colorpicker.script', PTW_JS_PATH. 'color_picker/jquery.colorpicker.js');
			framePtw::_()->addStyle('ptw.colorpicker.style', PTW_JS_PATH. 'color_picker/jquery.colorpicker.css');
			framePtw::_()->addScript('jquery.bootstrap.colorpicker.tinycolor', PTW_JS_PATH. 'jquery.bootstrap.colorpicker/tinycolor.js');
			$loaded = true;
		}
	}
	public function loadBootstrapPartial() {
		static $loaded = false;
		if(!$loaded) {
			$this->loadBootstrapPartialOnlyCss();
			framePtw::_()->addScript('bootstrap', PTW_JS_PATH. 'bootstrap.min.js');
			framePtw::_()->addStyle('jasny-bootstrap', PTW_CSS_PATH. 'jasny-bootstrap.min.css');
			framePtw::_()->addScript('jasny-bootstrap', PTW_JS_PATH. 'jasny-bootstrap.min.js');
			$loaded = true;
		}
	}
	public function loadBootstrapPartialOnlyCss() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addStyle('bootstrap.partial', framePtw::_()->getModule('tables')->getAssetsUrl(). 'css/bootstrap.partial.min.css');
			$loaded = true;
		}
	}
	public function loadBootstrapSimple() {
		static $loaded = false;
		if(!$loaded) {
			framePtw::_()->addStyle('bootstrap-simple', PTW_CSS_PATH. 'bootstrap-simple.css');
			$loaded = true;
		}
	}
	public function loadGoogleFont( $font ) {
		static $loaded = array();
		if(!isset($loaded[ $font ])) {
			framePtw::_()->addStyle('google.font.'. str_replace(array(' '), '-', $font), 'https://fonts.googleapis.com/css?family='. urlencode($font));
			$loaded[ $font ] = 1;
		}
	}
}
