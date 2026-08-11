// ==UserScript==
// @name         JavDB 增强：评论 & 清单无限加载
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  破解评论区限制无限加载评论，拦截相关清单跳转并实现无限加载 (App API)
// @author       slowFever
// @match        *://javdb.com/v/*
// @match        *://*.javdb.com/v/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @connect      jdforrepam.com
// @run-at       document-idle
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    // ================= 配置区 =================
    const CONFIG = {
        API_BASE: 'https://jdforrepam.com/api',
        PAGE_SIZE: 20
    };

    // --- 工具函数 ---
    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    // ================= 鉴权模块 =================
    function getSignature() {
        const curr = Math.floor(Date.now() / 1000);
        const stored = localStorage.getItem('jb_jdsignature');
        if (stored) {
            const parts = stored.split('.');
            if (parts.length === 3 && (curr - parseInt(parts[0])) <= 300) return stored;
        }
        const salt = "71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa";
        const hash = md5(`${curr}${salt}`);
        const sign = `${curr}.lpw6vgqzsp.${hash}`;
        localStorage.setItem('jb_jdsignature', sign);
        return sign;
    }

    // ================= 通用网络请求 (优化提取) =================
    function fetchData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'jdSignature': getSignature(),
                    'user-agent': 'Dart/3.5 (dart:io)',
                    'accept-language': 'zh-TW'
                },
                timeout: 15000,
                onload: (resp) => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try { resolve(JSON.parse(resp.responseText)); }
                        catch (e) { reject(new Error('JSON 解析失败')); }
                    } else {
                        reject(new Error(`API 错误: ${resp.status}`));
                    }
                },
                onerror: () => reject(new Error('网络请求失败')),
                ontimeout: () => reject(new Error('请求超时'))
            });
        });
    }

    // ================= 模块：评论解锁 (完全保留您的原版样式与结构) =================
    function renderReviews(reviews, moreNode) {
        let html = '';
        reviews.forEach(r => {
            const id = r.id || Math.random().toString(36).substr(2, 9);
            const user = r.user?.name || r.user?.username || '匿名&nbsp;';
            const time = r.created_at ? new Date(typeof r.created_at === 'number' ? r.created_at * 1000 : r.created_at).toISOString().slice(0, 10) : '';
            let stars = '';
            if (r.score != null) {
                const score = Math.round(parseFloat(r.score));
                stars = '<i class="icon-star" style="color:#ffb000;font-size:14.4px;margin-right:2px;"></i>'.repeat(score) +
                    '<i class="icon-star gray" style="color:#999;font-size:14.4px;margin-right:2px;"></i>'.repeat(5 - score);
            }
            html += `<dt class="review-item" id="review-item-${id}" style="color:#4a4a4a;width:100%;line-height:24px;margin:0;padding:15px 0;display:block;">
                <div class="review-title" style="color:#4a4a4a;font-size:14.4px;line-height:21.6px;display:flex;align-items:center;margin-bottom:8px;">
                    <span>${user}</span><span style="margin:0 8px;display:inline-flex;align-items:center;">${stars}</span>
                    <span style="color:#888;font-size:14.4px;line-height:21.6px;">${time}</span>
                </div>
                <div class="content" style="color:#4a4a4a;width:100%;line-height:24px;">
                    <p style="margin:0;white-space:pre-wrap;word-break:break-word;">${escapeHtml(r.content || '')}</p>
                </div></dt>`;
        });
        moreNode.insertAdjacentHTML('beforebegin', html);
    }

    function setupReviewUnlocker(node) {
        const slug = window.location.pathname.match(/\/v\/([a-zA-Z0-9]+)/)?.[1];
        if (!slug) return;

        node.innerHTML = '▼ 加载完整评论';
        node.className = 'review-item more';
        node.style.cssText = 'cursor:pointer;text-align:center;color:#888;font-weight:bold;padding:12px;background:#F5F5F5;border-radius:6px;margin:20px 0;transition:all 0.2s;display:block;';
        node.onmouseover = () => { if(node.style.cursor !== 'default') node.style.background = '#D3D3D0'; };
        node.onmouseout = () => { if(node.style.cursor !== 'default') node.style.background = '#F5F5F5'; };

        // 优化：使用 dataset 替代全局变量，防止 SPA 页面切换导致的状态混乱
        node.dataset.page = '1';
        node.dataset.hasSkipped = 'false';

        node.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (node.dataset.loading === 'true') return;

            node.dataset.loading = 'true';
            let currentPage = parseInt(node.dataset.page);
            let hasSkippedNative = node.dataset.hasSkipped === 'true';

            node.innerHTML = `正在获取第 ${currentPage} 页...`;
            node.style.color = '#aaa';

            try {
                const url = `${CONFIG.API_BASE}/v1/movies/${slug}/reviews?page=${currentPage}&sort_by=hotly&limit=${CONFIG.PAGE_SIZE}`;
                const res = await fetchData(url);

                if (res.success === 1 && res.data?.reviews) {
                    let reviews = res.data.reviews;
                    if (!hasSkippedNative) {
                        const nativeCount = node.parentElement.querySelectorAll('dt.review-item:not(.more)').length;
                        if (nativeCount > 0) reviews = reviews.slice(nativeCount);
                        node.dataset.hasSkipped = 'true';
                    }
                    if (reviews.length > 0) renderReviews(reviews, node);

                    currentPage++;
                    node.dataset.page = currentPage;

                    if (res.data.reviews.length < CONFIG.PAGE_SIZE) {
                        node.innerHTML = '√ 已加载所有评论';
                        node.style.color = '#4CAF50';
                        node.style.cursor = 'default';
                        node.onclick = null;
                    } else {
                        node.innerHTML = `▶ 继续加载 (第 ${currentPage} 页)`;
                        node.style.color = '#f5c518';
                    }
                } else {
                    throw new Error(res.message || '无数据');
                }
            } catch (err) {
                node.innerHTML = `╳ 加载失败: ${err.message} (点击重试)`;
                node.style.color = '#ff4444';
            } finally {
                node.dataset.loading = 'false';
            }
        };
    }

    function checkReviewButton() {
        let targetNode = document.querySelector('.review-item.more');
        let parentList = document.querySelector('dl.review-items') || document.querySelector('dl.movie-review-list') || document.querySelector('.review-list');
        if (!targetNode && parentList) {
            targetNode = document.createElement('dt');
            targetNode.className = 'review-item more';
            parentList.appendChild(targetNode);
        }
        if (targetNode && !targetNode.dataset.hacked) {
            targetNode.dataset.hacked = 'true';
            setupReviewUnlocker(targetNode);
        }
    }

    // ================= 模块：清单解锁 (样式与交互严格对齐评论) =================
    function renderLists(lists, moreNode) {
        let html = '';
        lists.forEach(item => {
            const id = item.id || Math.random().toString(36).substr(2, 9);
            const name = escapeHtml(item.name || '未命名清单');
            const url = `/lists/${id}`;
            const stats = `视频: ${item.movies_count || 0} | 收藏: ${item.collections_count || 0} | 查看: ${item.views_count || 0}`;
            const time = item.created_at ? new Date(typeof item.created_at === 'number' ? item.created_at * 1000 : item.created_at).toISOString().slice(0, 10) : '';
            html += `<dt class="review-item list-item" id="list-item-${id}" style="color:#F5F5F5;width:100%;line-height:24px;margin:0;padding:15px 0;display:block;border-bottom:1px dashed #eee;">
                <div class="review-title" style="color:#4a4a4a;font-size:14.4px;line-height:21.6px;display:flex;align-items:center;margin-bottom:8px;justify-content:space-between;">
                    <a href="${url}" target="_self" style="color:#2e8abb;text-decoration:none;font-weight:bold;">${name}</a>
                    <span style="color:#888;font-size:12px;">${time}</span>
                </div>
                <div class="content" style="color:#666;width:100%;line-height:24px;font-size:13px;">
                    <p style="margin:0;">${stats}</p>
                </div>
            </dt>`;
        });
        moreNode.insertAdjacentHTML('beforebegin', html);
    }

    function loadRelatedLists(container, slug) {
        container.innerHTML = '';
        const listWrapper = document.createElement('dl');
        listWrapper.className = 'review-items movie-review-list';
        listWrapper.style.cssText = 'margin: 0; padding: 15px;';
        container.appendChild(listWrapper);

        const loadMoreNode = document.createElement('dt');
        loadMoreNode.className = 'review-item more list-more';
        // 严格对齐评论的按钮样式
        loadMoreNode.style.cssText = 'cursor:pointer;text-align:center;color:#888;font-weight:bold;padding:12px;background:#F5F5F5;border-radius:6px;margin:20px 0;transition:all 0.2s;display:block;list-style:none;';
        loadMoreNode.innerHTML = '▼ 加载相关清单';
        listWrapper.appendChild(loadMoreNode);

        // 严格对齐评论的 Hover 交互
        loadMoreNode.onmouseover = () => { if(loadMoreNode.style.cursor !== 'default') loadMoreNode.style.background = '#D3D3D0'; };
        loadMoreNode.onmouseout = () => { if(loadMoreNode.style.cursor !== 'default') loadMoreNode.style.background = '#F5F5F5'; };

        loadMoreNode.dataset.page = '1';

        const triggerFetch = async () => {
            if (loadMoreNode.dataset.loading === 'true') return;
            loadMoreNode.dataset.loading = 'true';

            let listCurrentPage = parseInt(loadMoreNode.dataset.page);
            loadMoreNode.innerHTML = `正在获取第 ${listCurrentPage} 页...`;
            loadMoreNode.style.color = '#aaa';

            try {
                const url = `${CONFIG.API_BASE}/v1/lists/related?movie_id=${slug}&page=${listCurrentPage}&limit=${CONFIG.PAGE_SIZE}`;
                const res = await fetchData(url);
                let lists = res.data?.lists || [];

                if (lists.length > 0) {
                    renderLists(lists, loadMoreNode);
                } else if (listCurrentPage === 1) {
                    loadMoreNode.innerHTML = '√ 暂无相关清单';
                    loadMoreNode.style.color = '#4CAF50';
                    loadMoreNode.style.cursor = 'default';
                    loadMoreNode.onclick = null;
                    return;
                }

                listCurrentPage++;
                loadMoreNode.dataset.page = listCurrentPage;

                if (lists.length < CONFIG.PAGE_SIZE) {
                    loadMoreNode.innerHTML = '√ 已加载所有清单';
                    loadMoreNode.style.color = '#4CAF50';
                    loadMoreNode.style.cursor = 'default';
                    loadMoreNode.onclick = null;
                } else {
                    loadMoreNode.innerHTML = `▶ 继续加载 (第 ${listCurrentPage} 页)`;
                    loadMoreNode.style.color = '#f5c518';
                }
            } catch (err) {
                loadMoreNode.innerHTML = `╳ 加载失败: ${err.message} (点击重试)`;
                loadMoreNode.style.color = '#ff4444';
            } finally {
                loadMoreNode.dataset.loading = 'false';
            }
        };

        loadMoreNode.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerFetch();
        };

        // 自动触发第一次加载
        triggerFetch();
    }

    function interceptListTab() {
        const listTabLink = document.querySelector('a.list-tab[data-action*="relatedLists"]');
        if (!listTabLink || listTabLink.dataset.myIntercepted === 'true') return;
        listTabLink.dataset.myIntercepted = 'true';

        listTabLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            const tabList = listTabLink.closest('ul');
            if (tabList) {
                tabList.querySelectorAll('li').forEach(li => li.classList.remove('is-active'));
                listTabLink.closest('li').classList.add('is-active');
            }

            const container = document.querySelector('#tabs-container');
            if (container) {
                const panels = container.querySelectorAll('[data-movie-tab-target]');
                panels.forEach(panel => {
                    if (panel.dataset.movieTabTarget !== 'lists') {
                        panel.style.display = 'none';
                    }
                });

                const listPanel = container.querySelector('[data-movie-tab-target="lists"]');
                if (listPanel) {
                    listPanel.style.display = 'block';
                    if (!listPanel.dataset.myLoaded) {
                        const slug = window.location.pathname.match(/\/v\/([a-zA-Z0-9]+)/)?.[1];
                        if (slug) {
                            listPanel.dataset.myLoaded = 'true';
                            loadRelatedLists(listPanel, slug);
                        }
                    }
                }
            }
        }, true);
    }

    // ================= 核心调度 =================
    function mainLoop() {
        checkReviewButton();
        interceptListTab();
    }

    mainLoop();
    new MutationObserver(mainLoop).observe(document.documentElement, {
        childList: true,
        subtree: true
    });
})();