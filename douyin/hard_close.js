// ==UserScript==
// @name        网页倒计时提醒并强制关闭
// @namespace   https://example.com
// @version     0.20250503174029
// @description 该脚本适用于抖音和B站，在页面上显示倒计时，倒计时结束时提醒用户学习并关闭页面。
// @author      YourName
// @match       https://www.douyin.com/*
// @icon        https://www.douyin.com/favicon.ico
// @grant       none
// @downloadURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/douyin/hard_close.js
// @updateURL https://raw.githubusercontent.com/nengyong-liang/JavaScript/refs/heads/main/douyin/hard_close.js
// ==/UserScript==

(function () {
    //match
    //https://www.bilibili.com/*
    //https://www.douyin.com/?recommend=1
    //https://www.douyin.com/*
    const TARGET_URLS = [
        'https://www.douyin.com/?recommend=1',
        'https://www.douyin.com/discover'
    ];

    const countdownBox = document.createElement('div');
    countdownBox.style = `
        position: fixed;
        top: 20px;
        left: 20px;
        width: 100px;
        height: 50px;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 16px;
        border-radius: 8px;
        z-index: 9999;
        cursor: move;
    `;
    document.body.appendChild(countdownBox);

    // 可拖动逻辑
    let isDragging = false;
    let offsetX, offsetY;

    countdownBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - countdownBox.getBoundingClientRect().left;
        offsetY = e.clientY - countdownBox.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            countdownBox.style.left = `${e.clientX - offsetX}px`;
            countdownBox.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    let countdown = 120;
    let intervalId = null; // 用于存储倒计时的ID
    let urlCheckTimer = null; // 用于存储URL检查的ID

    function isTargetPage(url) {
        return TARGET_URLS.some(base => url === base || url.startsWith(base + '/'));
    }

    function startCountdown() {
        if (intervalId !== null) return; // 防止重复启动
        intervalId = setInterval(() => {
            countdown--; // 每秒减少1秒
            countdownBox.innerText = `${countdown}s`;

            if (countdown <= 0) {
                clearInterval(intervalId); // 清除倒计时
                intervalId = null;// 重置倒计时ID

                const alertBox = document.createElement('div');
                alertBox.style = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 80%;
                    height: 80%;
                    transform: translate(-50%, -50%);
                    background-color: rgba(255, 0, 0, 0.5);
                    color: white;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 40px;
                    text-align: center;
                    border-radius: 10px;
                    z-index: 9999;
                `;
                alertBox.innerText = '时间到！请去学习。';
                document.body.appendChild(alertBox);

                setTimeout(() => {
                    //window.close();
                    window.location.href = 'https://web.shiguangxu.com/home/matter/all'; // 或者替换成你要跳转的网址
                }, 20000);
            }
        }, 1000);
    }

    function stopCountdown() {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function monitorURL() { //整个monitorURL，1s检查一次当前URL
        let lastURL = location.href; // 初始化lastURL为当前URL
        urlCheckTimer = setInterval(() => {
            const currentURL = location.href; // 获取当前URL
            
            //如果当前URL与上次URL不同，则更新lastURL
            if (currentURL !== lastURL) {
                lastURL = currentURL;
            }

            //如果当前URL是目标URL，则开始倒计时
            if (isTargetPage(currentURL)) {
                startCountdown();
            } else {
                stopCountdown();
                countdownBox.innerText = `暂停`;
            }
        }, 1000);
    }

    countdownBox.innerText = `${countdown}s`;
    monitorURL();
})();

//修改代码的逻辑，将计时部分封装到一个函数中，
//函数功能如下，每1s检查一次当前URL，如果是https://www.douyin.com/?recommend=1或者https://www.douyin.com/discover及其子页面，则开始倒计时
//如果进入了其他页面，则暂停倒计时
//如果重写匹配到前述url，则继续倒计时
//倒计时归零则与原代码中一样