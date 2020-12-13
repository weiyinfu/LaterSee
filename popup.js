function main() {
    const ele = document.querySelector("#url");


    function handleChange() {
        console.log("saving change" + ele.value);
        saveUrl(ele.value);
    }

    ele.addEventListener("change", handleChange);
    try {
        ele.value = getUrl() || ""
    } catch (e) {
        console.error(e);
    }
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        main()
    }
}