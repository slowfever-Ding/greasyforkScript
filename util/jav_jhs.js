// ==UserScript==
// @name         JAV-JHS
// @namespace    https://sleazyfork.org/zh-CN/scripts/533695-jav-jhs
// @version      1.8.8
// @author       xie bro
// @description  Jav-鉴黄师 收藏、屏蔽、标记已下载; 免VIP查看热榜、Top250排行榜、Fc2ppv等数据; 可查看所有评论信息; 支持云盘备份; 以图识图; 字幕搜索;
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @include      https://javdb*.com/*
// @include      https://www.javbus.com/*
// @include      https://*sehuatang.*/*
// @include      https://javtrailers.com/*
// @include      https://subtitlecat.com/*
// @include      https://www.aliyundrive.com/*
// @include      https://5masterzzz.site/*
// @exclude      https://www.javbus.com/forum/*
// @exclude      https://www.javbus.com/*actresses
// @require      data:application/javascript,;(function%20hookBody()%20%7B%20if%20(document.readyState%20!%3D%3D%20%22loading%22)%20%7B%20return%3B%20%7D%20const%20initialHideStyle%20%3D%20document.createElement(%22style%22)%3B%20initialHideStyle.textContent%20%3D%20%60%20body%20%7B%20opacity%3A%200%20!important%3B%20visibility%3A%20hidden%20!important%3B%20%7D%20body.script-ready%20%7B%20opacity%3A%201%20!important%3B%20visibility%3A%20visible%20!important%3B%20%7D%20%60%3B%20document.head.appendChild(initialHideStyle)%3B%20setTimeout(()%20%3D%3E%20%7B%20document.body.classList.add(%22script-ready%22)%3B%20%7D%2C%203e3)%3B%20%7D)()%3B
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      aliyundrive.com
// @connect      aliyundrive.net
// @connect      ja.wikipedia.org
// @connect      beta.magnet.pics
// @connect      jdforrepam.com
// @connect      cc3001.dmm.co.jp
// @connect      adult.contents.fc2.com
// @connect      fc2ppvdb.com
// @connect      123av.com
// @connect      u3c3.com
// @connect      btsow.pics
// @connect      *
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.sleazyfork.org/scripts/533695/JAV-JHS.user.js
// @updateURL https://update.sleazyfork.org/scripts/533695/JAV-JHS.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty, __typeError = e => {
    throw TypeError(e);
}, __defNormalProp = (e, t, n) => t in e ? __defProp(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : e[t] = n, __publicField = (e, t, n) => __defNormalProp(e, "symbol" != typeof t ? t + "" : t, n), __accessCheck = (e, t, n) => t.has(e) || __typeError("Cannot " + n), __privateAdd = (e, t, n) => t.has(e) ? __typeError("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), __privateMethod = (e, t, n) => (__accessCheck(e, t, "access private method"),
    n);

!function () {
    "use strict";
    var e, t, n, a, i;
    const r = {
        boxSelector: ".movie-list",
        itemSelector: ".movie-list .item",
        coverImgSelector: ".cover img",
        requestDomItemSelector: ".movie-list .item"
    }, s = {
        boxSelector: ".masonry",
        itemSelector: ".masonry .item",
        coverImgSelector: ".item .photo-frame img",
        requestDomItemSelector: "#waterfall .item"
    }, o = window.location.href, l = o.includes("javdb"), c = o.includes("javbus"), d = o.includes("/search?q") || o.includes("/search/") || o.includes("/users/"), p = "favorite", g = "filter", h = "hasDown", u = 2592e6;

    function m(e) {
        if (e) if (e.includes("<style>")) document.head.insertAdjacentHTML("beforeend", e); else {
            const t = document.createElement("style");
            t.textContent = e;
            document.head.appendChild(t);
        }
    }

    c && m("\n<style>\n    .masonry {\n        height: 100% !important;\n        width: 100% !important;\n        padding: 0 15px !important;\n    }\n    .masonry {\n        display: grid;\n        column-gap: 10px; /* 列间距*/\n        row-gap: 10px; /* 行间距 */\n        grid-template-columns: repeat(4, minmax(0, 1fr));\n    }\n    .masonry .item {\n        /*position: initial !important;*/\n        top: initial !important;\n        left: initial !important;\n        float: none !important;\n        background-color:#c4b1b1;\n        position: relative !important;\n    }\n    \n    .masonry .item:hover {\n        box-shadow: 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px #485fc7;\n    }\n    .masonry .movie-box{\n        width: 100% !important;\n        height: 100% !important;\n        margin: 0 !important;\n    }\n    .masonry .movie-box .photo-frame {\n        height: 70% !important;\n        margin: 0 !important;\n    }\n    .masonry .movie-box img {\n        max-height: 300px;\n        min-height: 300px;\n        height: 100% !important;\n        object-fit: cover; /* 保持比例，裁剪多余部分 */\n        object-position: top; /* 从中间裁剪（可调整：top, bottom, left, right） */\n    }\n    .masonry .movie-box img:hover {\n      transform: scale(1.04);\n      transition: transform 0.3s;\n    }\n    .masonry .photo-info{\n        height: 30% !important;\n    }\n    .masonry .photo-info span {\n      display: inline-block; /* 或者 block */\n      max-width: 100%;      /* 根据父容器限制宽度 */\n      white-space: nowrap;  /* 禁止换行 */\n      overflow: hidden;     /* 隐藏溢出内容 */\n      text-overflow: ellipsis; /* 显示省略号 */\n    }\n    \n    /* 无码页面的样式 */\n    .photo-frame .mheyzo,\n    .photo-frame .mcaribbeancom2{\n        margin-left: 0 !important;\n    }\n    .avatar-box{\n        width: 100% !important;\n        display: flex !important;\n        margin:0 !important;\n    }\n    .avatar-box .photo-info{\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        gap: 30px;\n        flex-direction: row;\n        background-color:#fff !important;\n    }\n    /*.photo-info .item-tag{\n        position: relative;\n    }*/\n    footer,#related-waterfall{\n        display: none!important;\n    }\n</style>\n");
    l && m('\n<style>\n    .navbar {\n        z-index: 12345679 !important;\n        padding: 0 0;\n    }\n    \n    .navbar-link:not(.is-arrowless) {\n        padding-right: 33px;\n    }\n    \n    .sub-header,\n    /*#search-bar-container, !*搜索框*!*/\n    #footer,\n    /*.search-recent-keywords, !*搜索框底部热搜词条*!*/\n    .app-desktop-banner,\n    div[data-controller="movie-tab"] .tabs,\n    h3.main-title,\n    div.video-meta-panel > div > div:nth-child(2) > nav > div.review-buttons > div:nth-child(2), /* 下载 订正 按钮*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(3), /* 相关清单*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(2), /* 短评按钮*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(1), /*磁力面板 按钮*/\n    .top-meta,\n    .float-buttons {\n        display: none !important;\n    }\n    \n    div.tabs.no-bottom,\n    .tabs ul {\n        border-bottom: none !important;\n    }\n    \n    \n    /* 视频列表项 相对相对 方便标签绝对定位*/\n    .movie-list .item {\n        position: relative !important;\n    }\n\n</style>\n');
    m("\n<style>\n    .a-primary, /* 主按钮 - 浅蓝色 */\n    .a-success, /* 成功按钮 - 浅绿色 */\n    .a-danger, /* 危险按钮 - 浅粉色 */\n    .a-warning, /* 警告按钮 - 浅橙色 */\n    .a-info, /* 信息按钮 - 浅青色 */\n    .a-dark, /* 深色按钮 - 改为中等灰色（保持浅色系中的对比） */\n    .a-outline, /* 轮廓按钮 - 浅灰色边框 */\n    .a-disabled /* 禁用按钮 - 极浅灰色 */\n    {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        padding: 6px 14px;\n        margin-left: 10px;\n        border-radius: 6px;\n        text-decoration: none;\n        font-size: 13px;\n        font-weight: 500;\n        transition: all 0.2s ease;\n        cursor: pointer;\n        border: 1px solid rgba(0, 0, 0, 0.08);\n        white-space: nowrap;\n    }\n    \n    .a-primary {\n        background: #e0f2fe;\n        color: #0369a1;\n        border-color: #bae6fd;\n    }\n    \n    .a-primary:hover {\n        background: #bae6fd;\n    }\n    \n    .a-success {\n        background: #dcfce7;\n        color: #166534;\n        border-color: #bbf7d0;\n    }\n    \n    .a-success:hover {\n        background: #bbf7d0;\n    }\n    \n    .a-danger {\n        background: #fee2e2;\n        color: #b91c1c;\n        border-color: #fecaca;\n    }\n    \n    .a-danger:hover {\n        background: #fecaca;\n    }\n    \n    .a-warning {\n        background: #ffedd5;\n        color: #9a3412;\n        border-color: #fed7aa;\n    }\n    \n    .a-warning:hover {\n        background: #fed7aa;\n    }\n    \n    .a-info {\n        background: #ccfbf1;\n        color: #0d9488;\n        border-color: #99f6e4;\n    }\n    \n    .a-info:hover {\n        background: #99f6e4;\n    }\n    \n    .a-dark {\n        background: #e2e8f0;\n        color: #334155;\n        border-color: #cbd5e1;\n    }\n    \n    .a-dark:hover {\n        background: #cbd5e1;\n    }\n    \n    .a-outline {\n        background: transparent;\n        color: #64748b;\n        border-color: #cbd5e1;\n    }\n    \n    .a-outline:hover {\n        background: #f8fafc;\n    }\n    \n    .a-disabled {\n        background: #f1f5f9;\n        color: #94a3b8;\n        border-color: #e2e8f0;\n        cursor: not-allowed;\n    }\n    \n    .a-disabled:hover {\n        transform: none;\n        box-shadow: none;\n        background: #f1f5f9;\n    }\n</style>\n");
    m("\n<style>\n    /* 全局通用样式 */\n    .fr-btn {\n        float: right;\n        margin-left: 4px !important;\n    }\n    \n    .menu-box {\n        position: fixed;\n        right: 10px;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        flex-direction: column;\n        z-index: 1000;\n        gap: 6px;\n    }\n    \n    .menu-btn {\n        display: inline-block !important;\n        min-width: 80px;\n        padding: 7px 12px;\n        border-radius: 4px;\n        color: white !important;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 12px;\n        text-align: center;\n        cursor: pointer;\n        transition: all 0.3s ease;\n        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n        border: none;\n        line-height: 1.3;\n        margin: 0;\n    }\n    \n    .menu-btn:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);\n        opacity: 0.9;\n    }\n    \n    .menu-btn:active {\n        transform: translateY(0);\n        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n    }\n    \n    .do-hide {\n        display: none !important;\n    }\n</style>\n");
    e = new WeakSet;
    t = async function () {
        if (!window.location.hostname.includes("javdb")) return;
        (await this.forage.keys()).forEach((e => e.startsWith("SCORE_") && this.forage.removeItem(e)));
        const e = Date.now();
        try {
            const t = await this.forage.getItem("lastCleanupTime");
            if (t && e - t < 864e5) return;
            const n = await this.forage.keys();
            for (const e of n) {
                if (this.interceptedKeys.includes(e)) continue;
                const t = await this.forage.getItem(e);
                if ("object" == typeof t && "expires" in t && "expiresStr" in t && Date.now() > t.expires) {
                    console.log("清理过期数据:", e);
                    await this.forage.removeItem(e);
                }
            }
            await this.forage.setItem("lastCleanupTime", e);
        } catch (t) {
            console.error("[自动清理失败]", t);
            await this.forage.setItem("lastCleanupTime", e);
        }
    };
    n = async function (e, t, n) {
        let a;
        if (Array.isArray(e)) a = [...e]; else {
            a = await this.forage.getItem(t) || [];
            if (a.includes(e)) {
                const t = `${e} ${n}已存在`;
                show.error(t);
                throw new Error(t);
            }
            a.push(e);
        }
        await this.forage.setItem(t, a);
        return a;
    };
    let f = class _StorageManager {
        constructor() {
            __privateAdd(this, e);
            __publicField(this, "car_list_key", "car_list");
            __publicField(this, "filter_actor_key", "filter_actor");
            __publicField(this, "title_filter_keyword_key", "title_filter_keyword");
            __publicField(this, "review_filter_keyword_key", "review_filter_keyword");
            __publicField(this, "setting_key", "setting");
            __publicField(this, "auto_page_key", "autoPage");
            __publicField(this, "fold_category_key", "foldCategory");
            __publicField(this, "review_ts_key", "review_ts");
            __publicField(this, "review_sign_key", "review_sign");
            __publicField(this, "actress_prefix_key", "z_actress_");
            __publicField(this, "score_prefix_key", "z_score_");
            __publicField(this, "forage", localforage.createInstance({
                driver: localforage.INDEXEDDB,
                name: "JAV-JHS",
                version: 1,
                storeName: "appData"
            }));
            __publicField(this, "interceptedKeys", [this.car_list_key, this.filter_actor_key, this.title_filter_keyword_key, this.review_filter_keyword_key, this.setting_key]);
            if (_StorageManager.instance) throw new Error("LocalStorageManager已被实例化过了!");
            _StorageManager.instance = this;
            __privateMethod(this, e, t).call(this).then();
            this.migrateData().then();
        }

        async migrateData() {
            var e;
            if (!(await (e = "JAV-JSH", new Promise((t => {
                const n = indexedDB.open(e);
                n.onerror = () => t(!1);
                n.onsuccess = () => {
                    n.result.close();
                    t(!0);
                };
                n.onupgradeneeded = e => {
                    e.target.transaction.abort();
                    t(!1);
                };
            }))))) return;
            const t = localforage.createInstance({
                driver: localforage.INDEXEDDB,
                name: "JAV-JSH",
                version: 1,
                storeName: "appData"
            }), n = localforage.createInstance({
                driver: localforage.INDEXEDDB,
                name: "JAV-JHS",
                version: 1,
                storeName: "appData"
            });
            t.keys().then((e => {
                const a = e.map((e => t.getItem(e).then((t => n.setItem(e, t)))));
                return Promise.all(a);
            })).then((() => {
                t.dropInstance({
                    name: "JAV-JSH"
                }).then((() => {
                }));
            })).catch((e => {
                console.error(e);
            }));
        }

        async saveFilterActor(t) {
            return __privateMethod(this, e, n).call(this, t, this.filter_actor_key, "演员");
        }

        async saveReviewFilterKeyword(t) {
            return __privateMethod(this, e, n).call(this, t, this.review_filter_keyword_key, "评论关键词");
        }

        async saveTitleFilterKeyword(t) {
            return __privateMethod(this, e, n).call(this, t, this.title_filter_keyword_key, "标题关键词");
        }

        async getFilterActorList() {
            return await this.forage.getItem(this.filter_actor_key) || [];
        }

        async getTitleFilterKeyword() {
            return await this.forage.getItem(this.title_filter_keyword_key) || [];
        }

        async getSetting(e = null, t) {
            const n = await this.forage.getItem(this.setting_key) || {};
            if (null === e) return n;
            const a = n[e];
            return a ? "true" === a || "false" === a ? "true" === a.toLowerCase() : "string" != typeof a || isNaN(Number(a)) ? a : Number(a) : t;
        }

        async saveSetting(e) {
            e ? await this.forage.setItem(this.setting_key, e) : show.error("设置对象为空");
        }

        async saveSettingItem(e, t) {
            if (!e) {
                show.error("key 不能为空");
                return;
            }
            let n = await this.getSetting();
            n[e] = t;
            await this.saveSetting(n);
        }

        async getReviewFilterKeywordList() {
            return await this.forage.getItem(this.review_filter_keyword_key) || [];
        }

        async saveCar(e, t, n, a) {
            if (!e) {
                show.error("番号为空!");
                throw new Error("番号为空!");
            }
            if (!t) {
                show.error("url为空!");
                throw new Error("url为空!");
            }
            t.includes("http") || (t = window.location.origin + t);
            n && (n = n.trim());
            const i = await this.forage.getItem(this.car_list_key) || [];
            let r = i.find((t => t.carNum === e));
            if (r) {
                r.url = t;
                r.actress = n;
                r.updateDate = utils.getNowStr();
            } else {
                r = {
                    carNum: e,
                    url: t,
                    actress: n,
                    status: "",
                    updateDate: utils.getNowStr()
                };
                i.push(r);
            }
            delete r.createDate;
            switch (a) {
                case g:
                    if (r.status === g) {
                        const t = `${e} 已在屏蔽列表中`;
                        show.error(t);
                        throw new Error(t);
                    }
                    r.status = g;
                    break;

                case p:
                    if (r.status === p) {
                        const t = `${e} 已在收藏列表中`;
                        show.error(t);
                        throw new Error(t);
                    }
                    r.status = p;
                    break;

                case h:
                    r.status = h;
                    break;

                default:
                    const t = "actionType错误";
                    show.error(t);
                    throw new Error(t);
            }
            await this.forage.setItem(this.car_list_key, i);
        }

        async getCarList() {
            return (await this.forage.getItem(this.car_list_key) || []).sort(((e, t) => {
                if (!e || !t) return 0;
                const n = e.updateDate ? new Date(e.updateDate).getTime() : 0;
                return (t.updateDate ? new Date(t.updateDate).getTime() : 0) - n;
            }));
        }

        async getCar(e) {
            return (await this.getCarList()).find((t => t.carNum === e));
        }

        async removeCar(e) {
            const t = await this.getCarList(), n = t.length, a = t.filter((t => t.carNum !== e));
            if (a.length === n) {
                show.error(`${e} 不存在`);
                return !1;
            }
            await this.forage.setItem(this.car_list_key, a);
            return !0;
        }

        async overrideCarList(e) {
            if (!Array.isArray(e)) throw new TypeError("必须传入数组类型数据");
            const t = e.filter((e => !e || "object" != typeof e || !e.carNum));
            if (t.length > 0) throw new Error(`缺少必要字段 carNum 的数据项: ${t.length} 条`);
            const n = new Set, a = e.filter((e => {
                if (n.has(e.carNum)) return !0;
                n.add(e.carNum);
                return !1;
            }));
            if (a.length > 0) throw new Error(`发现重复: ${a.slice(0, 3).map((e => e.carNum)).join(", ")}${a.length > 3 ? "..." : ""}`);
            e.forEach((e => {
                if (!("updateDate" in e)) if ("createDate" in e) {
                    e.updateDate = e.createDate;
                    delete e.createDate;
                } else e.updateDate = "2025-04-23 08:14:33";
            }));
            await this.forage.setItem(this.car_list_key, e);
        }

        async getItem(e) {
            if (this.interceptedKeys.includes(e)) {
                let t = `危险操作, 该key已有方法实现获取, 请用内部方法调用!  key: ${e}`;
                show.error(t);
                throw new Error(t);
            }
            const t = await this.forage.getItem(e);
            if (null == t) return null;
            if ("object" == typeof t && "expires" in t && "expiresStr" in t) {
                if (Date.now() > t.expires) {
                    await this.forage.removeItem(e);
                    return null;
                }
                return t.value;
            }
            return t;
        }

        async setItem(e, t, n = null) {
            if (this.interceptedKeys.includes(e)) {
                let t = `危险操作, 该key已有方法实现获取, 请用内部方法调用!  key: ${e}`;
                show.error(t);
                throw new Error(t);
            }
            let a = t;
            if (null !== n) {
                const e = Date.now() + n;
                a = {
                    value: t,
                    expires: e,
                    expiresStr: utils.formatDate(new Date(e))
                };
            }
            return await this.forage.setItem(e, a);
        }

        async removeItem(e) {
            if (this.interceptedKeys.includes(e)) {
                let t = `危险操作, 该key不可删除!  key: ${e}`;
                show.error(t);
                throw new Error(t);
            }
            return await this.forage.removeItem(e);
        }

        async importData(e) {
            let t = e.filterKeywordList;
            Array.isArray(t) && await this.forage.setItem(this.title_filter_keyword_key, t);
            t = e.filterActorList;
            Array.isArray(t) && await this.forage.setItem(this.filter_actor_key, t);
            t = e.reviewKeywordList;
            Array.isArray(t) && await this.forage.setItem(this.review_filter_keyword_key, t);
            e.dataList && await this.overrideCarList(e.dataList);
            t = e[this.title_filter_keyword_key];
            Array.isArray(t) && await this.forage.setItem(this.title_filter_keyword_key, t);
            t = e[this.filter_actor_key];
            Array.isArray(t) && await this.forage.setItem(this.filter_actor_key, t);
            t = e[this.review_filter_keyword_key];
            Array.isArray(t) && await this.forage.setItem(this.review_filter_keyword_key, t);
            e[this.car_list_key] && await this.overrideCarList(e[this.car_list_key]);
            e.setting && await this.saveSetting(e.setting);
        }

        async exportData() {
            return {
                car_list: await this.getCarList(),
                filter_actor: await this.getFilterActorList(),
                title_filter_keyword: await this.getTitleFilterKeyword(),
                review_filter_keyword: await this.getReviewFilterKeywordList(),
                setting: await this.getSetting()
            };
        }
    };

    class Utils {
        constructor() {
            __publicField(this, "intervalContainer", {});
            __publicField(this, "mimeTypes", {
                txt: "text/plain",
                html: "text/html",
                css: "text/css",
                csv: "text/csv",
                json: "application/json",
                xml: "application/xml",
                jpg: "image/jpeg",
                jpeg: "image/jpeg",
                png: "image/png",
                gif: "image/gif",
                webp: "image/webp",
                svg: "image/svg+xml",
                pdf: "application/pdf",
                doc: "application/msword",
                docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                xls: "application/vnd.ms-excel",
                xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ppt: "application/vnd.ms-powerpoint",
                pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                zip: "application/zip",
                rar: "application/x-rar-compressed",
                "7z": "application/x-7z-compressed",
                mp3: "audio/mpeg",
                wav: "audio/wav",
                mp4: "video/mp4",
                webm: "video/webm",
                ogg: "audio/ogg"
            });
            __publicField(this, "insertStyle", (e => {
                if (e) {
                    -1 === e.indexOf("<style>") && (e = "<style>" + e + "</style>");
                    $("head").append(e);
                }
            }));
            Utils.instance || (Utils.instance = this);
            return Utils.instance;
        }

        importResource(e) {
            let t;
            if (e.indexOf("css") >= 0) {
                t = document.createElement("link");
                t.setAttribute("rel", "stylesheet");
                t.href = e;
            } else {
                t = document.createElement("script");
                t.setAttribute("type", "text/javascript");
                t.src = e;
            }
            document.documentElement.appendChild(t);
        }

        openPage(e, t, n, a) {
            n || (n = !0);
            if (a && (a.ctrlKey || a.metaKey)) return window.open(e);
            const i = e.includes("?") ? `${e}&hideNav=1` : `${e}?hideNav=1`;
            layer.open({
                type: 2,
                title: t,
                content: i,
                scrollbar: !1,
                shadeClose: n,
                area: ["80%", "90%"],
                isOutAnim: !1,
                anim: -1
            });
        }

        closePage() {
            parent.document.documentElement.style.overflow = "auto";
            [".layui-layer-shade", ".layui-layer-move", ".layui-layer"].forEach((function (e) {
                const t = parent.document.querySelectorAll(e);
                if (t.length > 0) {
                    const e = t.length > 1 ? t[t.length - 1] : t[0];
                    e.parentNode.removeChild(e);
                }
            }));
            window.close();
        }

        loopDetector(e, t, n = 20, a = 1e4, i = !0) {
            let r = !1;
            const s = Math.random(), o = (new Date).getTime();
            this.intervalContainer[s] = setInterval((() => {
                if ((new Date).getTime() - o > a) {
                    console.warn("loopDetector timeout!", e, t);
                    r = i;
                }
                if (e() || r) {
                    clearInterval(this.intervalContainer[s]);
                    t && t();
                    delete this.intervalContainer[s];
                }
            }), n);
        }

        rightClick(e, t) {
            if (e) {
                e.jquery ? e = e.toArray() : e instanceof HTMLElement ? e = [e] : Array.isArray(e) || (e = [e]);
                e && 0 !== e.length ? e.forEach((e => {
                    e && e.addEventListener("contextmenu", (e => {
                        t(e);
                    }));
                })) : console.error("rightClick(), 找不到元素");
            }
        }

        q(e, t, n, a) {
            let i, r;
            if (e) {
                i = e.clientX - 130;
                r = e.clientY - 120;
            } else {
                i = window.innerWidth / 2 - 120;
                r = window.innerHeight / 2 - 120;
            }
            let s = layer.confirm(t, {
                offset: [r, i],
                title: "提示",
                btn: ["确定", "取消"],
                shade: 0,
                zIndex: 999999991
            }, (function () {
                n();
                layer.close(s);
            }), (function () {
                a && a();
            }));
        }

        getNowStr(e = "-", t = ":", n = null) {
            let a;
            a = n ? new Date(n) : new Date;
            const i = a.getFullYear(), r = String(a.getMonth() + 1).padStart(2, "0"), s = String(a.getDate()).padStart(2, "0"), o = String(a.getHours()).padStart(2, "0"), l = String(a.getMinutes()).padStart(2, "0"), c = String(a.getSeconds()).padStart(2, "0");
            return `${[i, r, s].join(e)} ${[o, l, c].join(t)}`;
        }

        formatDate(e, t = "-", n = ":") {
            let a;
            if (e instanceof Date) a = e; else {
                if ("string" != typeof e) throw new Error("Invalid date input: must be Date object or date string");
                a = new Date(e);
                if (isNaN(a.getTime())) throw new Error("Invalid date string");
            }
            const i = a.getFullYear(), r = String(a.getMonth() + 1).padStart(2, "0"), s = String(a.getDate()).padStart(2, "0"), o = String(a.getHours()).padStart(2, "0"), l = String(a.getMinutes()).padStart(2, "0"), c = String(a.getSeconds()).padStart(2, "0");
            return `${[i, r, s].join(t)} ${[o, l, c].join(n)}`;
        }

        download(e, t) {
            show.info("开始请求下载...");
            const n = t.split(".").pop().toLowerCase();
            let a = this.mimeTypes[n] || "application/octet-stream";
            const i = new Blob([e], {
                type: a
            }), r = URL.createObjectURL(i), s = document.createElement("a");
            s.href = r;
            s.download = t;
            document.body.appendChild(s);
            s.click();
            setTimeout((() => {
                document.body.removeChild(s);
                URL.revokeObjectURL(r);
            }), 100);
        }

        smoothScrollToTop(e = 500) {
            return new Promise((t => {
                const n = performance.now(), a = window.pageYOffset;
                window.requestAnimationFrame((function i(r) {
                    const s = r - n, o = Math.min(s / e, 1), l = o < .5 ? 4 * o * o * o : 1 - Math.pow(-2 * o + 2, 3) / 2;
                    window.scrollTo(0, a * (1 - l));
                    o < 1 ? window.requestAnimationFrame(i) : t();
                }));
            }));
        }

        simpleId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        }

        log(...e) {
            console.groupCollapsed("📌", ...e);
            const t = (new Error).stack.split("\n").slice(2).map((e => e.trim())).filter((e => e.trim()));
            console.log(t.join("\n"));
            console.groupEnd();
        }

        isUrl(e) {
            try {
                new URL(e);
                return !0;
            } catch (t) {
                return !1;
            }
        }

        setHrefParam(e, t) {
            const n = new URL(window.location.href);
            n.searchParams.set(e, t);
            window.history.pushState({}, "", n.toString());
        }

        getResponsiveArea() {
            const e = window.innerWidth;
            return e >= 1920 ? ["60%", "80%"] : e >= 1200 ? ["60%", "85%"] : e >= 768 ? ["70%", "90%"] : ["95%", "95%"];
        }

        isMobile() {
            const e = navigator.userAgent.toLowerCase();
            return ["iphone", "ipod", "ipad", "android", "blackberry", "windows phone", "nokia", "webos", "opera mini", "mobile", "mobi", "tablet"].some((t => e.includes(t)));
        }
    }

    class SeHuaTangStorageManager {
        constructor() {
            __publicField(this, "forage", localforage.createInstance({
                driver: localforage.INDEXEDDB,
                name: "JAV-JHS-SeHuaTang",
                version: 1,
                storeName: "appData"
            }));
            __publicField(this, "article_list_key", "article_list");
            if (SeHuaTangStorageManager.instance) throw new Error("SeHuaTangStorageManager已被实例化过了!");
            SeHuaTangStorageManager.instance = this;
        }

        async saveArticle(e, t, n, a) {
            if (!e) {
                show.error("articleId为空!");
                throw new Error("articleId为空!");
            }
            if (!n) {
                show.error("title为空!");
                throw new Error("title为空!");
            }
            if (!t) {
                show.error("url为空!");
                throw new Error("url为空!");
            }
            t.includes("http") || (t = window.location.origin + t);
            const i = await this.forage.getItem(this.article_list_key) || [];
            let r = i.find((t => t.articleId === e));
            if (r) r.updateDate = utils.getNowStr(); else {
                r = {
                    articleId: e,
                    url: t,
                    status: "",
                    updateDate: utils.getNowStr()
                };
                i.push(r);
            }
            switch (a) {
                case g:
                    if (r.status === g) {
                        const t = `${e} 已在屏蔽列表中`;
                        show.error(t);
                        throw new Error(t);
                    }
                    r.status = g;
                    break;

                case p:
                    if (r.status === p) {
                        const t = `${e} 已在收藏列表中`;
                        show.error(t);
                        throw new Error(t);
                    }
                    r.status = p;
                    break;

                default:
                    const t = "actionType错误";
                    show.error(t);
                    throw new Error(t);
            }
            await this.forage.setItem(this.article_list_key, i);
        }

        async getArticleList() {
            return await this.forage.getItem(this.article_list_key) || [];
        }

        async getArticle(e) {
            return (await this.forage.getItem(this.article_list_key) || []).find((t => t.articleId === e));
        }
    }

    window.utils = new Utils;
    window.http = new class {
        get(e, t = {}, n = {}) {
            return this.jqueryRequest("GET", e, null, t, n);
        }

        post(e, t = {}, n = {}) {
            return this.jqueryRequest("POST", e, t, null, n);
        }

        put(e, t = {}, n = {}) {
            return this.jqueryRequest("PUT", e, t, null, n);
        }

        del(e, t = {}, n = {}) {
            return this.jqueryRequest("DELETE", e, null, t, n);
        }

        jqueryRequest(e, t, n = {}, a = {}, i = {}) {
            "POST" === e && (i = {
                "Content-Type": "application/json",
                ...i
            });
            return new Promise(((r, s) => {
                $.ajax({
                    method: e,
                    url: t,
                    timeout: 1e4,
                    data: "GET" === e || "DELETE" === e ? a : JSON.stringify(n),
                    headers: i,
                    success: (e, t, n) => {
                        var a;
                        if (null == (a = n.getResponseHeader("Content-Type")) ? void 0 : a.includes("application/json")) try {
                            r("object" == typeof e ? e : JSON.parse(e));
                        } catch (i) {
                            r(e);
                        } else r(e);
                    },
                    error: (e, t, n) => {
                        let a = n;
                        if (e.responseText) try {
                            const t = JSON.parse(e.responseText);
                            a = t.message || t.msg || e.responseText;
                        } catch {
                            a = e.responseText;
                        }
                        s(new Error(a));
                    }
                });
            }));
        }
    };
    window.gmHttp = new class {
        get(e, t = {}, n = {}) {
            return this.gmRequest("GET", e, null, t, n);
        }

        post(e, t = {}, n = {}) {
            return this.gmRequest("POST", e, t, null, n);
        }

        put(e, t = {}, n = {}) {
            return this.gmRequest("PUT", e, t, null, n);
        }

        del(e, t = {}, n = {}) {
            return this.gmRequest("DELETE", e, null, t, n);
        }

        gmRequest(e, t, n = {}, a = {}, i = {}) {
            if (("GET" === e || "DELETE" === e) && a && Object.keys(a).length) {
                const e = new URLSearchParams(a).toString();
                t += (t.includes("?") ? "&" : "?") + e;
            }
            "POST" !== e && "PUT" !== e || (i = {
                "Content-Type": "application/json",
                ...i
            });
            return new Promise(((a, r) => {
                GM_xmlhttpRequest({
                    method: e,
                    url: t,
                    headers: i,
                    timeout: 1e4,
                    data: "POST" === e || "PUT" === e ? JSON.stringify(n) : void 0,
                    onload: e => {
                        var t;
                        try {
                            if (e.status >= 200 && e.status < 300) if (e.responseText && (null == (t = e.responseHeaders) ? void 0 : t.toLowerCase().includes("application/json"))) try {
                                a(JSON.parse(e.responseText));
                            } catch (n) {
                                a(e.responseText);
                            } else a(e.responseText || e); else {
                                console.error("请求失败,状态码:", e.status);
                                if (e.responseText) try {
                                    const t = JSON.parse(e.responseText);
                                    r(t);
                                } catch {
                                    r(new Error(e.responseText || `HTTP Error ${e.status}`));
                                } else r(new Error(`HTTP Error ${e.status}`));
                            }
                        } catch (n) {
                            r(n);
                        }
                    },
                    onerror: e => {
                        r(new Error(e.error || "Network Error"));
                    },
                    ontimeout: () => {
                        r(new Error("Request Timeout"));
                    }
                });
            }));
        }
    };
    window.storageManager = new f;
    window.seHuaTangStorageManager = new SeHuaTangStorageManager;
    const b = new BroadcastChannel("channel-refresh");
    window.refresh = function () {
        b.postMessage({
            type: "refresh"
        });
    };
    !function () {
        document.head.insertAdjacentHTML("beforeend", '\n        <style>\n            .loading-container {\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: flex;\n                justify-content: center;\n                align-items: center;\n                background-color: rgba(0, 0, 0, 0.1);\n                z-index: 99999999;\n            }\n    \n            .loading-animation {\n                position: relative;\n                width: 60px;\n                height: 12px;\n                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);\n                border-radius: 6px;\n                animation: loading-animate 1.8s ease-in-out infinite;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            }\n    \n            .loading-animation:before,\n            .loading-animation:after {\n                position: absolute;\n                display: block;\n                content: "";\n                animation: loading-animate 1.8s ease-in-out infinite;\n                height: 12px;\n                border-radius: 6px;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            }\n    \n            .loading-animation:before {\n                top: -20px;\n                left: 10px;\n                width: 40px;\n                background: linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);\n            }\n    \n            .loading-animation:after {\n                bottom: -20px;\n                width: 35px;\n                background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);\n            }\n    \n            @keyframes loading-animate {\n                0% {\n                    transform: translateX(40px);\n                }\n                50% {\n                    transform: translateX(-30px);\n                }\n                100% {\n                    transform: translateX(40px);\n                }\n            }\n        </style>\n    ');
        window.loading = function () {
            const e = document.createElement("div");
            e.className = "loading-container";
            const t = document.createElement("div");
            t.className = "loading-animation";
            e.appendChild(t);
            document.body.appendChild(e);
            return {
                close: () => {
                    e && e.parentNode && e.parentNode.removeChild(e);
                }
            };
        };
    }();
    !function () {
        document.head.insertAdjacentHTML("beforeend", "\n        <style>\n            .data-table {\n                width: 100%;\n                border-collapse: separate;\n                border-spacing: 0;\n                font-family: 'Helvetica Neue', Arial, sans-serif;\n                background: #fff;\n                overflow: hidden;\n                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);\n                margin: 0 auto; /* 表格整体水平居中 */\n            }\n    \n            .data-table thead tr {\n                background: #f8fafc;\n            }\n            \n            /* 表头居中 */\n            .data-table th {\n                padding: 16px 20px;\n                text-align: center !important; /* 表头文字居中 */\n                color: #64748b;\n                font-weight: 500;\n                font-size: 14px;\n                text-transform: uppercase;\n                letter-spacing: 0.5px;\n                border-bottom: 1px solid #e2e8f0;\n            }\n            \n            /* 单元格内容居中 */\n            .data-table td {\n                padding: 14px 20px;\n                color: #334155;\n                font-size: 15px;\n                border-bottom: 1px solid #f1f5f9;\n                text-align: center !important; /* 单元格文字居中 */\n                vertical-align: middle; /* 垂直居中 */\n            }\n            \n            .data-table tbody tr:last-child td {\n                border-bottom: none;\n            }\n            \n            /* 行hover 变色*/\n            .data-table tbody tr {\n                transition: all 0.2s ease;\n            }\n            \n            .data-table tbody tr:hover {\n                background: #f8fafc;\n            }\n            \n            /* 可选：特定列左对齐/右对齐的示例 */\n            .data-table .text-left {\n                text-align: left;\n            }\n            \n            .data-table .text-right {\n                text-align: right;\n            }\n            \n            /* 添加.show-border时显示边框 */\n            .data-table.show-border {\n                border: 1px solid #e2e8f0;\n            }\n            \n            .data-table.show-border th,\n            .data-table.show-border td {\n            border: 1px solid #e2e8f0;\n        }\n        </style>\n    ");
        window.TableGenerator = class {
            constructor(e) {
                this.defaults = {
                    tableClass: "data-table",
                    showBorder: !1,
                    buttons: []
                };
                this.config = {
                    ...this.defaults,
                    ...e
                };
                this.validateConfig() && this.init();
            }

            validateConfig() {
                if (!(this.config.containerId && this.config.columns && Array.isArray(this.config.columns) && Array.isArray(this.config.data))) {
                    console.error("缺少必要参数或参数类型不正确");
                    return !1;
                }
                this.container = document.getElementById(this.config.containerId);
                if (!this.container) {
                    console.error(`未找到ID为${this.config.containerId}的容器`);
                    return !1;
                }
                return !0;
            }

            init() {
                this.container.innerHTML = "";
                this.table = document.createElement("table");
                this.table.className = this.config.showBorder ? `${this.config.tableClass} show-border` : this.config.tableClass;
                this.createHeader();
                this.createBody();
                this.container.appendChild(this.table);
            }

            createHeader() {
                const e = document.createElement("thead"), t = document.createElement("tr");
                this.config.columns.forEach((e => {
                    const n = document.createElement("th");
                    n.textContent = e.title || e.key;
                    e.width && (n.style.width = e.width);
                    e.headerClass && (n.className = e.headerClass);
                    t.appendChild(n);
                }));
                if (this.config.buttons && this.config.buttons.length > 0) {
                    const e = document.createElement("th");
                    e.textContent = "操作";
                    this.config.buttonColumnWidth && (e.style.width = this.config.buttonColumnWidth);
                    t.appendChild(e);
                }
                e.appendChild(t);
                this.table.appendChild(e);
            }

            createBody() {
                const e = document.createElement("tbody");
                0 === this.config.data.length ? this.renderEmptyData(e) : this.renderDataRows(e);
                this.table.appendChild(e);
            }

            renderEmptyData(e) {
                const t = document.createElement("tr"), n = document.createElement("td");
                n.colSpan = this.config.columns.length + (this.config.buttons.length > 0 ? 1 : 0);
                n.textContent = "暂无数据";
                n.style.textAlign = "center";
                t.appendChild(n);
                e.appendChild(t);
            }

            renderDataRows(e) {
                this.config.data.forEach(((t, n) => {
                    const a = document.createElement("tr");
                    this.renderDataCells(a, t, n);
                    this.config.buttons && this.config.buttons.length > 0 && this.renderButtonCells(a, t, n);
                    e.appendChild(a);
                }));
            }

            renderDataCells(e, t, n) {
                this.config.columns.forEach((a => {
                    const i = document.createElement("td");
                    a.render ? i.innerHTML = a.render(t, n) : i.textContent = t[a.key] || "";
                    a.cellClass && (i.className = a.cellClass);
                    e.appendChild(i);
                }));
            }

            renderButtonCells(e, t, n) {
                const a = document.createElement("td");
                this.config.buttons.forEach((e => {
                    const i = document.createElement("a");
                    i.textContent = e.text;
                    i.className = e.class || "a-primary";
                    i.addEventListener("click", (a => {
                        if (e.onClick) {
                            const i = e.onClick.length;
                            3 === i ? e.onClick(a, t, n) : 2 === i ? e.onClick(a, t) : e.onClick(t);
                        }
                    }));
                    a.appendChild(i);
                }));
                e.appendChild(a);
            }

            update(e) {
                this.config.data = e;
                this.init();
            }

            getTableElement() {
                return this.table;
            }
        };
    }();
    !function () {
        const e = (e, t, n, a, i) => {
            let r;
            if ("object" == typeof n) r = n; else {
                r = "object" == typeof a ? a : i || {};
                r.gravity = n || "top";
                r.position = "string" == typeof a ? a : "center";
            }
            r.gravity && "center" !== r.gravity || (r.offset = {
                y: "calc(50vh - 150px)"
            });
            const s = "#60A5FA", o = "#93C5FD", l = "#10B981", c = "#6EE7B7", d = "#EF4444", p = "#FCA5A5", g = {
                borderRadius: "12px",
                color: "white",
                padding: "12px 16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                minWidth: "150px",
                textAlign: "center",
                zIndex: 999999999
            }, h = {
                text: e,
                duration: 2e3,
                close: !1,
                gravity: "top",
                position: "center",
                style: {
                    info: {
                        ...g,
                        background: `linear-gradient(to right, ${s}, ${o})`
                    },
                    success: {
                        ...g,
                        background: `linear-gradient(to right, ${l}, ${c})`
                    },
                    error: {
                        ...g,
                        background: `linear-gradient(to right, ${d}, ${p})`
                    }
                }[t],
                stopOnFocus: !0,
                oldestFirst: !1,
                ...r
            };
            Toastify(h).showToast();
        };
        window.show = {
            ok: (t, n = "center", a, i) => {
                e(t, "success", n, a, i);
            },
            error: (t, n = "center", a, i) => {
                e(t, "error", n, a, i);
            },
            info: (t, n = "center", a, i) => {
                e(t, "info", n, a, i);
            }
        };
    }();

    class PluginManager {
        constructor() {
            this.plugins = new Map;
        }

        register(e) {
            if ("function" != typeof e) throw new Error("插件必须是一个类");
            const t = e.name;
            if (!t) throw new Error("类必须要有名称");
            const n = t.toLowerCase();
            if (this.plugins.has(n)) throw new Error(`插件"${t}"已注册`);
            const a = new e;
            a.pluginManager = this;
            this.plugins.set(n, a);
        }

        getBean(e) {
            return this.plugins.get(e.toLowerCase());
        }

        _getDependencies(e) {
            const t = e.toString();
            return t.slice(t.indexOf("(") + 1, t.indexOf(")")).split(",").map((e => e.trim())).filter((e => e));
        }

        async process() {
            const e = (await Promise.allSettled(Array.from(this.plugins).map((async ([e, t]) => {
                try {
                    if ("function" == typeof t.handle) {
                        const n = await t.initCss();
                        utils.insertStyle(n);
                        await t.handle();
                        return {
                            name: e,
                            status: "fulfilled"
                        };
                    }
                    console.log("加载插件", e);
                } catch (n) {
                    console.error(`插件 ${e} 执行失败`, n);
                    return {
                        name: e,
                        status: "rejected",
                        error: n
                    };
                }
            })))).filter((e => "rejected" === e.status));
            e.length && console.error("以下插件执行失败：", e.map((e => e.name)));
            document.body.classList.add("script-ready");
        }
    }

    class BasePlugin {
        constructor() {
            __publicField(this, "pluginManager", null);
        }

        getBean(e) {
            let t = this.pluginManager.getBean(e);
            if (!t) {
                let t = "容器中不存在: " + e;
                show.error(t);
                throw new Error(t);
            }
            return t;
        }

        async initCss() {
            return "";
        }

        async handle() {
        }

        getPageInfo() {
            let e, t, n, a, i = window.location.href;
            if (l) {
                e = $('a[title="複製番號"]').attr("data-clipboard-text");
                t = i.split("?")[0].split("#")[0];
                n = $(".female").prev().map(((e, t) => $(t).text())).get().join(" ");
                a = $(".male").prev().map(((e, t) => $(t).text())).get().join(" ");
            }
            if (c) {
                t = i.split("?")[0];
                e = t.split("/").filter(Boolean).pop();
                n = $('span[onmouseover*="star_"] a').map(((e, t) => $(t).text())).get().join(" ");
                a = "";
            }
            return {
                carNum: e,
                url: t,
                actress: n,
                actors: a
            };
        }

        getSelector() {
            return l ? r : c ? s : null;
        }

        parseMovieId(e) {
            return e.split("/").pop().split(/[?#]/)[0];
        }
    }

    class DetailPagePlugin extends BasePlugin {
        constructor() {
            super();
        }

        async initCss() {
            return window.isDetailPage && window.location.href.includes("hideNav=1") ? "\n                .main-nav,#search-bar-container {\n                    display: none !important;\n                }\n                \n                html {\n                    padding-top:0px!important;\n                }\n            " : "";
        }

        handle() {
            if (window.isDetailPage) {
                this.checkFilterActor().then();
                $(".video-meta-panel a").attr("target", "_blank");
            }
        }

        async checkFilterActor() {
            if (!window.isDetailPage) return;
            const e = await storageManager.getFilterActorList();
            let t = this.getPageInfo().actors;
            e.forEach((e => {
                if (t.indexOf(e) > -1) {
                    const e = this.getBean("detailPageButtonPlugin");
                    e.answerCount++;
                    utils.q(null, "存在xxx演员, 是否屏蔽?", (() => {
                        e.filterOne(null, !0);
                    }), (() => {
                        e.answerCount = 1;
                    }));
                }
            }));
        }
    }

    class PreviewVideoPlugin extends BasePlugin {
        async initCss() {
            return "\n            .video-control-btn {\n                position: absolute;\n                bottom: 10px;\n                right: 10px;\n                z-index: 99999999999;\n                min-width:100px;\n                padding: 8px 16px;\n                background: rgba(0,0,0,0.7);\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n            }\n            .video-control-btn.active {\n                background-color: #1890ff; /* 选中按钮的背景色 */\n                color: white;             /* 选中按钮的文字颜色 */\n                font-weight: bold;        /* 加粗显示 */\n                border: 2px solid #096dd9; /* 边框样式 */\n            }\n        ";
        }

        handle() {
            let e = $(".preview-video-container");
            e.on("click", (e => {
                utils.loopDetector((() => $(".fancybox-content #preview-video").length > 0), (() => {
                    this.handleVideo().then();
                }));
            }));
            let t = window.location.href;
            (t.includes("gallery-1") || t.includes("gallery-2")) && utils.loopDetector((() => $(".fancybox-content #preview-video").length > 0), (() => {
                $(".fancybox-content #preview-video").length > 0 && this.handleVideo().then();
            }));
            t.includes("autoPlay=1") && e[0].click();
        }

        async handleVideo() {
            const e = $("#preview-video"), t = e.find("source"), n = e.parent();
            if (!e.length || !t.length) return;
            const a = e[0];
            a.muted = !1;
            n.css("position", "relative");
            const i = t.attr("src"), r = ["hhb", "hmb", "mhb", "mmb"], s = r.find((e => i.includes(e))) || "mhb", o = [{
                id: "video-mmb",
                text: "低画质",
                quality: "mmb"
            }, {
                id: "video-mhb",
                text: "中画质",
                quality: "mhb"
            }, {
                id: "video-hmb",
                text: "高画质",
                quality: "hmb"
            }, {
                id: "video-hhb",
                text: "超高清",
                quality: "hhb"
            }];
            const l = `videoQualities_${this.getPageInfo().carNum}`;
            let c = JSON.parse(sessionStorage.getItem(l));
            if (!c) {
                c = (await Promise.all(o.map((async e => {
                    const t = i.replace(new RegExp(r.join("|"), "g"), e.quality);
                    try {
                        return 200 === (await gmHttp.gmRequest("HEAD", t)).status ? e : null;
                    } catch (n) {
                        console.error("画质不可用,跳过", n);
                        return null;
                    }
                })))).filter(Boolean);
                c.length > 0 && sessionStorage.setItem(l, JSON.stringify(c));
            }
            let d = c.map(((e, t) => `\n                <button class="video-control-btn${e.quality === s ? " active" : ""}" \n                        id="${e.id}" \n                        data-quality="${e.quality}"\n                        style="bottom: ${50 * t}px; right: -105px;">\n                    ${e.text}\n                </button>\n            `)).join("");
            d = `<button class="menu-btn" id="speed-btn" style="position: absolute; min-width: 100px; background-color:#76b45d;bottom: ${50 * (c.length + 2)}px; right: -105px;">快进(z)</button>` + d;
            d = `<button class="menu-btn" id="video-filterBtn" style="position: absolute; min-width: 100px; background-color:#de3333;bottom: ${50 * (c.length + 1)}px; right: -105px;">屏蔽(a)</button>` + d;
            d = `<button class="menu-btn" id="video-favoriteBtn" style="position: absolute; min-width: 100px; background-color:#25b1dc;bottom: ${50 * (c.length + 0)}px; right: -105px;">收藏(s)</button>` + d;
            n.append(d);
            const p = n.find(".video-control-btn");
            n.on("click", ".video-control-btn", (async e => {
                const n = $(e.currentTarget), s = n.data("quality");
                if (!n.hasClass("active")) try {
                    const e = i.replace(new RegExp(r.join("|"), "g"), s);
                    t.attr("src", e);
                    a.load();
                    a.muted = !1;
                    await a.play();
                    p.removeClass("active");
                    n.addClass("active");
                } catch (o) {
                    console.error("切换画质失败:", o);
                }
            }));
            $("#speed-btn").on("click", (() => {
                this.getBean("DetailPageButtonPlugin").speedVideo();
            }));
            utils.rightClick($("#speed-btn"), (e => {
                this.getBean("DetailPageButtonPlugin").filterOne(e);
            }));
            $("#video-filterBtn").on("click", (e => {
                this.getBean("DetailPageButtonPlugin").filterOne(e);
            }));
            $("#video-favoriteBtn").on("click", (e => {
                this.getBean("DetailPageButtonPlugin").favoriteOne(e);
            }));
            p.last().trigger("click");
        }
    }

    const w = class _HotkeyManager {
        constructor() {
            if (new.target === _HotkeyManager) throw new Error("HotkeyManager cannot be instantiated.");
        }

        static registerHotkey(e, t, n = null) {
            if (Array.isArray(e)) {
                let a = [];
                e.forEach((e => {
                    if (!this.isHotkeyFormat(e)) throw new Error("快捷键格式错误");
                    let i = this.recordHotkey(e, t, n);
                    a.push(i);
                }));
                return a;
            }
            if (!this.isHotkeyFormat(e)) throw new Error("快捷键格式错误");
            return this.recordHotkey(e, t, n);
        }

        static recordHotkey(e, t, n) {
            let a = Math.random().toString(36).substr(2);
            this.registerHotKeyMap.set(a, {
                hotkeyString: e,
                callback: t,
                keyupCallback: n
            });
            return a;
        }

        static unregisterHotkey(e) {
            this.registerHotKeyMap.has(e) && this.registerHotKeyMap.delete(e);
        }

        static isHotkeyFormat(e) {
            return e.toLowerCase().split("+").map((e => e.trim())).every((e => ["ctrl", "shift", "alt"].includes(e) || 1 === e.length));
        }

        static judgeHotkey(e, t) {
            const n = e.toLowerCase().split("+").map((e => e.trim())), a = n.includes("ctrl"), i = n.includes("shift"), r = n.includes("alt"), s = n.find((e => "ctrl" !== e && "shift" !== e && "alt" !== e));
            return (this.isMac ? t.metaKey : t.ctrlKey) === a && t.shiftKey === i && t.altKey === r && t.key.toLowerCase() === s;
        }
    };
    __publicField(w, "isMac", 0 === navigator.platform.indexOf("Mac"));
    __publicField(w, "registerHotKeyMap", new Map);
    __publicField(w, "handleKeydown", (e => {
        for (const [t, n] of w.registerHotKeyMap) {
            let t = n.hotkeyString, a = n.callback;
            w.judgeHotkey(t, e) && a(e);
        }
    }));
    __publicField(w, "handleKeyup", (e => {
        for (const [t, n] of w.registerHotKeyMap) {
            let t = n.hotkeyString, a = n.keyupCallback;
            a && (w.judgeHotkey(t, e) && a(e));
        }
    }));
    let v = w;
    document.addEventListener("keydown", (e => {
        v.handleKeydown(e);
    }));
    document.addEventListener("keyup", (e => {
        v.handleKeyup(e);
    }));

    class JavTrailersPlugin extends BasePlugin {
        constructor() {
            super();
            this.hasBand = !1;
        }

        handle() {
            let e = window.location.href;
            if (!e.includes("handle=1")) return;
            if ($("h1:contains('Page not found')").length) {
                let t = e.split("?")[0].split("video/")[1].toLowerCase().replace("00", "-");
                window.location.href = "https://javtrailers.com/search/" + t + "?handle=1";
                return;
            }
            let t = $(".videos-list .video-link").toArray();
            if (t.length) {
                const n = e.split("?")[0].split("search/")[1].toLowerCase(), a = t.find((e => $(e).find(".vid-title").text().toLowerCase().includes(n)));
                if (a) {
                    window.location.href = $(a).attr("href") + "?handle=1";
                    return;
                }
            }
            this.handlePlayJavTrailers();
            $("#videoPlayerContainer").on("click", (() => {
                this.handlePlayJavTrailers();
            }));
            window.addEventListener("message", (e => {
                let t = document.getElementById("vjs_video_3_html5_api");
                t && (t.currentTime += 5);
            }));
            v.registerHotkey("z", (() => {
                const e = document.getElementById("vjs_video_3_html5_api");
                e && (e.currentTime += 5);
            }));
            v.registerHotkey("a", (() => window.parent.postMessage("a", "*")));
            v.registerHotkey("s", (() => window.parent.postMessage("s", "*")));
        }

        handlePlayJavTrailers() {
            if (!this.hasBand) {
                utils.loopDetector((() => 0 !== $("#vjs_video_3_html5_api").length), (() => {
                    setTimeout((() => {
                        this.hasBand = !0;
                        let e = document.getElementById("vjs_video_3_html5_api");
                        e.play();
                        e.currentTime = 5;
                        e.addEventListener("timeupdate", (function () {
                            e.currentTime >= 14 && e.currentTime < 16 && (e.currentTime += 2);
                        }));
                        $("#vjs_video_3_html5_api").css({
                            position: "fixed",
                            width: "100vw",
                            height: "100vh",
                            objectFit: "cover",
                            zIndex: "999999999"
                        });
                        $(".vjs-control-bar").css({
                            position: "fixed",
                            bottom: "20px",
                            zIndex: "999999999"
                        });
                    }), 0);
                }));
                utils.loopDetector((() => $("#vjs_video_3 canvas").length > 0), (() => {
                    0 !== $("#vjs_video_3 canvas").length && $("#vjs_video_3 canvas").css({
                        position: "fixed",
                        width: "100vw",
                        height: "100vh",
                        objectFit: "cover",
                        top: "0",
                        right: "0",
                        zIndex: "999999998"
                    });
                }));
            }
        }
    }

    class SubTitleCatPlugin extends BasePlugin {
        handle() {
            $(".t-banner-inner").hide();
            $("#navbar").hide();
            let e = window.location.href.split("=")[1].toLowerCase();
            $(".sub-table tr td a").toArray().forEach((t => {
                let n = $(t);
                n.text().toLowerCase().includes(e) || n.parent().parent().hide();
            }));
        }
    }

    const y = "https://jdforrepam.com/api";

    async function x() {
        const e = Math.floor(Date.now() / 1e3);
        if (e - (await storageManager.getItem(storageManager.review_ts_key) || 0) <= 20) return await storageManager.getItem(storageManager.review_sign_key);
        const t = `${e}.lpw6vgqzsp.${md5(`${e}71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa`)}`;
        await storageManager.setItem(storageManager.review_ts_key, e);
        await storageManager.setItem(storageManager.review_sign_key, t);
        return t;
    }

    const k = async (e, t = 1, n = 20) => {
        let a = `${y}/v1/movies/${e}/reviews`, i = {
            jdSignature: await x()
        };
        return (await http.get(a, {
            page: t,
            sort_by: "hotly",
            limit: n
        }, i)).data.reviews;
    }, _ = async e => {
        let t = `${y}/v4/movies/${e}`, n = {
            jdSignature: await x()
        };
        const a = await http.get(t, null, n);
        if (!a.data) {
            show.error("获取视频详情失败: " + a.message);
            throw new Error(a.message);
        }
        const i = a.data.movie, r = i.preview_images, s = [];
        r.forEach((e => {
            s.push(e.large_url.replace("https://tp-iu.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com"));
        }));
        return {
            movieId: i.id,
            actors: i.actors,
            title: i.origin_title,
            carNum: i.number,
            score: i.score,
            releaseDate: i.release_date,
            watchedCount: i.watched_count,
            imgList: s
        };
    }, P = async (e, t = 1, n = 20) => {
        let a = `${y}/v1/lists/related?movie_id=${e}&page=${t}&limit=${n}`, i = {
            jdSignature: await x()
        };
        const r = await gmHttp.get(a, null, i), s = [];
        r.data.lists.forEach((e => {
            s.push({
                relatedId: e.id,
                name: e.name,
                movieCount: e.movies_count,
                collectionCount: e.collections_count,
                viewCount: e.views_count,
                createTime: utils.formatDate(e.created_at)
            });
        }));
        return s;
    };

    class Fc2Plugin extends BasePlugin {
        handle() {
            let e = "/advanced_search?type=3&score_min=3&d=1";
            $('.navbar-item:contains("FC2")').attr("href", e);
            $('.tabs a:contains("FC2")').attr("href", e);
            if (window.location.href.includes("collection_codes?movieId")) {
                $("section").html("");
                const e = new URLSearchParams(window.location.search);
                let t = e.get("movieId"), n = e.get("carNum"), a = e.get("url");
                t && n && a && this.openFc2Dialog(t, n, a);
            }
        }

        async initCss() {
            return "\n            /* 弹层样式 */\n            .movie-detail-layer .layui-layer-title {\n                font-size: 18px;\n                color: #333;\n                background: #f8f8f8;\n            }\n            \n            \n            /* 容器样式 */\n            .movie-detail-container {\n                display: flex;\n                height: 100%;\n                background: #fff;\n            }\n            \n            .movie-poster-container {\n                flex: 0 0 60%;\n                padding: 15px;\n            }\n            \n            .right-box {\n                flex: 1;\n                padding: 20px;\n                overflow-y: auto;\n            }\n            \n            /* 预告片iframe */\n            .movie-trailer {\n                width: 100%;\n                height: 100%;\n                min-height: 400px;\n                background: #000;\n                border-radius: 4px;\n            }\n            \n            /* 电影信息样式 */\n            .movie-title {\n                font-size: 24px;\n                margin-bottom: 15px;\n                color: #333;\n            }\n            \n            .movie-meta {\n                margin-bottom: 20px;\n                color: #666;\n            }\n            \n            .movie-meta span {\n                margin-right: 15px;\n            }\n            \n            /* 演员列表 */\n            .actor-list {\n                display: flex;\n                flex-wrap: wrap;\n                gap: 8px;\n                margin-top: 10px;\n            }\n            \n            .actor-tag {\n                padding: 4px 12px;\n                background: #f0f0f0;\n                border-radius: 15px;\n                font-size: 12px;\n                color: #555;\n            }\n            \n            /* 图片列表 */\n            .image-list {\n                display: flex;\n                flex-wrap: wrap;\n                gap: 10px;\n                margin-top: 10px;\n            }\n            \n            .movie-image-thumb {\n                width: 120px;\n                height: 80px;\n                object-fit: cover;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: transform 0.3s;\n            }\n            \n            .movie-image-thumb:hover {\n                transform: scale(1.05);\n            }\n            \n            /* 加载中和错误状态 */\n            .search-loading, .movie-error {\n                padding: 40px;\n                text-align: center;\n                color: #999;\n            }\n            \n            .movie-error {\n                color: #f56c6c;\n            }\n            \n            .fancybox-container{\n                z-index:99999999\n             }\n             \n             \n             /* 错误提示样式 */\n            .movie-not-found, .movie-error {\n                text-align: center;\n                padding: 30px;\n                color: #666;\n            }\n            \n            .movie-not-found h3, .movie-error h3 {\n                color: #f56c6c;\n                margin: 15px 0;\n            }\n            \n            .icon-warning, .icon-error {\n                font-size: 50px;\n                color: #e6a23c;\n            }\n            \n            .icon-error {\n                color: #f56c6c;\n            }\n\n        ";
        }

        openFc2Dialog(e, t, n) {
            if (n.includes("123av")) {
                this.getBean("Fc2By123AvPlugin").open123AvFc2Dialog(t, n);
                return;
            }
            layer.open({
                type: 1,
                title: t,
                content: '\n            <div class="movie-detail-container">\n                <div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>\n                <div class="right-box">\n                    <div class="movie-info-container">\n                        <div class="search-loading">加载中...</div>\n                    </div>\n                    <div style="margin: 10px 0">\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:#25b1dc"><span>收藏</span></a>\n                        <a id="filterBtn" class="menu-btn" style="background-color:#de3333"><span>屏蔽</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:#7bc73b"><span>加入已下载</span></a>\n                        <a id="enable-magnets-filter" class="menu-btn" style="background-color:#c2bd4c">\n                            <span id="magnets-span">关闭磁力过滤</span>\n                        </a>\n\n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>字幕 (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>字幕 (迅雷)</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links" style="margin: 0 0.75rem">\n                            <div class="search-loading">加载中...</div>\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n                </div>\n            </div>\n        ',
                area: ["80%", "90%"],
                skin: "movie-detail-layer",
                scrollbar: !1,
                success: (a, i) => {
                    this.loadData(e, t);
                    $("#favoriteBtn").on("click", (async e => {
                        const a = $("#data-actress").text();
                        await storageManager.saveCar(t, n, a, p);
                        window.refresh();
                        layer.closeAll();
                    }));
                    $("#filterBtn").on("click", (e => {
                        utils.q(e, `是否屏蔽${t}?`, (async () => {
                            const e = $("#data-actress").text();
                            await storageManager.saveCar(t, n, e, g);
                            window.refresh();
                            layer.closeAll();
                            window.location.href.includes("collection_codes?movieId") && utils.closePage();
                        }));
                    }));
                    $("#hasDownBtn").on("click", (async e => {
                        const a = $("#data-actress").text();
                        await storageManager.saveCar(t, n, a, h);
                        window.refresh();
                        layer.closeAll();
                    }));
                    $("#enable-magnets-filter").on("click", (e => {
                        let t = $("#magnets-span");
                        const n = this.getBean("HighlightMagnetPlugin");
                        if ("关闭磁力过滤" === t.text()) {
                            n.showAll();
                            t.text("开启磁力过滤");
                        } else {
                            n.handle();
                            t.text("关闭磁力过滤");
                        }
                    }));
                    $("#search-subtitle-btn").on("click", (e => utils.openPage(`https://subtitlecat.com/index.php?search=${t}`, t, !1, e)));
                    $("#xunLeiSubtitleBtn").on("click", (() => this.getBean("DetailPageButtonPlugin").searchXunLeiSubtitle(t)));
                },
                end() {
                    window.location.href.includes("collection_codes?movieId") && utils.closePage();
                }
            });
        }

        loadData(e, t) {
            this.handleVideo(t.replace("FC2-", ""));
            this.handleMovieDetail(e);
            this.handleMagnets(e);
            this.getBean("reviewPlugin").showReview(e, $("#reviews-content")).then();
            this.getBean("RelatedPlugin").showRelated($("#related-content")).then();
        }

        handleMovieDetail(e) {
            _(e).then((e => {
                const t = e.actors || [], n = e.imgList || [];
                let a = "";
                if (t.length > 0) {
                    let e = "";
                    for (let n = 0; n < t.length; n++) {
                        let i = t[n];
                        a += `<span class="actor-tag"><a href="/actors/${i.id}" target="_blank">${i.name}</a></span>`;
                        0 === i.gender && (e += i.name + " ");
                    }
                    $("#data-actress").text(e);
                } else a = '<span class="no-data">暂无演员信息</span>';
                let i = "";
                i = Array.isArray(n) && n.length > 0 ? n.map(((e, t) => `\n                <a href="${e}" data-fancybox="movie-gallery" data-caption="剧照 ${t + 1}">\n                    <img src="${e}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `)).join("") : '<div class="no-data">暂无剧照</div>';
                $(".movie-info-container").html(`\n                <h3 class="movie-title">${e.title || "无标题"}</h3>\n                <div class="movie-meta">\n                    <span>番号: ${e.carNum || "未知"}</span>\n                    <span>年份: ${e.releaseDate || "未知"}</span>\n                    <span>评分: ${e.score || "无"}</span>\n                </div>\n                <div class="movie-actors">\n                    <div class="actor-list">主演: ${a}</div>\n                </div>\n                <div class="movie-gallery" style="margin-top:10px">\n                    <h4>剧照: </h4>\n                    <div class="image-list">${i}</div>\n                </div>\n            `);
            })).catch((e => {
                console.error(e);
                $(".movie-info-container").html(`\n                <div class="movie-error">加载失败: ${e.message}</div>\n            `);
            }));
        }

        handleMagnets(e) {
            (async e => {
                let t = `${y}/v1/movies/${e}/magnets`, n = {
                    jdSignature: await x()
                };
                return (await http.get(t, null, n)).data.magnets;
            })(e).then((e => {
                let t = "";
                if (e.length > 0) for (let n = 0; n < e.length; n++) {
                    let a = e[n], i = "";
                    n % 2 == 0 && (i = "odd");
                    t += `\n                        <div class="item columns is-desktop ${i}">\n                            <div class="magnet-name column is-four-fifths">\n                                <a href="magnet:?xt=urn:btih:${a.hash}" title="右鍵點擊並選擇「複製鏈接地址」">\n                                    <span class="name">${a.name}</span>\n                                    <br>\n                                    <span class="meta">\n                                        ${(a.size / 1024).toFixed(2)}GB, ${a.files_count}個文件 \n                                     </span>\n                                    <br>\n                                    <div class="tags">\n                                        ${a.hd ? '<span class="tag is-primary is-small is-light">高清</span>' : ""}\n                                        ${a.cnsub ? '<span class="tag is-warning is-small is-light">字幕</span>' : ""}\n                                    </div>\n                                </a>\n                            </div>\n                            <div class="buttons column">\n                                <button class="button is-info is-small copy-to-clipboard" data-clipboard-text="magnet:?xt=urn:btih:${a.hash}" type="button">&nbsp;複製&nbsp;</button>\n                            </div>\n                            <div class="date column"><span class="time">${a.created_at}</span></div>\n                        </div>\n                    `;
                } else t = '<span class="no-data">暂无磁力信息</span>';
                $("#magnets-content").html(t);
                this.getBean("HighlightMagnetPlugin").handleDb();
            })).catch((e => {
                console.error(e);
                $("#magnets-content").html(`\n                <div class="movie-error">加载失败: ${e.message}</div>\n            `);
            }));
        }

        async handleVideo(e) {
            const t = this.getBean("Fc2By123AvPlugin");
            let n = loading();
            try {
                const n = [`${t.baseUrl}/dm3/v/fc2-ppv-${e}`, `${t.baseUrl}/v/fc2-ppv-${e}`, `${t.baseUrl}/dm1/v/fc2-ppv-${e}`];
                let i = !1;
                for (const e of n) try {
                    const {id: n, moviePoster: a} = await t.get123AvVideoInfo(e), r = await t.getMovie(n, a);
                    if (r) {
                        $(".movie-trailer").attr("src", r);
                        i = !0;
                        break;
                    }
                } catch (a) {
                    console.log("尝试失败:", e, a.message);
                }
                if (!i) throw new Error("所有地址尝试失败");
            } catch (a) {
                console.error(a);
                $(".movie-poster-container").html(`\n                <div class="movie-not-found">\n                    <i class="icon-warning"></i>\n                    <h3>未找到相关视频信息</h3>\n                    <p>123Av 中没有找到与当前番号相关的影片信息</p>\n                    <p style="margin:20px">请尝试以下网站</p>\n                    <p><a class="menu-btn" style="background:linear-gradient(to right, #d29494, rgb(254,98,142))" href="https://missav.ws/dm3/fc2-ppv-${e}" target="_blank">missav</a></p>\n                </div>\n            `);
                $(".movie-trailer").hide();
            } finally {
                n.close();
            }
        }

        async openFc2Page(e, t, n) {
            let a = await storageManager.getSetting("javDbUrl", "https://javdb.com");
            window.open(`${a}/users/collection_codes?movieId=${e}&carNum=${t}&url=${n}`);
        }
    }

    class FoldCategoryPlugin extends BasePlugin {
        async handle() {
            if (!window.isListPage) return;
            let e, t = $(".tabs ul");
            if (t.length > 0) {
                e = $("#tags");
                let n = $("#tags dl div.tag.is-info").map((function () {
                    return $(this).text().replaceAll("\n", "").replaceAll(" ", "");
                })).get().join(" ");
                if (!n) return;
                t.append('\n                <li class="is-active" id="foldCategoryBtn">\n                    <a class="menu-btn" style="background-color:#d23e60 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                        <span></span>\n                        <i style="margin-left: 10px"></i>\n                    </a>\n                </li>\n            ');
                $(".tabs").append(`<div style="padding-top:10px"><span>已选分类: ${n}</span></div>`);
            }
            let n = $("h2.section-title");
            if (n.length > 0) {
                n.append('\n                <div id="foldCategoryBtn">\n                    <a class="menu-btn" style="background-color:#d23e60 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                        <span></span>\n                        <i style="margin-left: 10px"></i>\n                    </a>\n                </div>\n            ');
                e = $("section > div > div.box");
            }
            if (!e) return;
            let a = $("#foldCategoryBtn"), i = "yes" === await storageManager.getItem(storageManager.fold_category_key), [r, s] = i ? ["展开", "icon-angle-double-down"] : ["折叠", "icon-angle-double-up"];
            a.find("span").text(r).end().find("i").attr("class", s);
            window.location.href.includes("noFold=1") || e[i ? "hide" : "show"]();
            a.on("click", (async t => {
                t.preventDefault();
                i = !i;
                await storageManager.setItem(storageManager.fold_category_key, i ? "yes" : "no");
                const [n, r] = i ? ["展开", "icon-angle-double-down"] : ["折叠", "icon-angle-double-up"];
                a.find("span").text(n).end().find("i").attr("class", r);
                e[i ? "hide" : "show"]();
            }));
        }
    }

    class ActressInfoPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "apiUrl", "https://ja.wikipedia.org/wiki/");
        }

        handle() {
            this.handleDetailPage().then();
            this.handleStarPage().then();
        }

        async initCss() {
            return "\n            <style>\n                .info-tag {\n                    background-color: #ecf5ff;\n                    display: inline-block;\n                    height: 32px;\n                    padding: 0 10px;\n                    line-height: 30px;\n                    font-size: 12px;\n                    color: #409eff;\n                    border: 1px solid #d9ecff;\n                    border-radius: 4px;\n                    box-sizing: border-box;\n                    white-space: nowrap;\n                }\n            </style>\n        ";
        }

        async handleDetailPage() {
            let e = $(".female").prev().map(((e, t) => $(t).text().trim())).get();
            if (!e.length) return;
            let t = null, n = "";
            for (let i = 0; i < e.length; i++) {
                let r = e[i];
                t = await storageManager.getItem(storageManager.actress_prefix_key + r);
                if (!t) try {
                    t = await this.searchInfo(r);
                    t && await storageManager.setItem(storageManager.actress_prefix_key + r, t, u);
                } catch (a) {
                    console.error("该名称查询失败,尝试其它名称");
                }
                let s = "";
                s = t ? `\n                    <div class="panel-block">\n                        <strong>${r}:</strong>\n                        <a href="${t.url}" style="margin-left: 5px" target="_blank">\n                            <span class="info-tag">${t.birthday} ${t.age}</span>\n                            <span class="info-tag">${t.height} ${t.weight}</span>\n                            <span class="info-tag">${t.threeSizeText} ${t.braSize}</span>\n                        </a>\n                    </div>\n                ` : `<div class="panel-block"><a href="${this.apiUrl + r}" target="_blank"><strong>${r}:</strong></a></div> `;
                n += s;
            }
            $('strong:contains("演員")').parent().after(n);
        }

        async handleStarPage() {
            let e = [], t = $(".actor-section-name");
            t.length && t.text().trim().split(",").forEach((t => {
                e.push(t.trim());
            }));
            let n = $(".section-meta:not(:contains('影片'))");
            n.length && n.text().trim().split(",").forEach((t => {
                e.push(t.trim());
            }));
            if (!e.length) return;
            let a = null;
            for (let s = 0; s < e.length; s++) {
                let t = e[s];
                a = await storageManager.getItem(storageManager.actress_prefix_key + t);
                if (a) break;
                try {
                    a = await this.searchInfo(t);
                } catch (r) {
                    console.error("该名称查询失败,尝试其它名称");
                }
                if (a) break;
            }
            a && e.forEach((e => {
                storageManager.setItem(storageManager.actress_prefix_key + e, a, u);
            }));
            let i = '<div style="font-size: 17px; font-weight: normal; margin-top: 5px;">无此相关演员信息</div>';
            a && (i = `\n                <a href="${a.url}" target="_blank">\n                    <div style="font-size: 17px; font-weight: normal; margin-top: 5px;">\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">出生日期: ${a.birthday}</span>\n                            <span style="width: 200px;">年龄: ${a.age}</span>\n                            <span style="width: 200px;">身高: ${a.height}</span>\n                        </div>\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">体重: ${a.weight}</span>\n                            <span style="width: 200px;">三围: ${a.threeSizeText}</span>\n                            <span style="width: 200px;">罩杯: ${a.braSize}</span>\n                        </div>\n                    </div>\n                </a>\n            `);
            t.parent().append(i);
        }

        async searchInfo(e) {
            "三上悠亞" === e && (e = "三上悠亜");
            let t = this.apiUrl + e;
            const n = await gmHttp.get(t), a = new DOMParser, i = $(a.parseFromString(n, "text/html"));
            let r = i.find('a[title="誕生日"]').parent().parent().find("td").text().trim(), s = i.find("th:contains('現年齢')").parent().find("td").text().trim() ? parseInt(i.find("th:contains('現年齢')").parent().find("td").text().trim()) + "岁" : "", o = i.find('tr:has(a[title="身長"]) td').text().trim().split(" ")[0] + "cm", l = i.find('tr:has(a[title="体重"]) td').text().trim().split("/")[1].trim();
            "― kg" === l && (l = "");
            return {
                birthday: r,
                age: s,
                height: o,
                weight: l,
                threeSizeText: i.find('a[title="スリーサイズ"]').closest("tr").find("td").text().replace("cm", "").trim(),
                braSize: i.find('th:contains("ブラサイズ")').next("td").contents().first().text().trim(),
                url: t
            };
        }
    }

    class AliyunPanPlugin extends BasePlugin {
        handle() {
            $("body").append('<a class="a-success" id="refresh-token-btn" style="position:fixed; right: 0; top:50%;z-index:99999">获取refresh_token</a>');
            $("#refresh-token-btn").on("click", (e => {
                let t = localStorage.getItem("token");
                if (!t) {
                    alert("请先登录!");
                    return;
                }
                let n = JSON.parse(t).refresh_token;
                navigator.clipboard.writeText(n).then((() => {
                    alert("已复制到剪切板 如失败, 请手动复制: " + n);
                })).catch((e => {
                    console.error("Failed to copy refresh token: ", e);
                }));
            }));
        }
    }

    class HitShowPlugin extends BasePlugin {
        constructor() {
            super();
        }

        handle() {
            $('a[href*="rankings/playback"]').on("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = "/?handlePlayback=1&period=daily";
            }));
            this.handlePlayback().then();
        }

        async handlePlayback() {
            if (!window.location.href.includes("handlePlayback=1")) return;
            let e = new URLSearchParams(window.location.search).get("period");
            this.toolBar(e);
            let t = $(".movie-list");
            t.html("");
            let n = loading();
            try {
                const n = await (async (e = "daily", t = "high_score") => {
                    let n = `${y}/v1/rankings/playback?period=${e}&filter_by=${t}`, a = {
                        jdSignature: await x()
                    };
                    return (await http.get(n, null, a)).data.movies;
                })(e);
                let a = this.markDataListHtml(n);
                t.html(a);
                window.refresh();
                this.loadScore(n);
            } finally {
                n.close();
            }
        }

        toolBar(e) {
            $(".pagination").remove();
            $(".main-tabs ul li").removeClass("is-active");
            $(".main-tabs ul li:first").addClass("is-active");
            let t = `\n            <div class="button-group" style="margin-top:18px">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small ${"daily" === e ? "is-info" : ""}" href="/?handlePlayback=1&period=daily">日榜</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"weekly" === e ? "is-info" : ""}" href="/?handlePlayback=1&period=weekly">周榜</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"monthly" === e ? "is-info" : ""}" href="/?handlePlayback=1&period=monthly">月榜</a>\n                </div>\n            </div>\n        `;
            $(".toolbar").html(t);
        }

        getStarRating(e) {
            let t = "";
            const n = Math.floor(e);
            for (let a = 0; a < n; a++) t += '<i class="icon-star"></i>';
            for (let a = 0; a < 5 - n; a++) t += '<i class="icon-star gray"></i>';
            return t;
        }

        loadScore(e) {
            if (0 === e.length) return;
            (async () => {
                const t = [];
                for (const a of e) try {
                    const e = a.id;
                    if ($(`#${e}`).is(":hidden")) continue;
                    const t = await storageManager.getItem(storageManager.score_prefix_key + e);
                    if (t) {
                        this.appendScoreHtml(e, t);
                        continue;
                    }
                    for (; !document.hasFocus();) await new Promise((e => setTimeout(e, 500)));
                    const n = await _(e);
                    let i = n.score, r = n.watchedCount, s = `\n                        <span class="value">\n                            <span class="score-stars">${this.getStarRating(i)}</span> \n                            &nbsp; ${i}分，由${r}人評價\n                        </span>\n                    `;
                    this.appendScoreHtml(e, s);
                    await storageManager.setItem(storageManager.score_prefix_key + e, s, 6048e5);
                    await new Promise((e => setTimeout(e, 1e3)));
                } catch (n) {
                    t.push({
                        carNum: a.number,
                        error: n.message,
                        stack: n.stack
                    });
                    console.error(`🚨 解析评分数据失败 | 编号: ${a.number}\n`, `错误详情: ${n.message}\n`, n.stack ? `调用栈:\n${n.stack}` : "");
                }
                if (t.length > 0) {
                    show.error("解析评分数据失败, 个数:", t.length);
                    console.table(t);
                }
            })();
        }

        appendScoreHtml(e, t) {
            let n = $(`#score_${e}`);
            "" === n.html().trim() && n.slideUp(0, (function () {
                $(this).html(t).slideDown(500);
            }));
        }

        markDataListHtml(e) {
            let t = "";
            e.forEach((e => {
                t += `\n                <div class="item" id="${e.id}">\n                    <a href="/v/${e.id}" class="box" title="${e.origin_title}">\n                        <div class="cover ">\n                            <img loading="lazy" src="${e.cover_url.replace("https://tp-iu.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com")}" alt="">\n                        </div>\n                        <div class="video-title"><strong>${e.number}</strong> ${e.origin_title}</div>\n                        <div class="score" id="score_${e.id}">\n                        </div>\n                        <div class="meta">\n                            ${e.release_date}\n                        </div>\n                        <div class="tags has-addons">\n                           ${e.has_cnsub ? '<span class="tag is-warning">含中字磁鏈</span>' : e.magnets_count > 0 ? '<span class="tag is-success">含磁鏈</span>' : '<span class="tag is-info">无磁鏈</span>'}\n                           ${e.new_magnets ? '<span class="tag is-info">今日新種</span>' : ""}\n                        </div>\n                    </a>\n                </div>\n            `;
            }));
            return t;
        }
    }

    class TOP250Plugin extends BasePlugin {
        constructor() {
            super();
            __publicField(this, "has_cnsub", "");
            __publicField(this, "movies", []);
        }

        handle() {
            $('.main-tabs ul li:contains("猜你喜歡")').html('<a href="/rankings/top"><span>Top250</span></a>');
            $('a[href*="rankings/top"]').on("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                const t = $(e.target), n = (t.is("a") ? t : t.closest("a")).attr("href");
                let a = n.includes("?") ? n.split("?")[1] : n;
                const i = new URLSearchParams(a);
                this.checkLogin(e, i);
            }));
            this.handleTop().then();
        }

        async handleTop() {
            if (!window.location.href.includes("handleTop=1")) return;
            const e = new URLSearchParams(window.location.search);
            let t = e.get("type") || "all", n = e.get("type_value") || "";
            this.has_cnsub = e.get("has_cnsub") || "";
            let a = e.get("page") || 1;
            this.toolBar(t, n, a);
            let i = $(".movie-list");
            i.html("");
            let r = loading();
            try {
                const e = await (async (e = "all", t = "", n = 1, a = 40) => {
                    let i = `${y}/v1/movies/top?start_rank=1&type=${e}&type_value=${t}&ignore_watched=false&page=${n}&limit=${a}`, r = {
                        "user-agent": "Dart/3.5 (dart:io)",
                        "accept-language": "zh-TW",
                        host: "jdforrepam.com",
                        authorization: "Bearer " + await storageManager.getItem("appAuthorization"),
                        jdsignature: await x()
                    };
                    return await gmHttp.get(i, null, r);
                })(t, n, a, 50);
                let r = e.success, s = e.message, o = e.action;
                if (1 === r) {
                    let t = e.data.movies;
                    if (0 === t.length) {
                        show.error("无数据");
                        return;
                    }
                    this.movies = t;
                    const n = this.getBean("hitShowPlugin");
                    let a = n.markDataListHtml(t);
                    i.html(a);
                    window.refresh();
                    if ("1" === this.has_cnsub) {
                        $(".item:contains('含中字磁鏈')").show();
                        $(".item:contains('含磁鏈')").hide();
                    } else if ("0" === this.has_cnsub) {
                        $(".item:contains('含中字磁鏈')").hide();
                        $(".item:contains('含磁鏈')").show();
                    } else {
                        $(".item:contains('含中字磁鏈')").show();
                        $(".item:contains('含磁鏈')").show();
                    }
                    n.loadScore(t);
                } else {
                    console.error(e);
                    i.html(`<h3>${s}</h3>`);
                    show.error(s);
                }
                if ("JWTVerificationError" === o) {
                    await storageManager.removeItem("appAuthorization");
                    await this.checkLogin(null, new URLSearchParams(window.location.search));
                }
            } catch (s) {
                console.error("获取Top数据失败:", s);
                show.error(`获取Top数据失败: ${s ? s.message : s}`);
            } finally {
                r.close();
            }
        }

        toolBar(e, t, n) {
            $(".main-tabs ul li").removeClass("is-active");
            $(".main-tabs ul li:eq(1)").addClass("is-active");
            if ("5" === n.toString()) {
                $("#auto-page").remove();
                $(".pagination-next").remove();
            }
            $(".pagination-ellipsis").closest("li").remove();
            $(".pagination-list li a").each((function () {
                parseInt($(this).text()) > 5 && $(this).closest("li").remove();
            }));
            let a = "";
            for (let r = (new Date).getFullYear(); r >= 2008; r--) a += `\n                <a style="padding:18px 18px !important;" \n                   class="button is-small ${t === r.toString() ? "is-info" : ""}" \n                   href="/?handleTop=1&type=year&type_value=${r}&has_cnsub=${this.has_cnsub}">\n                  ${r}\n                </a>\n            `;
            let i = `\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox" style="margin-bottom: 0!important;">\n                    <a style="padding:18px 18px !important;" class="button is-small ${"all" === e ? "is-info" : ""}" href="/?handleTop=1&type=all&type_value=&has_cnsub=${this.has_cnsub}">全部</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"0" === t ? "is-info" : ""}" href="/?handleTop=1&type=video_type&type_value=0&has_cnsub=${this.has_cnsub}">有码</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"1" === t ? "is-info" : ""}" href="/?handleTop=1&type=video_type&type_value=1&has_cnsub=${this.has_cnsub}">无码</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"2" === t ? "is-info" : ""}" href="/?handleTop=1&type=video_type&type_value=2&has_cnsub=${this.has_cnsub}">欧美</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"3" === t ? "is-info" : ""}" href="/?handleTop=1&type=video_type&type_value=3&has_cnsub=${this.has_cnsub}">Fc2</a>\n                    \n                    <a style="padding:18px 18px !important;margin-left: 50px" class="button is-small ${"1" === this.has_cnsub ? "is-info" : ""}" data-cnsub-value="1">含中字磁鏈</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"0" === this.has_cnsub ? "is-info" : ""}" data-cnsub-value="0">无字幕</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-cnsub-value="">重置</a>\n                </div>\n                \n                <div class="buttons has-addons" id="conditionBox">\n                    ${a}\n                </div>\n            </div>\n        `;
            $(".toolbar").html(i);
            $("a[data-cnsub-value]").on("click", (e => {
                const t = $(e.currentTarget).data("cnsub-value");
                this.has_cnsub = t.toString();
                $("a[data-cnsub-value]").removeClass("is-info");
                $(e.currentTarget).addClass("is-info");
                $(".toolbar a.button").not("[data-cnsub-value]").each(((e, n) => {
                    const a = $(n), i = new URL(a.attr("href"), window.location.origin);
                    i.searchParams.set("has_cnsub", t);
                    a.attr("href", i.toString());
                }));
                const n = new URL(window.location.href);
                n.searchParams.set("has_cnsub", t);
                history.pushState({}, "", n.toString());
                if ("1" === this.has_cnsub) {
                    $(".item:contains('含中字磁鏈')").show();
                    $(".item:contains('含磁鏈')").hide();
                } else if ("0" === this.has_cnsub) {
                    $(".item:contains('含中字磁鏈')").hide();
                    $(".item:contains('含磁鏈')").show();
                } else {
                    $(".item:contains('含中字磁鏈')").show();
                    $(".item:contains('含磁鏈')").show();
                }
                this.getBean("hitShowPlugin").loadScore(this.movies);
            }));
        }

        async checkLogin(e, t) {
            if (!(await storageManager.getItem("appAuthorization"))) {
                show.error("未登录手机端接口, 无法查看");
                this.openLoginDialog();
                return;
            }
            let n = "all", a = "", i = t.get("t") || "";
            if (/^y\d+$/.test(i)) {
                n = "year";
                a = i.substring(1);
            } else if ("" !== i) {
                n = "video_type";
                a = i;
            }
            let r = `/?handleTop=1&type=${n}&type_value=${a}`;
            e && (e.ctrlKey || e.metaKey) ? window.open(r, "_blank") : window.location.href = r;
        }

        openLoginDialog() {
            layer.open({
                type: 1,
                title: "JavDB",
                closeBtn: 1,
                area: ["360px", "auto"],
                shadeClose: !1,
                content: '\n                <div style="padding: 30px; font-family: \'Helvetica Neue\', Arial, sans-serif;">\n                    <div style="margin-bottom: 25px;">\n                        <input type="text" id="username" name="username" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="用户名 | 邮箱"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <div style="margin-bottom: 15px;">\n                        <input type="password" id="password" name="password" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="密码"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <button id="loginBtn" \n                            style="width: 100%; padding: 12px; background: #4a8bfc; color: white; \n                                   border: none; border-radius: 4px; font-size: 15px; cursor: pointer;\n                                   transition: background 0.3s;"\n                            onmouseover="this.style.background=\'#3a7be0\'"\n                            onmouseout="this.style.background=\'#4a8bfc\'">\n                        登录\n                    </button>\n                </div>\n            ',
                success: (e, t) => {
                    $("#loginBtn").click((function () {
                        const e = $("#username").val(), n = $("#password").val();
                        if (!e || !n) {
                            show.error("请输入用户名和密码");
                            return;
                        }
                        let a = loading();
                        (async (e, t) => {
                            let n = `${y}//v1/sessions?username=${e}&password=${t}&device_uuid=04b9534d-5118-53de-9f87-2ddded77111e&device_name=iPhone&device_model=iPhone&platform=ios&system_version=17.4&app_version=official&app_version_number=1.9.29&app_channel=official`, a = {
                                "user-agent": "Dart/3.5 (dart:io)",
                                "accept-language": "zh-TW",
                                "content-type": "multipart/form-data; boundary=--dio-boundary-2210433284",
                                jdsignature: await x()
                            };
                            return await gmHttp.post(n, null, a);
                        })(e, n).then((async e => {
                            let n = e.success;
                            if (0 === n) show.error(e.message); else {
                                if (1 !== n) {
                                    console.error("登录失败", e);
                                    throw new Error(e.message);
                                }
                                {
                                    let n = e.data.token;
                                    await storageManager.setItem("appAuthorization", n);
                                    await storageManager.setItem("appUser", e.data);
                                    show.ok("登录成功");
                                    layer.close(t);
                                    window.location.href = "/?handleTop=1&period=daily";
                                }
                            }
                        })).catch((e => {
                            console.error("登录异常:", e);
                            show.error(e.message);
                        })).finally((() => {
                            a.close();
                        }));
                    }));
                }
            });
        }
    }

    class NavBarPlugin extends BasePlugin {
        handle() {
            this.margeNav();
            this.hookSearch();
            this.hookOldSearch();
            this.toggleOtherNavItem();
            $(window).resize(this.toggleOtherNavItem);
            if (window.location.href.includes("/search?q")) {
                const e = new URLSearchParams(window.location.search);
                let t = e.get("q"), n = e.get("f");
                $("#search-keyword").val(t);
                $("#search-type").val(n);
            }
        }

        hookSearch() {
            $("#navbar-menu-hero").after('\n            <div class="navbar-menu" id="search-box">\n                <div class="navbar-start" style="display: flex; align-items: center; gap: 5px;">\n                    <select id="search-type" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; background-color: #333; color: #eee; font-size: 14px; outline: none;">\n                        <option value="all">影片</option>\n                        <option value="actor">演員</option>\n                        <option value="series">系列</option>\n                        <option value="maker">片商</option>\n                        <option value="director">導演</option>\n                        <option value="code">番號</option>\n                        <option value="list">清單</option>\n                    </select>\n                    <input id="search-keyword" type="text" placeholder="輸入影片番號，演員名等關鍵字進行檢索" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; flex-grow: 1; font-size: 14px; background-color: #333; color: #eee; outline: none;">\n                    <a href="/advanced_search?noFold=1" title="進階檢索" style="padding: 6px 12px; background-color: #444; border-radius: 4px; text-decoration: none; color: #ddd; font-size: 14px; border: 1px solid #555;"><span>...</span></a>\n                    <a id="search-img-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">识图</a>\n                    <a id="search-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">檢索</a>\n                </div>\n            </div>\n        ');
            $("#search-keyword").on("paste", (e => {
                setTimeout((() => {
                    $("#search-btn").click();
                }), 0);
            })).on("keypress", (e => {
                "Enter" === e.key && setTimeout((() => {
                    $("#search-btn").click();
                }), 0);
            }));
            $("#search-btn").on("click", (e => {
                let t = $("#search-keyword").val(), n = $("#search-type option:selected").val();
                "" !== t && (window.location.href.includes("/search?q") ? window.location.href = "/search?q=" + t + "&f=" + n : window.open("/search?q=" + t + "&f=" + n));
            }));
            $("#search-img-btn").on("click", (() => {
                this.getBean("SearchByImagePlugin").open();
            }));
        }

        hookOldSearch() {
            const e = document.querySelector(".search-image");
            if (!e) return;
            const t = e.cloneNode(!0);
            e.parentNode.replaceChild(t, e);
            $("#button-search-image").attr("data-tooltip", "以图识图");
            $(".search-image").on("click", (e => {
                this.getBean("SearchByImagePlugin").open();
            }));
        }

        margeNav() {
            $('a[href*="/feedbacks/new"]').remove();
            $('a[href*="theporndude.com"]').remove();
            $('a.navbar-link[href="/makers"]').parent().after('\n            <div class="navbar-item has-dropdown is-hoverable">\n                <a class="navbar-link">其它</a>\n                <div class="navbar-dropdown is-boxed">\n                  <a class="navbar-item" href="/feedbacks/new" target="_blank" >反饋</a>\n                  <a class="navbar-item" rel="nofollow noopener" target="_blank" href="https://theporndude.com/zh">ThePornDude</a>\n                </div>\n              </div>\n        ');
        }

        toggleOtherNavItem() {
            let e = $("#search-box"), t = $("#search-bar-container");
            if ($(window).width() < 1600 && $(window).width() > 1023) {
                e.hide();
                t.show();
            }
            if ($(window).width() > 1600) {
                e.show();
                t.hide();
            }
        }
    }

    class OtherSitePlugin extends BasePlugin {
        handle() {
            let e = this.getPageInfo().carNum, t = `\n            <div style="margin-top:20px;margin-left: -16px;">\n                <div style="display: flex;gap: 5px">\n                    <a id="javTrailersBtn" class="menu-btn" style="background:linear-gradient(to right, #d7ab91, rgb(255,76,76))"><span>JavTrailers</span></a>\n                    <a href="https://jable.tv/videos/${e}/" target="_blank" class="menu-btn" style="background:linear-gradient(to right, rgb(255,161,0), rgb(0,119,172))"><span>Jable</span></a>\n                    <a href="https://missav.ws/search/${e}" target="_blank" class="menu-btn" style="background:linear-gradient(to right, #d29494, rgb(254,98,142))"><span>MissAv</span></a>\n                    <a href="https://www.av.gl/vod/search.html?wd=${e}" target="_blank" class="menu-btn" style="color:#f40 !important;background:linear-gradient(to bottom, rgb(238,164,238), #fff)"><span>Avgle</span></a>\n                </div>\n            </div>\n        `;
            $(".column-video-cover").append(t);
            $("#javTrailersBtn").on("click", (t => utils.openPage(`https://javtrailers.com/video/${e.toLowerCase().replace("-", "00")}?handle=1`, e, !1, t)));
        }
    }

    class BusDetailPagePlugin extends BasePlugin {
        async initCss() {
            if (!window.isDetailPage) return "";
            $("h4:contains('論壇熱帖')").hide();
            $("h4:contains('同類影片')").hide();
            $("h4:contains('推薦')").hide();
            return window.location.href.includes("hideNav=1") ? "\n                .navbar-default {\n                    display: none !important;\n                }\n                body {\n                    padding-top:0px!important;\n                }\n            " : "";
        }

        async handle() {
            if (window.location.href.includes("/star/")) {
                const e = $(".avatar-box");
                if (e.length > 0) {
                    let t = e.parent();
                    t.css("position", "initial");
                    t.insertBefore(t.parent());
                }
            }
        }
    }

    class DetailPageButtonPlugin extends BasePlugin {
        constructor() {
            super();
            this.answerCount = 1;
        }

        handle() {
            this.bindHotkey();
            this.hideVideoControls();
            window.isDetailPage && this.createMenuBtn();
        }

        createMenuBtn() {
            const e = this.getPageInfo(), t = e.carNum,
                n = '\n            <div style="margin: 10px auto;">\n                <a id="filterBtn" class="menu-btn" style="background-color:#de3333">\n                    <span>屏蔽(a)</span>\n                </a>\n                <a id="favoriteBtn" class="menu-btn" style="background-color:#25b1dc">\n                    <span>收藏(s)</span>\n                </a>\n                <a id="hasDownBtn" class="menu-btn" style="background-color:#7bc73b">\n                    <span>加入已下载</span>\n                </a>\n\n                <a id="enable-magnets-filter" class="menu-btn" style="background-color:#c2bd4c">\n                    <span id="magnets-span">关闭磁力过滤</span>\n                </a>\n                \n\n                <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                    <span>字幕 (SubTitleCat)</span>\n                </a>\n                <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                    <span>字幕 (迅雷)</span>\n                </a>\n                <a id="magnetSearchBtn" class="menu-btn fr-btn" style="background:linear-gradient(to right, rgb(245,140,1), rgb(84,161,29))">\n                    <span>磁力搜索</span>\n                </a>\n            </div>\n        ';
            l && $(".tabs").after(n);
            c && $("#mag-submit-show").before(n);
            $("#favoriteBtn").on("click", (() => this.favoriteOne()));
            $("#filterBtn").on("click", (e => this.filterOne(e)));
            $("#hasDownBtn").on("click", (async () => {
                await storageManager.saveCar(e.carNum, e.url, e.actress, h);
                window.refresh();
                show.ok("操作成功", {
                    duration: 50,
                    callback: () => {
                        utils.closePage();
                    }
                });
            }));
            $("#magnetSearchBtn").on("click", (() => {
                let t = this.getBean("MagnetHubPlugin").createMagnetHub(e.carNum);
                layer.open({
                    type: 1,
                    title: "磁力搜索",
                    content: '<div id="magnetHubBox"></div>',
                    area: utils.getResponsiveArea(),
                    scrollbar: !1,
                    success: () => {
                        $("#magnetHubBox").append(t);
                    }
                });
            }));
            $("#enable-magnets-filter").on("click", (e => {
                let t = $("#magnets-span");
                const n = this.getBean("HighlightMagnetPlugin");
                if ("关闭磁力过滤" === t.text()) {
                    n.showAll();
                    t.text("开启磁力过滤");
                } else {
                    n.handle();
                    t.text("关闭磁力过滤");
                }
            }));
            $("#search-subtitle-btn").on("click", (e => utils.openPage(`https://subtitlecat.com/index.php?search=${t}`, t, !1, e)));
            $("#xunLeiSubtitleBtn").on("click", (() => this.searchXunLeiSubtitle(t)));
            this.showStatus(t).then();
        }

        async showStatus(e) {
            let t = await storageManager.getCar(e);
            if (t) switch (t.status) {
                case g:
                    $("#filterBtn").text("已屏蔽(a)");
                    break;

                case p:
                    $("#favoriteBtn").text("已收藏(s)");
                    break;

                case h:
                    $("#hasDownBtn").text("已加入已下载");
            }
        }

        async favoriteOne() {
            let e = this.getPageInfo();
            await storageManager.saveCar(e.carNum, e.url, e.actress, p);
            window.refresh();
            show.ok("操作成功", {
                duration: 50,
                callback: () => {
                    utils.closePage();
                }
            });
        }

        searchXunLeiSubtitle(e) {
            let t = loading();
            gmHttp.get(`https://api-shoulei-ssl.xunlei.com/oracle/subtitle?gcid=&cid=&name=${e}`).then((t => {
                let n = t.data;
                n && 0 !== n.length ? layer.open({
                    type: 1,
                    title: "迅雷字幕",
                    content: '<div id="table-container"></div>',
                    area: ["50%", "70%"],
                    success: t => {
                        new TableGenerator({
                            containerId: "table-container",
                            columns: [{
                                key: "name",
                                title: "文件名"
                            }, {
                                key: "ext",
                                title: "类型"
                            }, {
                                key: "extra_name",
                                title: "来源"
                            }],
                            data: n,
                            buttons: [{
                                text: "预览",
                                class: "a-primary",
                                onClick: t => {
                                    let n = t.url, a = e + "." + t.ext;
                                    this.previewSubtitle(n, a);
                                }
                            }, {
                                text: "下载",
                                class: "a-success",
                                onClick: async t => {
                                    let n = t.url, a = e + "." + t.ext, i = await gmHttp.get(n);
                                    utils.download(i, a);
                                }
                            }]
                        });
                    }
                }) : show.error("迅雷中找不到相关字幕!");
            })).catch((e => {
                console.error(e);
                show.error(e);
            })).finally((() => {
                t.close();
            }));
        }

        async filterOne(e, t) {
            e && e.preventDefault();
            let n = this.getPageInfo();
            if (t) {
                await storageManager.saveCar(n.carNum, n.url, n.actress, g);
                window.refresh();
                show.ok("操作成功", {
                    duration: 50,
                    callback: () => {
                        utils.closePage();
                    }
                });
            } else utils.q(e, `是否屏蔽${n.carNum}?`, (async () => {
                await storageManager.saveCar(n.carNum, n.url, n.actress, g);
                window.refresh();
                show.ok("操作成功", {
                    duration: 50,
                    callback: () => {
                        utils.closePage();
                    }
                });
            }), (() => {
                this.answerCount = 1;
            }));
        }

        speedVideo() {
            if ($("#preview-video").is(":visible")) {
                const e = document.getElementById("preview-video");
                if (e) {
                    e.muted = !1;
                    e.controls = !1;
                    if (e.currentTime + 5 < e.duration) e.currentTime += 5; else {
                        show.info("预览视频结束, 已回到开头");
                        e.currentTime = 1;
                    }
                }
                return;
            }
            const e = $('iframe[id^="layui-layer-iframe"]');
            if (e.length > 0) {
                e[0].contentWindow.postMessage("speedVideo", "*");
                return;
            }
            let t = $(".preview-video-container");
            if (t.length > 0) {
                t[0].click();
                const e = document.getElementById("preview-video");
                if (e) {
                    e.currentTime += 5;
                    e.muted = !1;
                }
            } else $("#javTrailersBtn").click();
        }

        hideVideoControls() {
            const e = document.getElementById("preview-video");
            e && e.addEventListener("mouseenter", (() => {
                e.controls = !0;
            }));
        }

        bindHotkey() {
            const e = {
                a: () => {
                    this.answerCount >= 2 ? this.filterOne(null, !0) : this.filterOne(null);
                    this.answerCount++;
                },
                s: () => this.favoriteOne(null),
                z: () => this.speedVideo()
            }, t = (e, t) => {
                v.registerHotkey(e, (n => {
                    const a = document.activeElement;
                    "INPUT" === a.tagName || "TEXTAREA" === a.tagName || a.isContentEditable || (window.isDetailPage ? t() : (e => {
                        const t = $(".layui-layer-content iframe");
                        if (0 === t.length) return !1;
                        t[0].contentWindow.postMessage(e, "*");
                    })(e));
                }));
            };
            window.isDetailPage && window.addEventListener("message", (t => {
                e[t.data] && e[t.data]();
            }));
            Object.entries(e).forEach((([e, n]) => {
                t(e, n);
            }));
        }

        previewSubtitle(e, t) {
            if (!e) {
                console.error("未提供文件URL");
                return;
            }
            const n = e.split(".").pop().toLowerCase();
            "ass" === n || "srt" === n ? gmHttp.get(e).then((e => {
                let a = e, i = "字幕预览";
                if ("ass" === n) {
                    i = "ASS字幕预览 - " + t;
                    const n = e.match(/\[Events][\s\S]*?(?=\[|$)/i);
                    n && (a = n[0]);
                } else "srt" === n && (i = "SRT字幕预览 - " + t);
                layer.open({
                    type: 1,
                    title: i,
                    area: ["80%", "80%"],
                    scrollbar: !1,
                    content: `<div style="padding:15px;background:#1E1E1E;color:#FFF;font-family:Consolas,Monaco,monospace;white-space:pre-wrap;overflow:auto;height:100%;">${a}</div>`,
                    btn: ["下载", "关闭"],
                    btn1: function (n, a, i) {
                        utils.download(e, t);
                        return !1;
                    }
                });
            })).catch((e => {
                show.error(`预览失败: ${e.message}`);
                console.error("预览字幕文件出错:", e);
            })) : alert("仅支持预览ASS和SRT字幕文件");
        }
    }

    class HistoryPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "dataType", "all");
            __publicField(this, "tableObj", null);
        }

        handle() {
            if (l) {
                let e = function () {
                    if ($(".navbar-search").is(":hidden")) {
                        $(".historyBtnBox").show();
                        $(".miniHistoryBtnBox").hide();
                    } else {
                        $(".historyBtnBox").hide();
                        $(".miniHistoryBtnBox").show();
                    }
                };
                $(".navbar-end").prepend('<div class="navbar-item has-dropdown is-hoverable historyBtnBox">\n                    <a id="historyBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-right:15px !important;">\n                        历史列表\n                    </a>\n                </div>');
                $(".navbar-search").css("margin-left", "0").before('\n                <div class="navbar-item miniHistoryBtnBox">\n                    <a id="miniHistoryBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-left:0 !important;padding-right:0 !important;">\n                        历史列表\n                    </a>\n                </div>\n            ');
                e();
                $(window).resize(e);
            }
            c && $("#navbar").append('\n                <ul class="nav navbar-nav navbar-right" style="margin-right: 10px">\n                    <li><a id="historyBtn" style="color: #86e114 !important;padding-right:15px !important;" role="button">历史列表</a></li>\n                </ul>\n           ');
            $("#historyBtn,#miniHistoryBtn").on("click", (e => this.openHistory()));
        }

        openHistory() {
            layer.open({
                type: 1,
                title: "历史列表",
                content: '\n            <div style="margin: 10px">\n                <a class="menu-btn history-btn" data-action="all" style="background-color:#d3c8a5">所有</a>\n                <a class="menu-btn history-btn" data-action="filter" style="background-color:#ec4949">已屏蔽</a>\n                <a class="menu-btn history-btn" data-action="favorite" style="background-color:#50adb9;">已收藏</a>\n                <a class="menu-btn history-btn" data-action="hasDown" style="background-color:#8ebd6e;">已下载</a>\n            </div>\n            <div id="table-container"></div>\n        ',
                area: utils.getResponsiveArea(),
                success: async e => {
                    const t = await this.getDataList();
                    this.loadTableData(t);
                    $(".layui-layer-content").on("click", ".history-btn", (async e => {
                        this.dataType = $(e.target).data("action");
                        this.reloadTable();
                    }));
                },
                end: async () => window.refresh()
            });
        }

        async handleClickDetail(e, t) {
            if (l) if (t.carNum.includes("FC2-")) {
                const e = this.parseMovieId(t.url);
                this.getBean("fc2Plugin").openFc2Dialog(e, t.carNum, t.url);
            } else utils.openPage(t.url, t.carNum, !1, e);
            if (c) {
                let n = t.url;
                if (n.includes("javdb")) if (t.carNum.includes("FC2-")) {
                    const e = this.parseMovieId(n);
                    await this.getBean("Fc2Plugin").openFc2Page(e, t.carNum, n);
                } else window.open(n, "_blank"); else utils.openPage(t.url, t.carNum, !1, e);
            }
        }

        async reloadTable() {
            const e = await this.getDataList();
            this.tableObj.update(e);
        }

        handleDelete(e, t) {
            utils.q(e, `是否移除${t.carNum}?`, (async () => {
                await storageManager.removeCar(t.carNum);
                this.getBean("listPagePlugin").showCarNumBox(t.carNum);
                this.reloadTable().then();
            }));
        }

        async getDataList() {
            let e = await storageManager.getCarList();
            this.allCount = e.length;
            this.filterCount = 0;
            this.favoriteCount = 0;
            this.hasDownCount = 0;
            e.forEach((e => {
                switch (e.status) {
                    case g:
                        this.filterCount++;
                        break;

                    case p:
                        this.favoriteCount++;
                        break;

                    case h:
                        this.hasDownCount++;
                }
            }));
            $('a[data-action="all"]').text(`所有 (${this.allCount})`);
            $('a[data-action="filter"]').text(`已屏蔽 (${this.filterCount})`);
            $('a[data-action="favorite"]').text(`已收藏 (${this.favoriteCount})`);
            $('a[data-action="hasDown"]').text(`已下载 (${this.hasDownCount})`);
            return "all" === this.dataType ? e : e.filter((e => e.status === this.dataType));
        }

        loadTableData(e) {
            this.tableObj = new TableGenerator({
                containerId: "table-container",
                columns: [{
                    key: "carNum",
                    title: "番号"
                }, {
                    key: "actress",
                    title: "演员",
                    width: "250px"
                }, {
                    key: "updateDate",
                    title: "操作日期",
                    width: "185px",
                    render: e => "updateDate" in e ? e.updateDate : e.createDate || ""
                }, {
                    key: "url",
                    title: "来源",
                    render: e => {
                        let t = e.url;
                        return t.includes("javdb") ? '<span style="color:#d34f9e">Javdb</span>' : t.includes("javbus") ? '<span style="color:#eaa813">JavBus</span>' : t.includes("123av") ? '<span style="color:#eaa813">123Av</span>' : `<span style="color:#050505">${t}</span>`;
                    }
                }, {
                    key: "status",
                    title: "状态",
                    width: "250px",
                    render: e => {
                        let t, n = "";
                        switch (e.status) {
                            case "filter":
                                t = "#ec4949";
                                n = "已屏蔽";
                                break;

                            case "favorite":
                                t = "#50adb9";
                                n = "已收藏";
                                break;

                            case "hasDown":
                                t = "#8ebd6e";
                                n = "已下载";
                        }
                        return `<span style="color:${t}">${n}</span>`;
                    }
                }],
                data: e,
                buttons: [{
                    text: "移除",
                    class: "a-danger",
                    onClick: e => {
                        this.handleDelete(event, e);
                    }
                }, {
                    text: "详情页",
                    class: "a-info",
                    onClick: e => {
                        this.handleClickDetail(event, e);
                    }
                }]
            });
        }
    }

    class ReviewPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "floorIndex", 1);
        }

        async handle() {
            if (window.isDetailPage) {
                if (l) {
                    const e = this.parseMovieId(window.location.href);
                    await this.showReview(e);
                    await this.getBean("RelatedPlugin").showRelated();
                }
                if (c) {
                    let e = this.getPageInfo().carNum;
                    const t = await (async e => {
                        let t = `${y}/v2/search`, n = {
                            "user-agent": "Dart/3.5 (dart:io)",
                            "accept-language": "zh-TW",
                            host: "jdforrepam.com",
                            jdsignature: await x()
                        }, a = {
                            q: e,
                            page: 1,
                            type: "movie",
                            limit: 1,
                            movie_type: "all",
                            from_recent: "false",
                            movie_filter_by: "all",
                            movie_sort_by: "relevance"
                        };
                        return (await gmHttp.get(t, a, n)).data.movies;
                    })(e);
                    let n = null;
                    for (let a = 0; a < t.length; a++) {
                        let i = t[a];
                        if (i.number.toLowerCase() === e.toLowerCase()) {
                            n = i.id;
                            break;
                        }
                    }
                    if (!n) {
                        show.error("解析视频ID失败, 该视频可能不存在, 无法获取评论数据");
                        return;
                    }
                    this.showReview(n, $("#sample-waterfall")).then();
                }
            }
        }

        async showReview(e, t) {
            const n = t || $("#magnets-content");
            n.append('\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;">评论区</span>\n                <a id="reviewsFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">折叠</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">▲</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        ');
            $("#reviewsFold").on("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                const t = $("#reviewsFold .toggle-text"), n = $("#reviewsFold .toggle-icon"), a = "展开" === t.text();
                t.text(a ? "折叠" : "展开");
                n.text(a ? "▲" : "▼");
                if (a) {
                    $("#reviewsContainer").show();
                    $("#reviewsFooter").show();
                } else {
                    $("#reviewsContainer").hide();
                    $("#reviewsFooter").hide();
                }
            }));
            n.append('<div id="reviewsContainer"></div>');
            n.append('<div id="reviewsFooter"></div>');
            await this.fetchAndDisplayReviews(e);
        }

        async fetchAndDisplayReviews(e) {
            const t = $("#reviewsContainer"), n = $("#reviewsFooter");
            t.append('<div id="reviewsLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">获取评论中...</div>');
            const a = await storageManager.getSetting("reviewCount", 20);
            let i = null;
            try {
                i = await k(e, 1, a);
            } catch (s) {
                console.error("获取评论失败:", s);
            } finally {
                $("#reviewsLoading").remove();
            }
            if (!i) {
                t.append('\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    获取评论失败\n                    <a id="retryFetchReviews" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">重试</a>\n                </div>\n            ');
                $("#retryFetchReviews").on("click", (async () => {
                    $("#retryFetchReviews").parent().remove();
                    await this.fetchAndDisplayReviews(e);
                }));
                return;
            }
            if (0 === i.length) {
                t.append('<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">无评论</div>');
                return;
            }
            const r = await storageManager.getReviewFilterKeywordList();
            this.displayReviews(i, t, r);
            if (i.length === a) {
                n.html('\n                <button id="loadMoreReviews" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    加载更多评论\n                </button>\n                <div id="reviewsEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部评论</div>\n            ');
                let i = 1, o = $("#loadMoreReviews");
                o.on("click", (async () => {
                    o.text("加载中...").prop("disabled", !0);
                    i++;
                    let n;
                    try {
                        n = await k(e, i, a);
                    } catch (s) {
                        console.error("加载更多评论失败:", s);
                    } finally {
                        o.text("加载失败, 请点击重试").prop("disabled", !1);
                    }
                    if (n) {
                        this.displayReviews(n, t, r);
                        if (n.length < a) {
                            o.remove();
                            $("#reviewsEnd").show();
                        } else o.text("加载更多评论").prop("disabled", !1);
                    }
                }));
            } else n.html('<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部评论</div>');
        }

        displayReviews(e, t, n) {
            if (e.length) {
                e.forEach((e => {
                    if (n.some((t => e.content.includes(t)))) return;
                    const a = Array(e.score).fill('<i class="icon-star"></i>').join(""), i = e.content.replace(/(https?:\/\/[^\s]+|magnet:\?[^\s"'\u4e00-\u9fa5，。？！（）【】]+)/gi, (e => `<a href="${e}" class="a-primary" style="padding:0; word-break: break-all; white-space: pre-wrap;" target="_blank" rel="noopener noreferrer">${e}</a>`)), r = `\n            <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this.floorIndex++}楼</span>\n                ${e.username} &nbsp;&nbsp; <span class="score-stars">${a}</span> \n                <span class="time">${utils.formatDate(e.created_at)}</span> \n                &nbsp;&nbsp; 点赞:${e.likes_count}\n                <p class="review-content" style="margin-top: 5px;"> ${i} </p>\n            </div>\n        `;
                    t.append(r);
                }));
                utils.rightClick($(".review-content"), (async e => {
                    const t = window.getSelection().toString();
                    if (t) {
                        e.preventDefault();
                        if (await utils.q(e, `是否将 '${t}' 加入评论区关键词?`)) {
                            await storageManager.saveReviewFilterKeyword(t);
                            show.ok("操作成功, 刷新页面后生效");
                        }
                    }
                }));
            }
        }
    }

    class FilterTitleKeywordPlugin extends BasePlugin {
        handle() {
            if (!window.isDetailPage) return;
            let e, t;
            if (l) {
                e = $("h2");
                t = $(".male").prev();
            }
            c && (e = $("h3"));
            utils.rightClick(e, (e => {
                const t = window.getSelection().toString();
                if (t) {
                    e.preventDefault();
                    let n = {
                        clientX: e.clientX,
                        clientY: e.clientY + 80
                    };
                    utils.q(n, `是否屏蔽标题关键词 ${t}?`, (async () => {
                        await storageManager.saveTitleFilterKeyword(t);
                        window.refresh();
                        utils.closePage();
                    }));
                }
            }));
            t && t.length > 0 && utils.rightClick(t, (e => {
                e.preventDefault();
                let t = $(e.target).text().trim();
                utils.q(e, `是否屏蔽演员${t}?`, (async () => {
                    await storageManager.saveFilterActor(t);
                    window.refresh();
                    const e = this.getBean("detailPageButtonPlugin");
                    await e.filterOne(null, !0);
                }));
            }));
        }
    }

    class ListPageButtonPlugin extends BasePlugin {
        handle() {
            window.isListPage && this.createMenuBtn();
        }

        createMenuBtn() {
            if (l) {
                if (window.location.href.includes("/actors/")) {
                    $(".toolbar .buttons").append('\n                    <a class="menu-btn" id="waitCheckBtn" \n                       style="background-color:#56c938 !important;; margin-left: 40px;margin-bottom: 8px; border-bottom:none !important; border-radius:3px;">\n                        <span>打开待鉴定</span>\n                    </a>\n                    <a class="menu-btn" id="waitDownBtn" \n                       style="background-color:#2caac0 !important;; margin-left: 10px;margin-bottom: 8px; border-bottom:none !important; border-radius:3px;">\n                      <span>打开已收藏</span>\n                    </a>\n                ');
                    d || $(".toolbar .buttons").append(`\n                        <a class="menu-btn" id="sort-toggle-btn" \n                           style="background-color:#8783ab !important; margin-left: 50px;margin-bottom: 8px; border-bottom:none !important; border-radius:3px;">当前排序方式: ${"rateCount" === localStorage.getItem("sortMethod") ? "评价人数" : "date" === localStorage.getItem("sortMethod") ? "时间" : "默认"}</a>\n                    `);
                } else if (window.location.href.includes("advanced_search")) {
                    let e = $("h2.section-title");
                    e.css({
                        display: "grid",
                        "grid-template-columns": "auto auto 1fr",
                        width: "100%"
                    });
                    e.append(`\n                    <div>\n                        <a class="menu-btn" id="waitCheckBtn" \n                           style="background-color:#56c938 !important;; margin-left: 10px;border-bottom:none !important; border-radius:3px;">\n                            <span>打开待鉴定</span>\n                        </a>\n                        <a class="menu-btn" id="waitDownBtn" \n                           style="background-color:#2caac0 !important;; margin-left: 10px;border-bottom:none !important; border-radius:3px;">\n                          <span>打开已收藏</span>\n                        </a>\n                        <a class="menu-btn" id="sort-toggle-btn" \n                           style="background-color:#8783ab !important; margin-left: 20px; border-bottom:none !important; border-radius:3px; float: right">\n                          当前排序方式: ${"rateCount" === localStorage.getItem("sortMethod") ? "评价人数" : "date" === localStorage.getItem("sortMethod") ? "时间" : "默认"}\n                        </a>\n                    </div>\n                `);
                } else {
                    $(".tabs ul").append('\n                    <li class="is-active" id="waitCheckBtn">\n                        <a class="menu-btn" style="background-color:#56c938 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                            <span>打开待鉴定</span>\n                        </a>\n                    </li>\n                     <li class="is-active" id="waitDownBtn">\n                        <a class="menu-btn" style="background-color:#2caac0 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                            <span>打开已收藏</span>\n                        </a>\n                    </li>\n                ');
                    d || $(".tabs ul").after(`\n                      <div style="padding:10px">\n                        <a class="menu-btn" id="sort-toggle-btn" \n                           style="background-color:#8783ab !important; margin-left: 20px; border-bottom:none !important; border-radius:3px;">\n                          当前排序方式: ${"rateCount" === localStorage.getItem("sortMethod") ? "评价人数" : "date" === localStorage.getItem("sortMethod") ? "时间" : "默认"}\n                        </a>\n                      </div>\n                    `);
                }
                this.sortItems();
            }
            if (c) {
                const e = '\n                <div style="margin-top: 10px">\n                    <a id="waitCheckBtn" class="menu-btn" style="background-color:#56c938 !important;margin-left: 14px;border-bottom:none !important;border-radius:3px;">\n                        <span>打开待鉴定</span>\n                    </a>\n                    <a id="waitDownBtn" class="menu-btn" style="background-color:#2caac0 !important;margin-left: 5px;border-bottom:none !important;border-radius:3px;">\n                        <span>打开已收藏</span>\n                    </a>\n                </div>\n            ';
                $(".masonry").parent().prepend(e);
            }
            $("#waitCheckBtn").on("click", (e => {
                this.openWaitCheck(e).then();
            }));
            $("#waitDownBtn").on("click", (e => {
                this.openFavorite(e).then();
            }));
            $("#sort-toggle-btn").on("click", (e => {
                const t = localStorage.getItem("sortMethod");
                let n;
                n = t && "default" !== t ? "rateCount" === t ? "date" : "default" : "rateCount";
                const a = {
                    default: "默认",
                    rateCount: "评价人数",
                    date: "时间"
                }[n];
                $(e.target).text(`当前排序方式: ${a}`);
                localStorage.setItem("sortMethod", n);
                this.sortItems();
            }));
        }

        sortItems() {
            if (d) return;
            const e = localStorage.getItem("sortMethod");
            if (!e) return;
            $(".movie-list .item").each((function (e) {
                $(this).attr("data-original-index") || $(this).attr("data-original-index", e);
            }));
            const t = $(".movie-list"), n = $(".item", t);
            if ("default" === e) n.sort((function (e, t) {
                return $(e).data("original-index") - $(t).data("original-index");
            })).appendTo(t); else {
                const a = n.get();
                a.sort((function (t, n) {
                    if ("rateCount" === e) {
                        const e = e => {
                            const t = $(e).find(".score .value").text().match(/由(\d+)人/);
                            return t ? parseFloat(t[1]) : 0;
                        };
                        return e(n) - e(t);
                    }
                    {
                        const e = e => {
                            const t = $(e).find(".meta").text().trim();
                            return new Date(t);
                        };
                        return e(n) - e(t);
                    }
                }));
                t.empty().append(a);
            }
        }

        async openWaitCheck() {
            let e = this.getSelector();
            const t = await storageManager.getSetting("waitCheckCount", 5), n = ["已收藏", "已屏蔽", "已下载"];
            let a = 0;
            $(`${e.itemSelector}:visible`).each(((e, i) => {
                if (a >= t) return !1;
                const r = $(i);
                if (n.some((e => r.find(`span:contains('${e}')`).length > 0))) return;
                const {carNum: s, aHref: o, title: l} = this.getBean("ListPagePlugin").findCarNumAndHref(r);
                if (s.includes("FC2-")) {
                    const e = this.parseMovieId(o);
                    this.getBean("Fc2Plugin").openFc2Page(e, s, o);
                } else {
                    let e = o + (o.includes("?") ? "&autoPlay=1" : "?autoPlay=1");
                    window.open(e);
                }
                a++;
            }));
            0 === a && show.info("没有需鉴定的视频");
        }

        async openFavorite() {
            let e = await storageManager.getSetting("waitCheckCount", 5);
            const t = (await storageManager.getCarList()).filter((e => e.status === p));
            for (let n = 0; n < e; n++) {
                if (n >= t.length) return;
                let e = t[n], a = e.carNum, i = e.url;
                if (a.includes("FC2-")) {
                    const e = this.parseMovieId(i);
                    await this.getBean("Fc2Plugin").openFc2Page(e, a, i);
                } else window.open(i);
            }
        }
    }

    class ListPagePlugin extends BasePlugin {
        async handle() {
            this.cleanRepeatId();
            this.replaceHdImg();
            await this.doFilter();
            this.showNoItem();
            this.bindClick().then();
            new BroadcastChannel("channel-refresh").addEventListener("message", (async e => {
                "refresh" === e.data.type && await this.doFilter();
            }));
            $(this.getSelector().itemSelector + " a").attr("target", "_blank");
            this.checkDom();
        }

        checkDom() {
            if (!window.isListPage) return;
            const e = this.getSelector(), t = document.querySelector(e.boxSelector), n = new MutationObserver((e => {
                n.disconnect();
                try {
                    this.replaceHdImg();
                    this.doFilter().then();
                    this.getBean("ListPageButtonPlugin").sortItems();
                    this.showNoItem();
                    this.getBean("CopyTitleOrDownImgPlugin").addCopy();
                    $(this.getSelector().itemSelector + " a").attr("target", "_blank");
                } finally {
                    n.observe(t, a);
                }
            })), a = {
                childList: !0,
                subtree: !1
            };
            n.observe(t, a);
        }

        showNoItem() {
            if ($(this.getSelector().itemSelector).length > 0) {
                0 === $(this.getSelector().itemSelector).filter((function () {
                    return "none" !== $(this).css("display");
                })).length && show.info("当前内容已标记, 无内容可鉴定, 请进入下一页");
            }
        }

        cleanRepeatId() {
            if (!c) return;
            $("#waterfall_h").removeAttr("id").attr("id", "no-page");
            const e = $('[id="waterfall"]');
            0 !== e.length && e.each((function () {
                const e = $(this);
                if (!e.hasClass("masonry")) {
                    e.children().insertAfter(e);
                    e.remove();
                }
            }));
        }

        async doFilter() {
            if (!window.isListPage) return;
            let e = $(this.getSelector().itemSelector).toArray();
            await this.filterMovieList(e);
            await this.getBean("autoPagePlugin").handlePaging();
        }

        async filterMovieList(e) {
            const t = await storageManager.getCarList(), n = await storageManager.getTitleFilterKeyword(), a = t.filter((e => e.status === g)).map((e => e.carNum)), i = t.filter((e => e.status === p)).map((e => e.carNum)), r = t.filter((e => e.status === h)).map((e => e.carNum));
            let s = await storageManager.getSetting("hideFilterItem", "yes");
            d && (s = "no");
            e.forEach((e => {
                let t = $(e);
                if (c && t.find(".avatar-box").length > 0) return;
                const {carNum: o, aHref: d, title: p} = this.findCarNumAndHref(t), g = `${o}-hide`, h = `${o}-keywordHide`;
                if ("no" === s && t.attr("data-hide") === g) {
                    t.show();
                    t.removeAttr("data-hide");
                }
                if (n.some((e => p.includes(e) || o.includes(e))) && t.attr("data-keyword-hide") !== h) {
                    t.hide();
                    t.attr("data-keyword-hide", h);
                    return;
                }
                if (a.includes(o) && "yes" === s && t.attr("data-hide") !== g) {
                    t.hide();
                    t.attr("data-hide", g);
                    return;
                }
                if (r.includes(o) && "yes" === s && t.attr("data-hide") !== g) {
                    t.hide();
                    t.attr("data-hide", g);
                    return;
                }
                let u = "", m = "";
                if (a.includes(o)) {
                    u = "已屏蔽";
                    m = "#d95427";
                } else if (i.includes(o)) {
                    u = "已收藏";
                    m = "#2caac0";
                } else if (r.includes(o)) {
                    u = "已下载";
                    m = "#58c433";
                }
                t.find(".status-tag").remove();
                if (u) {
                    l && t.find(".tags").append(`\n                    <span class="tag is-success status-tag" \n                        style="margin-right: 5px; border-radius:10px; position:absolute; right: 0; top:5px;z-index:10;background-color: ${m} !important;">\n                        ${u}\n                    </span>`);
                    if (c) {
                        let e = `<a class="a-primary status-tag" style="margin-right: 5px; padding: 0 5px;color: #fff; border-radius:10px; position:absolute; right: 0; top:5px;z-index:10;background-color: ${m} !important;"><span>${u}</span></a>`;
                        t.find(".item-tag").append(e);
                    }
                }
            }));
            $("#waitDownBtn span").text(`打开已收藏 (${i.length})`);
        }

        async bindClick() {
            let e = this.getSelector();
            $(e.boxSelector).on("click", ".item img", (async e => {
                e.preventDefault();
                if ($(e.target).closest("div.meta-buttons").length) return;
                const t = $(e.target).closest(".item"), {carNum: n, aHref: a} = this.findCarNumAndHref(t);
                let i = await storageManager.getSetting("dialogOpenDetail", "yes");
                if (n.includes("FC2-")) {
                    let e = this.parseMovieId(a);
                    this.getBean("fc2Plugin").openFc2Dialog(e, n, a);
                } else "yes" === i ? utils.openPage(a, n, !1, e) : window.open(a);
            }));
            $(e.boxSelector).on("click", ".item .video-title", (async e => {
                const t = $(e.target).closest(".item"), {carNum: n, aHref: a} = this.findCarNumAndHref(t);
                if (n.includes("FC2-")) {
                    e.preventDefault();
                    let t = this.parseMovieId(a);
                    this.getBean("fc2Plugin").openFc2Dialog(t, n, a);
                }
            }));
            $(e.boxSelector).on("contextmenu", ".item img", (e => {
                e.preventDefault();
                const t = $(e.target).closest(".item"), {carNum: n, aHref: a} = this.findCarNumAndHref(t);
                utils.q(e, `是否屏蔽番号 ${n}?`, (async () => {
                    await storageManager.saveCar(n, a, "", g);
                    window.refresh();
                    show.ok("操作成功");
                }));
            }));
        }

        findCarNumAndHref(e) {
            let t, n, a = e.find("a").attr("href");
            if (l) {
                t = e.find(".video-title").find("strong").text();
                n = e.find(".video-title").text();
            }
            if (c) {
                t = a.split("/").filter(Boolean).pop();
                n = e.find("img").attr("title");
            }
            return {
                carNum: t,
                aHref: a,
                title: n
            };
        }

        showCarNumBox(e) {
            const t = $(".movie-list .item").toArray().find((t => $(t).find(".video-title strong").text() === e));
            if (t) {
                const n = $(t);
                if (n.attr("data-hide") === `${e}-hide`) {
                    n.show();
                    n.removeAttr("data-hide");
                }
            }
        }

        replaceHdImg(e) {
            e || (e = document.querySelectorAll(this.getSelector().coverImgSelector));
            l && e.forEach((e => {
                e.src = e.src.replace("thumbs", "covers");
            }));
            if (c) {
                const t = /\/(imgs|pics)\/(thumb|thumbs)\//, n = /(\.jpg|\.jpeg|\.png)$/i, a = e => {
                    if (e.src && t.test(e.src) && "true" !== e.dataset.hdReplaced) {
                        e.src = e.src.replace(t, "/$1/cover/").replace(n, "_b$1");
                        e.dataset.hdReplaced = "true";
                        e.loading = "lazy";
                    }
                };
                e.forEach((e => {
                    a(e);
                }));
            }
        }
    }

    class AutoPagePlugin extends BasePlugin {
        constructor() {
            super();
            this.paging = !1;
            this.selector = null;
            l && (this.selector = r);
            c && (this.selector = s);
        }

        async handle() {
            window.isListPage && !this.shouldDisablePaging() && this.bindPageClick().then();
        }

        async bindPageClick() {
            $(".pagination-link, .pagination-next, .pagination-previous, .pagination li a").on("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                let t = $(e.target).attr("href");
                this.parsePage(t).then();
            }));
            0 === $("#auto-page").length && await this.insertPageBtn();
            $("#auto-page").on("click", (async e => {
                e.preventDefault();
                if ("yes" === await storageManager.getItem(storageManager.auto_page_key)) {
                    await storageManager.setItem(storageManager.auto_page_key, "no");
                    $("#auto-page").html("开启自动翻页");
                } else {
                    await storageManager.setItem(storageManager.auto_page_key, "yes");
                    $("#auto-page").html("关闭自动翻页");
                    await this.handlePaging();
                }
            }));
        }

        async insertPageBtn() {
            let e = "yes" === await storageManager.getItem(storageManager.auto_page_key) ? "关闭自动翻页" : "开启自动翻页";
            l && $(".pagination").prepend(`<a style="background-color:#fff; order: 2;padding: calc(.5em - 1px) .75em;" id='auto-page'>${e}</a>`);
            c && $(".pagination").append(`<li><a style="margin-left: 20px;cursor: pointer;" id='auto-page'>${e}</a></li>`);
        }

        async parsePage(e) {
            let t = loading();
            try {
                const t = await http.get(e), n = (new DOMParser).parseFromString(t, "text/html");
                c && $(n).find(".avatar-box").length > 0 && $(n).find(".avatar-box").parent().remove();
                let a = n.querySelectorAll(this.selector.requestDomItemSelector), i = n.querySelectorAll(".pagination");
                const r = this.getBean("listPagePlugin");
                await r.filterMovieList(a);
                let s = n.querySelectorAll(this.selector.coverImgSelector);
                r.replaceHdImg(s);
                let o = $(this.selector.boxSelector);
                o.fadeOut(300, (() => {
                    o.html(a).fadeIn(300, (async () => {
                    }));
                }));
                await this.insertPageBtn();
                $(".pagination").replaceWith(i);
                window.history.pushState({}, "", e);
                if (c) {
                    const t = this.getPageNumberFromUrl(e);
                    document.title = document.title.replace(/第\d+頁/, "第" + t + "頁");
                }
                await utils.smoothScrollToTop();
                await this.bindPageClick();
                await this.handlePaging();
            } finally {
                t.close();
            }
        }

        getPageNumberFromUrl(e) {
            const t = e.match(/\/page\/(\d+)/);
            return t ? parseInt(t[1], 10) : null;
        }

        shouldDisablePaging() {
            return ["search?q", "handlePlayback=1", "handleTop=1", "/want_watch_videos", "/watched_videos", "/advanced_search?type=100"].some((e => window.location.href.includes(e)));
        }

        async handlePaging() {
            if (this.shouldDisablePaging()) return;
            if ($("#no-page").length) {
                $("#auto-page").remove();
                return;
            }
            if (0 === $(this.selector.boxSelector).length) return;
            if (!window.isListPage) return;
            if (this.paging) return;
            let e = !0;
            $(`${this.selector.itemSelector}:visible`).each(((t, n) => {
                0 === $(n).find("span:contains('已收藏')").length && 0 === $(n).find("span:contains('已屏蔽')").length && 0 === $(n).find("span:contains('已下载')").length && (e = !1);
            }));
            if (!e) return;
            if ("yes" !== await storageManager.getItem(storageManager.auto_page_key)) return;
            let t = null;
            l && (t = $(".pagination-next"));
            c && (t = $("#next"));
            if (t && 0 !== t.length) {
                this.paging = !0;
                show.info("下一页....", {
                    duration: 100,
                    callback: () => {
                        t[0].click();
                        this.paging = !1;
                    }
                });
            }
        }
    }

    class HighlightMagnetPlugin extends BasePlugin {
        handle() {
            this.handleDb();
            this.handleBus();
        }

        handleDb() {
            let e = $("#magnets-content .name").toArray();
            if (0 === e.length) return;
            let t = !1;
            e.forEach((e => {
                let n = $(e), a = n.text().toLowerCase();
                a.includes("4k") && n.css("color", "#f40");
                (a.includes("-c") || a.includes("-u") || a.includes("-uc") || a.includes("4k")) && (t = !0);
            }));
            t ? e.forEach((e => {
                let t = $(e), n = t.text().toLowerCase();
                n.includes("-c") || n.includes("-u") || n.includes("-uc") || n.includes("4k") || t.parent().parent().parent().hide();
            })) : $("#enable-magnets-filter").addClass("do-hide");
        }

        handleBus() {
            c && isDetailPage && utils.loopDetector((() => $("#magnet-table td a").length > 0), (() => {
                let e = $("#magnet-table tr td:first-child a:first-child").toArray(), t = !1;
                e.forEach((e => {
                    let n = $(e), a = n.text().toLowerCase();
                    a.includes("4k") && n.css("color", "#f40");
                    (a.includes("-c") || a.includes("-u") || a.includes("-uc") || a.includes("4k")) && (t = !0);
                }));
                t ? e.forEach((e => {
                    let t = $(e), n = t.text().toLowerCase();
                    n.includes("-c") || n.includes("-u") || n.includes("-uc") || n.includes("4k") || t.parent().parent().hide();
                })) : $("#enable-magnets-filter").addClass("do-hide");
            }));
        }

        showAll() {
            if (l) {
                $("#magnets-content .item").toArray().forEach((e => $(e).show()));
            }
            c && $("#magnet-table tr").toArray().forEach((e => $(e).show()));
        }
    }

    class AliyunApi {
        constructor(e) {
            this.baseApiUrl = "https://api.aliyundrive.com";
            this.refresh_token = e;
            this.authorization = null;
            this.default_drive_id = null;
            this.backupFolderId = null;
        }

        async getDefaultDriveId() {
            if (this.default_drive_id) return this.default_drive_id;
            this.userInfo = await this.getUserInfo();
            this.default_drive_id = this.userInfo.default_drive_id;
            return this.default_drive_id;
        }

        async getHeaders() {
            if (this.authorization) return {
                authorization: this.authorization
            };
            this.authorization = await this.getAuthorization();
            return {
                authorization: this.authorization
            };
        }

        async getAuthorization() {
            let e = this.baseApiUrl + "/v2/account/token", t = {
                refresh_token: this.refresh_token,
                grant_type: "refresh_token"
            };
            try {
                return "Bearer " + (await http.post(e, t)).access_token;
            } catch (n) {
                throw n.message.includes("is not valid") ? new Error("refresh_token无效, 请重新填写并保存") : n;
            }
        }

        async getUserInfo() {
            const e = await this.getHeaders();
            let t = this.baseApiUrl + "/v2/user/get";
            return await http.post(t, {}, e);
        }

        async deleteFile(e, t = null) {
            if (!e) throw new Error("未传入file_id");
            t || (t = await this.getDefaultDriveId());
            let n = {
                file_id: e,
                drive_id: t
            }, a = this.baseApiUrl + "/v2/recyclebin/trash";
            const i = await this.getHeaders();
            await gmHttp.post(a, n, i);
            return {};
        }

        async createFolder(e, t = null, n = "root") {
            t || (t = await this.getDefaultDriveId());
            let a = this.baseApiUrl + "/adrive/v2/file/createWithFolders", i = {
                name: e,
                type: "folder",
                parent_file_id: n,
                check_name_mode: "auto_rename",
                content_hash_name: "sha1",
                drive_id: t
            };
            const r = await this.getHeaders();
            return await gmHttp.post(a, i, r);
        }

        async getFileList(e = "root", t = null) {
            t || (t = await this.getDefaultDriveId());
            let n = this.baseApiUrl + "/adrive/v3/file/list";
            const a = {
                drive_id: t,
                parent_file_id: e,
                limit: 200,
                all: !1,
                url_expire_sec: 14400,
                image_thumbnail_process: "image/resize,w_256/format,avif",
                image_url_process: "image/resize,w_1920/format,avif",
                video_thumbnail_process: "video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast",
                fields: "*",
                order_by: "updated_at",
                order_direction: "DESC"
            }, i = await this.getHeaders();
            return (await gmHttp.post(n, a, i)).items;
        }

        async uploadFile(e, t, n, a = null) {
            let i = this.baseApiUrl + "/adrive/v2/file/createWithFolders";
            a || (a = await this.getDefaultDriveId());
            let r = {
                drive_id: a,
                part_info_list: [{
                    part_number: 1
                }],
                parent_file_id: e,
                name: t,
                type: "file",
                check_name_mode: "auto_rename"
            };
            const s = await this.getHeaders(), o = await gmHttp.post(i, r, s), l = o.upload_id, c = o.file_id, d = o.part_info_list[0].upload_url;
            console.log("创建完成: ", o);
            await this._doUpload(d, n);
            const p = await gmHttp.post("https://api.aliyundrive.com/v2/file/complete", r = {
                drive_id: "745851",
                file_id: c,
                upload_id: l
            }, s);
            console.log("标记完成:", p);
        }

        _doUpload(e, t) {
            return new Promise(((n, a) => {
                $.ajax({
                    type: "PUT",
                    url: e,
                    data: t,
                    contentType: " ",
                    processData: !1,
                    success: (e, t, i) => {
                        if (200 === i.status) {
                            console.log("上传成功:", e);
                            n({});
                        } else a(i);
                    },
                    error: e => {
                        console.error("上传失败", e.responseText);
                        a(e);
                    }
                });
            }));
        }

        async getDownloadUrl(e, t = null) {
            t || (t = await this.getDefaultDriveId());
            let n = this.baseApiUrl + "/v2/file/get_download_url";
            const a = await this.getHeaders();
            let i = {
                file_id: e,
                drive_id: t
            };
            return (await gmHttp.post(n, i, a)).url;
        }

        async _createBackupFolder(e) {
            const t = await this.getFileList();
            let n = null;
            for (let a = 0; a < t.length; a++) {
                let i = t[a];
                if (i.name === e) {
                    n = i;
                    break;
                }
            }
            if (!n) {
                console.log("不存在目录, 进行创建");
                n = await this.createFolder(e);
            }
            this.backupFolderId = n.file_id;
        }

        async backup(e, t, n) {
            if (this.backupFolderId) await this.uploadFile(this.backupFolderId, t, n); else {
                await this._createBackupFolder(e);
                await this.uploadFile(this.backupFolderId, t, n);
            }
        }

        async getBackupList(e) {
            let t = null;
            if (this.backupFolderId) t = await this.getFileList(this.backupFolderId); else {
                await this._createBackupFolder(e);
                t = await this.getFileList(this.backupFolderId);
            }
            const n = [];
            t.forEach((e => {
                n.push({
                    name: e.name,
                    fileId: e.file_id,
                    createTime: e.created_at,
                    size: e.size
                });
            }));
            return n;
        }
    }

    class WebDavApi {
        constructor(e, t, n) {
            this.davUrl = e.endsWith("/") ? e : e + "/";
            this.username = t;
            this.password = n;
            this.folderName = null;
        }

        _getAuthHeaders() {
            return {
                Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
                Depth: "1"
            };
        }

        _sendRequest(e, t, n = {}, a) {
            return new Promise(((i, r) => {
                const s = this.davUrl + t, o = {
                    ...this._getAuthHeaders(),
                    ...n
                };
                GM_xmlhttpRequest({
                    method: e,
                    url: s,
                    headers: o,
                    data: a,
                    onload: e => {
                        e.status >= 200 && e.status < 300 ? i(e) : r(new Error(`Request failed with status ${e.status}: ${e.statusText}`));
                    },
                    onerror: e => {
                        console.error("请求WebDav发生错误:", e);
                        r(new Error("请求WebDav失败, 请检查服务是否启动, 凭证是否正确"));
                    }
                });
            }));
        }

        async backup(e, t, n) {
            await this._sendRequest("MKCOL", e);
            const a = e + "/" + t;
            await this._sendRequest("PUT", a, {
                "Content-Type": "text/plain"
            }, n);
        }

        async getFileList(e) {
            var t, n;
            const a = (await this._sendRequest("PROPFIND", e, {
                "Content-Type": "application/xml"
            }, '\n                <?xml version="1.0"?>\n                <d:propfind xmlns:d="DAV:">\n                    <d:prop>\n                        <d:displayname />\n                        <d:getcontentlength />\n                        <d:creationdate />\n                        <d:iscollection />\n                    </d:prop>\n                </d:propfind>\n            ')).responseText, i = (new DOMParser).parseFromString(a, "text/xml").getElementsByTagNameNS("DAV:", "response"), r = [];
            for (let s = 0; s < i.length; s++) {
                if (0 === s) continue;
                if ("1" === i[s].getElementsByTagNameNS("DAV:", "iscollection")[0].textContent) continue;
                const e = i[s].getElementsByTagNameNS("DAV:", "displayname")[0].textContent, a = (null == (t = i[s].getElementsByTagNameNS("DAV:", "getcontentlength")[0]) ? void 0 : t.textContent) || "0", o = (null == (n = i[s].getElementsByTagNameNS("DAV:", "creationdate")[0]) ? void 0 : n.textContent) || "";
                r.push({
                    fileId: e,
                    name: e,
                    size: a,
                    createTime: o
                });
            }
            r.reverse();
            return r;
        }

        async deleteFile(e) {
            let t = this.folderName + "/" + encodeURI(e);
            await this._sendRequest("DELETE", t, {
                "Cache-Control": "no-cache"
            });
        }

        async getBackupList(e) {
            this.folderName = e;
            await this._sendRequest("MKCOL", e);
            return this.getFileList(e);
        }

        async getFileContent(e) {
            let t = this.folderName + "/" + e;
            return (await this._sendRequest("GET", t, {
                Accept: "application/octet-stream"
            })).responseText;
        }
    }

    class SettingPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __privateAdd(this, a);
            __publicField(this, "folderName", "JHS-数据备份");
        }

        getDefaultGridColumns() {
            return window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : window.innerWidth < 1e3 ? 3 : window.innerWidth < 1200 ? 4 : 5;
        }

        async initCss() {
            let e = await storageManager.getSetting("containerWidth", "100"), t = await storageManager.getSetting("containerColumns", this.getDefaultGridColumns()), n = `\n            section .container{\n                max-width: 1000px !important;\n                min-width: ${e}%;\n            }\n            .movie-list{\n                grid-template-columns: repeat(${t}, minmax(0, 1fr));\n            }\n        `;
            c && (n = `\n                .container-fluid .row{\n                    max-width: 1000px !important;\n                    min-width: ${e}%;\n                    margin: auto auto;\n                }\n                \n                .masonry {\n                    grid-template-columns: repeat(${t}, minmax(0, 1fr));\n                }\n            `);
            return `\n            <style>\n                ${n}\n                .nav-btn::after {\n                    content:none !important;\n                }\n                \n                .setting-item {\n                    display: flex;\n                    align-items: center;\n                    justify-content: space-between;\n                    margin-bottom: 10px;\n                    padding: 10px;\n                    border: 1px solid #ddd;\n                    border-radius: 5px;\n                    /*background-color: #f9f9f9;*/\n                }\n                .setting-label {\n                    font-size: 14px;\n                    min-width: 180px;\n                    font-weight: bold;\n                    margin-right: 10px;\n                }\n                .form-content{\n                    max-width: 160px;\n                    min-width: 160px;\n                }\n                .form-content * {\n                    width: 100%;\n                    padding: 5px;\n                    margin-right: 10px;\n                    text-align: center;\n                }\n                .keyword-label {\n                    display: inline-flex;\n                    align-items: center;\n                    padding: 4px 8px;\n                    border-radius: 4px;\n                    color: white;\n                    font-size: 14px;\n                    position: relative;\n                    margin-left: 8px;\n                    margin-bottom: 2px;\n                }\n                \n                .keyword-remove {\n                    margin-left: 6px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    line-height: 1;\n                }\n                \n                .keyword-input {\n                    padding: 6px 12px;\n                    border: 1px solid #ccc;\n                    border-radius: 4px;\n                    font-size: 14px;\n                    float:right;\n                }\n                \n                .add-tag-btn {\n                    padding: 6px 12px;\n                    background-color: #45d0b6;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    margin-left: 8px;\n                    float:right;\n                }\n                \n                .add-tag-btn:hover {\n                    background-color: #3fceb7;\n                }\n                #saveBtn,#moreBtn {\n                    padding: 8px 20px;\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    margin-top: 10px;\n                }\n                #saveBtn:hover {\n                    background-color: #45a049;\n                }\n                #moreBtn{\n                    background-color: #ad8731;\n                    color: white;\n                }\n                #moreBtn:hover {\n                    background-color: #dc9f11;\n                }\n                \n                .simple-setting, .mini-simple-setting {\n                    display: none; /* 默认隐藏 */\n                    background: rgba(255,255,255,0.9); \n                    position: absolute;\n                    top: 35px; /* 在按钮正下方显示 */\n                    right: -200%;\n                    z-index: 1000;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n                    padding: 0;\n                    margin-top: 5px; /* 稍微拉开一点距离 */\n                    color: #363131;\n                }\n                \n                .mini-switch {\n                  appearance: none;\n                  -webkit-appearance: none;\n                  width: 40px;\n                  height: 20px;\n                  background: #e0e0e0;\n                  border-radius: 20px;\n                  position: relative;\n                  cursor: pointer;\n                  outline: none;\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked {\n                  background: #4CAF50;\n                }\n                \n                .mini-switch::before {\n                  content: "";\n                  position: absolute;\n                  width: 16px;\n                  height: 16px;\n                  border-radius: 50%;\n                  background: white;\n                  top: 2px;\n                  left: 2px;\n                  box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked::before {\n                  left: calc(100% - 18px);\n                }\n            </style\n        `;
        }

        handle() {
            if (l) {
                let e = function () {
                    if ($(".navbar-search").is(":hidden")) {
                        $(".mini-setting-box").hide();
                        $(".setting-box").show();
                    } else {
                        $(".mini-setting-box").show();
                        $(".setting-box").hide();
                    }
                };
                $("#navbar-menu-user .navbar-end").prepend('<div class="navbar-item has-dropdown is-hoverable setting-box" style="position:relative;">\n                    <a id="setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-right:15px !important;">\n                        设置\n                    </a>\n                    <div class="simple-setting"></div>\n                </div>');
                utils.loopDetector((() => $("#miniHistoryBtn").length > 0), (() => {
                    $(".miniHistoryBtnBox").before('\n                    <div class="navbar-item mini-setting-box" style="position:relative;margin-left: auto;">\n                        <a id="mini-setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-left:0 !important;padding-right:0 !important;">\n                            设置\n                        </a>\n                        <div class="mini-simple-setting"></div>\n                    </div>\n                ');
                    e();
                }));
                $(window).resize(e);
            }
            c && $("#navbar").append(`\n                <ul class="nav navbar-nav navbar-right setting-box">\n                    <li><a id="setting-btn" style="color: #ff8400 !important;padding-right:15px !important;" role="button">设置</a><div class="simple-setting">${this.simpleSetting()}</div></li>\n                </ul>\n           `);
            $(".main-nav").on("click", "#setting-btn, #mini-setting-btn", (() => {
                layer.open({
                    type: 1,
                    title: "设置",
                    content: '\n            <div style=" display: flex; flex-direction: column; height: 100%; ">\n                <div style="margin: 20px">\n                  <a id="importBtn" class="menu-btn" style="background-color:#d25a88"><span>导入数据</span></a>\n                  <a id="exportBtn" class="menu-btn" style="background-color:#85d0a3"><span>导出数据</span></a>\n                  <a id="syncDataBtn" class="menu-btn" style="background-color:#387ca9"><span>同步数据</span></a>\n                  <a id="getRefreshTokenBtn" class="menu-btn fr-btn" style="background-color:#c4a35e"><span>获取refresh_token</span></a>\n\n                </div>\n                <div style=" flex: 1; overflow-y: auto; margin: 0 20px; padding-bottom: 20px; ">\n                    <div class="setting-item">\n                        <span class="setting-label">阿里云盘备份</span>\n                        <div>\n                            <a id="backupBtn" class="menu-btn" style="background-color:#5d87c2"><span>备份数据</span></a>\n                            <a id="backupListBtn" class="menu-btn" style="background-color:#48c554"><span>查看备份</span></a>\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">refresh_token:</span>\n                        <div class="form-content">\n                            <input id="refresh_token" >\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 2px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));"/>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">WebDav备份</span>\n                        <div>\n                            <a id="webdavBackupBtn" class="menu-btn" style="background-color:#5d87c2"><span>备份数据</span></a>\n                            <a id="webdavBackupListBtn" class="menu-btn" style="background-color:#48c554"><span>查看备份</span></a>\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">服务地址:</span>\n                        <div class="form-content">\n                            <input id="webDavUrl" >\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">用户名:</span>\n                        <div class="form-content">\n                            <input id="webDavUsername" >\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">密码:</span>\n                        <div class="form-content">\n                            <input id="webDavPassword" >\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 2px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));"/>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">评论区条数:</span>\n                        <div class="form-content">\n                            <select id="reviewCount">\n                                <option value="10">10条</option>\n                                <option value="20">20条</option>\n                                <option value="30">30条</option>\n                                <option value="40">40条</option>\n                                <option value="50">50条</option>\n                            </select>\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">每次打开待鉴定待下载数量:</span>\n                        <div class="form-content">\n                            <input type="number" id="waitCheckCount" min="1" max="20" style="width: 100%;">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">JavDb地址(用于跟Bus同步数据):</span>\n                        <div class="form-content">\n                            <input id="javDbUrl" >\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 2px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.75), rgba(0,0,0,0));"/>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">评论区屏蔽词:</span>\n                        <div id="reviewKeywordContainer" style="max-width: 50%;min-width: 50%;">\n                            <div class="tag-box">\n                            </div>\n                            <div style="margin-top: 10px;">\n                                <button class="add-tag-btn">添加</button>\n                                <input type="text" class="keyword-input" placeholder="添加屏蔽词">\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">视频标题屏蔽词:</span>\n                        <div id="filterKeywordContainer" style="max-width: 50%;min-width: 50%;">\n                            <div class="tag-box">\n                            </div>\n                            <div style="margin-top: 10px;">\n                                <button class="add-tag-btn">添加</button>\n                                <input type="text" class="keyword-input" placeholder="添加屏蔽词">\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">屏蔽男演员:</span>\n                        <div id="filterActorContainer" style="max-width: 50%;min-width: 50%;">\n                            <div class="tag-box">\n                            </div>\n                            <div style="margin-top: 10px;">\n                                <button class="add-tag-btn">添加</button>\n                                <input type="text" class="keyword-input" placeholder="添加屏蔽词">\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <div style=" flex-shrink: 0; padding: 15px 20px; text-align: right; border-top: 1px solid #eee; background: white; ">   \n                    <button id="saveBtn">保存设置</button>\n                </div>\n            </div>\n        ',
                    area: utils.getResponsiveArea(),
                    scrollbar: !1,
                    success: (e, t) => {
                        $(e).find(".layui-layer-content").css("position", "relative");
                        this.loadForm();
                        this.bindClick();
                    }
                });
            }));
            $(".main-nav").on("mouseenter", ".setting-box", (() => {
                $(".simple-setting").html(this.simpleSetting()).show();
                this.initSimpleSettingForm().then();
            })).on("mouseleave", ".setting-box", (() => {
                $(".simple-setting").html("").hide();
            }));
            $(".main-nav").on("mouseenter", ".mini-setting-box", (() => {
                $(".mini-simple-setting").html(this.simpleSetting()).show();
                this.initSimpleSettingForm().then();
            })).on("mouseleave", ".mini-setting-box", (() => {
                $(".mini-simple-setting").html("").hide();
            }));
        }

        simpleSetting() {
            return '\n             <div style="display: flex; flex-direction: column; height: 100%;margin-top:20px">\n                <div style=" flex: 1; overflow-y: auto; margin: 0 10px; ">\n                    <div class="setting-item">\n                        <span class="setting-label">隐藏已鉴定内容:</span>\n                        <div class="form-content">\n                            <input type="checkbox" id="hideFilterItem" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">弹窗方式打开页面:</span>\n                        <div class="form-content">\n                             <input type="checkbox" id="dialogOpenDetail" class="mini-switch">\n                        </div>\n                    </div>       \n                                    \n                    <div class="setting-item">\n                        <span class="setting-label">页面列数: <span id="showContainerColumns"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerColumns" min="3" max="10" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">页面宽度: <span id="showContainerWidth"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerWidth" min="0" max="30" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                </div>\n                <div style="flex-shrink: 0; padding: 0 20px 15px; text-align: right; border-top: 1px solid #eee;">   \n                    <button id="moreBtn">更多设置</button>\n                </div>\n            </div>\n        ';
        }

        async loadForm() {
            let e = await storageManager.getSetting();
            $("#reviewCount").val(e.reviewCount || 20);
            $("#waitCheckCount").val(e.waitCheckCount || 5);
            $("#refresh_token").val(e.refresh_token || "");
            $("#javDbUrl").val(e.javDbUrl || "https://javdb.com");
            $("#webDavUrl").val(e.webDavUrl || "");
            $("#webDavUsername").val(e.webDavUsername || "");
            $("#webDavPassword").val(e.webDavPassword || "");
            let t = await storageManager.getReviewFilterKeywordList(), n = await storageManager.getTitleFilterKeyword(), a = await storageManager.getFilterActorList();
            t && t.forEach((e => {
                this.addLabelTag("#reviewKeywordContainer", e);
            }));
            n && n.forEach((e => {
                this.addLabelTag("#filterKeywordContainer", e);
            }));
            a && a.forEach((e => {
                this.addLabelTag("#filterActorContainer", e);
            }));
            ["#reviewKeywordContainer", "#filterKeywordContainer", "#filterActorContainer"].forEach((e => {
                $(`${e} .add-tag-btn`).on("click", (t => this.addKeyword(t, e)));
                $(`${e} .keyword-input`).on("keypress", (t => {
                    "Enter" === t.key && this.addKeyword(t, e);
                }));
            }));
        }

        async initSimpleSettingForm() {
            let e = await storageManager.getSetting();
            $("#hideFilterItem").prop("checked", !e.hideFilterItem || "yes" === e.hideFilterItem);
            $("#containerColumns").val(e.containerColumns || 4);
            $("#showContainerColumns").text(e.containerColumns || 4);
            $("#containerWidth").val((e.containerWidth || 100) - 70);
            $("#showContainerWidth").text((e.containerWidth || 100) + "%");
            $("#dialogOpenDetail").prop("checked", !e.dialogOpenDetail || "yes" === e.dialogOpenDetail);
            $("#containerColumns").on("input", (e => {
                let t = $("#containerColumns").val();
                $("#showContainerColumns").text(t);
                if (l) {
                    document.querySelector(".movie-list").style.gridTemplateColumns = `repeat(${t}, minmax(0, 1fr))`;
                }
                if (c) {
                    document.querySelector(".masonry").style.gridTemplateColumns = `repeat(${t}, minmax(0, 1fr))`;
                }
                storageManager.saveSettingItem("containerColumns", t);
            }));
            $("#containerWidth").on("input", (e => {
                let t = parseInt($(e.target).val());
                const n = t + 70 + "%";
                $("#showContainerWidth").text(n);
                if (l) {
                    document.querySelector("section .container").style.minWidth = n;
                }
                if (c) {
                    document.querySelector(".container-fluid .row").style.minWidth = n;
                }
                storageManager.saveSettingItem("containerWidth", t + 70);
            }));
            $("#dialogOpenDetail").on("change", (e => {
                let t = $("#dialogOpenDetail").is(":checked") ? "yes" : "no";
                storageManager.saveSettingItem("dialogOpenDetail", t);
            }));
            $("#hideFilterItem").on("change", (e => {
                let t = $("#hideFilterItem").is(":checked") ? "yes" : "no";
                storageManager.saveSettingItem("hideFilterItem", t);
                window.refresh();
            }));
            $("#moreBtn").on("click", (() => {
                $(".simple-setting").html("").hide();
                $("#setting-btn")[0].click();
            }));
        }

        bindClick() {
            $("#importBtn").on("click", (e => this.importData(e)));
            $("#exportBtn").on("click", (e => this.exportData(e)));
            $("#syncDataBtn").on("click", (e => this.syncData(e)));
            $("#backupBtn").on("click", (e => this.backupData(e)));
            $("#backupListBtn").on("click", (e => this.backupListBtn(e)));
            $("#webdavBackupBtn").on("click", (e => this.backupDataByWebDav(e)));
            $("#webdavBackupListBtn").on("click", (e => this.backupListBtnByWebDav(e)));
            $("#getRefreshTokenBtn").on("click", (e => layer.alert("即将跳转阿里云盘, 请登录后, 点击最右侧悬浮按钮获取refresh_token", {
                yes: function (e, t, n) {
                    window.open("https://www.aliyundrive.com/drive/home");
                    layer.close(e);
                }
            })));
            $("#saveBtn").on("click", (() => this.saveForm()));
        }

        async saveForm() {
            const e = $("#reviewCount").val(), t = $("#waitCheckCount").val(), n = $("#refresh_token").val();
            let a = await storageManager.getSetting();
            a.reviewCount = e;
            a.waitCheckCount = t;
            a.refresh_token = n;
            a.webDavUrl = $("#webDavUrl").val();
            a.webDavUsername = $("#webDavUsername").val();
            a.webDavPassword = $("#webDavPassword").val();
            a.javDbUrl = new URL($("#javDbUrl").val()).origin;
            await storageManager.saveSetting(a);
            let i = [];
            $("#reviewKeywordContainer .keyword-label").toArray().forEach((e => {
                let t = $(e).text().replace("×", "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
                i.push(t);
            }));
            await storageManager.saveReviewFilterKeyword(i);
            let r = [];
            $("#filterKeywordContainer .keyword-label").toArray().forEach((e => {
                let t = $(e).text().replace("×", "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
                r.push(t);
            }));
            await storageManager.saveTitleFilterKeyword(r);
            let s = [];
            $("#filterActorContainer .keyword-label").toArray().forEach((e => {
                let t = $(e).text().replace("×", "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
                s.push(t);
            }));
            await storageManager.saveFilterActor(s);
            show.ok("保存成功");
            window.refresh();
        }

        addLabelTag(e, t) {
            const n = $(`${e} .tag-box`), a = $(`\n            <div class="keyword-label" style="background-color: #c5b9a0">\n                ${t}\n                <span class="keyword-remove">×</span>\n            </div>\n        `);
            a.find(".keyword-remove").click((e => {
                $(e.target).parent().remove();
            }));
            n.append(a);
        }

        addKeyword(e, t) {
            let n = $(`${t} .keyword-input`);
            const a = n.val().trim();
            if (a) {
                this.addLabelTag(t, a);
                n.val("");
            }
        }

        importData() {
            try {
                const e = document.createElement("input");
                e.type = "file";
                e.accept = ".json";
                e.onchange = e => {
                    const t = e.target.files[0];
                    if (!t) return;
                    const n = new FileReader;
                    n.onload = e => {
                        try {
                            const t = e.target.result.toString(), n = JSON.parse(t);
                            layer.confirm("确定是否要覆盖导入？", {
                                icon: 3,
                                title: "确认覆盖",
                                btn: ["确定", "取消"]
                            }, (async function (e) {
                                await storageManager.importData(n);
                                show.ok("数据导入成功");
                                layer.close(e);
                                location.reload();
                            }));
                        } catch (t) {
                            console.error(t);
                            show.error("导入失败：文件内容不是有效的JSON格式 " + t);
                        }
                    };
                    n.onerror = () => {
                        show.error("读取文件时出错");
                    };
                    n.readAsText(t);
                };
                document.body.appendChild(e);
                e.click();
                setTimeout((() => document.body.removeChild(e)), 1e3);
            } catch (e) {
                console.error(e);
                show.error("导入数据时出错: " + e.message);
            }
        }

        async backupData(e) {
            const t = await storageManager.getSetting("refresh_token");
            if (!t) {
                show.error("请填写refresh_token并保存后, 再试此功能");
                return;
            }
            let n = utils.getNowStr("_", "_") + ".json", a = JSON.stringify(await storageManager.exportData());
            a = S(a);
            let i = loading();
            try {
                const e = new AliyunApi(t);
                await e.backup(this.folderName, n, a);
                show.ok("备份完成");
            } catch (r) {
                console.error(r);
                show.error(r.toString());
            } finally {
                i.close();
            }
        }

        async backupListBtn(e) {
            const t = await storageManager.getSetting("refresh_token");
            if (!t) {
                show.error("请填写refresh_token并保存后, 再试此功能");
                return;
            }
            let n = loading();
            try {
                const e = new AliyunApi(t), n = await e.getBackupList(this.folderName);
                this.openFileListDialog(n, e, "阿里云盘");
            } catch (a) {
                console.error(a);
                show.error(`发生错误: ${a ? a.message : a}`);
            } finally {
                n.close();
            }
        }

        async backupDataByWebDav(e) {
            const t = await storageManager.getSetting(), n = t.webDavUrl;
            if (!n) {
                show.error("请填写webDav服务地址并保存后, 再试此功能");
                return;
            }
            const a = t.webDavUsername;
            if (!a) {
                show.error("请填写webDav用户名并保存后, 再试此功能");
                return;
            }
            const i = t.webDavPassword;
            if (!i) {
                show.error("请填写webDav密码并保存后, 再试此功能");
                return;
            }
            let r = utils.getNowStr("_", "_") + ".json", s = JSON.stringify(await storageManager.exportData());
            s = S(s);
            let o = loading();
            try {
                const e = new WebDavApi(n, a, i);
                await e.backup(this.folderName, r, s);
                show.ok("备份完成");
            } catch (l) {
                console.error(l);
                show.error(l.toString());
            } finally {
                o.close();
            }
        }

        async backupListBtnByWebDav(e) {
            const t = await storageManager.getSetting(), n = t.webDavUrl;
            if (!n) {
                show.error("请填写webDav服务地址并保存后, 再试此功能");
                return;
            }
            const a = t.webDavUsername;
            if (!a) {
                show.error("请填写webDav用户名并保存后, 再试此功能");
                return;
            }
            const i = t.webDavPassword;
            if (!i) {
                show.error("请填写webDav密码并保存后, 再试此功能");
                return;
            }
            let r = loading();
            try {
                const e = new WebDavApi(n, a, i), t = await e.getBackupList(this.folderName);
                this.openFileListDialog(t, e, "WebDav");
            } catch (s) {
                console.error(s);
                show.error(`发生错误: ${s ? s.message : s}`);
            } finally {
                r.close();
            }
        }

        openFileListDialog(e, t, n) {
            layer.open({
                type: 1,
                title: n + "备份文件",
                content: '<div id="table-container"></div>',
                area: ["40%", "70%"],
                success: a => {
                    const i = new TableGenerator({
                        containerId: "table-container",
                        columns: [{
                            key: "name",
                            title: "文件名"
                        }, {
                            key: "createTime",
                            title: "备份日期",
                            render: e => `${utils.getNowStr("-", ":", e.createTime)}`
                        }, {
                            key: "size",
                            title: "文件大小",
                            render: e => {
                                const t = ["B", "KB", "MB", "GB", "TB", "PB"];
                                let n = 0, a = e.size;
                                for (; a >= 1024 && n < t.length - 1;) {
                                    a /= 1024;
                                    n++;
                                }
                                return `${a % 1 == 0 ? a.toFixed(0) : a.toFixed(2)} ${t[n]}`;
                            }
                        }],
                        data: e,
                        buttons: [{
                            text: "删除",
                            class: "a-danger",
                            onClick: async (e, a) => {
                                layer.confirm(`是否删除 ${a.name} ?`, {
                                    icon: 3,
                                    title: "提示",
                                    btn: ["确定", "取消"]
                                }, (async e => {
                                    layer.close(e);
                                    let r = loading();
                                    try {
                                        await t.deleteFile(a.fileId);
                                        let e = await t.getBackupList(this.folderName);
                                        i.update(e);
                                        "阿里云盘" === n ? layer.alert("已移至回收站, 请到阿里云盘回收站二次删除") : layer.alert("删除成功");
                                    } catch (s) {
                                        console.error(s);
                                        show.error(`发生错误: ${s ? s.message : s}`);
                                    } finally {
                                        r.close();
                                    }
                                }));
                            }
                        }, {
                            text: "下载",
                            class: "a-primary",
                            onClick: e => {
                                let a = loading();
                                try {
                                    "阿里云盘" === n ? t.getDownloadUrl(e.fileId).then((t => {
                                        gmHttp.get(t, null, {
                                            Referer: "https://www.aliyundrive.com/"
                                        }).then((t => {
                                            t = D(t);
                                            utils.download(t, e.name);
                                        }));
                                    })).catch((e => {
                                        console.error(e);
                                        show.error("下载失败: " + e);
                                    })) : t.getFileContent(e.fileId).then((t => {
                                        t = D(t);
                                        utils.download(t, e.name);
                                    }));
                                } catch (i) {
                                    console.error(i);
                                    show.error("下载失败: " + i);
                                } finally {
                                    a.close();
                                }
                            }
                        }, {
                            text: "导入",
                            class: "a-success",
                            onClick: e => {
                                layer.confirm(`是否将该云备份数据 ${e.name} 导入?`, {
                                    icon: 3,
                                    title: "提示",
                                    btn: ["确定", "取消"]
                                }, (async a => {
                                    layer.close(a);
                                    let i = loading();
                                    try {
                                        let a;
                                        if ("阿里云盘" === n) {
                                            const n = await t.getDownloadUrl(e.fileId);
                                            a = await gmHttp.get(n, null, {
                                                Referer: "https://www.aliyundrive.com/"
                                            });
                                        } else a = await t.getFileContent(e.fileId);
                                        a = D(a);
                                        const i = JSON.parse(a);
                                        await storageManager.importData(i);
                                        show.ok("导入成功!");
                                        window.location.reload();
                                    } catch (r) {
                                        console.error(r);
                                        show.error(r);
                                    } finally {
                                        i.close();
                                    }
                                }));
                            }
                        }]
                    });
                }
            });
        }

        async exportData(e) {
            try {
                const e = JSON.stringify(await storageManager.exportData()), t = `${utils.getNowStr("_", "_")}.json`;
                utils.download(e, t);
                show.ok("数据导出成功");
            } catch (t) {
                console.error(t);
                show.error("导出数据时出错: " + t.message);
            }
        }

        async syncData(e) {
            let t = null, n = null;
            if (l) {
                t = "是否将JavBus的数据及配置同步到本站中? ";
                n = "https://www.javbus.com/temp?syncData=1";
            }
            if (c) {
                t = "是否将JavDB的数据及配置同步到本站中? ";
                n = await storageManager.getSetting("javDbUrl", "https://javdb.com") + "/feedbacks/new?syncData=1";
            }
            utils.q(e, t, (() => {
                const e = window.open(n);
                let t = new URL(n).origin;
                console.log("开始连接接受方:", t);
                let r, s = 0;
                if (!this.hasListenMsg) {
                    window.addEventListener("message", (n => {
                        if (n.origin === t) if ("ok" === n.data) {
                            clearInterval(r);
                            console.log("连接确认，开始同步数据");
                            e.postMessage("syncData", t);
                        } else {
                            const e = n.data;
                            console.log("收到数据", e);
                            __privateMethod(this, a, i).call(this, e);
                        }
                    }));
                    this.hasListenMsg = !0;
                }
                const o = () => {
                    if (s >= 8) {
                        clearInterval(r);
                        console.log("超过最大重试次数，停止尝试");
                        show.error("同步失败, 目标网站已中断, 请检查是否登录后再试!", {
                            close: !0,
                            duration: -1
                        });
                    } else {
                        console.log(`第 ${s + 1} 次ping...`);
                        e.postMessage("ping", t);
                        s++;
                    }
                };
                r = setInterval(o, 1e3);
                o();
            }));
        }
    }

    a = new WeakSet;
    i = async function (e) {
        try {
            const t = e.carList || [], n = e.filterActor || [], a = e.titleFilterKeyword || [], i = e.reviewFilterKeyword || [], r = e.setting || {}, s = await storageManager.getCarList() || [], o = await storageManager.getFilterActorList() || [], l = await storageManager.getTitleFilterKeyword() || [], c = await storageManager.getReviewFilterKeywordList() || [], d = await storageManager.getSetting() || {}, p = [...s];
            t.forEach((e => {
                s.some((t => t.carNum === e.carNum)) || p.push(e);
            }));
            const g = [...new Set([...o, ...n])], h = [...new Set([...l, ...a])], u = [...new Set([...c, ...i])], m = {
                ...d
            };
            Object.keys(r).forEach((e => {
                e in m && m[e] || (m[e] = r[e]);
            }));
            await storageManager.overrideCarList(p);
            await storageManager.saveFilterActor(g);
            await storageManager.saveTitleFilterKeyword(h);
            await storageManager.saveReviewFilterKeyword(u);
            await storageManager.saveSetting(m);
            show.ok("同步完成, 关闭提示后, 将重载数据", {
                close: !0,
                duration: -1,
                callback: () => {
                    window.location.reload();
                }
            });
        } catch (t) {
            console.error(t);
            show.error("同步数据时出错:", t);
        }
    };
    const C = "x7k9p3";

    function S(e) {
        return (C + e + C).split("").map((e => {
            const t = e.codePointAt(0);
            return String.fromCodePoint(t + 5);
        })).join("");
    }

    function D(e) {
        return e.split("").map((e => {
            const t = e.codePointAt(0);
            return String.fromCodePoint(t - 5);
        })).join("").slice(C.length, -C.length);
    }

    class SyncDataPlugin extends BasePlugin {
        async handle() {
            if (!window.location.href.includes("syncData=1")) return;
            c && $("h4").html("临时页面, 用于同步数据");
            let e = null;
            l && (e = "https://www.javbus.com");
            c && (e = await storageManager.getSetting("javDbUrl", "https://javdb.com"));
            console.log("等待发送方:", e);
            window.addEventListener("message", (async t => {
                if (t.origin === e) if ("ping" === t.data) {
                    console.log("收到 ping，发送确认");
                    t.source.postMessage("ok", t.origin);
                } else if ("syncData" === t.data) {
                    console.log("开始发送数据...");
                    const e = await storageManager.getCarList(), n = await storageManager.getFilterActorList(), a = await storageManager.getTitleFilterKeyword(), i = await storageManager.getReviewFilterKeywordList(), r = await storageManager.getSetting();
                    t.source.postMessage({
                        carList: e,
                        filterActor: n,
                        titleFilterKeyword: a,
                        reviewFilterKeyword: i,
                        setting: r
                    }, t.origin);
                    show.ok("数据已传输, 即将关闭页面...", {
                        callback: () => {
                            window.close();
                        }
                    });
                }
            }));
        }
    }

    class BusPreviewVideoPlugin extends BasePlugin {
        async initCss() {
            return "\n            .video-control-btn {\n                min-width:100px;\n                padding: 8px 16px;\n                background: rgba(0,0,0,0.7);\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n            }\n            .video-control-btn.active {\n                background-color: #1890ff; /* 选中按钮的背景色 */\n                color: white;             /* 选中按钮的文字颜色 */\n                font-weight: bold;        /* 加粗显示 */\n                border: 2px solid #096dd9; /* 边框样式 */\n            }\n        ";
        }

        handle() {
            if (!isDetailPage) return;
            const e = $("#sample-waterfall a:first").attr("href"), t = $(`\n            <a class="preview-video-container sample-box" style="cursor: pointer">\n                <div class="photo-frame" style="position:relative;">\n                    <img src="${e}" class="video-cover" alt="">\n                    <div class="play-icon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); \n                            color:white; font-size:40px; text-shadow:0 0 10px rgba(0,0,0,0.5);">\n                        ▶\n                    </div>\n                </div>\n            </a>`);
            $("#sample-waterfall").prepend(t);
            let n = $(".preview-video-container");
            n.on("click", (async t => {
                t.preventDefault();
                t.stopPropagation();
                if (!$("#preview-video").length) {
                    let t = await this.parseVideo(e);
                    console.log("解析播放地址:", t);
                    $("#magneturlpost").next().after(`<div><video id="preview-video" controls style="width: 100%;margin-top: 5px;"><source src="${t}" /></video></div>`);
                    this.handleVideo().then((() => {
                        const e = document.getElementById("preview-video");
                        if (e) {
                            const t = e.getBoundingClientRect();
                            window.scrollTo({
                                top: window.scrollY + t.top - 100,
                                behavior: "smooth"
                            });
                        }
                    }));
                }
            }));
            window.location.href.includes("autoPlay=1") && n[0].click();
        }

        async handleVideo() {
            const e = $("#preview-video"), t = e.find("source"), n = e.parent();
            if (!e.length || !t.length) return;
            const a = e[0];
            a.muted = !1;
            a.play();
            n.css("position", "relative");
            const i = t.attr("src"), r = ["hhb", "hmb", "mhb", "mmb"], s = r.find((e => i.includes(e))) || "mhb", o = [{
                id: "video-mmb",
                text: "低画质",
                quality: "mmb"
            }, {
                id: "video-mhb",
                text: "中画质",
                quality: "mhb"
            }, {
                id: "video-hmb",
                text: "高画质",
                quality: "hmb"
            }, {
                id: "video-hhb",
                text: "超高清",
                quality: "hhb"
            }];
            const l = `videoQualities_${this.getPageInfo().carNum}`;
            let c = JSON.parse(sessionStorage.getItem(l));
            if (!c) {
                c = (await Promise.all(o.map((async e => {
                    const t = i.replace(new RegExp(r.join("|"), "g"), e.quality);
                    try {
                        return (await fetch(t, {
                            method: "HEAD"
                        })).ok ? e : null;
                    } catch {
                        return null;
                    }
                })))).filter(Boolean);
                c.length && sessionStorage.setItem(l, JSON.stringify(c));
            }
            if (c.length <= 1) return;
            const d = c.map(((e, t) => `\n                <button class="video-control-btn${e.quality === s ? " active" : ""}" \n                        id="${e.id}" \n                        data-quality="${e.quality}"\n                        style="bottom: ${50 * t}px; right: -105px;">\n                    ${e.text}\n                </button>\n            `)).join("");
            n.append(d);
            const p = n.find(".video-control-btn");
            n.on("click", ".video-control-btn", (async e => {
                const n = $(e.currentTarget), s = n.data("quality");
                if (!n.hasClass("active")) try {
                    const e = i.replace(new RegExp(r.join("|"), "g"), s);
                    t.attr("src", e);
                    a.load();
                    a.muted = !1;
                    await a.play();
                    p.removeClass("active");
                    n.addClass("active");
                } catch (o) {
                    console.error("切换画质失败:", o);
                }
            }));
            p.last().trigger("click");
        }

        async parseVideo(e) {
            const t = `ok_url_${this.getPageInfo().carNum}`;
            let n = sessionStorage.getItem(t);
            if (n) return n;
            const a = e.match(/\/digital\/video\/([^\/]+)\//);
            if (!a || a.length < 2) {
                show.error("解析id错误" + e + ", 该视频没有对应的dmm视频");
                console.error("解析dmm视频id错误", e);
                setTimeout((() => {
                    $("#preview-video").remove();
                }), 1e3);
                return null;
            }
            const i = a[1], r = i.charAt(0).toLowerCase();
            let s = i.substring(0, 3);
            const o = async e => {
                try {
                    console.log("测试视频地址", e);
                    return (await fetch(e, {
                        method: "HEAD"
                    })).ok ? e : null;
                } catch {
                    return null;
                }
            };
            let l = i.replace("00", ""), c = [`https://cc3001.dmm.co.jp/litevideo/freepv/${r}/${s}/${i}/${i}hhb.mp4`, `https://cc3001.dmm.co.jp/litevideo/freepv/${r}/${s}/${l}/${l}hhb.mp4`, `https://cc3001.dmm.co.jp/litevideo/freepv/${r}/${s}/${i}/${i}mhb.mp4`, `https://cc3001.dmm.co.jp/litevideo/freepv/${r}/${s}/${l}/${l}mhb.mp4`], d = null;
            for (let p = 0; p < c.length; p++) {
                let e = await o(c[p]);
                if (e) {
                    console.log("测试成功,", e);
                    d = e;
                    break;
                }
            }
            if (!d) {
                show.error("解析dmm预览视频失败, 请联系作者, 提供番号信息");
                throw new Error("解析dmm预览视频失败, 请联系作者, 提供番号信息");
            }
            sessionStorage.setItem(t, d);
            return d;
        }
    }

    class SearchByImagePlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "siteList", [{
                name: "TinEye",
                url: "https://tineye.com/search?url={占位符}",
                ico: "https://www.google.com/s2/favicons?sz=64&domain=tineye.com"
            }, {
                name: "Bing",
                url: "https://www.bing.com/images/search?q=imgurl:{占位符}&view=detailv2&iss=sbi",
                ico: "https://www.bing.com/favicon.ico"
            }, {
                name: "Google旧版",
                url: "https://www.google.com/searchbyimage?image_url={占位符}&client=firefox-b-d",
                ico: "https://www.google.com/favicon.ico"
            }, {
                name: "Google",
                url: "https://lens.google.com/uploadbyurl?url={占位符}",
                ico: "https://www.google.com/favicon.ico"
            }, {
                name: "Yandex",
                url: "https://yandex.ru/images/search?rpt=imageview&url={占位符}",
                ico: "https://yandex.ru/favicon.ico"
            }]);
            __publicField(this, "isUploading", !1);
        }

        async initCss() {
            return "\n            <style>\n                #upload-area {\n                    border: 2px dashed #85af68;\n                    border-radius: 8px;\n                    padding: 40px;\n                    text-align: center;\n                    margin-bottom: 20px;\n                    transition: all 0.3s;\n                    background-color: #f9f9f9;\n                }\n                #upload-area:hover {\n                    border-color: #76b947;\n                    background-color: #f0f0f0;\n                }\n                /* 拖拽进入 */\n                #upload-area.highlight {\n                    border-color: #2196F3;\n                    background-color: #e3f2fd;\n                }\n                \n                \n                #select-image-btn {\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    transition: background-color 0.3s;\n                }\n                #select-image-btn:hover {\n                    background-color: #45a049;\n                }\n                \n                \n                #handle-btn, #cancel-btn {\n                    padding: 8px 16px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    border: none;\n                    transition: opacity 0.3s;\n                }\n                #handle-btn {\n                    background-color: #2196F3;\n                    color: white;\n                }\n                #handle-btn:hover {\n                    opacity: 0.9;\n                }\n                #cancel-btn {\n                    background-color: #f44336;\n                    color: white;\n                }\n                #cancel-btn:hover {\n                    opacity: 0.9;\n                }\n                \n                .site-btns-container {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 15px;\n                }\n                .site-btn {\n                    display: flex;\n                    align-items: center;\n                    padding: 8px 12px;\n                    background-color: #f5f5f5;\n                    border-radius: 4px;\n                    text-decoration: none;\n                    color: #333;\n                    transition: all 0.2s;\n                    font-size: 14px;\n                    border: 1px solid #ddd;\n                }\n                .site-btn:hover {\n                    background-color: #e0e0e0;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .site-btn img {\n                    width: 16px;\n                    height: 16px;\n                    margin-right: 6px;\n                }\n                .site-btn span {\n                    white-space: nowrap;\n                }\n            </style>\n        ";
        }

        open() {
            layer.open({
                type: 1,
                title: "以图识图",
                content: '\n            <div style="padding: 20px">\n                <div id="upload-area">\n                    <div style="color: #555;margin-bottom: 15px;">\n                        <p>拖拽图片到此处 或 点击按钮选择图片</p>\n                        <p>也可以直接 Ctrl+V 粘贴图片或 图片URL</p>\n                    </div>\n                    <button id="select-image-btn">选择图片</button>\n                    <input type="file" style="display: none" id="image-file" accept="image/*">\n                </div>\n                \n                <div id="url-input-container" style="margin-top: 15px;display: none;">\n                    <input type="text" id="image-url" placeholder="粘贴图片URL地址..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">\n                </div>\n                \n                <div id="preview-area" style="margin-bottom: 20px; text-align: center; display: none;">\n                    <img id="preview-image" alt="" src="" style="max-width: 100%; max-height: 300px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">\n                    <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;" id="action-btns">\n                        <button id="handle-btn">搜索图片</button>\n                        <button id="cancel-btn">取消</button>\n                    </div>\n                    \n                    <div id="search-results" style="display: none;">\n                        <p style="margin: 20px auto">请选择识图网站：<a id="openAll" style="cursor: pointer">全部打开</a></p>\n                        <div class="site-btns-container" id="site-btns-container"></div>\n                    </div>\n                </div>\n                \n            </div>\n        ',
                area: utils.isMobile() ? utils.getResponsiveArea() : ["40%", "80%"],
                success: async e => {
                    this.initEventListeners();
                }
            });
        }

        initEventListeners() {
            const e = $("#upload-area"), t = $("#image-file"), n = $("#select-image-btn"), a = $("#preview-area"), i = $("#preview-image"), r = $("#action-btns"), s = $("#handle-btn"), o = $("#cancel-btn"), l = $("#url-input-container"), c = $("#image-url"), d = $("#search-results"), p = $("#site-btns-container");
            e.on("dragover", (t => {
                t.preventDefault();
                e.addClass("highlight");
            })).on("dragleave", (() => {
                e.removeClass("highlight");
            })).on("drop", (t => {
                t.preventDefault();
                e.removeClass("highlight");
                if (t.originalEvent.dataTransfer.files && t.originalEvent.dataTransfer.files[0]) {
                    this.handleImageFile(t.originalEvent.dataTransfer.files[0]);
                    this.resetSearchUI();
                }
            }));
            n.on("click", (() => {
                t.trigger("click");
            }));
            t.on("change", (e => {
                if (e.target.files && e.target.files[0]) {
                    this.handleImageFile(e.target.files[0]);
                    this.resetSearchUI();
                }
            }));
            $(document).on("paste", (async e => {
                const t = e.originalEvent.clipboardData.items;
                for (let a = 0; a < t.length; a++) if (-1 !== t[a].type.indexOf("image")) {
                    const e = t[a].getAsFile();
                    this.handleImageFile(e);
                    this.resetSearchUI();
                    return;
                }
                const n = e.originalEvent.clipboardData.getData("text");
                if (n && utils.isUrl(n)) {
                    l.show();
                    c.val(n);
                    i.attr("src", n);
                    a.show();
                    this.resetSearchUI();
                }
            }));
            s.on("click", (async () => {
                const e = i.attr("src");
                if (e) {
                    if (!this.isUploading) {
                        this.isUploading = !0;
                        try {
                            const t = await this.searchByImage(e);
                            r.hide();
                            d.show();
                            p.empty();
                            this.siteList.forEach((e => {
                                const n = e.url.replace("{占位符}", encodeURIComponent(t));
                                p.append(`\n                            <a href="${n}" class="site-btn" target="_blank" title="${e.name}">\n                                <img src="${e.ico}" alt="${e.name}">\n                                <span>${e.name}</span>\n                            </a>\n                        `);
                            }));
                            p.show();
                        } finally {
                            this.isUploading = !1;
                        }
                    }
                } else show.info("请粘贴或上传图片");
            }));
            o.on("click", (() => {
                a.hide();
                l.hide();
                t.val("");
                c.val("");
            }));
            c.on("change", (() => {
                if (utils.isUrl(c.val())) {
                    i.attr("src", c.val());
                    a.show();
                }
            }));
            $("#openAll").on("click", (() => {
                $(".site-btn").toArray().forEach((e => {
                    window.open($(e).attr("href"));
                }));
            }));
        }

        resetSearchUI() {
            $("#action-btns").show();
            $("#search-results").hide();
            $("#site-btns-container").hide().empty();
        }

        handleImageFile(e) {
            const t = document.getElementById("preview-image"), n = document.getElementById("preview-area"), a = document.getElementById("url-input-container");
            if (!e.type.match("image.*")) {
                show.info("请选择图片文件");
                return;
            }
            const i = new FileReader;
            i.onload = e => {
                t.src = e.target.result;
                n.style.display = "block";
                a.style.display = "none";
                $("#handle-btn")[0].click();
            };
            i.readAsDataURL(e);
        }

        async searchByImage(e) {
            let t = loading();
            try {
                let t = e;
                if (e.startsWith("data:")) {
                    show.info("开始上传图片...");
                    const n = await async function (e) {
                        var t;
                        const n = e.match(/^data:(.+);base64,(.+)$/);
                        if (!n || n.length < 3) throw new Error("无效的Base64图片数据");
                        const a = n[1], i = n[2], r = atob(i), s = new Array(r.length);
                        for (let g = 0; g < r.length; g++) s[g] = r.charCodeAt(g);
                        const o = new Uint8Array(s), l = new Blob([o], {
                            type: a
                        }), c = new FormData;
                        c.append("image", l);
                        const d = await fetch("https://api.imgur.com/3/image", {
                            method: "POST",
                            headers: {
                                Authorization: "Client-ID d70305e7c3ac5c6"
                            },
                            body: c
                        }), p = await d.json();
                        if (p.success && p.data && p.data.link) return p.data.link;
                        throw new Error((null == (t = p.data) ? void 0 : t.error) || "上传到Imgur失败");
                    }(e);
                    if (!n) {
                        show.error("上传到失败");
                        return;
                    }
                    t = n;
                }
                return t;
            } catch (n) {
                show.error(`搜索失败: ${n.message}`);
                console.error("搜索失败:", n);
            } finally {
                t.close();
            }
        }
    }

    class BusNavBarPlugin extends BasePlugin {
        handle() {
            $("#navbar > div > div > span").append('\n            <button class="btn btn-default" style="color: #0d9488" id="search-img-btn">识图</button>\n       ');
            $("#search-img-btn").on("click", (() => {
                this.getBean("SearchByImagePlugin").open();
            }));
        }
    }

    class RelatedPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "floorIndex", 1);
            __publicField(this, "isInit", !1);
        }

        async showRelated(e) {
            const t = e || $("#magnets-content");
            let n = this.parseMovieId(window.location.href);
            t.append('\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;">相关清单</span>\n                <a id="relatedFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">展开</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">▼</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        ');
            $("#relatedFold").on("click", (e => {
                e.preventDefault();
                e.stopPropagation();
                const t = $("#relatedFold .toggle-text"), a = $("#relatedFold .toggle-icon"), i = "展开" === t.text();
                t.text(i ? "折叠" : "展开");
                a.text(i ? "▲" : "▼");
                if (i) {
                    $("#relatedContainer").show();
                    $("#relatedFooter").show();
                    if (!this.isInit) {
                        this.fetchAndDisplayRelateds(n);
                        this.isInit = !0;
                    }
                } else {
                    $("#relatedContainer").hide();
                    $("#relatedFooter").hide();
                }
            }));
            t.append('<div id="relatedContainer"></div>');
            t.append('<div id="relatedFooter"></div>');
        }

        async fetchAndDisplayRelateds(e) {
            const t = $("#relatedContainer"), n = $("#relatedFooter");
            t.append('<div id="relatedLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">获取清单中...</div>');
            let a = null;
            try {
                a = await P(e, 1, 20);
            } catch (i) {
                console.error("获取清单失败:", i);
            } finally {
                $("#relatedLoading").remove();
            }
            if (a) if (0 !== a.length) {
                this.displayRelateds(a, t);
                if (20 === a.length) {
                    n.html('\n                <button id="loadMoreRelateds" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    加载更多清单\n                </button>\n                <div id="relatedEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部清单</div>\n            ');
                    let a = 1, r = $("#loadMoreRelateds");
                    r.on("click", (async () => {
                        r.text("加载中...").prop("disabled", !0);
                        a++;
                        let n;
                        try {
                            n = await P(e, a, 20);
                        } catch (i) {
                            console.error("加载更多清单失败:", i);
                        } finally {
                            r.text("加载失败, 请点击重试").prop("disabled", !1);
                        }
                        if (n) {
                            this.displayRelateds(n, t);
                            if (n.length < 20) {
                                r.remove();
                                $("#relatedEnd").show();
                            } else r.text("加载更多清单").prop("disabled", !1);
                        }
                    }));
                } else n.html('<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部清单</div>');
            } else t.append('<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">无清单</div>'); else {
                t.append('\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    获取清单失败\n                    <a id="retryFetchRelateds" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">重试</a>\n                </div>\n            ');
                $("#retryFetchRelateds").on("click", (async () => {
                    $("#retryFetchRelateds").parent().remove();
                    await this.fetchAndDisplayRelateds(e);
                }));
            }
        }

        displayRelateds(e, t) {
            e.length && e.forEach((e => {
                let n = `\n                <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                   <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this.floorIndex++}</span>\n                   <span style="position:absolute;bottom:5px;right:10px;color:#999;font-size:12px;">创建时间: ${e.createTime}</span>\n                   <p><a href="/lists/${e.relatedId}" target="_blank" style="color:#2e8abb">${e.name}</a></p>\n                   <p style="margin-top: 5px;">视频个数: ${e.movieCount}</p>\n                   <p style="margin-top: 5px;">收藏次数: ${e.collectionCount} 被查看次数: ${e.viewCount}</p>\n                </div>\n            `;
                t.append(n);
            }));
        }
    }

    class WantAndWatchedVideosPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "type", null);
        }

        async handle() {
            if (window.location.href.includes("/want_watch_videos")) {
                $("h3").append('<a class="a-primary" id="wantWatchBtn" style="padding:10px;">导入至 JHS</a>');
                $("#wantWatchBtn").on("click", (e => {
                    this.type = p;
                    this.importWantWatchVideos(e, "是否将 想看的影片 导入到 JHS-收藏?");
                }));
            }
            if (window.location.href.includes("/watched_videos")) {
                $("h3").append('<a class="a-success" id="wantWatchBtn" style="padding:10px;">导入至 JHS</a>');
                $("#wantWatchBtn").on("click", (e => {
                    this.type = h;
                    this.importWantWatchVideos(e, "是否将 看过的影片 导入到 JHS-已下载?");
                }));
            }
        }

        importWantWatchVideos(e, t) {
            utils.q(null, `${t} <br/> <span style='color: #f40'>执行此功能前请记得备份数据</span>`, (async () => {
                let e = loading();
                try {
                    await this.parseMovieList();
                } catch (t) {
                    console.error(t);
                } finally {
                    e.close();
                }
            }));
        }

        async parseMovieList(e) {
            let t, n;
            if (e) {
                t = e.find(this.getSelector().itemSelector);
                n = e.find(".pagination-next").attr("href");
            } else {
                t = $(this.getSelector().itemSelector);
                n = $(".pagination-next").attr("href");
            }
            for (const i of t) {
                const e = $(i), t = e.find("a").attr("href"), n = e.find(".video-title strong").text().trim();
                if (t && n) try {
                    if (await storageManager.getCar(n)) {
                        show.info(`${n} 已存在, 跳过`);
                        continue;
                    }
                    await storageManager.saveCar(n, t, "", this.type);
                } catch (a) {
                    console.error(`保存失败 [${n}]:`, a);
                }
            }
            if (n) {
                show.info("发现下一页，正在解析:", n);
                await new Promise((e => setTimeout(e, 1e3)));
                $.ajax({
                    url: n,
                    method: "GET",
                    success: e => {
                        const t = new DOMParser, n = $(t.parseFromString(e, "text/html"));
                        this.parseMovieList(n);
                    },
                    error: function (e) {
                        console.error(e);
                        show.error("加载下一页失败:" + e.message);
                    }
                });
            } else {
                show.ok("导入结束!");
                window.refresh();
            }
        }
    }

    class SeHuaTangPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "currentImageIndex", 0);
            __publicField(this, "currentImageGroup", []);
            __publicField(this, "processedArticles", new Set);
        }

        async initCss() {
            return "\n            <style>\n                /*.icn{\n                    width: 85px !important;\n                }*/\n                .xst{\n                    font-size: 15px;\n                    color: #090909;\n                }\n                #threadlisttableid em{\n                    font-size: 15px;\n                }\n            </style>\n        ";
        }

        async handle() {
            let e = $(".enter-btn");
            e.length > 0 && e[0].click();
            if (!window.location.href.includes("viewthread")) {
                this.parseArticleImg().then();
                this.checkDom();
                this.bindClick();
                this.handleImg();
            }
        }

        getInfo(e) {
            let t, n = e.find("a.xst"), a = n.text().trim(), i = n.attr("href");
            t = i.includes("tid=") ? i.match(/tid=(\d+)/)[1] : i.split("-")[1];
            return {
                articleId: t,
                url: i,
                title: a
            };
        }

        bindClick() {
            $("#threadlisttableid").on("click", ".block-btn", (async () => {
                let e = $(event.target).closest("tr");
                const {articleId: t, url: n, title: a} = this.getInfo(e);
                await seHuaTangStorageManager.saveArticle(t, n, a, g);
                show.error("屏蔽成功!");
                this.doFilter().then();
            })).on("click", ".fav-btn", (async e => {
                let t = $(e.target).closest("tr");
                const {articleId: n, url: a, title: i} = this.getInfo(t);
                await seHuaTangStorageManager.saveArticle(n, a, i, p);
                show.ok("收藏成功!");
                this.doFilter().then();
            }));
        }

        async doFilter() {
            const e = await seHuaTangStorageManager.getArticleList();
            $('.icn a[title="新窗口打开"], .icn a[title="有新回复 - 新窗口打开"]').toArray().forEach((t => {
                $(t).hide();
                let n = $(t).parent();
                n.find(".fav-btn").length || n.prepend('\n                    <a class="block-btn" style="color: #d99c1c; cursor: pointer; display: inline-block;min-width: 37px;">屏蔽</a>\n                    <a class="fav-btn" style="color: #1cd925; cursor: pointer; display: inline-block;min-width: 37px;">收藏</a>\n                ');
                let a = n.parent();
                const {articleId: i, url: r, title: s} = this.getInfo(a), o = e.find((e => e.articleId === i));
                o && o.status === p && a.find(".common em a").text("已收藏").css("color", "#14e097");
                if (o && o.status === g) {
                    a.find(".common em a").text("已屏蔽").css("color", "#c72222");
                    a.parent().hide();
                }
            }));
        }

        checkDom() {
            const e = document.querySelector("#threadlisttableid"), t = new MutationObserver((async a => {
                t.disconnect();
                try {
                    await this.doFilter();
                    this.parseArticleImg().then();
                } finally {
                    t.observe(e, n);
                }
            })), n = {
                childList: !0,
                subtree: !1
            };
            t.observe(e, n);
        }

        async parseArticleImg() {
            $(".s.xst").each((async (e, t) => {
                const n = $(t).attr("href");
                if (!this.processedArticles.has(n)) {
                    this.processedArticles.add(n);
                    try {
                        const e = $(t).closest("tbody");
                        if (e.find(".imageBox").length) return;
                        if (!e.is(":visible")) return;
                        const a = await fetch(n);
                        if (!a.ok) return;
                        const i = $($.parseHTML(await a.text())).find("img.zoom[file]:not([file*='static'], [file*='hrline'])").slice(0, 5);
                        if (!i.length) return;
                        const r = i.map(((e, t) => `<img src="${$(t).attr("file")}" style="width:300px;height:auto;max-width:300px;max-height:300px;object-fit:contain" onclick="zoom(this,this.src,0,0,0)" alt="">`)).get().join("");
                        e.append(`\n                    <tr class="imageBox">\n                        <td colspan="5">\n                            <div style="display:flex;gap:10px;overflow-x:auto;padding:5px 0">${r}</div>\n                        </td>\n                    </tr>\n            `);
                    } catch (a) {
                        console.error("Error:", n, a);
                    }
                }
            }));
        }

        handleImg() {
            document.addEventListener("click", (e => {
                if ("IMG" === e.target.tagName && e.target.closest(".imageBox")) {
                    const t = e.target.closest(".imageBox");
                    this.currentImageGroup = Array.from(t.querySelectorAll("img"));
                    this.currentImageIndex = this.currentImageGroup.indexOf(e.target);
                    this.createNavigateBtn();
                }
            }));
        }

        navigateImage(e) {
            this.currentImageIndex = (this.currentImageIndex + e + this.currentImageGroup.length) % this.currentImageGroup.length;
            const t = this.currentImageGroup[this.currentImageIndex];
            zoom(t, t.src, 0, 0, 0);
            this.createNavigateBtn();
        }

        createNavigateBtn() {
            utils.loopDetector((() => $("#imgzoom_picpage").length > 0), (() => {
                if (0 === $("#imgzoom_picpage").length) return;
                const e = document.getElementById("imgzoom_picpage");
                console.log("zoomContainer", e);
                if (!e) return;
                e.querySelectorAll("#zimg_prev, #zimg_next").forEach((e => e.remove()));
                const t = document.createElement("div");
                t.id = "zimg_prev";
                t.className = "zimg_prev";
                t.onclick = () => this.navigateImage(-1);
                const n = document.createElement("div");
                n.id = "zimg_next";
                n.className = "zimg_next";
                n.onclick = () => this.navigateImage(1);
                e.append(t, n);
            }));
        }
    }

    class CopyTitleOrDownImgPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "titleSvg", '<svg t="1747553289744" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7507" width="200" height="200"><path d="M959.8 150.8c0-2.3-1.9-4.2-4.2-4.2H253.3c-2.3 0-4.2 1.9-4.2 4.2v115.9c0 2.3 1.9 4.2 4.2 4.2h702.3c2.3 0 4.2-1.9 4.2-4.2V150.8z" fill="" p-id="7508"></path><path d="M126.4 208.8m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7509"></path><path d="M851.5 453.7c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.7-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V453.7z" fill="" p-id="7510"></path><path d="M126.4 512m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7511"></path><path d="M851.5 756.9c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.8-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V756.9z" fill="" p-id="7512"></path><path d="M126.4 815.2m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7513"></path></svg>');
            __publicField(this, "carNumSvg", '<svg t="1747552574854" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3539" width="200" height="200"><path d="M920.337035 447.804932c-6.067182-6.067182-10.918677-11.643178-16.985859-17.71036l48.536436-30.334889-42.469254-109.207238-121.340579 12.134365c-6.067182-6.067182-6.067182-12.134365-12.134365-18.201547-12.134365-12.134365-18.201547-24.267706-24.267706-30.334889-24.26873-36.402071-30.334889-42.469254-54.603619-42.469254H339.116511c-18.201547 0-24.267706 6.067182-54.603619 42.469254-6.067182 6.067182-12.134365 18.201547-24.267706 30.334889 0 0-6.067182 6.067182-12.134365 18.201547l-115.27442-12.134365-48.536436 109.207238 51.090608 24.378223c-6.067182 6.067182-30.334889 34.660404-30.334889 34.660405l-15.542998 22.280446-12.282744 17.018605c-6.067182 12.134365-5.064342 10.868535-5.064342 29.070082v224.480635c0 36.402071 18.201547 60.670801 54.603618 60.670801h115.273397c36.402071 0 54.603619-24.267706 54.603619-54.603619v-18.201547h424.693562v18.201547c0 30.334889 18.201547 54.603619 54.603618 54.603619h115.273397c36.402071 0 60.670801-24.267706 60.670801-60.670801V539.300786c0-42.469254 0.685615-46.662763-11.44875-64.863287-4.731768-6.744611-11.94403-16.196891-20.101827-26.632567z m-35.186383-78.381161l-30.334889 18.201547-12.134365-12.134365c-6.067182-8.899694-12.134365-12.134365-12.134365-18.201547l42.469254-6.067183 12.134365 18.201548z m-533.899776-97.072873h339.755054l78.871325 103.140055H272.378527l78.872349-103.140055zM175.305655 357.290429h36.402071c-6.067182 6.067182-6.067182 12.134365-12.134365 18.201547l-18.201547 6.067183-18.201547-12.134365 12.135388-12.134365z m667.375743 394.35765h-54.603619V678.843936H242.043638v72.804143H132.837424V527.167444c0-12.134365-0.041956-20.662599 1.216711-23.556508 1.258667-2.89391 9.955746-16.924461 21.193695-29.173437l35.722596-38.276768h639.576607l21.917172 20.938891c6.067182 6.067182 21.847587 21.366633 25.712615 28.732392 7.621585 9.996678 6.973832 10.999518 13.041014 23.133883v242.682182h-48.536436zM242.043638 533.234627h133.474944v60.670801H242.043638v-60.670801z m412.559197 0h133.474944v60.670801H654.602835v-60.670801z" p-id="3540"></path></svg>');
            __publicField(this, "downSvg", '<svg t="1747552626242" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4551" width="200" height="200"><path d="M641.6 660l-8.64-64 32-4.32a211.2 211.2 0 0 0-26.72-420.32 215.36 215.36 0 0 0-213.12 192 94.56 94.56 0 0 0 0 11.52v41.28h-64V384v-7.04a153.12 153.12 0 0 1 0-19.52A279.84 279.84 0 0 1 636.16 108H640A275.2 275.2 0 0 1 673.28 656z" fill="#333333" p-id="4552"></path><path d="M490.4 446.24l-7.52-39.84a182.4 182.4 0 0 1 107.52-162.88l29.12-13.28L646.08 288l-29.12 13.28a117.92 117.92 0 0 0-70.08 101.28l6.24 30.4zM392.96 652.32h-78.72A202.24 202.24 0 0 1 256 256l30.72-9.12 18.24 61.28-30.72 9.12a138.24 138.24 0 0 0 39.68 270.72h78.72zM479.2 512h64v320h-64z" fill="#333333" p-id="4553"></path><path d="M510.4 908l-156.32-147.68 43.84-46.4 112.48 106.08 112.8-106.08 43.84 46.56-156.64 147.52z" fill="#333333" p-id="4554"></path></svg>');
        }

        async initCss() {
            return `\n            .box .tags {\n                justify-content: space-between;\n            }\n            .tool-box span{\n                opacity:.3\n            }\n            \n            .tool-box span:hover{\n                opacity:1\n            }\n            ${c ? ".tool-box .icon{ height: 2rem; width: 2rem; }" : ""}\n            \n            \n            .tool-box svg path {\n              fill: blue;\n            }\n            \n            [data-theme="dark"] .tool-box svg path {\n              fill: white;\n            }\n        `;
        }

        handle() {
            if (window.isListPage) {
                this.addCopy();
                this.bindClick();
            }
        }

        addCopy() {
            $(this.getSelector().itemSelector).toArray().forEach((e => {
                let t = $(e);
                if (!(t.find(".tool-box").length > 0)) {
                    l && t.find(".tags").append(`\n                    <div class="tool-box" style="margin-left: auto">\n                        <span class="carNumSvg" title="复制番号" style="margin-right: 15px; color:#9f2727;">${this.carNumSvg}</span>\n                        <span class="titleSvg"  title="复制标题" style="margin-right: 15px; color:#c5a45d;">${this.titleSvg}</span>\n                        <span class="downSvg"   title="下载封面" style="margin-right: 15px; color:#2ca5c0;">${this.downSvg}</span>\n                    </div>\n                `);
                    if (c) {
                        if (t.find(".avatar-box").length > 0) return;
                        t.find(".photo-info").append(`\n                    <div class="tool-box">\n                        <span class="carNumSvg" title="复制番号" style="margin-right: 15px;">${this.carNumSvg}</span>\n                         <span class="titleSvg" title="复制标题" style="margin-right: 15px;">${this.titleSvg}</span>\n                        <span class="downSvg"   title="下载封面" style="margin-right: 15px;">${this.downSvg}</span>\n                    </div>                \n                `);
                    }
                }
            }));
        }

        bindClick() {
            const e = this.getBean("ListPagePlugin");
            $(document).on("click", ".titleSvg", (t => {
                t.preventDefault();
                t.stopPropagation();
                const n = $(t.target).closest(".item"), {carNum: a, aHref: i, title: r} = e.findCarNumAndHref(n);
                navigator.clipboard.writeText(r).then((() => {
                    show.info("标题已复制到剪切板, " + r);
                })).catch((e => {
                    console.error("复制失败: ", e);
                }));
            })).on("click", ".carNumSvg", (t => {
                t.preventDefault();
                t.stopPropagation();
                const n = $(t.target).closest(".item"), {carNum: a, aHref: i, title: r} = e.findCarNumAndHref(n);
                navigator.clipboard.writeText(a).then((() => {
                    show.info("番号已复制到剪切板, " + a);
                })).catch((e => {
                    console.error("复制失败: ", e);
                }));
            })).on("click", ".downSvg", (t => {
                t.preventDefault();
                t.stopPropagation();
                const n = $(t.target).closest(".item"), {carNum: a, aHref: i, title: r} = e.findCarNumAndHref(n);
                let s = n.find(".cover img");
                c && (s = n.find(".photo-frame img"));
                const o = s.attr("src");
                http.get(o).then((e => {
                    utils.download(e, r + ".jpg");
                }));
            }));
        }
    }

    class Fc2By123AvPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "baseUrl", "https://123av.com/ja");
            __publicField(this, "$contentBox", $(".section .container"));
            __publicField(this, "urlParams", new URLSearchParams(window.location.search));
            __publicField(this, "sortVal", this.urlParams.get("sort") || "release_date");
            __publicField(this, "currentPage", this.urlParams.get("page") ? parseInt(this.urlParams.get("page")) : 1);
            __publicField(this, "maxPage", null);
            __publicField(this, "keyword", this.urlParams.get("keyword") || null);
        }

        handle() {
            $('.tabs li:contains("FC2")').after('<li><a href="/advanced_search?type=100&released_start=2099-09"><span>123Av-Fc2</span></a></li>');
            if (o.includes("/advanced_search?type=100")) {
                this.hookPage();
                this.handleQuery().then();
            }
        }

        hookPage() {
            let e = $("h2.section-title");
            e.contents().first().replaceWith("123Av");
            e.css("marginBottom", "0");
            e.append('\n            <div style="margin-left: 100px; width: 400px;">\n                <input id="search-123av-keyword" type="text" placeholder="搜索123Av Fc2ppv内容" style="padding: 4px 5px;margin-right: 0">\n                <a id="search-123av-btn" class="a-primary" style="margin-left: 0">搜索</a>\n                <a id="clear-123av-btn" class="a-dark" style="margin-left: 0">重置</a>\n            </div>\n        ');
            $("#search-123av-keyword").val(this.keyword);
            $("#search-123av-btn").on("click", (async () => {
                let e = $("#search-123av-keyword").val().trim();
                if (e) {
                    this.keyword = e;
                    utils.setHrefParam("keyword", e);
                    await this.handleQuery();
                }
            }));
            $("#clear-123av-btn").on("click", (async () => {
                $("#search-123av-keyword").val("");
                this.keyword = "";
                utils.setHrefParam("keyword", "");
                $(".page-box").show();
                $(".tool-box").show();
                await this.handleQuery();
            }));
            $(".empty-message").remove();
            $("#foldCategoryBtn").remove();
            $(".section .container .box").remove();
            $("#sort-toggle-btn").remove();
            this.$contentBox.append('<div class="tool-box" style="margin-top: 10px"></div>');
            this.$contentBox.append('<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>');
            this.$contentBox.append('<div class="page-box"></div>');
            $(".tool-box").append('\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="release_date">发布日期</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="recent_update">最近更新</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="trending">热门</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_today">今天最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_week">本周最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_month">本月最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed">最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_favourited">最受欢迎</a>\n                </div>\n            </div>\n        ');
            $(`#conditionBox a[data-sort="${this.sortVal}"]`).addClass("is-info");
            utils.setHrefParam("sort", this.sortVal);
            utils.setHrefParam("page", this.currentPage);
            $("#conditionBox").on("click", "a.button", (e => {
                let t = $(e.target);
                this.sortVal = t.data("sort");
                utils.setHrefParam("sort", this.sortVal);
                t.siblings().removeClass("is-info");
                t.addClass("is-info");
                this.handleQuery();
            }));
            $(".page-box").append('\n            <nav class="pagination">\n                <a class="pagination-previous">上一页</a>\n                <ul class="pagination-list"></ul>\n                <a class="pagination-next">下一页</a>\n            </nav>\n        ');
            $(document).on("click", ".pagination-link", (e => {
                e.preventDefault();
                this.currentPage = parseInt($(e.target).data("page"));
                utils.setHrefParam("page", this.currentPage);
                this.renderPagination();
                this.handleQuery();
            }));
            $(".pagination-previous").on("click", (e => {
                e.preventDefault();
                if (this.currentPage > 1) {
                    this.currentPage--;
                    utils.setHrefParam("page", this.currentPage);
                    this.renderPagination();
                    this.handleQuery();
                }
            }));
            $(".pagination-next").on("click", (e => {
                e.preventDefault();
                if (this.currentPage < this.maxPage) {
                    this.currentPage++;
                    utils.setHrefParam("page", this.currentPage);
                    this.renderPagination();
                    this.handleQuery();
                }
            }));
        }

        renderPagination() {
            const e = $(".pagination-list");
            e.empty();
            let t = Math.max(1, this.currentPage - 2), n = Math.min(this.maxPage, this.currentPage + 2);
            this.currentPage <= 3 ? n = Math.min(6, this.maxPage) : this.currentPage >= this.maxPage - 2 && (t = Math.max(this.maxPage - 5, 1));
            if (t > 1) {
                e.append('<li><a class="pagination-link" data-page="1">1</a></li>');
                t > 2 && e.append('<li><span class="pagination-ellipsis">…</span></li>');
            }
            for (let a = t; a <= n; a++) {
                const t = a === this.currentPage ? " is-current" : "";
                e.append(`<li><a class="pagination-link${t}" data-page="${a}">${a}</a></li>`);
            }
            if (n < this.maxPage) {
                n < this.maxPage - 1 && e.append('<li><span class="pagination-ellipsis">…</span></li>');
                e.append(`<li><a class="pagination-link" data-page="${this.maxPage}">${this.maxPage}</a></li>`);
            }
        }

        async handleQuery() {
            let e = loading();
            try {
                let e = [];
                e = 1 === this.currentPage ? [1, 2] : [2 * this.currentPage - 1, 2 * this.currentPage];
                if (this.keyword) {
                    e = [1];
                    $(".page-box").hide();
                    $(".tool-box").hide();
                }
                const t = e.map((e => {
                    let t = `${this.baseUrl}/dm3/tags/fc2?sort=${this.sortVal}&page=${e}`;
                    this.keyword && (t = `${this.baseUrl}/search?keyword=${this.keyword}`);
                    return gmHttp.get(t);
                })), n = await Promise.all(t);
                let a = [];
                for (const r of n) {
                    let e = $(r);
                    e.find(".box-item").each(((e, t) => {
                        const n = $(t), i = n.find("img").attr("data-src");
                        let r = n.find("img").attr("title");
                        const s = n.find(".detail a"), o = s.attr("href"), l = this.baseUrl + (o.startsWith("/") ? o : "/" + o), c = s.text().trim().replace(r + " - ", "");
                        r = r.replace("FC2-PPV", "FC2");
                        a.push({
                            imgSrc: i,
                            carNum: r,
                            href: l,
                            title: c
                        });
                    }));
                    if (!this.maxPage) {
                        let t, n = e.find(".page-item:not(.disabled)").last();
                        if (n.find("a.page-link").length) {
                            let e = n.find("a.page-link").attr("href");
                            t = parseInt(e.split("page=")[1]);
                        } else t = parseInt(n.find("span.page-link").text());
                        this.maxPage = Math.ceil(t / 2);
                        this.renderPagination();
                    }
                }
                let i = this.markDataListHtml(a);
                $(".movie-list").html(i);
                await utils.smoothScrollToTop();
            } catch (t) {
                console.error(t);
            } finally {
                e.close();
            }
        }

        open123AvFc2Dialog(e, t) {
            layer.open({
                type: 1,
                title: e,
                content: '\n            <div class="movie-detail-container">\n                <div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>\n                <div class="right-box">\n                    <div class="movie-info-container">\n                        <div class="search-loading">加载中...</div>\n                    </div>\n                    <div style="margin: 10px 0">\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:#25b1dc"><span>收藏</span></a>\n                        <a id="filterBtn" class="menu-btn" style="background-color:#de3333"><span>屏蔽</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:#7bc73b"><span>加入已下载</span></a>\n\n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>字幕 (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>字幕 (迅雷)</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links">\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n                </div>\n            </div>\n        ',
                area: ["80%", "90%"],
                skin: "movie-detail-layer",
                scrollbar: !1,
                success: (n, a) => {
                    this.loadData(e, t);
                    let i = e.replace("FC2-", "");
                    $("#magnets-content").append(this.getBean("MagnetHubPlugin").createMagnetHub(i));
                    $("#favoriteBtn").on("click", (async n => {
                        const a = $("#data-actress").text();
                        await storageManager.saveCar(e, t, a, p);
                        window.refresh();
                        layer.closeAll();
                    }));
                    $("#filterBtn").on("click", (n => {
                        utils.q(n, `是否屏蔽${e}?`, (async () => {
                            const n = $("#data-actress").text();
                            await storageManager.saveCar(e, t, n, g);
                            window.refresh();
                            layer.closeAll();
                            window.location.href.includes("collection_codes?movieId") && utils.closePage();
                        }));
                    }));
                    $("#hasDownBtn").on("click", (async n => {
                        const a = $("#data-actress").text();
                        await storageManager.saveCar(e, t, a, h);
                        window.refresh();
                        layer.closeAll();
                    }));
                    $("#search-subtitle-btn").on("click", (t => utils.openPage(`https://subtitlecat.com/index.php?search=${e}`, e, !1, t)));
                    $("#xunLeiSubtitleBtn").on("click", (() => this.getBean("DetailPageButtonPlugin").searchXunLeiSubtitle(e)));
                }
            });
        }

        async loadData(e, t) {
            let n = loading();
            try {
                const {id: n, publishDate: a, title: i, moviePoster: r} = await this.get123AvVideoInfo(t);
                $(".movie-info-container").html(`\n                    <h3 class="movie-title" style="margin-bottom: 10px">${i || "无标题"}</h3>\n                    <div class="movie-meta" style="margin-bottom: 10px">\n                        <span>番号: ${e || "未知"}</span>\n                        <span>年份: ${a || "未知"}</span>\n                        <span>\n                            站点: \n                            <a href="https://fc2ppvdb.com/articles/${e.replace("FC2-", "")}" target="_blank">fc2ppvdb</a>\n                            <a style="margin-left: 5px;" href="https://adult.contents.fc2.com/article/${e.replace("FC2-", "")}/" target="_blank">fc2电子市场</a>\n                        </span>\n                    </div>\n                    <div class="movie-actors" style="margin-bottom: 10px">\n                        <div class="actor-list">主演: </div>\n                    </div>\n                    <div class="movie-seller" style="margin-bottom: 10px">\n                        <span>販売者: </span>\n                    </div>\n                    <div class="movie-gallery" style="margin-bottom: 10px">\n                        <h4>剧照: </h4>\n                        <div class="image-list"></div>\n                    </div>\n                `);
                this.getMovie(n, r).then((e => {
                    $(".movie-trailer").attr("src", e);
                }));
                this.getImgList(e).then();
                this.getActressInfo(e).then();
            } catch (a) {
                console.error(a);
            } finally {
                n.close();
            }
        }

        async get123AvVideoInfo(e) {
            const t = await gmHttp.get(e), n = t.match(/v-scope="Movie\({id:\s*(\d+),/), a = n ? n[1] : null, i = $(t);
            return {
                id: a,
                publishDate: i.find('span:contains("リリース日:")').next("span").text(),
                title: i.find("h1").text().trim(),
                moviePoster: i.find("#player").attr("data-poster")
            };
        }

        async getActressInfo(e) {
            let t = `https://fc2ppvdb.com/articles/${e.replace("FC2-", "")}`;
            const n = await gmHttp.get(t), a = $(n), i = a.find("div").filter((function () {
                return 0 === $(this).text().trim().indexOf("女優：");
            }));
            if (0 === i.length || i.length > 1) {
                show.error("解析女优信息失败");
                return;
            }
            const r = $(i[0]).find("a");
            let s = "主演: ";
            if (r.length > 0) {
                let e = "";
                r.each(((t, n) => {
                    let a = $(n), i = a.text(), r = a.attr("href");
                    s += `<span class="actor-tag"><a href="https://fc2ppvdb.com${r}" target="_blank">${i}</a></span>`;
                    e += i + " ";
                }));
                $("#data-actress").text(e);
            } else s += "<span>暂无演员信息</span>";
            $(".actor-list").html(s);
            const o = a.find("div").filter((function () {
                return 0 === $(this).text().trim().indexOf("販売者：");
            }));
            if (o.length > 0) {
                const e = $(o[0]).find("a");
                if (e.length > 0) {
                    const t = $(e[0]);
                    console.log(t);
                    let n = t.text(), a = t.attr("href");
                    $(".movie-seller").html(`<span> 販売者: <a href="https://fc2ppvdb.com${a}" target="_blank">${n}</a></span>`);
                }
            }
        }

        async getImgList(e) {
            let t = `https://adult.contents.fc2.com/article/${e.replace("FC2-", "")}/`;
            const n = await gmHttp.get(t, null, {
                referer: t
            });
            let a = $(n).find(".items_article_SampleImagesArea img").map((function () {
                return $(this).attr("src");
            })).get(), i = "";
            Array.isArray(a) && a.length > 0 ? i = a.map(((e, t) => `\n                <a href="${e}" data-fancybox="movie-gallery" data-caption="剧照 ${t + 1}">\n                    <img src="${e}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `)).join("") : $(".movie-gallery").html("<h4>剧照: 暂无剧照</h4>");
            $(".image-list").html(i);
        }

        async getMovie(e, t) {
            let n = `${this.baseUrl}/ajax/v/${e}/videos`, a = loading();
            try {
                let e = (await gmHttp.get(n)).result.watch;
                return e.length > 0 ? e[0].url + "?poster=" + t : null;
            } catch (i) {
                console.error(i);
            } finally {
                a.close();
            }
        }

        markDataListHtml(e) {
            let t = "";
            e.forEach((e => {
                t += `\n                <div class="item">\n                    <a href="${e.href}" class="box" title="${e.title}">\n                        <div class="cover ">\n                            <img loading="lazy" src="${e.imgSrc.replace("/s360", "")}" alt="">\n                        </div>\n                        <div class="video-title"><strong>${e.carNum}</strong> ${e.title}</div>\n                        <div class="score">\n                        </div>\n                        <div class="meta">\n                        </div>\n                        <div class="tags has-addons">\n                        </div>\n                    </a>\n                </div>\n            `;
            }));
            return t;
        }
    }

    class video123AvPlugin extends BasePlugin {
        async handle() {
            if (o.includes("5masterzzz")) {
                localStorage.setItem("__pul", Date.now().toString());
                setInterval((() => {
                    localStorage.setItem("__pul", Date.now().toString());
                }), 5e3);
            }
        }
    }

    class MagnetHubPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "currentEngine", null);
            __publicField(this, "searchEngines", [{
                name: "U3C3",
                id: "u3c3",
                url: "https://u3c3.com/?search2=eelj1a3lfe1a1&search={keyword}",
                parse: this.parseU3C3
            }, {
                name: "BTSOW",
                id: "BTSOW",
                url: "https://btsow.pics/search/{keyword}",
                parse: this.parseBTSOW
            }]);
        }

        async initCss() {
            return "\n            <style>\n                .magnet-container {\n                    margin: 20px auto;\n                    width: 100%;\n                    font-family: Arial, sans-serif;\n                }\n                .magnet-tabs {\n                    display: flex;\n                    border-bottom: 1px solid #ddd;\n                    margin-bottom: 15px;\n                }\n                .magnet-tab {\n                    padding: 5px 12px;\n                    cursor: pointer;\n                    border: 1px solid transparent;\n                    border-bottom: none;\n                    margin-right: 5px;\n                    background: #f5f5f5;\n                    border-radius: 5px 5px 0 0;\n                }\n                .magnet-tab.active {\n                    background: #fff;\n                    border-color: #ddd;\n                    border-bottom: 1px solid #fff;\n                    margin-bottom: -1px;\n                    font-weight: bold;\n                }\n                .magnet-tab:hover:not(.active) {\n                    background: #e9e9e9;\n                }\n                \n                .magnet-results {\n                    min-height: 200px;\n                }\n                .magnet-result {\n                    padding: 15px;\n                    border-bottom: 1px solid #eee;\n                    position: relative; \n                }\n                .magnet-result:hover {\n                    background-color: #f9f9f9;\n                }\n                .magnet-title {\n                    font-weight: bold;\n                    margin-bottom: 5px;\n                    white-space: nowrap;\n                    overflow: hidden; \n                    text-overflow: ellipsis;\n                    padding-right: 80px; \n                }\n                .magnet-info {\n                    display: flex;\n                    justify-content: space-between;\n                    font-size: 12px;\n                    color: #666;\n                    margin-bottom: 5px;\n                }\n                .magnet-loading {\n                    text-align: center;\n                    padding: 20px;\n                }\n                .magnet-error {\n                    color: #f44336;\n                    padding: 10px;\n                }\n                \n                .magnet-copy {\n                position: absolute;\n                right: 15px;\n                top: 12px;\n            }\n                .copy-btn {\n                    background-color: #f0f0f0;\n                    color: #555;\n                    border: 1px solid #ddd;\n                    padding: 3px 8px;\n                    border-radius: 3px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    transition: all 0.2s;\n                }\n                .copy-btn:hover {\n                    background-color: #e0e0e0;\n                    border-color: #ccc;\n                }\n                .copy-btn.copied {\n                    background-color: #4CAF50;\n                    color: white;\n                    border-color: #4CAF50;\n                }\n            </style>\n        ";
        }

        createMagnetHub(e) {
            const t = $('<div class="magnet-container"></div>'), n = $('<div class="magnet-tabs"></div>'), a = localStorage.getItem("magnetHub_selectedEngine");
            let i = 0;
            this.searchEngines.forEach(((e, t) => {
                const r = $(`<div class="magnet-tab" data-engine="${e.id}">${e.name}</div>`);
                if (a && e.id === a) {
                    r.addClass("active");
                    this.currentEngine = e;
                    i = t;
                } else if (0 === t && !a) {
                    r.addClass("active");
                    this.currentEngine = e;
                }
                n.append(r);
            }));
            t.append(n);
            const r = $('<div class="magnet-results"></div>');
            t.append(r);
            t.on("click", ".magnet-tab", (n => {
                const a = $(n.target).data("engine");
                this.currentEngine = this.searchEngines.find((e => e.id === a));
                localStorage.setItem("magnetHub_selectedEngine", a);
                t.find(".magnet-tab").removeClass("active");
                $(n.target).addClass("active");
                this.searchEngine(r, this.currentEngine, e);
            }));
            this.searchEngine(r, this.currentEngine || this.searchEngines[i], e);
            return t;
        }

        searchEngine(e, t, n) {
            e.html(`<div class="magnet-loading">正在从 ${t.name} 搜索 "${n}"...</div>`);
            const a = `${t.name}_${n}`, i = sessionStorage.getItem(a);
            if (i) try {
                const n = JSON.parse(i);
                this.displayResults(e, n, t.name);
                return;
            } catch (s) {
                e.html(`<div class="magnet-error">解析 ${t.name} 缓存结果失败: ${s.message}</div>`);
            }
            const r = t.url.replace("{keyword}", encodeURIComponent(n));
            GM_xmlhttpRequest({
                method: "GET",
                url: r,
                onload: n => {
                    try {
                        const i = t.parse.call(this, n.responseText);
                        i.length > 0 && sessionStorage.setItem(a, JSON.stringify(i));
                        this.displayResults(e, i, t.name);
                    } catch (s) {
                        e.html(`<div class="magnet-error">解析 ${t.name} 结果失败: ${s.message}</div>`);
                    }
                },
                onerror: n => {
                    e.html(`<div class="magnet-error">从 ${t.name} 获取数据失败: ${n.statusText}</div>`);
                }
            });
        }

        displayResults(e, t, n) {
            e.empty();
            if (0 !== t.length) {
                t.forEach((t => {
                    const n = $(`\n                <div class="magnet-result">\n                    <div class="magnet-title"><a href="${t.magnet}">${t.title}</a></div>\n                    <div class="magnet-info">\n                        <span>大小: ${t.size || "未知"}</span>\n                        <span>日期: ${t.date || "未知"}</span>\n                    </div>\n                    <div class="magnet-copy">\n                        <button class="copy-btn" data-magnet="${t.magnet}">复制链接</button>\n                    </div>\n                </div>\n            `);
                    e.append(n);
                }));
                e.on("click", ".copy-btn", (function () {
                    const e = $(this), t = e.data("magnet");
                    navigator.clipboard ? navigator.clipboard.writeText(t).then((() => {
                        a(e);
                    })).catch((n => {
                        i(t, e);
                    })) : i(t, e);
                }));
            } else e.append('<div class="magnet-error">没有找到相关结果</div>');

            function a(e) {
                const t = e.text();
                e.addClass("copied").text("已复制");
                setTimeout((() => {
                    e.removeClass("copied").text(t);
                }), 2e3);
            }

            function i(e, t) {
                const n = document.createElement("textarea");
                n.value = e;
                n.style.position = "fixed";
                document.body.appendChild(n);
                n.select();
                try {
                    document.execCommand("copy");
                    a(t);
                } catch (i) {
                    console.error("复制失败:", i);
                    alert("复制失败，请手动复制链接");
                }
                document.body.removeChild(n);
            }
        }

        parseBTSOW(e) {
            const t = $(e), n = [];
            t.find(".data-list .row").each(((e, t) => {
                const a = $(t);
                let i = a.find("a");
                if (0 === i.length) return;
                const r = i.attr("title"), s = "magnet:?xt=urn:btih:" + i.attr("href").split("/").pop(), o = a.find(".size").text(), l = a.find(".date").text();
                n.push({
                    title: r,
                    magnet: s,
                    size: o,
                    date: l
                });
            }));
            return n;
        }

        parseU3C3(e) {
            const t = $(e), n = [];
            t.find(".torrent-list tbody tr").each(((e, t) => {
                const a = $(t);
                if (a.text().includes("置顶")) return;
                const i = a.find("td:nth-child(2) a").attr("title") || a.find("td:nth-child(2) a").text().trim(), r = a.find("td:nth-child(3) a[href^='magnet:']").attr("href"), s = a.find("td:nth-child(4)").text().trim(), o = a.find("td:nth-child(5)").text().trim();
                r && n.push({
                    title: i,
                    magnet: r,
                    size: s,
                    date: o
                });
            }));
            return n;
        }
    }

    utils.importResource("https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/layer.min.css");
    utils.importResource("https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css");
    window.onload = async function () {
        window.isDetailPage = function () {
            let e = window.location.href;
            return e.includes("javdb") ? e.split("?")[0].includes("/v/") : !!e.includes("javbus") && $("#magnet-table").length > 0;
        }();
        window.isListPage = function () {
            let e = window.location.href;
            return e.includes("javdb") ? $(".movie-list").length > 0 || e.includes("advanced_search") : !!e.includes("javbus") && $(".masonry > div .item").length > 0;
        }();
        !function () {
            const e = new PluginManager;
            let t = window.location.hostname;
            if (t.includes("javdb")) {
                e.register(ListPagePlugin);
                e.register(AutoPagePlugin);
                e.register(Fc2Plugin);
                e.register(FoldCategoryPlugin);
                e.register(ListPageButtonPlugin);
                e.register(HistoryPlugin);
                e.register(SettingPlugin);
                e.register(NavBarPlugin);
                e.register(HitShowPlugin);
                e.register(TOP250Plugin);
                e.register(SyncDataPlugin);
                e.register(SearchByImagePlugin);
                e.register(CopyTitleOrDownImgPlugin);
                e.register(Fc2By123AvPlugin);
                e.register(DetailPagePlugin);
                e.register(ReviewPlugin);
                e.register(RelatedPlugin);
                e.register(DetailPageButtonPlugin);
                e.register(HighlightMagnetPlugin);
                e.register(PreviewVideoPlugin);
                e.register(FilterTitleKeywordPlugin);
                e.register(ActressInfoPlugin);
                e.register(OtherSitePlugin);
                e.register(WantAndWatchedVideosPlugin);
                e.register(MagnetHubPlugin);
            }
            if (t.includes("javbus")) {
                e.register(ListPagePlugin);
                e.register(ListPageButtonPlugin);
                e.register(SettingPlugin);
                e.register(HistoryPlugin);
                e.register(SyncDataPlugin);
                e.register(AutoPagePlugin);
                e.register(SearchByImagePlugin);
                e.register(BusNavBarPlugin);
                e.register(CopyTitleOrDownImgPlugin);
                e.register(BusDetailPagePlugin);
                e.register(DetailPageButtonPlugin);
                e.register(ReviewPlugin);
                e.register(FilterTitleKeywordPlugin);
                e.register(HighlightMagnetPlugin);
                e.register(BusPreviewVideoPlugin);
                e.register(MagnetHubPlugin);
            }
            t.includes("sehuatang") && e.register(SeHuaTangPlugin);
            t.includes("javtrailers") && e.register(JavTrailersPlugin);
            t.includes("subtitlecat") && e.register(SubTitleCatPlugin);
            t.includes("aliyundrive") && e.register(AliyunPanPlugin);
            t.includes("5masterzzz") && e.register(video123AvPlugin);
            e.process().then();
        }();
    };
}();
