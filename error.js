function main() {
    const errorDiv = document.querySelector("#errorInfo");
    errorDiv.innerHTML = getError();
}

document.onreadystatechange = function () {
    if (document.readyState === "complete") {
        main()
    }
}