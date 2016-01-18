<?php

/**
 * CrossContextsSettings
 *
 * Copyright 2014-2015 by goldsky <goldsky@virtudraft.com>
 *
 * This file is part of CrossContextsSettings, a custom plugin to manage cross
 * contexts' settings
 *
 * CrossContextsSettings is free software; you can redistribute it and/or modify it under the
 * terms of the GNU General Public License as published by the Free Software
 * Foundation version 3,
 *
 * CrossContextsSettings is distributed in the hope that it will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with
 * CrossContextsSettings; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
 * Suite 330, Boston, MA 02111-1307 USA
 *
 * CrossContextsSettings processor script
 *
 * @package crosscontextssettings
 * @subpackage processor
 */
class CrossContextsSettingsContextsGetListProcessor extends modObjectGetListProcessor {

    public $classKey = 'modContext';
    public $languageTopics = array('crosscontextssettings:default');
    public $defaultSortField = 'key';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'crosscontextssettings.contextsgetlist';

    /**
     * Can be used to adjust the query prior to the COUNT statement
     *
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->where(array(
            'key:!=' => 'mgr'
        ));
        return $c;
    }

    /**
     * Just to make sure 'web' context is at the first column
     * @param array $list
     * @return array
     */
    public function afterIteration(array $list) {
        $newList = array();
        $web = array();
        foreach ($list as $k => $v) {
            if ($v['key'] === 'web') {
                $web = $v;
                continue;
            }
            $newList[] = $v;
        }
        array_unshift($newList, $web);

        return $newList;
    }

    public function outputArray(array $array, $count = false) {
        if ($count === false) {
            $count = count($array);
        }
        return '{"success":true,"total":"' . $count . '","results":' . $this->modx->toJSON($array) . '}';
    }

}

return 'CrossContextsSettingsContextsGetListProcessor';
