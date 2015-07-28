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
class CrossContextsSettingsContextsClearCacheProcessor extends modProcessor {

    public $objectType = 'crosscontextssettings.context';
    public $languageTopics = array('setting', 'namespace');
    public $permission = 'settings';

    public function initialize() {
        $this->unsetProperty('action');
        $contexts = $this->getProperty('ctxs', false);
        if (empty($contexts)) {
            return $this->modx->lexicon($this->objectType . '_err_ns');
        }
        $check = false;
        foreach ($contexts as $ctx => $val) {
            if ($val == '1') {
                $check = true;
                break;
            }
        }
        if (empty($check)) {
            return $this->modx->lexicon($this->objectType . '_err_ns');
        }

        return true;
    }

    public function process() {
        $contexts = $this->getProperty('ctxs', false);
        $ls = array();
        foreach ($contexts as $ctx => $val) {
            if ($val == '1') {
                $ls[] = $ctx;
            }
        }
        if (!empty($ls)) {
            $res = $this->modx->cacheManager->refresh(array(
                'auto_publish' => array('contexts' => array_diff($ls, array('mgr'))),
                'system_settings' => array(),
                'context_settings' => array('contexts' => $ls),
//                'db' => array(),
//                'media_sources' => array(),
                'lexicon_topics' => array(),
//                'scripts' => array(),
//                'default' => array(),
                'resource' => array('contexts' => array_diff($ls, array('mgr'))),
                'menu' => array(),
                'action_map' => array()
            ));

            if (!$res) {
                return $this->failure();
            }
        }

        return $this->success();
    }

}

return 'CrossContextsSettingsContextsClearCacheProcessor';
