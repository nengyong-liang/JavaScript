// ==UserScript==
// @name         Block Xiaohongshu Homepage
// @name:zh-CN   禁止访问小红书首页
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @description  Redirects to search page when visiting Xiaohongshu homepage to prevent addiction to fragmented information
// @description:zh-CN  当访问小红书首页时自动跳转到搜索页，防止沉迷碎片信息
// @downloadURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/xiaohongshu/homepage_prohibited.js
// @updateURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/xiaohongshu/homepage_prohibited.js
// ==/UserScript==

(function() {
    'use strict';

    const redirectTarget = 'https://www.xiaohongshu.com/search_result?type=51';

    // Check if the current URL is Xiaohongshu homepage
    function isExploreUrl(url) {
        if (!url) return false;

        // Exact match for https://www.xiaohongshu.com/explore
        if (url === 'https://www.xiaohongshu.com/explore' || url === 'https://www.xiaohongshu.com/explore/') {
            return true;
        }

        // Match explore page with query parameters
        if (url.match(/^https:\/\/www\.xiaohongshu\.com\/explore\?.*/)) {
            return true;
        }

        return false;
    }

    // Delayed redirect to search page
    function delayedRedirect() {
        setTimeout(function() {
            console.log('Redirecting to search page...');
            window.location.href = redirectTarget;
        }, 500);
    }

    // If current page is homepage, call redirect function
    if (isExploreUrl(window.location.href)) {
        console.log('Xiaohongshu homepage detected, redirecting to search page...');
        delayedRedirect();
        return;
    }

    // Periodically check current URL
    setInterval(function() {
        if (isExploreUrl(window.location.href)) {
            console.log('Xiaohongshu homepage detected, redirecting to search page...');
            delayedRedirect();
        }
    }, 1000);

})();
