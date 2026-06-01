function normalizePath(path) {
    if (!path) {
        return "";
    }

    var cleanPath = path.split("?")[0].split("#")[0];
    if (cleanPath === "/") {
        return "/index.html";
    }

    return cleanPath;
}

document.addEventListener("DOMContentLoaded", function () {
    var container = document.getElementById("site-header");
    if (!container) {
        return;
    }

    fetch("/header.html")
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Failed to load header");
            }

            return response.text();
        })
        .then(function (html) {
            container.innerHTML = html;

            var cta = container.querySelector("#header-cta");
            if (cta) {
                var ctaText = container.dataset.ctaText;
                if (ctaText) {
                    cta.textContent = ctaText;
                }

                var ctaClass = container.dataset.ctaClass;
                if (ctaClass) {
                    cta.className = ctaClass;
                }

                var ctaId = container.dataset.ctaId;
                if (ctaId) {
                    cta.id = ctaId;
                }
            }

            var currentPath = normalizePath(window.location.pathname);
            var links = container.querySelectorAll("nav a");
            links.forEach(function (link) {
                var href = link.getAttribute("href") || "";
                if (href.indexOf("/") !== 0) {
                    return;
                }

                if (normalizePath(href) === currentPath) {
                    link.classList.add("ativa");
                }
            });
        })
        .catch(function () {
            return;
        });
});
