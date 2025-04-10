// ==UserScript==
// @name        点击 JAVLibrary 链接标记为已访问
// @author      slowFever
// @namespace   https://greasyfork.org/
// @description:zh   将点击过的 JAVLibrary 链接标记为已访问
// @description:en   Mark clicked JAVLibrary links as visited
// @match       *://*javlibrary.com/*
// @match       *://*javlibrary*/*
// @grant       GM_addStyle
// @version     1.0.0
// @description 2025/4/10 17:05:49
// @license     MIT
// ==/UserScript==

(function () {
    'use strict';

    GM_addStyle(`
        .pubgroup td.left a::before {
            content: "●";
            color: #33c82f;
            padding-right: 4px;
            font-size: 20px;
        }
        
        .pubgroup td.left a:visited::before {
            color: #aaa;
        }
    `);

})()
