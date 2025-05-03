// ==UserScript==
// @name         抖音收藏视频跳转助手 - 支持左键跳转右键拖动
// @namespace    http://tampermonkey.net/
// @version     0.20250503133221
// @description  在抖音用户收藏页面显示可移动按钮，左键点击跳转视频，右键点击拖动按钮
// @author       你
// @match        https://www.douyin.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 提取 modal_id 的函数
    function getModalIdFromUrl() {
        const search = window.location.search; // 获取当前 URL 的查询参数
        const params = new URLSearchParams(search); // 创建 URLSearchParams 对象
        return params.get('modal_id');
    }

    // 创建浮动按钮
    function createFloatingButton(modalId) {
        const button = document.createElement('div');
        button.innerText = '跳转视频';
        button.style = `
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 99999;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #ff0057, #e43d3d);
            border-radius: 50%;
            color: white;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        `;

        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        // 左键点击事件：跳转视频页面
        button.addEventListener('click', (e) => {
            modalId = getModalIdFromUrl();
            if (e.button === 0) { // 左键点击
                window.open(`https://www.douyin.com/video/${modalId}`, '_blank');
            }
        });

        // 右键按下：启动拖动
        button.addEventListener('mousedown', (e) => {
            if (e.button === 2) { // 鼠标右键
                e.preventDefault(); // 阻止默认右键菜单
                isDragging = true;
                offsetX = e.clientX - button.offsetLeft;
                offsetY = e.clientY - button.offsetTop;
                button.style.transition = 'none';
            }
        });

        // 拖动逻辑
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                button.style.left = `${e.clientX - offsetX}px`;
                button.style.top = `${e.clientY - offsetY}px`;
            }
        });

        // 松开鼠标：停止拖动
        document.addEventListener('mouseup', (e) => {
            if (e.button === 2) { // 右键释放
                isDragging = false;
                button.style.transition = 'transform 0.2s ease';
            }
        });

        return button;
    }

    // 主逻辑
    function main() {
        const existingBtn = document.getElementById('dy-float-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        const floatingBtn = createFloatingButton(modalId);
        floatingBtn.id = 'dy-float-btn';
        document.body.appendChild(floatingBtn);
    }

    // // 监听 URL 变化（适用于单页应用）
    // const oldPushState = history.pushState; // 备份原有的 pushState 方法
    // history.pushState = function (...args) {
    //     oldPushState.apply(this, args);
    //     main();
    // };

    // 初始化
    main();
})();
