<?php
class productPropertiesModelPtw extends modelPtw {

	public function __construct() {
		global $wpdb;
		$this->db = $wpdb;
		$this->_setTbl('@__product_properties');
	}

	public function removeOldAndAddPropsToTable($tableId, $propList) {
		$tableId = (int) $tableId;
		if(is_array($propList) && count($propList)) {
			// remove previous values
			$removeQuery = $this->db->prepare("DELETE FROM " . $this->getTbl() . " WHERE table_id=%d", $tableId);
			$removeQuery = dbPtw::prepareQuery($removeQuery);
			$this->db->query($removeQuery);

			// add new
			$inserRes = $this->addPropsToTable($tableId, $propList);
			return $inserRes;
		}
		return false;
	}

	public function addPropsToTable($tableId, $propList) {
		$tableId = (int) $tableId;
		$countProp = count($propList);
		$queryParams = array();
		$queryParamCodes = array();
		if($countProp) {
			foreach($propList as $oneProp) {
				$queryParams[] = $tableId;
				$queryParams[] = $oneProp['property_id'];
				$queryParams[] = $oneProp['order'];
				$queryParamCodes[] = "(%d, %d, %d)";
			}

			$insertQuery = $this->db->prepare("INSERT INTO " . $this->getTbl() . "(`table_id`,`property_id`,`order`)"
				. " VALUES " . implode(',', $queryParamCodes), $queryParams);
			$insertQuery = dbPtw::prepareQuery($insertQuery);
			$this->db->query($insertQuery);
			return true;
		}
		return false;
	}

	public function getTableProperties($id) {
		$id = (int) $id;
		$selQuery = $this->db->prepare("SELECT pp.`property_id` FROM " . $this->getTbl() . " pp " .
			" INNER JOIN @__product_property_codes dc	ON pp.property_id = dc.id " .
			" WHERE pp.`table_id`=%d" .
			" ORDER BY pp.`order` ASC;", $id);
		$selQuery = dbPtw::prepareQuery($selQuery);
		$queryRes = $this->db->get_results($selQuery, ARRAY_A);

		if(count($queryRes)) {
			foreach($queryRes as $oneKey => $oneQr) {
				$queryRes[$oneKey]['uIdx'] = rand(1, 99999);
			}
		}

		return $queryRes;
	}

	public function getSimpleTableProps($tableId) {
		$tableId = (int) $tableId;
		if($tableId) {
			$querySel = $this->db->prepare("SELECT pp.`property_id`, pp.`order` FROM " . $this->getTbl() . " pp WHERE pp.`table_id`=%d", $tableId);
			$querySel = dbPtw::prepareQuery($querySel);
			$queryRes = $this->db->get_results($querySel, ARRAY_A);
			// insert new
			if(is_array($queryRes) && count($queryRes)) {
				return $queryRes;
			}
		}
		return array();
	}

	public function copyDataFrom($oldId, $newId) {
		$retRes = false;
		$newId = (int) $newId;
		if($newId) {
			// get data from "old table"
			$queryRes = $this->getSimpleTableProps($oldId);
			// insert new
			if(is_array($queryRes) && count($queryRes)) {
				$retRes = $this->addPropsToTable($newId, $queryRes);
			}
		}
		return $retRes;
	}
}