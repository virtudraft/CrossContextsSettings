CrossContextsSettings.panel.Home = function (config) {
    config = config || {};
    Ext.apply(config, {
        border: false
        , baseCls: 'modx-formpanel'
        , cls: 'container'
        , items: [
            {
                html: '<b style="font-size: 22px;">' + _('crosscontextssettings') + '</b> ' + CrossContextsSettings.config.version
                , border: false
                , cls: 'modx-page-header'
            }, {
                xtype: 'modx-tabs'
                , defaults: {border: false, autoHeight: true}
                , border: true
                , items: [
                    {
                        title: _('crosscontextssettings.settings')
                        , defaults: {autoHeight: true}
                        , items: [
                            {
                                html: '<p>' + _('crosscontextssettings.settings_desc') + '</p>'
                                , border: false
                                , bodyCssClass: 'panel-desc'
                            }, {
                                id: 'crosscontextssettings-grid-settings-holder'
                                , border: false
                                , preventRender: true
                            }
                        ]
//                    }, {
//                        title: _('crosscontextssettings.usergroups')
//                        , items: []
                    }
                ]
                , listeners: {
                    'beforerender': {
                        fn: function (tabPanel) {
                            this.makeGrid();
                        }
                        , scope: this
                    }
                }
            }, {
                html: '<a href="javascript:void(0);" style="color: #bbbbbb;" id="crosscontextssettings_about">' + _('crosscontextssettings.about') + '</a>',
                border: false,
                bodyStyle: 'font-size: 10px; margin: 5px; background: transparent;',
                listeners: {
                    afterrender: function() {
                        Ext.get('crosscontextssettings_about').on('click', function() {
                            var msg = '&copy; 2014, ';
                            msg += '<a href="http://www.virtudraft.com" target="_blank">';
                            msg += 'www.virtudraft.com';
                            msg += '</a><br/>';
                            msg += 'License GPL v3';
                            Ext.MessageBox.alert('CrossContextsSettings', msg);
                        });
                    }
                }
            }
        ]
    });
    CrossContextsSettings.panel.Home.superclass.constructor.call(this, config);
};
Ext.extend(CrossContextsSettings.panel.Home, MODx.Panel, {
    makeGrid: function () {
        MODx.Ajax.request({
            url: CrossContextsSettings.config.connectorUrl
            , params: {
                action: 'mgr/contexts/getlist'
            }
            , listeners: {
                'success': {
                    fn: function (r) {
                        if (r.success) {
                            this.getSettingsGrid(r.results);
                        }
                    }
                    , scope: this
                }
            }
        });
    }
    , getSettingsGrid: function (record) {
        MODx.load({
            xtype: 'crosscontextssettings-grid-settings'
            , record: record
            , cls: 'main-wrapper'
            , preventRender: true
            , applyTo: 'crosscontextssettings-grid-settings-holder'
        });
    }
});
Ext.reg('crosscontextssettings-panel-home', CrossContextsSettings.panel.Home);