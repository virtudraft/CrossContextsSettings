CrossContextsSettings.panel.Home = function (config) {
    config = config || {};

    var _this = this;

    Ext.applyIf(config, {
        border: false
        , baseCls: 'modx-formpanel'
        , cls: 'container'
        , items: [
            {
                html: '<h2>' + _('crosscontextssettings') + ' <span style="font-size: small">' + CrossContextsSettings.config.version + '</span></h2>'
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
                                , listeners: {
                                    'afterrender': {
                                        fn: function (tabPanel) {
                                            this.getContextList(this.getSettingsGrid());
                                        }
                                        , scope: this
                                    }
                                }
                            }
                        ]
                    }, {
                        title: _('clear_cache')
                        , items: [
                            {
                                html: '<p>' + _('crosscontextssettings.clear_cache_desc') + '</p>'
                                , border: false
                                , bodyCssClass: 'panel-desc'
                            }, {
                                id: 'crosscontextssettings-clearcache-panel-holder'
                                , border: false
                                , preventRender: true
                                , listeners: {
                                    'afterrender': {
                                        fn: function (tabPanel) {
                                            this.getContextList(this.getClearCachePanel());
                                        }
                                        , scope: this
                                    }
                                }
                            }
                        ]
                    }
                ]
            }, {
                html: '<a href="javascript:void(0);" style="color: #bbbbbb;" id="crosscontextssettings_about">' + _('crosscontextssettings.about') + '</a>',
                border: false,
                bodyStyle: 'font-size: 10px; margin: 5px; background: transparent;',
                listeners: {
                    afterrender: function () {
                        Ext.get('crosscontextssettings_about').on('click', function () {
                            var msg = '&copy; 2014-2015, ';
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
    contexts: {},
    getContextList: function (callback) {
        if (this.contexts.length > 0) {
            if (typeof (callback) === 'function') {
                return callback();
            }
            return this.contexts;
        }
        return MODx.Ajax.request({
            url: CrossContextsSettings.config.connectorUrl
            , params: {
                action: 'mgr/contexts/getlist'
            }
            , listeners: {
                'success': {
                    fn: function (r) {
                        if (r.success) {
                            this.contexts = r.results;
                            if (typeof (callback) === 'function') {
                                return callback();
                            }
                        }
                    }
                    , scope: this
                }
            }
        });
    }
    , getSettingsGrid: function () {
        MODx.load({
            xtype: 'crosscontextssettings-grid-settings'
            , record: this.contexts
            , cls: 'main-wrapper'
            , preventRender: true
            , applyTo: 'crosscontextssettings-grid-settings-holder'
        });
    }
    , getClearCachePanel: function () {
        var ccForm = new CrossContextsSettings.panel.ClearCache({
            record: this.contexts
            , cls: 'main-wrapper'
        });
        var holder = Ext.getCmp('crosscontextssettings-clearcache-panel-holder');
        holder.add(ccForm);
        holder.doLayout();
    }
});
Ext.reg('crosscontextssettings-panel-home', CrossContextsSettings.panel.Home);