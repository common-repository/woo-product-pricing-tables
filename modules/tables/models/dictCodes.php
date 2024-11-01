<?php
class dictCodesModelPtw extends modelPtw {
	protected $db = null;

	public function __construct() {
		global $wpdb;
		$this->db = $wpdb;
		$this->_setTbl('@__product_property_codes');
	}

	public function insertAndGetRecords($codes/*, $ptwType = 'meta_key'*/, $insertNewCodes = false) {
		if(is_array($codes) && count($codes)) {
			foreach($codes as $key1 => $oneCode) {
				if(strlen($oneCode['code']) > 200) {
					$codes[$key1]['code'] = substr($oneCode['code'], 0, 200);
				}
				if(strlen($oneCode['title']) > 200) {
					$codes[$key1]['title'] = substr($oneCode['title'], 0, 200);
				}
			}
		}

		$countCodes = count($codes);
		$resArr = array();
		if($countCodes) {
			$codeArr = array();
			foreach($codes as $oneElem) {
				$codeArr[] = $oneElem['code'];
			}

			$s1Params = array_fill(0, $countCodes, '%s');
			// select 1
			$s1Query = dbPtw::prepareQuery("SELECT `id`, `code`, `title` FROM " . $this->getTbl() .
				" WHERE `code` IN (" . implode(',', $s1Params) . ")");
			$s1Query = $this->db->prepare($s1Query, $codeArr);

			$s1Res = $this->db->get_results($s1Query, ARRAY_A);
			$s3Res = array();

			$s1CountRes = count($s1Res);
			// need to insert new Codes?
			if($countCodes > $s1CountRes && $insertNewCodes) {
				// prepare
				$insertIndexesArr = array();
				$select2Params = array();
				foreach($codes as $oneCode) {
					$find = false;
					$ind2 = 0;
					while(!$find && $ind2 < count($s1Res)) {
						if($s1Res[$ind2]['code'] == $oneCode['code']) {
							$find = true;
						}
						$ind2++;
					}
					// add only if element not exists
					if(!$find) {
						$select2Params[] = $oneCode['code'];
						$insertIndexesArr[] = $oneCode['code'];
						$insertIndexesArr[] = $oneCode['title'];
					}
				}

				// remove Exists indexes
				if(count($insertIndexesArr)) {
					$s2ParamsCode = array_fill(0, count($insertIndexesArr)/2, "(%s, %s)");
					$i2Query = $this->db->prepare("INSERT INTO " . $this->getTbl() . "(`code`, `title`) VALUES " . implode(',', $s2ParamsCode), $insertIndexesArr);

					$i2Query = dbPtw::prepareQuery($i2Query);
					$i2Res = $this->db->query($i2Query);
					// new select
					$s3Params = array_fill(0, count($select2Params), '%s');
					$s3Query = dbPtw::prepareQuery("SELECT `id`, `code`, `title` FROM " . $this->getTbl() .
						" WHERE `code` IN (" . implode(',', $s3Params) . ")");

					$s3Query = $this->db->prepare($s3Query, $select2Params);
					$s3Res = $this->db->get_results($s3Query, ARRAY_A);
				}
			}

			$resArr = array_merge($s1Res, $s3Res);
		}
		return $resArr;
	}

	public function getCodeList($dictCodesArr, $allProductAttributeList, $isBackend = false) {
		$allResArr = array();
		$resArr1 = array();
		// prepare WooComerce Product properties
		if(count($dictCodesArr)) {
			$resArr1 = $this->insertAndGetRecords($dictCodesArr, $isBackend);
			if(count($resArr1)) {
				foreach($resArr1 as $ra1Key => $ra1Val) {
					if(!in_array($ra1Val['code'], array('_thumbnail_id', '_product_attributes'))) {
						$ra1Val['ptwType'] = 'meta_key';
						$allResArr[$ra1Val['id']] = $ra1Val;
					}
				}
			}
		}
		// prepare Attribute Properties
		if(count($allProductAttributeList)) {
			$resArr2 = $this->insertAndGetRecords($allProductAttributeList, $isBackend);
			if(count($resArr2)) {
				foreach($resArr2 as $ra1Key => $ra1Val) {
					$ra1Val['ptwType'] = '_product_attributes';
					$allResArr[$ra1Val['id']] = $ra1Val;
				}
			}
		}
		// hardcode fields
		$specCodeArr = array();
		$specCodeArr[] = array(
			'code' => 'post_title',
			'title' => $this->translate('Post title'),
		);
		$specCodeArr[] = array(
			'code' => 'post_url',
			'title' => $this->translate('Post url'),
		);
		$specCodeArr[] = array(
			'code' => 'post_thumbnail_url',
			'title' => $this->translate('Post thumbnail'),
		);
		$resArr3 = $this->insertAndGetRecords($specCodeArr, $isBackend);
		if(count($resArr3)) {
			foreach($resArr3 as $ra2Key => $ra2Val) {
				$ra2Val['ptwType'] = 'post_info';
				$allResArr[$ra2Val['id']] = $ra2Val;
			}
		}

		return $allResArr;
	}
}