// ==UserScript==
// @name         Block Xiaohongshu Homepage
// @name:zh-CN   禁止访问小红书首页
// @version      0.1
// @match        https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @description  Redirects to search page when visiting Xiaohongshu homepage to prevent addiction to fragmented information
// @description:zh-CN  当访问小红书首页时自动跳转到搜索页，防止沉迷碎片信息
// @downloadURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/xiaohongshu/homepage_prohibited.js
// @updateURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/xiaohongshu/homepage_prohibited.js
// ==/UserScript==

(function() {
    //测试测试 测试 对的
    'use strict'; //启用严格模式，提高代码规范性。禁止某些语法（如隐式全局变量），有助于避免潜在的错误。
    const redirectTarget = 'https://www.xiaohongshu.com/search_result?type=51';

    // 检查当前页面是否为小红书首页 对的
    function isExploreUrl(url) {
        if (!url) return false;//如果url为空，直接返回false

        //无查询参数的首页URL
        if (url === 'https://www.xiaohongshu.com/explore' || url === 'https://www.xiaohongshu.com/explore/') {
            return true;
        }
        //有查询参数的首页URL
        if (url.match(/^https:\/\/www\.xiaohongshu\.com\/explore\?.*/)) {
            return true;
        }
        return false;
    }

    //延迟重定向函数
    function delayedRedirect() {
        setTimeout(function() {
            console.log('Redirecting to search page...');
            window.location.href = redirectTarget;
        }, 70);
    }

    //立即检查当前URL
    if (isExploreUrl(window.location.href)) {
        console.log('Xiaohongshu homepage detected, redirecting to search page...');
        delayedRedirect();
        return;
    }

    //每0.5检查一次当前URL
    setInterval(function() {
        if (isExploreUrl(window.location.href)) {
            console.log('Xiaohongshu homepage detected, redirecting to search page...');
            delayedRedirect();
        }
    }, 500);
    //非常好

})();
