<?php

/**
 * CrossContextsSettings
 *
 * Copyright 2014 by goldsky <goldsky@virtudraft.com>
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
 * CrossContextsSettings build script
 *
 * @package crosscontextssettings
 * @subpackage build
 */
$settings['crosscontextssettings.core_path'] = $modx->newObject('modSystemSetting');
$settings['crosscontextssettings.core_path']->fromArray(array(
    'key' => 'crosscontextssettings.core_path',
    'value' => '{core_path}components/crosscontextssettings/',
    'xtype' => 'textfield',
    'namespace' => 'crosscontextssettings',
    'area' => 'URL',
        ), '', true, true);

$settings['crosscontextssettings.assets_url'] = $modx->newObject('modSystemSetting');
$settings['crosscontextssettings.assets_url']->fromArray(array(
    'key' => 'crosscontextssettings.assets_url',
    'value' => '{assets_url}components/crosscontextssettings/',
    'xtype' => 'textfield',
    'namespace' => 'crosscontextssettings',
    'area' => 'URL',
        ), '', true, true);

return $settings;
