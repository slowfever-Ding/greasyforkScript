// ==UserScript==
// @name         AjaxHook 请求监听器
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  使用 ajaxhook 拦截并监听网页中的 XHR 与 fetch 请求
// @author       slowFever
// @grant        none
// @match        *://*/*
// @match        *
// @icon         https://www.tampermonkey.net/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @supportURL   https://github.com/wendux/Ajax-hook
// @license      MIT
// ==/UserScript==

(function() {
    'use strict';

    function safeJSONParse(str) {
        // console.log('[safeJSONParse] 🌟 输入:', str);

        if (typeof str !== 'string' || str.trim() === '') {
            console.warn('[safeJSONParse] ⚠️ 空字符串或非法类型 →', str);
            return null;
        }

        // 🚫 检测明显是代码或非数据
        const suspiciousPatterns = [
            /^<\?php/,           // PHP 代码
            /function\s*\(/,     // JS 函数
            /echo\s+/,           // PHP 输出
            /for\s*\(/,          // JS/PHP 循环
            /console\.log/,      // JS 日志
            /alert\s*\(/,        // JS 弹窗
            /<\/?[a-z][\s\S]*>/i // HTML 标签
        ];

        if (suspiciousPatterns.some(re => re.test(str))) {
            console.warn('[safeJSONParse] ⚠️ 检测到代码/标签特征，跳过 JSON 解析 → 返回原字符串');
            return str;
        }

        // ✅ 尝试 JSON.parse
        try {
            const json = JSON.parse(str);
            console.log('[safeJSONParse] ✅ JSON 解析成功 →', json);
            return json;
        } catch (e) {
            // 不打印“不是合法 JSON”，静默跳过
        }

        // ✅ 尝试 URL 参数
        try {
            const params = new URLSearchParams(str);
            const obj = {};
            for (const [key, value] of params.entries()) {
                obj[key] = value;
            }

            if (Object.keys(obj).length > 0) {
                console.log('[safeJSONParse] ✅ URL 参数解析成功 →', obj);
                return obj;
            }
        } catch (e) {
            // 静默跳过
        }

        // 🚫 最后 fallback
        console.warn('[safeJSONParse] ⚠️ 无法解析，返回原字符串 →', str);
        return str;
    }

    try {
        ah.proxy({
            // 请求发出前
            onRequest: (config, handler) => {
                console.log(`🟡 [AH 请求] 发起请求:`);
                console.log(`🔗 URL: ${config.url}`);
                console.log(`📦 Method: ${config.method}`);
                console.log(`🧾 Headers:`, config.headers);
                console.log(`📤 Body:`, safeJSONParse(config.body));
                handler.next(config);
            },

            // 请求成功响应后
            onResponse: (response, handler) => {
                console.log(`🟢 [AH 响应] 接收到响应:`);
                console.log(`🔗 URL: ${response.config.url}`);
                console.log(`📊 状态: ${response.status}`);
                console.log(`📥 响应内容:`, safeJSONParse(response.response));

                // 这里打印分割线，带时间
                const now = new Date();
                const hh = String(now.getHours()).padStart(2, '0');
                const mm = String(now.getMinutes()).padStart(2, '0');
                const ss = String(now.getSeconds()).padStart(2, '0');
                const time = `${hh}:${mm}:${ss}`;
                console.log(`%c\n========================= 脚本执行完成 🕒 ${time} =========================\n`, 'color: green; font-weight: bold;');

                handler.next(response);
            },

            // 请求异常（如超时、断网）
            onError: (err, handler) => {
                console.error(`🔴 [AH 错误] 请求失败:`);
                console.error(`❗ 错误类型: ${err.type}`);
                console.error(`🔗 请求地址: ${err.config?.url}`);
                handler.next(err);
            }
        });
    } catch (e) {
        console.error('🚨 AjaxHook 初始化失败:', e);
    }

})();
