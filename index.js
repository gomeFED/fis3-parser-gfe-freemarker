var Freemarker = require('freemarker.js');
var root = fis.project.getProjectPath();

var fm = new Freemarker({
    viewRoot: root
});

/**
 * 获取mock数据
 * @param  {Object} file fis 的 File 对象
 * @return {Object}      mockData
 */
function mockData(file) {
    var data = {},
        mockFilePath = file.subpathNoExt.replace('/html/', '/data/') + '.json',
        mockFile = fis.file(root, mockFilePath);

    if (mockFile.exists()) {
        try {
            data = JSON.parse(mockFile.getContent());
        } catch (e) {
            fis.log.warn('mock data parse error:' + mockFilePath);
        }
    } else {
        // fis.log.warn('not found mock data file:' + mockFilePath);
    }
    return data;
}


/**
 * 解析freemarker模板
 * @param  {string} content     文件内容
 * @param  {File}   file        fis 的 File 对象 [fis3/lib/file.js]
 * @param  {object} settings    插件配置属性
 * @return {string}             处理后的文件内容
 */
module.exports = function(content, file, settings) {
    try {
        content = fm.renderSync(file.subpath, mockData(file));
    } catch (e) {
        fis.log.warn('Got error: %s while parsing `%s`.%s', e.message.red, file.subpath, e.detail || '');
        fis.log.debug(e.stack);
    }
    return content;

};
