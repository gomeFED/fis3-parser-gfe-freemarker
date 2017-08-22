var Freemarker = require('freemarker.js');
var fs = require('fs');
var projectPath = fis.project.getProjectPath();
var cachePath = fis.project.getCachePath();
var fm = new Freemarker({
    viewRoot: projectPath
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
    var isEntryFile = (~content.indexOf('/html') || ~content.indexOf('/HTML')) && (~content.indexOf('/head') || ~content.indexOf('/HEAD')) && (~content.indexOf('/body') || ~content.indexOf('/BODY'));
    var tmpFile = file.realpathNoExt+'.tmp';
    if(isEntryFile){
        try {
            //将内容写到缓存文件的目的：防止此插件前面其它插件对内容的处理
            fis.util.write(tmpFile, content, 'utf-8');
            content = fm.renderSync(file.subpathNoExt + '.tmp', mockData(file));
            if(fis.util.isFile(tmpFile)){
                fis.util.del(tmpFile);    
            }
        } catch (e) {
            fis.log.warn('Got error: %s while parsing `%s`.%s', e.message.red, file.subpath, e.detail || '');
            fis.log.debug(e.stack);
        }
    }
    return content;
};
