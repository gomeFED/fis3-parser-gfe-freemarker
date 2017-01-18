var Freemarker = require('freemarker.js');
var projectPath = fis.project.getProjectPath();
var cachePath = fis.project.getCachePath();
var fm = new Freemarker({
    viewRoot: cachePath
});

/**
 * ��ȡmock����
 * @param  {Object} file fis �� File ����
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
 * ����freemarkerģ��
 * @param  {string} content     �ļ�����
 * @param  {File}   file        fis �� File ���� [fis3/lib/file.js]
 * @param  {object} settings    �����������
 * @return {string}             �������ļ�����
 */
module.exports = function(content, file, settings) {
    try {
        //������д�������ļ���Ŀ¼����ֹ�˲��ǰ�滹�����������ݴ���Ĳ��
        fis.util.write(cachePath + '/freemarker.tmp', content, 'utf-8');
        content = fm.renderSync('/freemarker.tmp', mockData(file));
    } catch (e) {
        fis.log.warn('Got error: %s while parsing `%s`.%s', e.message.red, file.subpath, e.detail || '');
        fis.log.debug(e.stack);
    }
    return content;

};
