<?php
class errorsPtw {
    const FATAL = 'fatal';
    const MOD_INSTALL = 'mod_install';
    static private $errors = array();
    static private $haveErrors = false;
    
    static public $current = array();
    static public $displayed = false;
    
    static public function push($error, $type = 'common') {
        if(!isset(self::$errors[$type]))
            self::$errors[$type] = array();
        if(is_array($error))
            self::$errors[$type] = array_merge(self::$errors[$type], $error);
        else
            self::$errors[$type][] = $error;
        self::$haveErrors = true;
        
        if($type == 'session') 
            self::setSession(self::$errors[$type]);
    }
    static public function setSession($error) {
        $sesErrors = self::getSession();
        if(empty($sesErrors))
            $sesErrors = array();
        if(is_array($error))
            $sesErrors = array_merge($sesErrors, $error);
        else
            $sesErrors[] = $error;
        reqPtw::setVar('sesErrors', $sesErrors, 'session');
    }
    static public function init() {
        $ptwErrors = reqPtw::getVar('ptwErrors');
        if(!empty($ptwErrors)) {
            if(!is_array($ptwErrors)) {
                $ptwErrors = array( $ptwErrors );
            }
            $ptwErrors = array_map('htmlspecialchars', array_map('stripslashes', array_map('trim', $ptwErrors)));
            if(!empty($ptwErrors)) {
                self::$current = $ptwErrors;
				if(is_admin()) {
					add_action('admin_notices', array('errorsPtw', 'showAdminErrors'));
				} else {
					add_filter('the_content', array('errorsPtw', 'appendErrorsContent'), 99999);
				}
            }
        }
    }
	static public function showAdminErrors() {
		if(self::$current) {
			$html = '';
			foreach(self::$current as $error) {
				$html .= '<div class="error"><p><strong style="font-size: 15px;">'. $error. '</strong></p></div>';
			}
			echo $html;
		}
	}
    static public function appendErrorsContent($content) {
        if(!self::$displayed && !empty(self::$current)) {
            $content = '<div class="toeErrorMsg">'. implode('<br />', self::$current). '</div>'. $content;
            self::$displayed = true;
        }
        return $content;
    }
    static public function getSession() {
        return reqPtw::getVar('sesErrors', 'session');
    }
    static public function clearSession() {
        reqPtw::clearVar('sesErrors', 'session');
    }
    static public function get($type = '') {
        $res = array();
        if(!empty(self::$errors)) {
            if(empty($type)) {
                foreach(self::$errors as $e) {
                    foreach($e as $error) {
                        $res[] = $error;
                    }
                }
            } else 
                $res = self::$errors[$type];
        }
        return $res;
    }
    static public function haveErrors($type = '') {
        if(empty($type))
            return self::$haveErrors;
        else
            return isset(self::$errors[$type]);
    }
}

