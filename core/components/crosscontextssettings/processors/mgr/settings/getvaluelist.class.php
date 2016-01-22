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
class CrossContextsSettingsSettingsGetListProcessor extends modObjectGetListProcessor {

    public $classKey = 'modContextSetting';
    public $languageTopics = array('crosscontextssettings:default');
    public $defaultSortField = 'key';
    public $defaultSortDirection = 'ASC';
    public $objectType = 'crosscontextssettings.getlist';
    protected $columns = array();

    /**
     * {@inheritDoc}
     * @return boolean
     */
    public function initialize() {
        $columns = $this->getProperty('columns');
        if ($columns) {
            $columns = array_map('trim', @explode(',', $columns));
            foreach($columns as $k => $v) {
                if (empty($v)) {
                    unset($columns[$k]);
                }
            }
            $count = count($columns);
            if ($count < 3) {
                return $this->modx->lexicon('crosscontextssettings.context_err_ns');
            }
            $this->columns = $columns;
        }

        return parent::initialize();
    }

    /**
     * Get the data of the query
     * @return array
     */
    public function getData() {
        $data = array();
        $limit = intval($this->getProperty('limit'));
        $start = intval($this->getProperty('start'));

        /* query for chunks */
        $c = $this->modx->newQuery($this->classKey);
        $c = $this->prepareQueryBeforeCount($c);
        $version = $this->modx->getVersionData();
        $data['total'] = $this->modx->getCount($this->classKey, $c);
        $c = $this->prepareQueryAfterCount($c);
        $sortClassKey = $this->getSortClassKey();
        $sortKey = $this->modx->getSelectColumns($sortClassKey, $this->getProperty('sortAlias', $sortClassKey), '', array($this->getProperty('sort')));
        if (empty($sortKey)) {
            $sortKey = $this->getProperty('sort');
        }
        $c->sortby($sortKey, $this->getProperty('dir'));
        if ($limit > 0) {
            $c->limit($limit, $start);
        }

        $data['results'] = $this->modx->getCollection($this->classKey, $c);
        return $data;
    }

    /**
     * Can be used to adjust the query prior to the COUNT statement
     *
     * @param xPDOQuery $c
     * @return xPDOQuery
     */
    public function prepareQueryBeforeCount(xPDOQuery $c) {
        $c->where(array(
            $this->classKey . '.context_key:!=' => 'mgr'
        ));
        $namespace = $this->getProperty('namespace');
        if ($namespace) {
            $c->where(array(
                $this->classKey . '.namespace:=' => $namespace
            ));
        }
        $area = $this->getProperty('area');
        if ($area) {
            $c->where(array(
                $this->classKey . '.area:=' => $area
            ));
        }
        $key = $this->getProperty('key');
        if ($key) {
            $c->where(array(
                $this->classKey . '.key:LIKE' => "%$key%"
            ));
        }
        $c->groupby($this->classKey . '.key', 'asc');
        return $c;
    }

    /**
     * Prepare the row for iteration
     * @param xPDOObject $object
     * @return array
     */
    public function prepareRow(xPDOObject $object) {
        $objectArray = $object->toArray();

        $output = array();
        if (!empty($this->columns) && is_array($this->columns)) {
            foreach ($this->columns as $column) {
                if ($column === 'key' || $column === 'namespace' || $column === 'area') {
                    $output[$column] = $objectArray[$column];
                } else {
                    $setting = $this->modx->getObject($this->classKey, array(
                        'context_key' => $column,
                        'key' => $objectArray['key'],
                    ));
                    if (!isset($output['xtype'])) {
                        $output['xtype'] = '';
                    }
                    if ($setting) {
                        $output[$column] = $setting->get('value');
                        $output['xtype'] = $setting->get('xtype');
                    } else {
                        $output[$column] = '';
                        if (empty($output['xtype'])) {
                            $check = $this->modx->getObject($this->classKey, array(
                                'key' => $objectArray['key'],
                                'xtype:!=' => '',
                            ));
                            if ($check) {
                                $output['xtype'] = $check->get('xtype');
                            }
                        }
                    }
                }
            }
        }

        return $output;
    }
}

return 'CrossContextsSettingsSettingsGetListProcessor';
