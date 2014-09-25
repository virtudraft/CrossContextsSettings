CrossContextsSettings.grid.Settings = function (config) {
    config = config || {};

    var colModel = [];
    var columns = [];

    if (config.record) {
        colModel.push({
            header: _('key')
            , width: 300
            , sortable: true
            , dataIndex: 'key'
            , locked: true
            , id: 'key'
        });
        columns.push('key');
        Ext.each(config.record, function (item, index) {
            colModel.push({
                header: item.key
                , width: 200
                , sortable: false
                , dataIndex: item.key
                , id: item.key
                , editor: item.editor
            });
            columns.push(item.key);
        });
    }
    Ext.applyIf(config, {
        id: 'crosscontextssettings-grid-settings'
        , url: CrossContextsSettings.config.connectorUrl
        , baseParams: {
            action: 'mgr/settings/getvaluelist'
            , columns: columns.toString()
            , 'namespace': MODx.request['namespace'] ? MODx.request['namespace'] : 'core'
        }
        , colModel: new Ext.ux.grid.LockingColumnModel(colModel)
        , fields: columns
        , paging: true
        , remoteSort: true
        , anchor: '97%'
        , view: new Ext.ux.grid.LockingGridView()
        , height: 580
//        , bodyStyle: 'min-height: 400px;'
        , autoHeight: false
        , save_action: 'mgr/settings/updatefromgrid'
        , autosave: true
        , tbar: [
//            {
//                text: _('setting_create')
//            }, 
            '->', {
                xtype: 'modx-combo-namespace'
                , name: 'namespace'
                , id: 'modx-filter-namespace'
                , emptyText: _('namespace_filter')
                , value: MODx.request['namespace'] ? MODx.request['namespace'] : 'core'
                , allowBlank: true
                , width: 150
                , listeners: {
                    'select': {
                        fn: this.filterByNamespace
                        , scope: this
                    }
                }
            }, {
                xtype: 'modx-combo-area'
                , name: 'area'
                , id: 'modx-filter-area'
                , emptyText: _('area_filter')
//                , url: MODx.config.connectors_url +'system/settings.php'
                , baseParams: {
                    action: 'getAreas'
                    , 'namespace': MODx.request['namespace'] ? MODx.request['namespace'] : 'core'
                }
                , width: 250
                , allowBlank: true
                , listeners: {
                    'select': {
                        fn: this.filterByArea
                        , scope: this
                    }
                }
            }, '-', {
                xtype: 'textfield'
                , name: 'filter_key'
                , id: 'modx-filter-key'
                , emptyText: _('search_by_key') + '...'
                , listeners: {
                    'change': {
                        fn: this.filterByKey
                        , scope: this
                    }
                    , 'render': {
                        fn: function (cmp) {
                            new Ext.KeyMap(cmp.getEl(), {
                                key: Ext.EventObject.ENTER
                                , fn: this.blur
                                , scope: cmp
                            });
                        }
                        , scope: this
                    }
                }
            }, {
                xtype: 'button'
                , id: 'modx-filter-clear'
                , text: _('filter_clear')
                , listeners: {
                    'click': {
                        fn: this.clearFilter
                        , scope: this
                    }
                }
            }
        ]
    });
    CrossContextsSettings.grid.Settings.superclass.constructor.call(this, config);
};
Ext.extend(CrossContextsSettings.grid.Settings, MODx.grid.Grid, {
    clearFilter: function () {
        var ns = MODx.request['namespace'] ? MODx.request['namespace'] : 'core';
        var store = this.getStore();
        store.baseParams.namespace = ns;
        store.baseParams.area = '';
        Ext.getCmp('modx-filter-namespace').reset();
        var acb = Ext.getCmp('modx-filter-area');
        if (acb) {
            acb.store.baseParams.namespace = ns;
            acb.store.load();
            acb.reset();
        }
        Ext.getCmp('modx-filter-key').reset();
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
    , filterByKey: function (tf, newValue, oldValue) {
        this.getStore().baseParams.key = newValue;
        this.getStore().baseParams.namespace = '';
        this.getBottomToolbar().changePage(1);
        this.refresh();
        return true;
    }
    , filterByNamespace: function (cb, rec, ri) {
        this.getStore().baseParams.namespace = rec.data['name'];
        this.getStore().baseParams.area = '';
        this.getBottomToolbar().changePage(1);
        this.refresh();

        var acb = Ext.getCmp('modx-filter-area');
        if (acb) {
            var s = acb.store;
            s.baseParams.namespace = rec.data.name;
            s.removeAll();
            s.load();
            acb.setValue('');
        }
    }
    , filterByArea: function (cb, rec, ri) {
        this.getStore().baseParams.area = rec.data['v'];
        this.getBottomToolbar().changePage(1);
        this.refresh();
    }
});
Ext.reg('crosscontextssettings-grid-settings', CrossContextsSettings.grid.Settings);