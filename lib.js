function storageSet(k, v) {
    //保存数据
    localStorage[k] = v
}

function storageGet(k) {
    return localStorage[k]
}

const urlKey = "url";
const errorKey = "error";

function getUrl() {
    return storageGet(urlKey);
}

function saveUrl(value) {
    storageSet(urlKey, value);
}

function setError(err) {
    storageSet(errorKey, err);
}

function getError() {
    return storageGet(errorKey);
}