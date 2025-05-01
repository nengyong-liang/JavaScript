// ==UserScript==
// @name        网页自动下滑（带开关控制）
// @namespace   https://example.com
// @version     0.1
// @description 该脚本可用于所有网站的自动下滑功能，点击开关按钮开始或暂停下滑。
// @author      YourName
// @match       *://*/*
// @icon        https://example.com/favicon.ico
// @grant       none
// ==/UserScript==
(function() {

    // 创建并设置按钮样式
    const btnToggle = document.createElement('div');
    btnToggle.style = `
    font-size:14px;cursor:pointer;width: 80px;height: 40px;
    background: linear-gradient(135deg, #FF512F 0%,#DD2476 100%);
    color: white;
    border: 1px solid rgba(255,255,255,0.5);
    position: fixed;left: 20px;bottom: 150px;z-index: 999;
    display: flex;border-radius: 8px;align-items: center;justify-content: center;
    `;
    btnToggle.innerText = '开启下滑';

    // 控制变量
    let STARTED_SCROLL = false;  // 下滑是否正在运行
    let PAUSED_SCROLL = false;   // 下滑是否暂停
    const SCROLL_STEP = 500;     // 每次下滑的距离，可以根据需求调整
    const SCROLL_INTERVAL = 100; // 每次下滑的间隔时间，单位：毫秒

    // 启动/暂停下滑的函数
    const startStopScroll = () => {
        if (!STARTED_SCROLL) {
            // 如果没有开始下滑，则启动下滑
            STARTED_SCROLL = true;
            PAUSED_SCROLL = false;
            btnToggle.innerText = '暂停下滑';

            // 每隔一定时间下滑一定距离
            const scrollInterval = setInterval(() => {
                if (!PAUSED_SCROLL) {
                    window.scrollBy(0, SCROLL_STEP);
                }
            }, SCROLL_INTERVAL);

            // 点击按钮时清除定时器并控制暂停/继续下滑
            btnToggle.onclick = () => {
                PAUSED_SCROLL = !PAUSED_SCROLL;
                if (PAUSED_SCROLL) {
                    btnToggle.innerText = '继续下滑';
                } else {
                    btnToggle.innerText = '暂停下滑';
                }
            };

        } else {
            // 如果已经开始下滑，则切换暂停/继续状态
            PAUSED_SCROLL = !PAUSED_SCROLL;
            if (PAUSED_SCROLL) {
                btnToggle.innerText = '继续下滑';
            } else {
                btnToggle.innerText = '暂停下滑';
            }
        }
    };

    // 设置按钮点击事件
    btnToggle.onclick = startStopScroll;

    // 将按钮添加到页面中
    document.body.appendChild(btnToggle);

})();
