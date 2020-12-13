
# 文件说明
* error.html和error.js：错误提示
* lib.js：公共库
* popup.html和popup.js:弹出页面
* haha.js：background后台页面
* server.py：一个后台demo

# 发送至onetab的方式
* 发送全部标签页至Onetab
* 发送除当前页外至onetab
* 发送当前页至onetab
* 发送右侧至标签页
* 发送左侧至标签页发送全部至标签页
* 仅发送当前页至Onetab


# 创建级联菜单
通过指定id和parentId来确定父级菜单。  
```js
chrome.contextMenus.create({
    id: "OneTab",
    type: "normal",
    title: "OneTab",
});
chrome.contextMenus.create({
    id: "SendAllTabsToOneTab",
    type: "normal",
    title: "发送全部标签页至OneTab",
    parentId: "OneTab"
}, onMenuCreated);
```

# tab标签页的信息
其中比较有用的字段包括：
* active
* id
* title
* url
* 
```plain
const tab={
    active: false
    audible: false
    autoDiscardable: true
    discarded: false
    favIconUrl: "http://open.chrome.360.cn/favicon.ico"
    height: 821
    highlighted: false
    id: 1999
    incognito: false
    index: 1
    mutedInfo: {muted: false}
    pinned: false
    selected: false
    status: "complete"
    title: "标签--扩展开发文档"
    url: "http://open.chrome.360.cn/extension_dev/tabs.html"
    width: 1440
    windowId: 2065
}
```