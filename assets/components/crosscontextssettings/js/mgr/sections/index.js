Ext.onReady(function () {
    MODx.load({xtype: 'crosscontextssettings-page-home'});
});

CrossContextsSettings.page.Home = function (config) {
    config = config || {};
    Ext.applyIf(config, {
        components: [{
                xtype: 'crosscontextssettings-panel-home'
                , renderTo: 'crosscontextssettings-panel-home-div'
            }]
    });
    CrossContextsSettings.page.Home.superclass.constructor.call(this, config);
};
Ext.extend(CrossContextsSettings.page.Home, MODx.Component);
Ext.reg('crosscontextssettings-page-home', CrossContextsSettings.page.Home);