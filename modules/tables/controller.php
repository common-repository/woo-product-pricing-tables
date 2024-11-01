<?php
class tablesControllerPtw extends controllerPtw {
	public function createFromTpl() {
		$res = new responsePtw();
		if(($id = $this->getModel()->createFromTpl(reqPtw::get('post'))) != false) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	protected function _prepareListForTbl($data) {
		if(!empty($data)) {
			foreach($data as $i => $v) {
				$data[ $i ]['label'] = '<a class="" href="'. $this->getModule()->getEditLink($data[ $i ]['id']). '">'. $data[ $i ]['label']. '&nbsp;<i class="fa fa-fw fa-pencil" style="margin-top: 2px;"></i></a>';
			}
		}
		return $data;
	}
	protected function _prepareModelBeforeListSelect($model) {
		$where = 'original_id != 0';
		$model->addWhere( $where );
		return $model;
	}
	protected function _prepareTextLikeSearch($val) {
		$query = '(label LIKE "%'. $val. '%"';
		if(is_numeric($val)) {
			$query .= ' OR id LIKE "%'. (int) $val. '%"';
		}
		$query .= ')';
		return $query;
	}
	public function importJSONTable() {
		$res = new responsePtw();
		$data = reqPtw::getVar('data');
		$updateWithSameId = (int) reqPtw::getVar('update_with_same_id');
		$tables = array();
		$requiredFields = array(
			'css', 'html', 'img', 'img_url', 'is_base', 'is_pro', 'original_id', 'params', 'label', 'productsList', 'tablePropList'
		);

		if (! count($data)) {
			$res->pushError('List is empty');
		} else {
			foreach ($data as $table) {
				$issetRequiredField = true;

				foreach ($requiredFields as $field) {
					if (! isset($table[$field])) {
						$issetRequiredField = false;

						break;
					}
				}

				if (! $issetRequiredField) continue;

				if(!$updateWithSameId) {
					if (isset($table['id'])) unset($table['id']);
				}

				$tables[] = $table;
			}

			if (! count($tables)) {
				$res->pushError('List of invalid');
			} else {
				$productModel = $this->getModel('products');
				$productPropModel = $this->getModel('productProperties');

				foreach ($tables as $table) {
					if($updateWithSameId
						&& isset($table['id'])
						&& $this->getModel()->getById($table['id']) !== false
					) {
						$this->getModel()->update($table, array('id' => $table['id']));
						if(!empty($table['productsList'])) {
							$productModel->saveProductIdsIntoTable($table['id'], $table['productsList']);
						}
						if(!empty($table['tablePropList'])) {
							$productPropModel->removeOldAndAddPropsToTable($table['id'], $table['tablePropList']);
						}
					} else {
						$newTableId = $this->getModel()->insert($table);
						if(!empty($table['productsList'])) {
							$productModel->saveProductIdsIntoTable($newTableId, $table['productsList']);
						}
						if(!empty($table['tablePropList'])) {
							$productPropModel->removeOldAndAddPropsToTable($newTableId, $table['tablePropList']);
						}
					}
				}

				$res->addData('success', true);
			}
		}

		$res->ajaxExec();
	}
	public function getJSONExportTable() {
		$res = new responsePtw();
		$tableIDList = reqPtw::getVar('tables');

		if (! count($tableIDList)) {
			$res->pushError('List is empty');
		} else {
			$tables = array();

			foreach ($tableIDList as $value) {
				$id = (int) $value;

				if ($id) $tables[] = $id;
			}

			if (! count($tables)) {
				$res->pushError('List of invalid');
			} else {
				$tableData = $this->getExportData($tables);
				$res->addData('exportData', $tableData);
			}
		}

		$res->ajaxExec();
	}
	protected function getExportData($tableIds) {
		$tableData = $this->getModel()->getFullByIdList($tableIds);
		if(is_array($tableData) && count($tableData)) {
			$productModel = $this->getModel('products');
			$productPropModel = $this->getModel('productProperties');

			foreach($tableData as $tblKey => $oneTable) {
				$tableId = (int) $oneTable['id'];
				if($tableId) {
					// get product list
					$tableData[$tblKey]['productsList'] = $productModel->getAllProductsInTable($tableId);
					// get product properties
					$tableData[$tblKey]['tablePropList'] = $productPropModel->getSimpleTableProps($tableId);
				}
			}
		}
		return $tableData;
	}
	public function remove() {
		$res = new responsePtw();
		if($this->getModel()->remove(reqPtw::getVar('id', 'post'))) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function save() {
		$res = new responsePtw();
		$data = reqPtw::getVar('data', 'post');
		if($this->getModel()->save( $data )) {
			// save product properties
			$ppModel = $this->getModel('productProperties');
			$ppModel->removeOldAndAddPropsToTable($data['id'], $data['wcProdProps']);
			$productModel = $this->getModel('products');
			$productModel->saveProductIdsIntoTable($data['id'], $data['wcProducts']);
			$res->addMessage(__('Done', PTW_LANG_CODE));
		} else
			$res->pushError($this->getModel()->getErrors());
		$res->ajaxExec();
	}
	public function changeTpl() {
		$res = new responsePtw();
		if($this->getModel()->changeTpl(reqPtw::get('post'))) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
			$id = (int) reqPtw::getVar('id', 'post');
			$res->addData('edit_link', $this->getModule()->getEditLink( $id ));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function exportForDb() {
		$forPro = (int) reqPtw::getVar('for_pro', 'get');
		$tblsCols = array(
			'@__tables' => array('unique_id','label','original_id','params','html','css','img','sort_order','is_base','date_created','is_pro'),
		);
		if($forPro) {
			echo 'db_install=>';
			foreach($tblsCols as $tbl => $cols) {
				echo $this->_makeExportQueriesLogicForPro($tbl, $cols);
			}
		} else {
			foreach($tblsCols as $tbl => $cols) {
				echo $this->_makeExportQueriesLogic($tbl, $cols);
			}
		}
		exit();
	}
	private function _makeExportQueriesLogicForPro($table, $cols) {
		global $wpdb;
		$octoList = $this->_getExportData($table, $cols, true);
		$res = array();

		foreach($octoList as $octo) {
			$uId = '';
			$rowData = array();
			foreach($octo as $k => $v) {
				if(!in_array($k, $cols)) continue;
				
				$val = @mysql_real_escape_string($v);
				if($k == 'unique_id') $uId = $val;
				$rowData[ $k ] = $val;

			}
			$res[ $uId ] = $rowData;
		}
		echo str_replace(array('@__'), '', $table). '|'. base64_encode( utilsPtw::serialize($res) );
	}
	private function _getExportData($table, $cols, $forPro = false) {
		return dbPtw::get('SELECT '. implode(',', $cols). ' FROM '. $table. ' WHERE original_id = 0 and is_base = 1 and is_pro = '. ($forPro ? '1' : '0'));;
	}
	/**
	 * new usage
	 */
	private function _makeExportQueriesLogic($table, $cols) {
		global $wpdb;
		$eol = "\r\n";
		$octoList = $this->_getExportData($table, $cols);
		$valuesArr = array();
		$allKeys = array();
		$uidIndx = 0;
		$i = 0;
		foreach($octoList as $octo) {
			$arr = array();
			$addToKeys = empty($allKeys);
			$i = 0;
			foreach($octo as $k => $v) {
				if(!in_array($k, $cols)) continue;
				if($addToKeys) {
					$allKeys[] = $k;
					if($k == 'unique_id') {
						$uidIndx = $i;
					}
				}
//				$v = ''. stripslashes($v). '';
//				$v = ''. $wpdb->esc_like($v). '';
//				$v = addslashes($v);
				// $arr[] = ''. @mysql_real_escape_string($v). '';
				$arr[] = $v;
				$i++;
			}
			$valuesArr[] = $arr;
		}
		$out = '';
		//$out .= "\$cols = array('". implode("','", $allKeys). "');". $eol;
		$out .= "\$data = array(". $eol;
		foreach($valuesArr as $row) {
			$uid = str_replace(array('"'), '', $row[ $uidIndx ]);
			$installData = array();
			foreach($row as $i => $v) {
				$installData[] = "'{$allKeys[ $i ]}' => '{$v}'";
			}
			$out .= "'$uid' => array(". implode(',', $installData). "),". $eol;
		}
		$out .= ");". $eol;
		return $out;
	}
	public function saveAsCopy() {
		$res = new responsePtw();
		$ajaxPostData = reqPtw::get('post');

		$newId = $this->getModel()->saveAsCopy($ajaxPostData);
		if($newId) {
			$oldId = $ajaxPostData['id'];
			$productPropModel = $this->getModel('productProperties');
			$productPropModel->copyDataFrom($oldId, $newId);
			$productModel = $this->getModel('products');
			$productModel->copyDataFrom($oldId, $newId);

			$res->addMessage(__('Done, redirecting to new Table...', PTW_LANG_CODE));
			$res->addData('edit_link', $this->getModule()->getEditLink( $newId ));
		} else {
			$res->pushError ($this->getModel()->getErrors());
		}
		return $res->ajaxExec();
	}
	public function updateLabel() {
		$res = new responsePtw();
		if($this->getModel()->updateLabel(reqPtw::get('post'))) {
			$res->addMessage(__('Done', PTW_LANG_CODE));
		} else
			$res->pushError ($this->getModel()->getErrors());
		return $res->ajaxExec();
	}
	public function getPermissions() {
		return array(
			PTW_USERLEVELS => array(
				PTW_ADMIN => array('getListForTbl', 'remove', 'removeGroup', 'clear',
					'save', 'exportForDb', 'updateLabel', 'changeTpl', 'saveAsCopy')
			),
		);
	}
}

