function onMenuCreated() {
  console.log(arguments);
}

function saveAndClose(tabList) {
  //发送标签页到服务器并关闭标签页
  console.log(tabList);
  axios
    .post(getUrl(), { type: "laterSee", tabList })
    .then((resp) => {
      console.log(resp);
      if (resp.data.msg !== "ok") {
        throw new Error("发送数据错误");
      }
      Tabs().remove(tabList.map((tab) => tab.id));
    })
    .catch(onError);
}

let lastOpenErrorTime = 0;
const isChrome = myBrowser() === "Chrome";

function onError(err) {
  setError(err);
  const now = new Date().getTime();
  if (lastOpenErrorTime - now > 1000 * 30) {
    lastOpenErrorTime = now;
    window.open("error.html");
  }
  console.error(err);
}
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
function emitEvent(event) {
  if (!getSendTabEvent()) {
    //如果拒绝发送，则直接返回
    return;
  }

  function go() {
    console.log(event);
    axios
      .post(getUrl(), event)
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
      Tabs().get(event.tabId, (tab) => {
        event.tab = tab;
        go();
      });
    }, 150);
  }
}
function handleTabs(tabsHandler) {
  if (isChrome) {
    Tabs().getAllInWindow(tabsHandler);
    return;
  }
  browser.tabs.query({}).then(tabsHandler);
}
function Tabs() {
  if (isChrome) {
    return chrome.tabs;
  } else {
    return browser.tabs;
  }
}
function ContextMenus() {
  if (isChrome) {
    return chrome.contextMenus;
  }
  return browser.contextMenus;
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
      let pro = null;

      handleTabs((tabs) => {
        for (let tab of tabs) {
          if (tab.active) {
            saveAndClose([tab]);
            break;
          }
        }
      });
    },
  },
];

function main() {
  //设置上下文菜单
  ContextMenus().removeAll(function () {
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
      ContextMenus().create(info, onMenuCreated);
    }

    ContextMenus().onClicked.addListener(function (info, tab) {
      console.log(`info=${info.menuItemId} tab=${tab}`);
      console.log(handlerMap);
      handlerMap[info.menuItemId].handle();
    });
  });
  if (getSendTabEvent()) {
    //如果应该发送标签页变化事件
    Tabs().onCreated.addListener((tab) => {
      emitEvent({ type: "create", tab });
    });
    Tabs().onUpdated.addListener((tabId, info, tab) => {
      emitEvent({ type: "update", tabId, info, tab });
    });
    Tabs().onRemoved.addListener((tabId, info) => {
      emitEvent({ type: "remove", tabId, info });
    });
    Tabs().onAttached.addListener(function (tabId, info) {
      Tabs().get(tabId, (tab) => {
        emitEvent({ type: "attach", tabId, info });
      });
    });
    Tabs().onDetached.addListener((tabId, info) => {
      Tabs().get(tabId, (tab) => {
        emitEvent({ type: "detach", tabId, info });
      });
    });
    Tabs().onMoved.addListener((tabId, info) => {
      emitEvent({ type: "move", tabId, info });
    });
    if (isChrome) {
      Tabs().onSelectionChanged.addListener((tabId, info) => {
        emitEvent({ type: "select", tabId, info });
      });
    }
  }
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    main();
  }
};
