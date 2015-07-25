CrossContextsSettings.window.CreateSetting = function (config) {
    config = config || {};
    var valueTextareas = [];
    Ext.each(config.contexts, function (item, index) {
        valueTextareas.push({
            xtype: 'textarea'
            , fieldLabel: _('value') + ' (' + item + ')'
            , name: 'value['+item+']'
            , anchor: '100%'
        });
    });
    Ext.applyIf(config, {
        title: _('setting_create')
        , width: 600
        , url: CrossContextsSettings.config.connectorUrl
        , baseParams: {
            action: 'mgr/settings/create'
            , contexts: Ext.util.JSON.encode(config.contexts)
        }
        , fields: [
            {
                layout: 'column'
                , border: false
                , defaults: {
                    layout: 'form'
                    , labelAlign: 'top'
                    , anchor: '100%'
                    , border: false
                }
                , items: [
                    {
                        columnWidth: .5
                        , items: [
                            {
                                xtype: 'textfield'
                                , fieldLabel: _('key')
                                , name: 'key'
                                , id: 'modx-cs-key'
                                , maxLength: 100
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-key'
                                , html: _('key_desc')
                                , cls: 'desc-under'
                            }, {
                                xtype: 'textfield'
                                , fieldLabel: _('name')
                                , name: 'name'
                                , id: 'modx-cs-name'
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-name'
                                , html: _('name_desc')
                                , cls: 'desc-under'
                            }, {
                                xtype: 'textarea'
                                , fieldLabel: _('description')
                                , name: 'description'
                                , id: 'modx-cs-description'
                                , allowBlank: true
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-description'
                                , html: _('description_desc')
                                , cls: 'desc-under'
                            }
                        ]
                    }, {
                        columnWidth: .5
                        , items: [
                            {
                                xtype: 'modx-combo-xtype-spec'
                                , fieldLabel: _('xtype')
                                , description: MODx.expandHelp ? '' : _('xtype_desc')
                                , id: 'modx-cs-xtype'
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-xtype'
                                , html: _('xtype_desc')
                                , cls: 'desc-under'
                            }, {
                                xtype: 'modx-combo-namespace'
                                , fieldLabel: _('namespace')
                                , name: 'namespace'
                                , id: 'modx-cs-namespace'
                                , value: 'core'
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-namespace'
                                , html: _('namespace_desc')
                                , cls: 'desc-under'
                            }, {
                                xtype: 'textfield'
                                , fieldLabel: _('area_lexicon_string')
                                , description: _('area_lexicon_string_msg')
                                , name: 'area'
                                , id: 'modx-cs-area'
                                , anchor: '100%'
                            }, {
                                xtype: 'label'
                                , forId: 'modx-cs-area'
                                , html: _('area_lexicon_string_msg')
                                , cls: 'desc-under'
                            }
                        ]
                    }
                ]
            }, {
                xtype: 'fieldset'
                , items: valueTextareas
            }]
        , keys: []
    });
    CrossContextsSettings.window.CreateSetting.superclass.constructor.call(this, config);
    this.on('show', function () {
        this.reset();
        this.setValues({
            namespace: Ext.getCmp('modx-filter-namespace').value
            , area: Ext.getCmp('modx-filter-area').value
        });
    }, this);
};
Ext.extend(CrossContextsSettings.window.CreateSetting, MODx.Window);
Ext.reg('crosscontextssettings-window-setting-create', CrossContextsSettings.window.CreateSetting);