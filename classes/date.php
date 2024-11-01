<?php
class datePtw {
	static public function _($time = NULL) {
		if(is_null($time)) {
			$time = time();
		}
		return date(PTW_DATE_FORMAT_HIS, $time);
	}
}