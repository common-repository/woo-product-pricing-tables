<?php
class wooModelPtw extends modelPtw {

	protected $wcPostType = 'product';

	public function getProductsTaxonomyList() {
		$taxonomyList = array();
		$taxTemp = get_taxonomies(
			array(
				'object_type' => array($this->wcPostType),
			),
			'objects'
		);

		if(count($taxTemp)) {
			foreach($taxTemp as $ttKey => $oneItem) {
				$addArr = array();
				$addArr['name'] = $oneItem->name;
				if(isset($oneItem->labels->singular_name)) {
					$addArr['label'] = $oneItem->labels->singular_name;
				} else {
					$addArr['label'] = $oneItem->label;
				}
				$taxonomyList[$ttKey] = $addArr;
			}
		}
		return $taxonomyList;
	}

	public function getDefaultTitleList() {
		$list = array(
			'post_thumbnail_url' => $this->translate('Post thumbnail'),
			'_wc_review_count' => $this->translate('Review Count'),
			'_wc_rating_count' => $this->translate('Rating Count'),
			'_wc_average_rating' => $this->translate('Average Rating'),
			'_edit_lock' => $this->translate('Edit Lock'),
			'_edit_last' => $this->translate('Edit Last'),
			'_thumbnail_id' => $this->translate('Thumbnail Id'),
			'_sku' => $this->translate('Sku'),
			'_regular_price' => $this->translate('Regular Price'),
			'_sale_price' => $this->translate('Sale Price'),
			'_sale_price_dates_from' => $this->translate('Sale Price Dates From'),
			'_sale_price_dates_to' => $this->translate('Sale Price Dates To'),
			'total_sales' => $this->translate('Total Sales'),
			'_tax_status' => $this->translate('Tax Status'),
			'_tax_class' => $this->translate('Tax Class'),
			'_manage_stock' => $this->translate('Manage Stock'),
			'_backorders' => $this->translate('Backorders'),
			'_sold_individually' => $this->translate('Sold Individually'),
			'_weight' => $this->translate('Weight'),
			'_length' => $this->translate('Length'),
			'_width' => $this->translate('Width'),
			'_height' => $this->translate('Height'),
			'_upsell_ids' => $this->translate('Upsell Ids'),
			'_crosssell_ids' => $this->translate('Crosssell Ids'),
			'_purchase_note' => $this->translate('Purchase Note'),
			'_default_attributes' => $this->translate('Default Attributes'),
			'_virtual' => $this->translate('Virtual'),
			'_downloadable' => $this->translate('Downloadable'),
			'_product_image_gallery' => $this->translate('Product Image Gallery'),
			'_download_limit' => $this->translate('Download Limit'),
			'_download_expiry' => $this->translate('Download Expiry'),
			'_stock' => $this->translate('Stock'),
			'_stock_status' => $this->translate('Stock Status'),
			'_product_version' => $this->translate('Product Version'),
			'_price' => $this->translate('Price'),
			'_product_attributes' => $this->translate('Product Attributes'),
		);
		return $list;
	}

	public function getMetaCodesForAllProducts() {
		global $wpdb;
		$query = "SELECT DISTINCT pm.meta_key
				FROM " . $wpdb->prefix . "postmeta pm
				LEFT JOIN " . $wpdb->prefix . "posts p
					ON p.ID = pm.post_id
				WHERE p.post_type = 'product'";

		$prodCodes = $wpdb->get_results($query, OBJECT_K);

		$resultCodes = array();
		if(count($prodCodes)) {
			$titleList = $this->getDefaultTitleList();
			foreach($prodCodes as $key => $val) {
				// except some attributes
				if(!in_array($key, array(
					'_product_attributes', '_product_version', '_download_expiry', '_download_limit', '_crosssell_ids',
					'_upsell_ids', '_edit_last', '_edit_lock', '_product_image_gallery', '_visibility'
				))) {
					$title = isset($titleList[$key]) ? $titleList[$key] : $key;
					$toAddItem = array(
						'code' => $key,
						'title' => $title,
					);

					$resultCodes[] = $toAddItem;
				}
			}
		}
		return $resultCodes;
	}

	public function getAllProducts(&$allProductAttributeList) {
		$products = array();

		$productArgs = array(
			'post_type' => $this->wcPostType,
			'posts_per_page' => -1,
		);

		$tmpProd = get_posts($productArgs);

		if(count($tmpProd)) {
			foreach($tmpProd as $oneProduct) {
				$productToAdd = array(
					'id' => $oneProduct->ID,
					'post_title' => $oneProduct->post_title,
					'post_name' => $oneProduct->post_name,
					'post_url' => get_permalink($oneProduct),
				);

				$prodMetaArr = get_post_meta($oneProduct->ID);

				if(count($prodMetaArr)) {
					foreach($prodMetaArr as $pmKey => $pmValue) {

						switch($pmKey) {
							// prepare images
							case '_thumbnail_id':
								if(count($pmValue)) {
									$postImgUrl = wp_get_attachment_image_src($pmValue[0], 'medium', false);
									$productToAdd['post_thumbnail_url'] = $postImgUrl;
								}
								break;
							// prepare product_attibutes
							case '_product_attributes':
								$specPmArr = array();
								if(count($pmValue)) {
									foreach($pmValue as $pmvKey => $pmvVal) {
										$oneProdAttrs = unserialize($pmvVal);
										$specPmArr[] = $oneProdAttrs;
										$this->prepareProductAttr($oneProdAttrs, $allProductAttributeList, $productToAdd);
									}
								}
								$productToAdd[$pmKey] = $specPmArr;
								break;
							case '_wc_rating_count':
								$ratingInfo = '-';
								if(count($pmValue)) {
									foreach($pmValue as $pmvKey => $pmvVal) {
										$tmpVal = unserialize($pmvVal);

										if($tmpVal && is_array($tmpVal) && count($tmpVal)) {
//											foreach($tmpVal as $tKey => $tVal) {
//												$ratingInfo .= $tKey . $this->translate(' stars(') . $tVal . '); ';
//											}
											$ratingInfo = array_sum($tmpVal);
										}
									}
								}
								$productToAdd[$pmKey] = $ratingInfo;
								break;
							case '_sale_price_dates_from':
							case '_sale_price_dates_to':
								$tmpVal = $this->checkValueAndGet($pmValue);
								if($tmpVal) {
									$productToAdd[$pmKey] = date('Y/m/d', $tmpVal);
								} else {
									$productToAdd[$pmKey] = '-';
								}
								break;
							case '_regular_price':
							case '_sale_price':
							case '_price':
								$currPrice = $pmValue;
								if(is_array($pmValue)) {
									if(count($pmValue)) {
										$currPrice = $pmValue[0];
									} else {
										$currPrice = 0;
									}
								}
								$productToAdd[$pmKey] = wc_price($currPrice);
								break;
							default:
								$productToAdd[$pmKey] = $this->checkValueAndGet($pmValue);
								break;
							// items to skip
							case '_upsell_ids':
							case '_crosssell_ids':
							case '_edit_lock':
							case '_edit_last':
							//case '_product_attributes':
							case '_download_limit':
							case '_download_expiry':
							case '_product_version':
								break;
						}
					}
				}
				$products[$oneProduct->ID] = $productToAdd;
			}
		}
		return $products;
	}

	// get standart value
	protected function checkValueAndGet($propValue, $emptyVal = null) {

		if(is_array($propValue)) {
			if(count($propValue)) {
				$retResult = $propValue[0];
			} else {
				$retResult = 0;
			}
		} else {
			$retResult = $propValue;
		}
		if(!$emptyVal && empty($retResult)) {
			$retResult = $emptyVal;
		}

		return $retResult;
	}

	protected function prepareProductAttr($oneProdAttr, &$allProductAttributeList, &$productAdded) {
		if(count($oneProdAttr)) {
			foreach($oneProdAttr as $opaKey => $opaVal) {
				$attrCode = urlencode($opaVal['name']);
				$translatedCode = $this->translate($opaVal['name']);
				$allProductAttributeList[$attrCode] = array(
					'code' => 'ppa_' . $attrCode,
					'title' => $translatedCode,
				);

				if($productAdded) {
					$productAdded['ppa_' . $attrCode] = $opaVal['value'];
				}
			}
		}
	}

	public function getShortDataFromProductsArr($productArr) {
		$shortInfoArr = array();

		if(count($productArr)) {
			foreach($productArr as $productVal) {
				$shortInfoArr[$productVal['id']] = array(
					'id' => $productVal['id'],
					'title' => $productVal['post_title'],
				);
			}
		}

		return $shortInfoArr;
	}
}