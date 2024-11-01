<?php
/**
 * Plugin Name: Product Pricing Tables
 * Plugin URI: https://woobewoo.com/plugins/woocommerce-pricing-table/
 * Description: Product Pricing Tables
 * Version: 1.0.8
 * Author: woobewoo
 * Author URI: https://woobewoo.com/
 * WC requires at least: 3.4.0
 * WC tested up to: 9.3.3
 * Text Domain: woo-product-pricing-tables
 * Domain Path: /languages
 **/
	/**
	 * Base config constants and functions
	 */
    require_once(dirname(__FILE__). DIRECTORY_SEPARATOR. 'config.php');
    require_once(dirname(__FILE__). DIRECTORY_SEPARATOR. 'functions.php');
	add_action( 'before_woocommerce_init', function() {
		if ( class_exists( \Automattic\WooCommerce\Utilities\FeaturesUtil::class ) ) {
			\Automattic\WooCommerce\Utilities\FeaturesUtil::declare_compatibility( 'custom_order_tables', __FILE__, true );
		}
	} );
	/**
	 * Connect all required core classes
	 */
    importClassPtw('dbPtw');
    importClassPtw('installerPtw');
    importClassPtw('baseObjectPtw');
    importClassPtw('modulePtw');
    importClassPtw('modelPtw');
    importClassPtw('viewPtw');
    importClassPtw('controllerPtw');
    importClassPtw('helperPtw');
    importClassPtw('dispatcherPtw');
    importClassPtw('fieldPtw');
    importClassPtw('tablePtw');
    importClassPtw('framePtw');
    importClassPtw('reqPtw');
    importClassPtw('uriPtw');
    importClassPtw('htmlPtw');
    importClassPtw('responsePtw');
    importClassPtw('fieldAdapterPtw');
    importClassPtw('validatorPtw');
    importClassPtw('errorsPtw');
    importClassPtw('utilsPtw');
    importClassPtw('modInstallerPtw');
	importClassPtw('installerDbUpdaterPtw');
	importClassPtw('datePtw');
	/**
	 * Check plugin version - maybe we need to update database, and check global errors in request
	 */
    installerPtw::update();
    errorsPtw::init();
    /**
	 * Start application
	 */
    framePtw::_()->parseRoute();
    framePtw::_()->init();
    framePtw::_()->exec();
	
	//var_dump(framePtw::_()->getActivationErrors()); exit();
