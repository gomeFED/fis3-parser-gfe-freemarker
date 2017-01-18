var Freemarker = require('freemarker.js');
var projectPath = fis.project.getProjectPath();
var cachePath = fis.project.getCachePath();
var fm = new Freemarker({
    viewRoot: cachePath
});

/**
 * 获取mock数据
 * @param  {Object} file fis 的 File 对象
 * @return {Object}      mockData
 */
function mockData(file) {
    var data = {},
        mockFilePath = file.subpathNoExt.replace('/html/', '/data/') + '.json',
        mockFile = fis.file(projectPath, mockFilePath);

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
        //将内容写到缓存文件的目录：防止此插件前面还有其他对内容处理的插件
        fis.util.write(cachePath + '/freemarker.tmp', content, 'utf-8');
        content = fm.renderSync('/freemarker.tmp', mockData(file));
    } catch (e) {
        fis.log.warn('Got error: %s while parsing `%s`.%s', e.message.red, file.subpath, e.detail || '');
        fis.log.debug(e.stack);
    }
    console.log(content);
    return content;

};
