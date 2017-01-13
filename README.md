# fis3-parser-gfe-freemarker
fis3-parser-gfe-freemarker


## INSTALL

```bash
npm install [-g] fis3-parser-gfe-freemarker
```

## USE

```js
fis.match('/html/**.{html,ftl}', {
    parser: fis.plugin('gfe-freemarker', {
        ssiDomain: 'http://www.gome.com.cn'//需要拉取ssi内容的指定域名
    })
});
```