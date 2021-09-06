import {showCookieBanner} from "./cookie.js";
import analytics from "./analytics.js";
import leadfeeder from "./leadfeeder.js";

document.addEventListener('DOMContentLoaded', function () {
    showCookieBanner()
    analytics();
    leadfeeder();
});
