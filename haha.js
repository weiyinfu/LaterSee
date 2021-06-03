function onMenuCreated() {
    console.log(arguments)
}

function saveAndClose(tabList) {
    //发送标签页到服务器并关闭标签页
    console.log(tabList)
    axios.post(getUrl(), {type: "laterSee", tabList}).then(resp => {
        if (resp.data !== "ok" && resp !== "ok") {
            throw new Error("发送数据错误");
        }
        chrome.tabs.remove(tabList.map(tab => tab.id))
    }).catch(onError)
}

function onError(err) {
    setError(err)
    window.open("error.html")
    console.log(err)
}

function emitEvent(kwargs) {
    console.log(kwargs)
    axios.post(getUrl(), kwargs).then(resp => {
        if (resp.data !== "ok" && resp !== "ok") {
            throw new Error("发送数据错误");
        }
        console.log("ok")
    }).catch(onError)
}

const cmdList = [
    {
        name: "保存全部标签页",
        noParent: true,
        handle() {
            chrome.tabs.getAllInWindow(tabs => {
                saveAndClose(tabs);
            })
        }
    }, {
        name: "保存右侧标签页",
        handle() {
            chrome.tabs.getAllInWindow(tabs => {
                let start = false;
                let goodTabs = [];
                for (let tab of tabs) {
                    if (tab.active) {
                        start = true;
                        continue;
                    }
                    if (start) {
                        goodTabs.push(tab);
                    }
                }
                saveAndClose(goodTabs);
            })
        }
    }, {
        name: "保存左侧标签页",
        handle() {
            chrome.tabs.getAllInWindow(tabs => {
                let goodTabs = []
                for (let tab of tabs) {
                    if (tab.active) {
                        break
                    }
                    goodTabs.push(tab)
                }
                saveAndClose(goodTabs)
            })
        }
    }, {
        name: "保存此标签页",
        noParent: true,
        handle() {
            chrome.tabs.getAllInWindow(tabs => {
                for (let tab of tabs) {
                    if (tab.active) {
                        saveAndClose([tab]);
                        break;
                    }
                }
            })
        }
    }
]

function main() {
    //设置上下文菜单
    chrome.contextMenus.removeAll(function () {
        const handlerMap = {}
        for (let cmd of cmdList) {
            handlerMap[cmd.name] = cmd;
        }

        for (const cmd of cmdList) {
            const info = {
                id: cmd.name,
                title: cmd.name,
                contexts: ["all"],
            }
            chrome.contextMenus.create(info, onMenuCreated);
        }

        chrome.contextMenus.onClicked.addListener(function (info, tab) {
            handlerMap [info.menuItemId].handle();
        });
    })
    chrome.tabs.onCreated.addListener(tab => {
        emitEvent({type: "create", tab})
    })
    chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
        emitEvent({type: "update", tabId, info, tab})
    })
    chrome.tabs.onRemoved.addListener((tabId, info) => {
        emitEvent({type: "remove", tabId, info})
    })
    chrome.tabs.onAttached.addListener(function (tabId, info) {
        emitEvent({type: "attach", tabId, info})
    });
    chrome.tabs.onDetached.addListener((tabId, info) => {
        emitEvent({type: "detach", tabId, info})
    })
    chrome.tabs.onMoved.addListener((tabId, info) => {
        emitEvent({type: "move", tabId, info})
    })
    chrome.tabs.onSelectionChanged.addListener((tabId, info) => {
        emitEvent({type: "select", tabId, info})
    })
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        main()
    }
}