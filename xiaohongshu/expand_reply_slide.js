// ==UserScript==
// @name        小红书自动展开回复+页面滑动
// @namespace   https://xhsqun.com
// @version     0.20250502221544
// @description 自动展开回复和下滑页面，包含暂停/继续/停止功能，优化性能和代码逻辑。
// @author      xhsqun.com
// @match       https://www.xiaohongshu.com/*
// @icon         https://www.xiaohongshu.com/favicon.ico
// @grant       none
// @downloadURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/main/xiaohongshu/expand_reply_slide.js
// @updateURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/main/xiaohongshu/expand_reply_slide.js
// ==/UserScript==
(function () {
    // 验证  验证
    // 添加按钮样式
    // 修改验证  测试 测试 对的 测试 测试 ceshi  继续测试
    const createButton = (text, color, bottom) => { //定义函数
        const button = document.createElement('div'); //创建一个新的 <div> 元素。
        button.style = `
            font-size:12px;cursor:pointer;width: 60px;height: 60px;
            background: ${color};
            border: 1px solid rgba(255,255,255,0.5);
            position: fixed;right: 20px;bottom: ${bottom}px;z-index: 999;
            display: flex;border-radius: 30px;align-items: center;justify-content: center;
        `;
        button.innerText = text;
        return button;
    };

    const btnExpand_slow = createButton('展开回复_slow', 'linear-gradient(135deg, #FF512F, #DD2476)', 210);
    const btnExpand = createButton('展开回复', 'linear-gradient(135deg, #FF512F, #DD2476)', 150);
    const btnScroll = createButton('页面下滑', 'linear-gradient(135deg, #3498DB, #2980B9)', 90);

    let isExpanding = false;
    let isScrolling = false;
    let isExpanding_slow = false;

    let expandPaused = false;
    let scrollInterval = null;
    let expand_slow_Paused = false; 

    // 辅助函数：延迟
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // 异步编程

    // 辅助函数：等待元素加载
    const waitForElement = async (selector, timeout = 10000) => {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await sleep(100);
        }
        throw new Error(`元素 ${selector} 加载超时`);
    };

    // 自动展开回复功能
    const toggleExpandReplies = async () => {
        if (!isExpanding) {
            isExpanding = true;
            expandPaused = false;
            btnExpand.innerText = '运行中';
            try {
                while (isExpanding) {
                    if (expandPaused) {
                        btnExpand.innerText = '已暂停';
                        await sleep(200);
                        continue;
                    }
                    const buttons = document.querySelectorAll('.show-more');
                    for (const button of buttons) {
                        button.click();
                        await sleep(400);
                        if (!isExpanding) break;
                    }
                    await sleep(500); // 等待更多内容加载
                }
            } finally {
                btnExpand.innerText = '展开回复';
                isExpanding = false;
            }
        } else {
            expandPaused = !expandPaused;
            btnExpand.innerText = expandPaused ? '已暂停' : '运行中';
        }
    };

    // slow_自动展开回复功能
    const toggleExpandReplies_slow = async () => {
        if (!isExpanding_slow) { // 点击时，如果没有在运行
            isExpanding_slow = true; // 设置为运行中
            expand_slow_Paused = false;
            btnExpand_slow.innerText = 'slow_运行中';
            try { // 尝试执行以下代码
                while (isExpanding_slow) {
                    if (expand_slow_Paused) { // 如果处于暂停状态
                        btnExpand_slow.innerText = 'slow_已暂停';
                        await sleep(200);
                        continue;
                    }
                    const buttons = document.querySelectorAll('.show-more'); // 获取所有展开按钮
                    for (const button of buttons) {
                        button.click();
                        await sleep(1000);
                        if (!isExpanding) break;
                    }
                    await sleep(1000); // 等待更多内容加载
                }
            } finally { // 最终执行的代码，无论是否发生错误
                btnExpand_slow.innerText = '展开回复_slow';
                isExpanding_slow = false;
            }
        } else {// 点击时，如果已经在运行
            expand_slow_Paused = !expand_slow_Paused; // 切换暂停状态
            btnExpand_slow.innerText = expand_slow_Paused ? 'slow_已暂停' : 'slow_运行中'; // 更新按钮文本
        }
    };

    // 自动下滑功能 测试
    const toggleScrollPage = async () => {
        if (!isScrolling) {
            isScrolling = true;
            btnScroll.innerText = '运行中';
            scrollInterval = setInterval(() => {
                const scroller = document.querySelector('.note-scroller');
                if (scroller) {
                    scroller.scrollTop += 400;
                }
            }, 100);
        } else {
            clearInterval(scrollInterval);
            isScrolling = false;
            btnScroll.innerText = '页面下滑';
        }
    };

    // 按钮绑定事件 测试 测试
    btnExpand.onclick = toggleExpandReplies;
    btnScroll.onclick = toggleScrollPage;
    btnExpand_slow.onclick = toggleExpandReplies_slow

    // 添加按钮到页面
    document.body.appendChild(btnExpand);
    document.body.appendChild(btnScroll);
    document.body.appendChild(btnExpand_slow)
})();