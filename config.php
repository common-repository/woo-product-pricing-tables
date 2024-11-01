<?php
    global $wpdb;
    if (!defined('WPLANG') || WPLANG == '') {
        define('PTW_WPLANG', 'en_GB');
    } else {
        define('PTW_WPLANG', WPLANG);
    }
    if(!defined('DS')) define('DS', DIRECTORY_SEPARATOR);

    define('PTW_PLUG_NAME', basename(dirname(__FILE__)));
    define('PTW_DIR', WP_PLUGIN_DIR. DS. PTW_PLUG_NAME. DS);
    define('PTW_TPL_DIR', PTW_DIR. 'tpl'. DS);
    define('PTW_CLASSES_DIR', PTW_DIR. 'classes'. DS);
    define('PTW_TABLES_DIR', PTW_CLASSES_DIR. 'tables'. DS);
	define('PTW_HELPERS_DIR', PTW_CLASSES_DIR. 'helpers'. DS);
    define('PTW_LANG_DIR', PTW_DIR. 'languages'. DS);
    define('PTW_IMG_DIR', PTW_DIR. 'img'. DS);
    define('PTW_TEMPLATES_DIR', PTW_DIR. 'templates'. DS);
    define('PTW_MODULES_DIR', PTW_DIR. 'modules'. DS);
    define('PTW_FILES_DIR', PTW_DIR. 'files'. DS);
	define('PTW_JS_DIR', PTW_DIR. 'js'. DS);
    define('PTW_ADMIN_DIR', ABSPATH. 'wp-admin'. DS);

    define('PTW_SITE_URL', get_bloginfo('wpurl'). '/');
    define('PTW_JS_PATH', plugins_url().'/'.basename(dirname(__FILE__)).'/js/');
    define('PTW_CSS_PATH', plugins_url().'/'.basename(dirname(__FILE__)).'/css/');
    define('PTW_IMG_PATH', plugins_url().'/'.basename(dirname(__FILE__)).'/img/');
    define('PTW_MODULES_PATH', plugins_url().'/'.basename(dirname(__FILE__)).'/modules/');
    define('PTW_TEMPLATES_PATH', plugins_url().'/'.basename(dirname(__FILE__)).'/templates/');
    
    define('PTW_URL', PTW_SITE_URL);

    define('PTW_LOADER_IMG', PTW_IMG_PATH. 'loading.gif');
	define('PTW_TIME_FORMAT', 'H:i:s');
    define('PTW_DATE_DL', '/');
    define('PTW_DATE_FORMAT', 'm/d/Y');
    define('PTW_DATE_FORMAT_HIS', 'm/d/Y ('. PTW_TIME_FORMAT. ')');
    define('PTW_DATE_FORMAT_JS', 'mm/dd/yy');
    define('PTW_DATE_FORMAT_CONVERT', '%m/%d/%Y');
    define('PTW_WPDB_PREF', $wpdb->prefix);
    define('PTW_DB_PREF', 'ptw_');
    define('PTW_MAIN_FILE', 'ptw.php');

    define('PTW_DEFAULT', 'default');
    define('PTW_CURRENT', 'current');
	
	define('PTW_EOL', "\n");
    
    define('PTW_PLUGIN_INSTALLED', true);
    define('PTW_VERSION', '1.0.8');
    define('PTW_USER', 'user');
    
    define('PTW_CLASS_PREFIX', 'ptwc');
    define('PTW_FREE_VERSION', false);
	define('PTW_TEST_MODE', true);
    
    define('PTW_SUCCESS', 'Success');
    define('PTW_FAILED', 'Failed');
	define('PTW_ERRORS', 'ptwErrors');
	
	define('PTW_ADMIN',	'admin');
	define('PTW_LOGGED','logged');
	define('PTW_GUEST',	'guest');
	
	define('PTW_ALL',		'all');
	
	define('PTW_METHODS',		'methods');
	define('PTW_USERLEVELS',	'userlevels');
	/**
	 * Framework instance code, unused for now
	 */
	define('PTW_CODE', 'ptw');

	define('PTW_LANG_CODE', 'woo-product-pricing-tables');
	/**
	 * Plugin name
	 */
	define('PTW_WP_PLUGIN_NAME', 'Woocommerce Product Pricing Tables');
	/**
	 * Custom defined for plugin
	 */
	define('PTW_COMMON', 'common');
	define('PTW_FB_LIKE', 'fb_like');
	define('PTW_VIDEO', 'video');
	
	define('PTW_HOME_PAGE_ID', 0);
	/**
	 * Our product name
	 */
	define('PTW_OUR_NAME', 'Pricing Table');
	/**
	 * Shortcode name
	 */
	define('PTW_SHORTCODE', 'pricing-table-for-woo');
