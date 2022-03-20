function main() {
    const formMap = {
        "url": urlKey,
        "sendTabEvent": shouldSendTabEventKey,
    }

    function handleMainUrlChange(storageKey, e) {
        const ele = e.target;
        let value = ele.value;
        if (ele.type === "checkbox") {
            value = ele.checked;
        }
        console.log(`${storageKey}=${value}`);
        storageSet(storageKey, value)
    }

    for (let [elementId, storageKey] of Object.entries(formMap)) {
        const ele = document.querySelector(`#${elementId}`)
        if (ele.tagName.toLowerCase() !== "input") {
            throw new Error("can only handle input")
        }
        ele.addEventListener("change", evt => handleMainUrlChange(storageKey, evt))
        try {
            if (ele.type === "checkbox") {
                let value = storageGet(storageKey)
                ele.checked = false;
                if (value === undefined || value === "undefined" || value === "true") {
                    ele.checked = true;
                }
            } else {
                ele.value = storageGet(storageKey) || ""
            }
        } catch (e) {
            console.error(e);
        }
    }
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        main()
    }
}