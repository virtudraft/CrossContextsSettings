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
 * CrossContextsSettings controller script
 *
 * @package crosscontextssettings
 * @subpackage controller
 */
require_once dirname(__FILE__) . '/model/crosscontextssettings.class.php';

abstract class CrossContextsSettingsManagerController extends modExtraManagerController {

    /** @var CrossContextsSettings $crosscontextssettings */
    public $crosscontextssettings;

    public function initialize() {
        $this->crosscontextssettings = new CrossContextsSettings($this->modx);

        $this->addCss($this->crosscontextssettings->config['cssUrl'] . 'mgr.css');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/crosscontextssettings.js');
        $this->addHtml('<script type="text/javascript">
        Ext.onReady(function() {
            CrossContextsSettings.config = ' . $this->modx->toJSON($this->crosscontextssettings->config) . ';
        });
        </script>');
        return parent::initialize();
    }

    public function getLanguageTopics() {
        return array('crosscontextssettings:default', 'setting');
    }
}

class IndexManagerController extends CrossContextsSettingsManagerController {

    public static function getDefaultController() {
        return 'home';
    }

}
