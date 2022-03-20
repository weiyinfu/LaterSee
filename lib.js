function storageSet(k, v) {
    //保存数据
    localStorage[k] = v
}

function storageGet(k) {
    return localStorage[k]
}

const urlKey = "url";
const errorKey = "error";
const shouldSendTabEventKey = "tabEvent";

function setError(err) {
    storageSet(errorKey, err);
}

function getError() {
    return storageGet(errorKey);
}

function getUrl() {
    return storageGet(urlKey)
}

function getSendTabEvent() {
    const ans = storageGet(shouldSendTabEventKey)
    if (ans === "true" || ans === "undefined" || ans === undefined) {
        return true;
    }
    return false;
}
