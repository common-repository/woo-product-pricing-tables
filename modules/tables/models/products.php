<?php
class productsModelPtw extends modelPtw {
	protected $db = null;
	public function __construct() {
		global $wpdb;
		$this->db = $wpdb;
		$this->_setTbl('@__products');
	}

	public function getAllProductsInTable($tableId) {
		$tableId = (int) $tableId;
		$selQuery = dbPtw::prepareQuery("SELECT `product_id` 
			FROM " . $this->getTbl() . "
			WHERE table_id =%d 
			ORDER BY `order` ASC;");
		$selQuery = $this->db->prepare($selQuery, $tableId);
		$tmpArr = $this->db->get_results($selQuery, ARRAY_A);

		$productList = array();
		if(count($tmpArr)) {
			foreach($tmpArr as $oneProduct) {
				$productList[] = $oneProduct['product_id'];
			}
		}

		return $productList;
	}

	public function saveProductIdsIntoTable($tableId, $productIds) {
		$tableId = (int) $tableId;
		if(is_array($productIds) && count($productIds)) {
			// remove previous values
			$this->removeProductsForTable($tableId);
			// add new values
			return $this->addProductIdsInTable($tableId, $productIds);
		}
		return false;
	}

	public function removeProductsForTable($tableId) {
		$tableId = (int) $tableId;
		$delQuery = dbPtw::prepareQuery("DELETE FROM " . $this->getTbl() . " WHERE table_id = %d");
		$delQuery = $this->db->prepare($delQuery, $tableId);
		$this->db->query($delQuery);
	}

	public function addProductIdsInTable($tableId, $productIds) {
		$tableId = (int) $tableId;
		if(is_array($productIds) && count($productIds)) {
			// foreach($productIds as $oneProduct)
			$queryParams = array();
			$prodIdx = 0;
			foreach($productIds as $oneProduct) {
				$queryParams[] = $tableId;
				$queryParams[] = $oneProduct;
				$queryParams[] = $prodIdx;
				$prodIdx++;
			}

			$insertQuery = dbPtw::prepareQuery("INSERT INTO " . $this->getTbl() . "(`table_id`, `product_id`, `order`)VALUES" .
				implode(',', array_fill(0, count($productIds), "(%d, %d, %d)")));
			$insertQuery = $this->db->prepare($insertQuery, $queryParams);
			$this->db->query($insertQuery);
			return true;
		}
		return false;
	}

	public function copyDataFrom($oldId, $newId) {
		$retRes = false;
		$oldId = (int) $oldId;
		$newId = (int) $newId;

		$selQuery = dbPtw::prepareQuery("SELECT `product_id` FROM " . $this->getTbl() . " WHERE table_id =%d ORDER BY `order` ASC;");
		$selQuery = $this->db->prepare($selQuery, $oldId);
		$queryRes = $this->db->get_results($selQuery, ARRAY_A);
		// insert new
		if(is_array($queryRes) && count($queryRes)) {
			$productIds = array();
			foreach($queryRes as $oneProduct) {
				$productIds[] = $oneProduct['product_id'];
			}
			$retRes = $this->addProductIdsInTable($newId, $productIds);
		}
		return $retRes;
	}
}