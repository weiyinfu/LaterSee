修复获取当前activetab的bug。
# 去掉chrome冗余代码
```js
function Tabs() {
    if (isChrome) {
        return chrome.tabs;
    } else {
        return browser.tabs;
    }
}
```

获取全部标签页，火狐本来也有getAllInWindows函数，但是已经废弃了，只剩下Chrome和Edge依旧支持。
```js
function handleTabs(tabsHandler) {
    if (isChrome) {
        Tabs().getAllInWindow(tabsHandler);
        return;
    }
    browser.tabs.query({}).then(tabsHandler);
}

```
```js

function ContextMenus() {
    if (isChrome) {
        return chrome.contextMenus;
    }
    return browser.contextMenus;
}
```

判断浏览器
```js
function myBrowser() {
    var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    var isOpera = userAgent.indexOf("Opera") > -1;
    if (isOpera) {
        //判断是否Opera浏览器
        return "Opera";
    }
    if (userAgent.indexOf("Firefox") > -1) {
        //判断是否Firefox浏览器
        return "FF";
    }
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    if (userAgent.indexOf("Safari") > -1) {
        //判断是否Safari浏览器
        return "Safari";
    }
    if (
        userAgent.indexOf("compatible") > -1 &&
        userAgent.indexOf("MSIE") > -1 &&
        !isOpera
    ) {
        //判断是否IE浏览器
        return "IE";
    }
}
```

```
        if (isChrome) {
            browser.tabs.onSelectionChanged.addEventListener((tabId, info) => {
                emitEvent({type: "select", tabId, info});
            });
        }
```