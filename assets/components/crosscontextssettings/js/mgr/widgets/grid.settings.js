CrossContextsSettings.grid.Settings = function (config) {
    config = config || {};

    var columns = [];
    var fields = [];
    var contexts = [];
    var _this = this;

    if (config.record) {
        columns.push({
            header: _('key')
            , width: 300
            , sortable: true
            , dataIndex: 'key'
            , locked: true
            , id: 'key'
        });
        fields.push('key');
        fields.push('xtype');
        Ext.each(config.record, function (item, index) {
            columns.push({
                header: item.key
                , width: 200
                , sortable: false
                , dataIndex: item.key
                , id: item.key
                , editable: true
                , renderer: _this.renderDynField.createDelegate(_this, [_this], true)
            });
            fields.push(item.key);
            contexts.push(item.key);
        });
    }
    var cm = new Ext.ux.grid.LockingColumnModel({
        columns: columns
        , getCellEditor: function (colIndex, rowIndex) {
            var rec = config.store.getAt(rowIndex);
            var xt = {xtype: 'textfield'};
            if (typeof(rec) === 'object') {
                xt.xtype = rec.get('xtype');
                if (xt === 'text-password') {
                    xt.xtype = 'textfield';
                    xt.inputType = 'password';
                }
            }
            var o = MODx.load(xt);
            return new Ext.grid.GridEditor(o);
        }
    });

    Ext.applyIf(config, {
        id: 'crosscontextssettings-grid-settings'
        , url: CrossContextsSettings.config.connectorUrl
        , baseParams: {
            action: 'mgr/settings/getvaluelist'
            , columns: fields.toString()
            , 'namespace': MODx.request['namespace'] ? MODx.request['namespace'] : 'core'
        }
        , colModel: cm
        , fields: fields
        , paging: true
        , pageSize: 10
        , remoteSort: true
        , anchor: '97%'
        , view: new Ext.ux.grid.LockingGridView()
        , height: 595
        , autoHeight: false
        , save_action: 'mgr/settings/updatefromgrid'
        , autosave: true
        , tbar: [
            {
                text: _('setting_create')
                , scope: this
                , cls: 'primary-button'
                , handler: {
                    xtype: 'crosscontextssettings-window-setting-create'
                    , blankValues: true
                    , contexts: contexts
                }
            }, '->', {
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
                , baseParams: {
                    action: (MODx.version_is22 === 1 ? 'getAreas' : 'system/settings/getAreas')
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
    getMenu: function () {
        return [{
                text: _('remove')
                , handler: this.removeSetting
            }];
    }
    , removeSetting: function (btn, e) {
        MODx.msg.confirm({
            title: _('remove'),
            text: _('setting_remove_confirm'),
            url: CrossContextsSettings.config.connectorUrl,
            params: {
                action: 'mgr/settings/remove',
                key: this.menu.record.key
            },
            listeners: {
                'success': {
                    fn: this.refresh,
                    scope: this
                }
            }
        });
    }
    , clearFilter: function () {
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
    , renderDynField: function (v, md, rec, ri, ci, s, g) {
        var r = s.getAt(ri).data;
        v = Ext.util.Format.htmlEncode(v);
        var f;
        if (r.xtype == 'combo-boolean' || r.xtype == 'modx-combo-boolean') {
            f = MODx.grid.Grid.prototype.rendYesNo;
            return f(v, md, rec, ri, ci, s, g);
        } else if (r.xtype === 'datefield') {
            f = Ext.util.Format.dateRenderer(MODx.config.manager_date_format);
            return f(v, md, rec, ri, ci, s, g);
        } else if (r.xtype === 'text-password' || r.xtype == 'modx-text-password') {
            f = MODx.grid.Grid.prototype.rendPassword;
            return f(v, md, rec, ri, ci, s, g);
        } else if (r.xtype.substr(0, 5) == 'combo' || r.xtype.substr(0, 10) == 'modx-combo') {
            var cm = g.getColumnModel();
            var ed = cm.getCellEditor(ci, ri);
            if (!ed) {
                var o = Ext.ComponentMgr.create({xtype: r.xtype || 'textfield'});
                ed = new Ext.grid.GridEditor(o);
                cm.setEditor(ci, ed);
            }
            if (ed.store && !ed.store.isLoaded && ed.config.mode != 'local') {
                ed.store.load();
                ed.store.isLoaded = true;
            }
            f = Ext.util.Format.comboRenderer(ed.field, v);
            return f(v, md, rec, ri, ci, s, g);
        }
        return v;
    }

});
Ext.reg('crosscontextssettings-grid-settings', CrossContextsSettings.grid.Settings);