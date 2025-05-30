// ==UserScript==
// @name        获取影迷的秘密中的神秘代码
// @namespace   http://tampermonkey.net/
// @match       *://63h.net/*
// @match       *://www.63h.net/*
// @match       *://*.63h.*/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0.0
// @author      slowFever
// @description 自动获取影迷的秘密中当前页面的神秘代码。
// @icon        https://www.google.com/s2/favicons?sz=64&domain=www.63h.net
// ==/UserScript==

(function () {
    'use strict';

    // 添加样式
    GM_addStyle(`
    #custom-panel-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #678efd;
      color: white;
      border: none;
      padding: 8px 15px;
      border-radius: 6px;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      font-size: 14px;
    }

    #custom-panel {
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 300px;
      height: auto;
      background-color: hwb(224.4deg 40.39% 0.78% / 68%);
      backdrop-filter: blur(3px) saturate(180%);
      -webkit-backdrop-filter: blur(3px) saturate(180%);
      color: white;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      padding: 15px;
      z-index: 99999;
      font-family: sans-serif;
      opacity: 0;
      transform: translateX(350px);
      pointer-events: none;
      transition: opacity 0.5s ease, transform 0.5s ease;
    }

    #custom-panel.visible {
      opacity: 1;
      transform: translateX(0);
      pointer-events: auto;
    }

    #custom-panel h3 {
      display: flex;
      margin-top: 0;
      font-size: 16px;
      color: #ffffff;
    }
    
    #btn {
      display: flex;
      padding: 4px 10px;
      background-color: #0050ff;
      color: white;
      border: none;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    
    #btn:hover {
      background-color: #1d4ed8;
    }

    #custom-panel .content {
      font-size: 14px;
      line-height: 1.4;
    }
    
    .ellipsis-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
    }
    
    .image-container {
      overflow: hidden;
      margin-top: 10px;
    }
    
    .image-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: space-between;
    }
    
    .image-grid img {
      width: calc(50% - 5px);
      height: auto;
      object-fit: contain;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      max-width: 100%;
    }
    `)

    const titleElement = document.querySelector('.entry-header h1.entry-title');
    const imgElement = document.querySelectorAll('.entry-content p > img');

    if (!titleElement || !imgElement.length || !titleElement.textContent.match(/[A-Z]{2,}-\d{2,}/i)) {
        console.error('未找到标题、图片或番号，脚本停止执行。');
        return;
    }

    console.table([{ title: titleElement.textContent }]);
    console.table(
        [...imgElement].map((img, index) => ({
            index: index + 1,
            src: img.src
        }))
    );

    function extractTheCodeNumberFromTheText(text) {
        return text.match(/[A-Z]{2,}-\d{2,}/gi)
    }

    console.log(`✅ 已成功识别番号：${extractTheCodeNumberFromTheText(titleElement.textContent)}`);

    // 创建操作面板
    const panel = document.createElement('div');
    panel.id = 'custom-panel';
    panel.innerHTML = `
        <h3>
            <sapn style="flex: 1;">番号：<span id="code">${extractTheCodeNumberFromTheText(titleElement.textContent)}</span></sapn>
            <button id="btn">复制</button>
        </h3>
        <div class="content ellipsis-2">
          ${titleElement.textContent}
        </div>
        <div class="content image-container">
          <div class="image-grid">
            ${[...imgElement].map(item => {
                return `<img src="${item.src}" alt="Image">`;
            }).join('')}
          </div>
        </div>
    `;
    document.body.appendChild(panel);

    // 创建切换按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'custom-panel-toggle';
    toggleBtn.style = 'display: flex; align-items: center; justify-content: center;';

    // 展开图标 SVG
    const iconOpen = `<svg t="1748606871665" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7954" width="20" height="20"><path d="M544.768 507.904V251.904c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v251.904c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4V772.096c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-55.296c43.008-14.336 73.728-53.248 73.728-102.4 0-47.104-30.72-88.064-73.728-102.4zM512 653.312c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 24.576-18.432 43.008-43.008 43.008z" p-id="7955" fill="#ffffff"></path><path d="M854.016 0H169.984C75.776 0 0 75.776 0 169.984v681.984C0 948.224 75.776 1024 169.984 1024h681.984c94.208 0 169.984-75.776 169.984-169.984V169.984C1024 75.776 948.224 0 854.016 0z m106.496 854.016v6.144c-4.096 55.296-49.152 100.352-106.496 100.352H163.84c-55.296-4.096-100.352-49.152-100.352-106.496V163.84c4.096-55.296 49.152-100.352 106.496-100.352H858.112c55.296 4.096 100.352 49.152 100.352 106.496v684.032z" p-id="7956" fill="#ffffff"></path><path d="M288.768 317.44v-65.536c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v61.44c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4v249.856c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-245.76c43.008-14.336 73.728-53.248 73.728-102.4s-30.72-88.064-73.728-102.4z m-32.768 145.408c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 22.528-20.48 43.008-43.008 43.008zM798.72 317.44v-65.536c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v61.44c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4v249.856c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-245.76c43.008-14.336 73.728-53.248 73.728-102.4s-30.72-88.064-73.728-102.4z m-32.768 145.408c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 22.528-18.432 43.008-43.008 43.008z" p-id="7957" fill="#ffffff"></path></svg>`;
    // 收起图标 SVG
    const iconClose = `<svg t="1748606610599" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5450" width="20" height="20"><path d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m170.368 284.8L512 455.168 341.632 284.8l-56.832 56.832L455.168 512 284.8 682.368l56.832 56.768L512 568.768l170.368 170.368 56.768-56.768L568.768 512l170.368-170.368-56.768-56.832z" fill="#ffffff" p-id="5451"></path></svg>`;

    // 初始化面板状态
    const isInitiallyVisible = GM_getValue('panelVisible', true); // 默认展开
    if (isInitiallyVisible) {
        panel.classList.add('visible');
        toggleBtn.innerHTML = iconClose;
    } else {
        panel.classList.remove('visible');
        toggleBtn.innerHTML = iconOpen;
    }

    // 点击按钮切换并保存状态
    toggleBtn.onclick = function () {
        const isVisible = panel.classList.toggle('visible');
        GM_setValue('panelVisible', isVisible); // 保存状态
        toggleBtn.innerHTML = isVisible ? iconClose : iconOpen;
    };
    document.body.appendChild(toggleBtn);

    const btn = document.getElementById('btn');
    const codeSpan = document.getElementById('code');

    btn.addEventListener('click', () => {
        const textToCopy = codeSpan.textContent.trim();

        navigator.clipboard.writeText(textToCopy).then(() => {
            btn.textContent = '已复制';
            btn.disabled = true; // 禁用按钮

            setTimeout(() => {
                btn.textContent = '复制';
                btn.disabled = false; // 恢复按钮
            }, 3000);
        }).catch(err => {
            console.error('复制失败:', err);
            alert('复制失败，请手动复制');
        });
    });

})()
