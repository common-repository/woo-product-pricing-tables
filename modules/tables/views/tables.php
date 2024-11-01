<?php
class tablesViewPtw extends viewPtw {
	protected $_twig;
	private $_renderedTables = array();

	protected static $allProductAttributeList = array();
	protected static $allPropertyList = array();
	protected static $wcProducts = array();
	protected static $isJsAllProductsAssigned = false;
	protected static $frontendTablesInfo = false;

	public function getImportExportTab() {
		framePtw::_()->getModule('templates')->loadJqGrid();
		framePtw::_()->addStyle('admin.imex', $this->getModule()->getModPath(). 'css/admin.imex.css');
		framePtw::_()->addScript('admin.imex', $this->getModule()->getModPath(). 'js/admin.imex.js');
		framePtw::_()->addScript('admin.tables.list', $this->getModule()->getModPath(). 'js/admin.tables.list.js');
		framePtw::_()->addJSVar('admin.tables.list', 'ptwTblDataUrl', uriPtw::mod('tables', 'getListForTbl', array('reqType' => 'ajax')));

		return parent::getContent('tablesImportExport');
	}
	public function getTabContent() {
		framePtw::_()->getModule('templates')->loadJqGrid();

		framePtw::_()->addStyle('admin.tables', $this->getModule()->getModPath(). 'css/admin.tables.css');
		framePtw::_()->addScript('admin.tables', $this->getModule()->getModPath(). 'js/admin.tables.js');
		framePtw::_()->addScript('admin.tables.list', $this->getModule()->getModPath(). 'js/admin.tables.list.js');
		framePtw::_()->addJSVar('admin.tables.list', 'ptwTblDataUrl', uriPtw::mod('tables', 'getListForTbl', array('reqType' => 'ajax')));
		
		$this->assign('addNewLink', framePtw::_()->getModule('options')->getTabUrl('tables_add_new'));
		return parent::getContent('tablesAdmin');
	}
	public function getAddNewTabContent() {
		framePtw::_()->getModule('templates')->loadJqueryUi();
		framePtw::_()->addStyle('admin.tables', $this->getModule()->getModPath(). 'css/admin.tables.css');
		framePtw::_()->addScript('admin.tables', $this->getModule()->getModPath(). 'js/admin.tables.js');
		framePtw::_()->getModule('templates')->loadMagicAnims();
		framePtw::_()->getModule('templates')->loadBootstrapPartialOnlyCss();
		
		$changeFor = (int) reqPtw::getVar('change_for', 'get');
		if($changeFor) {
			$originalTable = $this->getModel()->getById( $changeFor );
			$editLink = $this->getModule()->getEditLink( $changeFor );
			$this->assign('originalTable', $originalTable);
			$this->assign('editLink', $editLink);
			framePtw::_()->addJSVar('admin.tables', 'ptwOriginalTable', $originalTable);
			dispatcherPtw::addFilter('mainBreadcrumbs', array($this, 'modifyBreadcrumbsForChangeTpl'));
		}
		$this->assign('list', dispatcherPtw::applyFilters('showTplsList', $this->getModel()->getSimpleList(array('original_id' => 0))));
		$this->assign('changeFor', $changeFor);
		
		return parent::getContent('tablesAddNewAdmin');
	}
	public function modifyBreadcrumbsForChangeTpl($crumbs) {
		$crumbs[ count($crumbs) - 1 ]['label'] = __('Modify Table Template', PTW_LANG_CODE);
		return $crumbs;
	}
	public function changeMainBreadCrumbsClb($crumbs) {
		return array( $crumbs[ count($crumbs) - 1 ] );	// Get rid of all other breadcrumbs - leave space on this page for other important things (buttons, etc.)
	}
	public function getEditTabContent($id) {
		$isWooCommercePluginActivated = $this->getModule()->isWooCommercePluginActivated();
		if(!$isWooCommercePluginActivated) {
			return;
		}
		$table = $this->getModel()->getById($id);
		if(empty($table)) {
			return __('Cannot find required Table', PTW_LANG_CODE);
		}

		$dictCodeModel = $this->getModel('dictCodes');
		$productPropModel = $this->getModel('productProperties');
		$productModel = $this->getModel('products');
		$ptwWccModel = $this->getModel('woo');

		$this->assign('table', $table);
		$this->assign('renderedTable', $this->renderTable($table, true));
		$this->assign('editorFooter', $this->getEditorFooter());
		
		dispatcherPtw::addAction('afterAdminBreadcrumbs', array($this, 'showEditTableFormControls'));
		dispatcherPtw::addFilter('mainBreadcrumbs', array($this, 'changeMainBreadCrumbsClb'));

		$this->connectFrontendAssets( $table );
		$this->connectEditorAssets( $table );
		
		framePtw::_()->getModule('templates')->loadJqueryUi();
		
		$ptwAddNewUrl = framePtw::_()->getModule('options')->getTabUrl('tables_add_new');
		$this->assign('ptwAddNewUrl', $ptwAddNewUrl);
		
		framePtw::_()->getModule('templates')->loadCodemirror();

		framePtw::_()->addStyle('codemirror-style', $this->getModule()->getModPath(). 'css/codemirror.css');
		framePtw::_()->addStyle('admin.tables', $this->getModule()->getModPath(). 'css/admin.tables.css');
		framePtw::_()->addScript('ptw-data-filler', $this->getModule()->getModPath() . 'js/ptwDataFiller.js');
		framePtw::_()->addScript('ptw-admin-data-filler', $this->getModule()->getModPath() . 'js/admin.ptwDataFiller.js', array(
			'jquery-ui-sortable',
			'jquery-ui-dialog',
		));
		framePtw::_()->addScript('admin.tables.edit', $this->getModule()->getModPath(). 'js/admin.tables.edit.js');
		framePtw::_()->addJSVar('admin.tables.edit', 'ptwAddNewUrl', $ptwAddNewUrl);

		$allProductAttributeList = array();
		$prodMetaCodes = $ptwWccModel->getMetaCodesForAllProducts();
		$wcProducts = $ptwWccModel->getAllProducts($allProductAttributeList);
		$allPropertyList = $dictCodeModel->getCodeList($prodMetaCodes, $allProductAttributeList, true);

		$productsList = $productModel->getAllProductsInTable($id);
		$tablePropList = $productPropModel->getTableProperties($id);

		// prepare shortInfo for product list
		$shortProductList = $ptwWccModel->getShortDataFromProductsArr($wcProducts);
		$this->assign('allProductList', $shortProductList);
		$this->assign('productList', $productsList);
		$this->assign('allProdAttrs', $allPropertyList);
		$this->assign('productAttributes', $tablePropList);

		// full products info in Javascript
		framePtw::_()->addJSVar('ptw-data-filler', 'ptwcData', array(
			'products' => $wcProducts,
			'productAttributes' => $allPropertyList,
		));
		
		return parent::getContent('tablesEditAdmin');
	}
	public function showTable($params) {
		$isWooCommercePluginActivated = $this->getModule()->isWooCommercePluginActivated();
		if(!$isWooCommercePluginActivated) {
			return;
		}
		$id = isset($params['id']) ? (int) $params['id'] : 0;
		$table = $id ? $this->getModel()->getById($id) : false;
		if(empty($table)) {
			return __('Cannot find required Table', PTW_LANG_CODE);
		}
		
		framePtw::_()->getModule('templates')->loadCoreJs();
		$this->connectFrontendAssets( $table );
		
		$this->assign('renderedTable', $this->renderTable($table, false));
		//
		$ptwWccModel = $this->getModel('woo');
		$productPropModel = $this->getModel('productProperties');
		$productModel = $this->getModel('products');

		if(!count(self::$wcProducts)) {
			self::$wcProducts = $ptwWccModel->getAllProducts(self::$allProductAttributeList);
		}
		if(!count(self::$allPropertyList)) {
			$dictCodeModel = $this->getModel('dictCodes');
			$prodMetaCodes = $ptwWccModel->getMetaCodesForAllProducts();
			self::$allPropertyList = $dictCodeModel->getCodeList($prodMetaCodes, self::$allProductAttributeList, false);
		}

		$productsList = $productModel->getAllProductsInTable($id);
		$tablePropList = $productPropModel->getTableProperties($id);

		if(!self::$isJsAllProductsAssigned) {
			framePtw::_()->addScript('ptw-data-filler', $this->getModule()->getModPath() . 'js/ptwDataFiller.js');
			framePtw::_()->addScript('ptw-frontend-data-filler', $this->getModule()->getModPath() . 'js/frontend.ptwDataFiller.js');
			framePtw::_()->addJSVar('ptw-data-filler', 'ptwcData', array(
				'products' => self::$wcProducts,
				'productAttributes' => self::$allPropertyList,
			));
			self::$isJsAllProductsAssigned = true;
		}

		framePtw::_()->addJSVar(
			'ptw-frontend-data-filler',
			'ptwTableFront_' . $id,
			array(
				'tableProducts' => $productsList,
				'tableProductAttr' => $tablePropList,
			)
		);

		return parent::getContent('tablesShowTable');
	}

	public function getJsDataForTable($tableId) {
		$productPropModel = $this->getModel('productProperties');
		$productModel = $this->getModel('products');

		$productsList = $productModel->getAllProductsInTable($tableId);
		$tablePropList = $productPropModel->getTableProperties($tableId);

		return array(
			'variable_name' => 'ptwTableFront_' . $tableId,
			'tableProducts' => $productsList,
			'tableProductAttr' => $tablePropList,
		);
	}

	public function showEditTableFormControls() {
		parent::display('tablesEditFormControls');
	}
	public function renderTable($table, $isEditMode = false) {
		if(is_numeric($table)) {
			$table = $this->getModel()->getById($table);
		}
		if(!isset($this->table) || $this->table != $table) {
			// if params enb_desc_col disabled - cut description column
			if($isEditMode === false) {
				if(isset($table['params']['enb_desc_col']['val']) && $table['params']['enb_desc_col']['val'] == 0) {
					$pattern = '`(' . '<div class="[-_\.\w\d\ ]*ptwTableDescCol[\W\w]*'
						. ')<div class="[-_\w\d\.\ ]*ptwCol-1' . '`ui';
					// regex find descriptionColumn
					if(preg_match_all($pattern, $table['html'], $matches)) {
						if(isset($matches[1][0])) {
							$table['html'] = str_replace($matches[1][0], '', $table['html']);
							$table['html'] = preg_replace("`\{\% if \(table\.params\.enb_desc_col\.val \=\= 1 or isEditMode\) \%\}`", '', $table['html']);
						}
					}
				}
			}
			$this->assign('table', $table);
		}
		$this->pushRenderedTable( $table );
		$content = parent::getContent('tablesRender');
		$this->_initTwig();
		return $this->_twig->render($content, array(
			'table' => $table, 
			'isEditMode' => $isEditMode,
		));
	}
	public function pushRenderedTable($table) {
		$this->_renderedTables[] = $table;
	}
	public function getRenderedTables() {
		return $this->_renderedTables;
	}
	public function renderForPost($pid, $params = array()) {
		//framePtw::_()->setStylesInitialized(false);
		//framePtw::_()->setScriptwInitialized(false);
		$isEditMode = isset($params['isEditMode']) ? $params['isEditMode'] : false;
		$post = isset($params['post']) ? $params['post'] : get_post($pid);
		$tables = $this->getModel()->getForPost($pid);
		if($isEditMode) {
			$this->loadWpAdminAssets();
		}
		framePtw::_()->getModule('templates')->loadCoreJs();
		framePtw::_()->getModule('templates')->loadBootstrap();
		framePtw::_()->getModule('templates')->loadCustomBootstrapColorpicker();
		
		if($isEditMode) {
			$originalBlocksByCategories = $this->getModel('tables_blocks')->getOriginalBlocksByCategories();
			$this->assign('originalBlocksByCategories', $originalBlocksByCategories);
			
			$this->assign('allPagesUrl', framePtw::_()->getModule('options')->getTabUrl('tables'));
			$this->assign('previewPageUrl', get_permalink($post));
		}
		$this->_preparePtwoForRender( $tables, $isEditMode );
		
		$this->assign('tables', $tables);
		$this->assign('pid', $pid);
		$this->assign('isEditMode', $isEditMode);
		$this->assign('post', $post);
		$this->assign('stylesScriptwHtml', $this->generateStylesScriptwHtml());
		// Render this part - at final step
		$this->assign('commonFooter', $this->getCommonFooter());
		if($isEditMode) {
			$this->assign('editorFooter', $this->getEditorFooter());
		} else {
			$this->assign('footer', $this->getFooter());
		}
		parent::display('tablesRenderForPost');
	}
	public function getEditorFooter() {
		return parent::getContent('tablesEditorFooter');
	}
	public function getFooter() {
		return parent::getContent('tablesFooter');
	}
	// Footer parts that need to be in frontend and in editor too
	public function getCommonFooter() {
		return parent::getContent('tablesCommonFooter');
	}
	private function _preparePtwoForRender(&$tables, $isEditMode = false) {
		if(!empty($tables['blocks'])) {
			foreach($tables['blocks'] as $i => $block) {
				$tables['blocks'][ $i ]['rendered_html'] = $this->renderBlock( $tables['blocks'][ $i ], $isEditMode );
			}
		}
	}
	public function renderBlock($block = array(), $isEditMode = false) {
		$this->assign('block', $block);
		$this->assign('isEditMode', $isEditMode);
		$content = parent::getInlineContent('tablesRenderBlock');
		$this->_initTwig();
		return $this->_twig->render($content, array('block' => $block));
	}
	public function connectFrontendAssets( $tables = array(), $isEditMode = false ) {
		$isDebbug = (bool) reqPtw::getVar('is_debbug', 'get');
		$isPro = framePtw::_()->getModule('promo')->isPro();

		framePtw::_()->addStyle('animate', $this->getModule()->getAssetsUrl(). 'css/animate.css');
		if ($isDebbug) {
			framePtw::_()->addStyle('frontend.tables', $this->getModule()->getModPath() . 'css/frontend.tables.css');
		} else {
			framePtw::_()->addStyle('frontend.tables', $this->getModule()->getModPath() . 'css/frontend.tables.min.css');
		}

		framePtw::_()->getModule('templates')->loadFontAwesome();
		framePtw::_()->getModule('templates')->loadTooltipster();

		if ($isDebbug) {
			framePtw::_()->addScript('ptw.js.responsive.text', PTW_JS_PATH . 'responsiveText.js');
			framePtw::_()->addScript('frontend.tables.editor.blocks_fabric.base', $this->getModule()->getModPath(). 'js/frontend.tables.editor.blocks_fabric.base.js');
			framePtw::_()->addScript('frontend.tables.editor.blocks.base', $this->getModule()->getModPath(). 'js/frontend.tables.editor.blocks.base.js');
			framePtw::_()->addScript('frontend.tables.editor.elements.base', $this->getModule()->getModPath(). 'js/frontend.tables.editor.elements.base.js');

		} else {
			framePtw::_()->addScript('table.min', PTW_JS_PATH . 'table.min.js');
		}

		framePtw::_()->addScript('frontend.tablesModal', $this->getModule()->getModPath(). 'js/modal.js', array('jquery'), false, true);


		if($isPro && framePtw::_()->getModule('tablepro')) {
			framePtw::_()->addScript('frontend.tablesPro', framePtw::_()->getModule('tablepro')->getModPath(). 'js/frontend.pro.tables.js', array('jquery'), false, true);
		}

		framePtw::_()->addScript('frontend.tables', $this->getModule()->getModPath(). 'js/frontend.tables.js', array('jquery'), false, true);
		framePtw::_()->addJSVar('frontend.tables', 'ptwBuildConst', array(
			'standardFonts' => utilsPtw::getStandardFontsList(),
		));
	}
	public function connectEditorAssets( $tables = array() ) {
		$this->assign('adminEmail', get_bloginfo('admin_email'));
		$this->connectEditorJs( $tables );
		$this->connectEditorCss( $tables );
		
		framePtw::_()->getModule('templates')->loadBootstrapPartial();

		$this->getModule()->assignRenderedTables();
	}
	public function connectEditorJs( $tables = array() ) {
		framePtw::_()->addScript('jquery-ui-core');
		framePtw::_()->addScript('jquery-ui-widget');
		framePtw::_()->addScript('jquery-ui-mouse');
		
		framePtw::_()->addScript('jquery-ui-draggable');
		framePtw::_()->addScript('jquery-ui-sortable');
		//framePtw::_()->addScript('jquery-ui-dialog');
		
		framePtw::_()->getModule('templates')->loadMediaScriptw();
		framePtw::_()->getModule('templates')->loadCustomBootstrapColorpicker();
		framePtw::_()->getModule('templates')->loadTinyMce();
		//framePtw::_()->getModule('templates')->loadContextMenu();
		//framePtw::_()->getModule('templates')->loadCustomColorpicker();
		framePtw::_()->getModule('templates')->loadSlimscroll();
		
		framePtw::_()->addScript('twig', PTW_JS_PATH. 'twig.min.js');
		framePtw::_()->addScript('icheck', PTW_JS_PATH. 'icheck.min.js');
		//framePtw::_()->addScript('frontend.tables.editor.menus', $this->getModule()->getModPath(). 'js/frontend.tables.editor.menus.js');
		framePtw::_()->addScript('wp.tabs', PTW_JS_PATH. 'wp.tabs.js');

		framePtw::_()->addScript('frontend.tables.editor.utils', $this->getModule()->getModPath(). 'js/frontend.tables.editor.utils.js');
		framePtw::_()->addScript('frontend.tables.editor.blocks_fabric', $this->getModule()->getModPath(). 'js/frontend.tables.editor.blocks_fabric.js');
		framePtw::_()->addScript('frontend.tables.editor.elements', $this->getModule()->getModPath(). 'js/frontend.tables.editor.elements.js');
		framePtw::_()->addScript('frontend.tables.editor.elements.menu', $this->getModule()->getModPath(). 'js/frontend.tables.editor.elements.menu.js');
		framePtw::_()->addScript('frontend.tables.editor.blocks', $this->getModule()->getModPath(). 'js/frontend.tables.editor.blocks.js');
		framePtw::_()->addScript('frontend.tables.editor', $this->getModule()->getModPath(). 'js/frontend.tables.editor.js');

		$ptwEditor = array();
		$ptwEditor['posts'] = array();

		global $wpdb;
		$postTypesForPostsList = array('page', 'post', 'product', 'blog');
		$allPosts = dbPtw::get("SELECT ID, post_title FROM $wpdb->posts WHERE post_type IN ('". implode("','", $postTypesForPostsList). "') AND post_status IN ('publish','draft') ORDER BY post_title");

		if ($allPosts) {
			foreach ($allPosts as $post) {
				$ptwEditor['posts'][] = array(
					'url' => get_permalink($post['ID']),
					'title' => $post['post_title'],
				);
			}
		}

		framePtw::_()->addJSVar('frontend.tables.editor', 'ptwEditor', $ptwEditor);
	}
	public function connectEditorCss( $tables = array() ) {
		// We will use other instance of this lib here - to use prev. one in admin area
		framePtw::_()->addStyle('tables.icheck', $this->getModule()->getModPath(). 'css/jquery.icheck.css');
		framePtw::_()->addStyle('frontend.tables.editor', $this->getModule()->getModPath(). 'css/frontend.tables.editor.css');
		framePtw::_()->addStyle('frontend.tables.editor.tinymce', $this->getModule()->getModPath(). 'css/frontend.tables.editor.tinymce.css');
		framePtw::_()->addStyle('frontend.tables.fonts', $this->getModule()->getAssetsUrl(). 'css/frontend.tables.fonts.css');
	}
	protected function _initTwig() {
		if(!$this->_twig) {
			if(!class_exists('Twig_Autoloader')) {
				require_once(PTW_CLASSES_DIR. 'Twig'. DS. 'Autoloader.php');
			}
			Twig_Autoloader::register();
			$this->_twig = new Twig_Environment(new Twig_Loader_String(), array('debug' => 0));
			$this->_twig->addFunction(
				new Twig_SimpleFunction('adjBs'	/*adjustBrightness*/, array(
						$this,
						'adjustBrightness'
					)
				)
			);
		}
	}
	public function adjustBrightness($hex, $steps) {
		static $converted = array();
		if(isset($converted[ $hex ]) && isset($converted[ $hex ][ $steps ])) {
			return $converted[ $hex ][ $steps ];
		}
		$isRgb = (strpos($hex, 'rgb') !== false);
		if($isRgb) {
			$rgbArr = utilsPtw::rgbToArray($hex);
			$isRgba = count($rgbArr) == 4;
			$hex = utilsPtw::rgbToHex($rgbArr);
		}
		 // Steps should be between -255 and 255. Negative = darker, positive = lighter
		$steps = max(-255, min(255, $steps));

		// Normalize into a six character long hex string
		$hex = str_replace('#', '', $hex);
		if (strlen($hex) == 3) {
			$hex = str_repeat(substr($hex, 0, 1), 2). str_repeat(substr($hex, 1, 1), 2). str_repeat(substr($hex, 2, 1), 2);
		}

		// Split into three parts: R, G and B
		$color_parts = str_split($hex, 2);
		$return = '#';

		foreach ($color_parts as $color) {
			$color   = hexdec($color); // Convert to decimal
			$color   = max(0, min(255, $color + $steps)); // Adjust color
			$return .= str_pad(dechex($color), 2, '0', STR_PAD_LEFT); // Make two char hex code
		}
		
		if($isRgb) {
			$return = utilsPtw::hexToRgb( $return );
			if($isRgba) {	// Don't forget about alpha chanel
				$return[] = $rgbArr[ 3 ];
			}
			$return = ($isRgba ? 'rgba' : 'rgb'). '('. implode(',', $return). ')';
		}
		if(!isset($converted[ $hex ]))
			$converted[ $hex ] = array();
		$converted[ $hex ][ $steps ] = $return;
		return $return;
	}


}
