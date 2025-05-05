// ==UserScript==
// @name         抖音收藏视频跳转助手
// @namespace    http://tampermonkey.net/
// @version     0.20250505215016
// @description  在抖音用户收藏页面显示可移动按钮，点击跳转到对应视频页面
// @author       你
// @match        https://www.douyin.com/user/self*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // 提取 modal_id 的函数
    function getModalIdFromUrl() {
        const search = window.location.search;
        const params = new URLSearchParams(search);
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
            cursor: move;
            user-select: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            transition: transform 0.2s ease;
        `;

        // 拖动功能
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - button.offsetLeft;
            offsetY = e.clientY - button.offsetTop;
            button.style.transition = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                button.style.left = `${e.clientX - offsetX}px`;
                button.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            button.style.transition = 'transform 0.2s ease';
        });

        // 点击事件：跳转视频页面
        button.addEventListener('click', (e) => {
            if (!isDragging) { // 防止误触拖动触发点击
                window.open(`https://www.douyin.com/video/${modalId}`, '_blank');
            }
        });

        return button;
    }

    // 主逻辑
    function main() {
        const modalId = getModalIdFromUrl();
        if (!modalId) return;

        const existingBtn = document.getElementById('dy-float-btn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const floatingBtn = createFloatingButton(modalId);
        floatingBtn.id = 'dy-float-btn';
        document.body.appendChild(floatingBtn);
    }

    // 监听 URL 变化（适用于单页应用）
    const oldPushState = history.pushState;
    history.pushState = function (...args) {
        oldPushState.apply(this, args);
        main();
    };

    // 初始化
    main();
})();