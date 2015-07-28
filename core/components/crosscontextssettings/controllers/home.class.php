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
class CrossContextsSettingsHomeManagerController extends CrossContextsSettingsManagerController {

    public function process(array $scriptProperties = array()) {

    }

    public function getPageTitle() {
        return $this->modx->lexicon('crosscontextssettings');
    }

    public function loadCustomCssJs() {
        $this->addCss($this->crosscontextssettings->config['jsUrl'] . 'ux/LockingGridView/LockingGridView.css');
        $this->addJavascript($this->modx->config['manager_url'] . 'assets/modext/widgets/core/modx.grid.settings.js');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'ux/LockingGridView/LockingGridView.js');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/widgets/window.setting.create.js');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/widgets/grid.settings.js');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/widgets/panel.clearcache.js');
        $this->addJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/widgets/panel.home.js');
        $this->addLastJavascript($this->crosscontextssettings->config['jsUrl'] . 'mgr/sections/index.js');
        $this->addHtml('
            <script type="text/javascript">
                MODx.version_is22 = ' . version_compare('2.2.100', $this->modx->getOption('settings_version')) . '
            </script>');
    }

    public function getTemplateFile() {
        return $this->crosscontextssettings->config['templatesPath'] . 'home.tpl';
    }

}
