<?php
class modulesModelPtw extends modelPtw {
    public function get($d = array()) {
        if(isset($d['id']) && $d['id'] && is_numeric($d['id'])) {
            $fields = framePtw::_()->getTable('modules')->fillFromDB($d['id'])->getFields();
            $fields['types'] = array();
            $types = framePtw::_()->getTable('modules_type')->fillFromDB();
            foreach($types as $t) {
                $fields['types'][$t['id']->value] = $t['label']->value;
            }
            return $fields;
        } elseif(!empty($d)) {
            $data = framePtw::_()->getTable('modules')->get('*', $d);
            return $data;
        } else {
            return framePtw::_()->getTable('modules')
                ->innerJoin(framePtw::_()->getTable('modules_type'), 'type_id')
                ->getAll(framePtw::_()->getTable('modules')->alias().'.*, '. framePtw::_()->getTable('modules_type')->alias(). '.label as type');
        }
    }
    public function put($d = array()) {
        $res = new responsePtw();
        $id = $this->_getIDFromReq($d);
        $d = prepareParamsPtw($d);
        if(is_numeric($id) && $id) {
            if(isset($d['active']))
                $d['active'] = ((is_string($d['active']) && $d['active'] == 'true') || $d['active'] == 1) ? 1 : 0;           //mmm.... govnokod?....)))
           /* else
                 $d['active'] = 0;*/
            
            if(framePtw::_()->getTable('modules')->update($d, array('id' => $id))) {
                $res->messages[] = __('Module Updated', PTW_LANG_CODE);
                $mod = framePtw::_()->getTable('modules')->getById($id);
                $newType = framePtw::_()->getTable('modules_type')->getById($mod['type_id'], 'label');
                $newType = $newType['label'];
                $res->data = array(
                    'id' => $id, 
                    'label' => $mod['label'], 
                    'code' => $mod['code'], 
                    'type' => $newType,
                    'active' => $mod['active'], 
                );
            } else {
                if($tableErrors = framePtw::_()->getTable('modules')->getErrors()) {
                    $res->errors = array_merge($res->errors, $tableErrors);
                } else
                    $res->errors[] = __('Module Update Failed', PTW_LANG_CODE);
            }
        } else {
            $res->errors[] = __('Error module ID', PTW_LANG_CODE);
        }
        return $res;
    }
    protected function _getIDFromReq($d = array()) {
        $id = 0;
        if(isset($d['id']))
            $id = $d['id'];
        elseif(isset($d['code'])) {
            $fromDB = $this->get(array('code' => $d['code']));
            if(isset($fromDB[0]) && $fromDB[0]['id'])
                $id = $fromDB[0]['id'];
        }
        return $id;
    }
}
