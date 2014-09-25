var CrossContextsSettings = function (config) {
    config = config || {};
    CrossContextsSettings.superclass.constructor.call(this, config);
};
Ext.extend(CrossContextsSettings, Ext.Component, {
    page: {}, window: {}, grid: {}, tree: {}, panel: {}, combo: {}, config: {}
});
Ext.reg('crosscontextssettings', CrossContextsSettings);
CrossContextsSettings = new CrossContextsSettings();