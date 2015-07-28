CrossContextsSettings.panel.ClearCache = function (config) {
    config = config || {};

    Ext.applyIf(config, {
        id: 'crosscontextssettings-clearcache-panel'
        , bodyStyle: 'margin: 10px;'
        , url: CrossContextsSettings.config.connectorUrl
        , baseParams: {
            action: 'mgr/contexts/clearcache'
        }
        , buttonAlign: 'left'
        , buttons: [
            {
                text: _('clear_cache')
                , cls: 'primary-button'
                , scope: this
                , handler: function () {
                    this.submit();
                }
            }
        ]
        , listeners: {
            'setup': {
                fn: this.setup
                , scope: this
            },
            'success': {
                fn: this.success
                , scope: this
            }
        }
    });

    CrossContextsSettings.panel.ClearCache.superclass.constructor.call(this, config);
};
Ext.extend(CrossContextsSettings.panel.ClearCache, MODx.FormPanel, {
    setup: function () {
        var record = this.config.record || {};
        if (typeof (record) === 'object') {
            var _this = this;
            Ext.each(record, function (item) {
                _this.add({
                    xtype: 'xcheckbox'
                    , boxLabel: item.name
                    , name: 'ctxs[' + item.key + ']'
                });
            });
            _this.doLayout();
            delete(this.config.record);
        }
    },
    success: function (o) {
        this.getForm().reset();
        MODx.msg.status({
            title: _('success')
            , message: o.result.message || _('refresh_success')
            , dontHide: false
        });
    }
});
Ext.reg('crosscontextssettings-clearcache-panel', CrossContextsSettings.panel.ClearCache);