function onMenuCreated() {
    console.log("onMenuCreated")
    console.log(arguments)
}

function saveAndClose(tabList) {
    //发送标签页到服务器并关闭标签页
    console.log(`saveAndClose tabList.length=${tabList.length}`)
    console.log(tabList);
    axios.post(getUrl(), {type: "laterSee", tabList})
        .then((resp) => {
            if (resp.data.msg !== "ok") {
                throw new Error("发送数据错误");
            }
            console.log(`removing ${JSON.stringify(tabList.map((tab) => tab.id))}`)
            browser.tabs.remove(tabList.map((tab) => tab.id)).then(() => {
                console.log("removed")
            }, e => {
                console.error("remove failed")
            })
        })
        .catch(onError);
}

let lastOpenErrorTime = 0;

function onError(err) {
    setError(err);
    const now = new Date().getTime();
    if (lastOpenErrorTime - now > 1000 * 30) {
        lastOpenErrorTime = now;
        window.open("error.html");
    }
    console.error(err);
}

function emitEvent(event) {
    if (!getSendTabEvent()) {
        //如果拒绝发送，则直接返回
        return;
    }

    function go() {
        console.log(event);
        axios.post(getUrl(), event)
            .then((resp) => {
                if (resp.data.msg !== "ok") {
                    throw new Error("发送数据错误");
                }
                console.log("ok");
            })
            .catch(onError);
    }

    if (event.tab || event.type === "remove") {
        //如果有tab信息，直接提交，否则过一会儿再提交
        go();
    } else {
        setTimeout(() => {
            browser.tabs.get(event.tabId, (tab) => {
                event.tab = tab;
                go();
            });
        }, 150);
    }
}

function handleTabs(tabsHandler) {
    browser.tabs.query({}).then(tabsHandler);
}


const cmdList = [
    {
        name: "保存全部标签页",
        noParent: true,
        handle() {
            handleTabs((tabs) => {
                saveAndClose(tabs);
            });
        },
    },
    {
        name: "保存右侧标签页",
        handle() {
            handleTabs((tabs) => {
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
            });
        },
    },
    {
        name: "保存左侧标签页",
        handle() {
            handleTabs((tabs) => {
                let goodTabs = [];
                for (let tab of tabs) {
                    if (tab.active) {
                        break;
                    }
                    goodTabs.push(tab);
                }
                saveAndClose(goodTabs);
            });
        },
    },
    {
        name: "保存此标签页",
        noParent: true,
        handle() {
            console.log("handling");
            handleTabs((tabs) => {
                browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
                    saveAndClose(tabs)
                })
            });
        },
    },
];

function main() {
    //设置上下文菜单
    browser.contextMenus.removeAll(function () {
        const handlerMap = {};
        for (let cmd of cmdList) {
            handlerMap[cmd.name] = cmd;
        }

        for (const cmd of cmdList) {
            const info = {
                id: cmd.name,
                title: cmd.name,
                contexts: ["all"],
            };
            browser.contextMenus.create(info, onMenuCreated);
        }

        browser.contextMenus.onClicked.addListener(function (info, tab) {
            console.log(`info=${info.menuItemId} tab=${tab}`);
            console.log(handlerMap);
            handlerMap[info.menuItemId].handle();
        });
    });
    if (getSendTabEvent()) {
        //如果应该发送标签页变化事件
        browser.tabs.onCreated.addListener((tab) => {
            emitEvent({type: "create", tab});
        });
        browser.tabs.onUpdated.addListener((tabId, info, tab) => {
            emitEvent({type: "update", tabId, info, tab});
        });
        browser.tabs.onRemoved.addListener((tabId, info) => {
            emitEvent({type: "remove", tabId, info});
        });
        browser.tabs.onAttached.addListener(function (tabId, info) {
            browser.tabs.get(tabId, (tab) => {
                emitEvent({type: "attach", tabId, info});
            });
        });
        browser.tabs.onDetached.addListener((tabId, info) => {
            browser.tabs.get(tabId, (tab) => {
                emitEvent({type: "detach", tabId, info});
            });
        });
        browser.tabs.onMoved.addListener((tabId, info) => {
            emitEvent({type: "move", tabId, info});
        });
    }
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        main();
    }
};
