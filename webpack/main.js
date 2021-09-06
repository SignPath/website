import {showCookieBanner} from "./cookie.js";
import analytics from "./analytics.js";
import leadfeeder from "./leadfeeder.js";
import {setGoogleAdGroup} from "./adGroup";

document.addEventListener('DOMContentLoaded', function () {
    setGoogleAdGroup();
    showCookieBanner();
    analytics();
    leadfeeder();
});
