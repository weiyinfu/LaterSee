function onMenuCreated() {
    console.log(arguments)
}

chrome.contextMenus.create({
    id: "OneTab",
    type: "normal",
    title: "OneTab",
});

function saveAndClose(tabList) {
    console.log(tabList)
    axios.post(getUrl(), {
        "tablist": tabList
    }).then(resp => {
        if (resp.data !== "ok" && resp !== "ok") {
            throw new Error("发送数据错误");
        }
        chrome.tabs.remove(tabList.map(tab => tab.id))
    }).catch(err => {
        setError(err)
        window.open("error.html")
        console.log(err)
    })
}

const cmdList = [
    {
        name: "发送全部标签页至OneTab",
        handle() {
            chrome.tabs.getAllInWindow(tabs => {
                saveAndClose(tabs);
            })
        }
    }, {
        name: "发送右侧标签页至onetab",
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
        name: "发送左侧标签页至Onetab",
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
        name: "仅发送此标签页至Onetab",
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
const handlerMap = {}
for (const cmd of cmdList) {
    chrome.contextMenus.create({
        id: cmd.name,
        title: cmd.name,
        parentId: "OneTab"
    }, onMenuCreated);
    handlerMap[cmd.name] = cmd;
}
chrome.contextMenus.onClicked.addListener(function (info, tab) {
    handlerMap [info.menuItemId].handle();
});
