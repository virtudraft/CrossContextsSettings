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

class CrossContextsSettingsSettingsCreateProcessor extends modProcessor {
    public $languageTopics = array('setting','namespace');
    public $permission = 'settings';
    public $objectType = 'setting';
    public $primaryKeyField = 'key';
    /** @var modContext */
    protected $contexts = array();

    public function initialize() {
        $primaryKey = $this->getProperty($this->primaryKeyField, false);
        if (empty($primaryKey)) {
            return $this->modx->lexicon($this->objectType . '_err_ns');
        }
        $this->unsetProperty('action');
        $contexts = $this->getProperty('contexts', false);
        if (empty($contexts)) {
            return $this->modx->lexicon('setting_err_nf');
        }
        $this->unsetProperty('contexts');
        $this->contexts = json_decode($contexts, true);
        foreach ($this->contexts as $fk) {
            $context = $this->modx->getContext($fk);
            if (empty($context)) {
                return $this->modx->lexicon('setting_err_nf');
            }
        }
        return true;
    }

    public function process() {
        $props = $this->getProperties();

        foreach ($this->contexts as $fk) {
            $value = trim($props['value'][$fk]);
            if ($value === '') {
                continue;
            }
            $result = $this->modx->runProcessor('context/setting/create', array(
                'fk' => $fk,
                'key' => $props['key'],
                'name' => $props['name'],
                'description' => $props['description'],
                'namespace' => $props['namespace'],
                'xtype' => $props['xtype'],
                'area' => $props['area'],
                'value' => $value,
            ));
            if ($result->isError()) {
                $response = $result->getAllErrors();
                return $this->failure(isset($response[0]) ? $response[0] : '');
            }
        }

        return $this->success();
    }
}

return 'CrossContextsSettingsSettingsCreateProcessor';
