# LaterSee是什么？
LaterSee是一个Chrome标签页管理工具，功能类似OneTab。和OneTab的不同之处在于，Onetab把标签信息保存在了本地LocalStorage里面，LaterSee把标签页信息以Ajax请求的方式发送到用户指定的一个post接口上。  
为啥不用现成的OneTab？Onetab在标签页比较少的时候有用，但是标签页一旦多了就需要以树形结构看标签。  
标签页的本质是一个todo项，为了将标签页跟todo管理工具整合起来，就需要LaterSee。  
LaterSee含义是"一会儿再看"，先把标签页保存起来吧。

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