import {cookieBanner} from "./cookie.js";
import {changelog} from "./changelog.js";
import {carousel} from "./carousel.js";
import {search} from "./search.js";

document.addEventListener('DOMContentLoaded', function () {
    cookieBanner();
    changelog();
    carousel();
    search();
});
