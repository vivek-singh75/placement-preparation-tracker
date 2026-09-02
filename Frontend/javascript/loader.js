async function loadLoader() {

    let path;

    if (window.location.pathname.includes("/html/")) {
        path = "../components/loader.html";
    } else {
        path = "./components/loader.html";
    }

    try {

        const response = await fetch(path);

        if (!response.ok) {
            throw new Error("Loader file not found");
        }

        const html = await response.text();

        document.body.insertAdjacentHTML("afterbegin", html);

        const loader = document.querySelector("#page-loader");

        // Apply saved theme
        if (localStorage.getItem("theme") === "dark") {
            loader.style.backgroundColor = "rgb(7, 23, 32)";

            const circle = loader.querySelector(".loader-circle");

            circle.style.borderColor = "#394b55";
            circle.style.borderTopColor = "#4dabf7";
        }

        // IMPORTANT: hide initial loader
        loader.classList.add("hide");

    } catch (error) {

        console.error("Loader Error:", error);

    }
}


// Show loader for login/API
async function showLoader() {

    let loader = document.querySelector("#page-loader");

    if (!loader) {
        await loadLoader();
        loader = document.querySelector("#page-loader");
    }

    loader.classList.remove("hide");
}


// Hide loader
function hideLoader() {

    const loader = document.querySelector("#page-loader");

    if (loader) {
        loader.classList.add("hide");
    }
}


// Load loader
loadLoader();


// Browser back/forward
window.addEventListener("pageshow", () => {
    hideLoader();
});