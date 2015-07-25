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
class CrossContextsSettingsSettingsRemoveProcessor extends modProcessor {

    public $languageTopics = array('setting', 'namespace');
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

        return true;
    }

    public function process() {
        $props = $this->getProperties();
        $contextSettings = $this->modx->getCollection('modContextSetting', array(
            'key' => $this->getProperty($this->primaryKeyField)
        ));
        if (!$contextSettings) {
            return $this->failure($this->modx->lexicon('setting_err_nf'));;
        }
        foreach ($contextSettings as $setting) {
            $result = $this->modx->runProcessor('context/setting/remove', array(
                'context_key' => $setting->get('context_key'),
                'key' => $props['key'],
            ));
            if ($result->isError()) {
                $response = $result->getAllErrors();
                return $this->failure(isset($response[0]) ? $response[0] : '');
            }
        }

        return $this->success();
    }

}

return 'CrossContextsSettingsSettingsRemoveProcessor';
