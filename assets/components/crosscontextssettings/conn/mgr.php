<?php

require_once dirname(dirname(dirname(dirname(dirname(__FILE__))))) . '/config.core.php';
require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
require_once MODX_CONNECTORS_PATH . 'index.php';

$corePath = $modx->getOption('crosscontextssettings.core_path', null, $modx->getOption('core_path') . 'components/crosscontextssettings/');
require_once $corePath . 'model/crosscontextssettings.class.php';
$modx->crosscontextssettings = new CrossContextsSettings($modx);

$modx->lexicon->load('crosscontextssettings:default');

/* handle request */
$path = $modx->getOption('processorsPath', $modx->crosscontextssettings->config, $corePath . 'processors/');
$modx->request->handleRequest(array(
    'processors_path' => $path,
    'location' => '',
));
