<?php
class promoModelPtw extends modelPtw {
	private $_apiUrl = '';
	private $_bigCli = null;
	private function _getApiUrl() {
		if(empty($this->_apiUrl)) {
			$this->_initApiUrl();
		}
		return $this->_apiUrl;
	}
	public function welcomePageSaveInfo($d = array()) {
		return;	// Nothing for now
		$reqUrl = $this->_getApiUrl(). '?mod=options&action=saveWelcomePageInquirer&pl=rcs';
		$d['where_find_us'] = (int) $d['where_find_us'];
		$desc = '';
		if(in_array($d['where_find_us'], array(4, 5))) {
			$desc = $d['where_find_us'] == 4 ? $d['find_on_web_url'] : $d['other_way_desc'];
		}
		wp_remote_post($reqUrl, array(
			'body' => array(
				'site_url' => get_bloginfo('wpurl'),
				'site_name' => get_bloginfo('name'),
				'where_find_us' => $d['where_find_us'],
				'desc' => $desc,
				'plugin_code' => PTW_CODE,
			)
		));
		// In any case - give user posibility to move futher
		return true;
	}
	public function saveUsageStat($code, $unique = false) {
		return;	// Nothing for now
		if($unique && $this->_checkUniqueStat($code)) {
			return;
		}
		$query = 'INSERT INTO @__usage_stat SET code = "'. dbPtw::escape($code). '", visits = 1
			ON DUPLICATE KEY UPDATE visits = visits + 1';
		return dbPtw::query($query);
	}
	private function _checkUniqueStat($code) {
		$uniqueStats = get_option(PTW_CODE. '_unique_stats');
		if(empty($uniqueStats))
			$uniqueStats = array();
		if(in_array($code, $uniqueStats)) {
			return true;
		}
		$uniqueStats[] = $code;
		update_option(PTW_CODE. '_unique_stats', $uniqueStats);
		return false;
	}
	public function saveSpentTime($code, $spent) {
		$spent = (int) $spent;
		$query = 'UPDATE @__usage_stat SET spent_time = spent_time + '. $spent. ' WHERE code = "'. $code. '"';
		return dbPtw::query($query);
	}
	public function getAllUsageStat() {
		$query = 'SELECT * FROM @__usage_stat';
		return dbPtw::get($query);
	}
	public function sendUsageStat() {
		return;	// Nothing for now
		$allStat = $this->getAllUsageStat();
		$reqUrl = $this->_getApiUrl(). '?mod=options&action=saveUsageStat&pl=rcs';
		$res = wp_remote_post($reqUrl, array(
			'body' => array(
				'site_url' => get_bloginfo('wpurl'),
				'site_name' => get_bloginfo('name'),
				'plugin_code' => PTW_CODE,
				'all_stat' => $allStat
			)
		));
		$this->clearUsageStat();
		// In any case - give user posibility to move futher
		return true;
	}
	public function clearUsageStat() {
		$query = 'DELETE FROM @__usage_stat';
		return dbPtw::query($query);
	}
	public function getUserStatsCount() {
		$query = 'SELECT SUM(visits) AS total FROM @__usage_stat';
		return (int) dbPtw::get($query, 'one');
	}
	public function checkAndSend($force = false){
		$statCount = $this->getUserStatsCount();
		if($statCount >= $this->getModule()->getMinStatSend() || $force) {
			$this->sendUsageStat();
		}
	}
	protected function _initApiUrl() {
		$this->_apiUrl = implode('', array('','h','t','tp',':','/','/u','p','da','t','e','s.','s','u','ps','y','st','i','c.','c','o','m',''));
	}
	private function _getBigStatClient() {
		if(!$this->_bigCli) {
			if(!class_exists('Mixpanel')) {
				require_once($this->getModule()->getModDir(). 'models'. DS. 'classes'. DS. 'lib'. DS. 'Mixpanel.php');
			}
			$opts = array();
			if(!function_exists('curl_init')) {
				$opts['consumer'] = 'socket';
			}
			if(class_exists('Mixpanel')) {
				$this->_bigCli = Mixpanel::getInstance("95bdec2ce4e9073c81b8b651f159ca3b", $opts);
				/*$bigCliId = (int) get_option(PTW_CODE. '_big_cli_id');
				if(!$bigCliId) {
					$bigCliId = mt_rand(1, 9999999999);
					update_option(PTW_CODE. '_big_cli_id', $bigCliId);
				}
				$this->_bigCli->identify( $bigCliId );*/
			}
		}
		return $this->_bigCli;
	}
	public function bigStatAdd( $key, $properties = array() ) {
		if(function_exists('json_encode')) {
			$this->_getBigStatClient();
			if($this->_bigCli) {
				$this->_bigCli->track( $key, $properties );
			}
		}
	}
	public function bigStatAddCheck( $key, $properties = array() ) {
		$canSend = (int) framePtw::_()->getModule('options')->get('send_stats');
		if( $canSend ) {
			$this->bigStatAdd( $key, $properties );
		}
	}
	public function saveDeactivateData( $d ) {
		$deactivateParams = array();
		$reasonsLabels = array(
			'not_working' => 'Not working',
			'found_better' => 'Found better',
			'not_need' => 'Not need',
			'temporary' => 'Temporary',
			'other' => 'Other',
		);
		$deactivateParams['Reason'] = isset($d['deactivate_reason']) && $d['deactivate_reason'] 
			? $reasonsLabels[ $d['deactivate_reason'] ]
			: 'No reason';
		if(isset($d['deactivate_reason']) && $d['deactivate_reason']) {
			switch( $d['deactivate_reason'] ) {
				case 'found_better':
					$deactivateParams['Better plugin'] = $d['better_plugin'];
					break;
				case 'other':
					$deactivateParams['Other'] = $d['other'];
					break;
			}
		}
		$this->bigStatAdd('Deactivated', $deactivateParams);
		$startUsage = (int) framePtw::_()->getModule('options')->get('plug_welcome_show');
		if($startUsage) {
			$usedTime = time() - $startUsage;
			$this->bigStatAdd('Used Time', array(
				'Seconds' => $usedTime, 
				'Hours' => round($usedTime / 60 / 60), 
				'Days' => round($usedTime / 60 / 60 / 24)
			));
		}
		return true;
	}
}
