// ==UserScript==
// @name        网页倒计时提醒
// @namespace   https://example.com
// @version     0.20250503173954
// @description 该脚本适用于抖音和B站，在页面上显示倒计时，倒计时结束时提醒用户学习并关闭页面。
// @author      YourName
// @match       https://www.douyin.com/*
// @match       https://www.bilibili.com/*
// @icon        https://www.douyin.com/favicon.ico
// @grant       none
// ==/UserScript==
(function() {

    // 创建可移动的小方框
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
    let countdown = 1; // 初始倒计时为60秒
    countdownBox.innerText = `${countdown}s`;

    // 可移动功能实现
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

    // 将倒计时框添加到页面
    document.body.appendChild(countdownBox);

    // 倒计时函数
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownBox.innerText = `${countdown}s`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // 倒计时结束，显示大方框
            const alertBox = document.createElement('div');
            alertBox.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                width: 900px;
                height: 450px;
                translate(-50%, -50%);
                background-color: rgba(255, 0, 0, 0.8);
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                text-align: center;
                border-radius: 10px;
                z-index: 9999;
            `;
            alertBox.innerText = '1min结束，请去学习';
            document.body.appendChild(alertBox);

            // 等待 3 秒后关闭页面
            setTimeout(() => {
                window.close(); // 强制关闭页面
            }, 3000); // 等待3秒显示提醒

        }
    }, 1000); // 每秒更新一次倒计时

    // 检测页面关闭
    window.addEventListener('beforeunload', () => {
        clearInterval(countdownInterval); // 如果页面关闭，停止倒计时
    });

})();
