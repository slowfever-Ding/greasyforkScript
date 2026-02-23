// ==UserScript==
// @name         AV字幕&视频录制下载助手 Pro
// @namespace    Subtitle search displays video download assistant
// @version      0.0.5
// @description  字幕搜索加载显示，深层媒体资源嗅探、M3U8解析、分辨率显示及M3U8下载功能；直播网站视频录制功能。
// @author       JmwPower, slowFever
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/564838/AV%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%E5%BD%95%E5%88%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/564838/AV%E5%AD%97%E5%B9%95%E8%A7%86%E9%A2%91%E5%BD%95%E5%88%B6%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%20Pro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isTopWindow = window.top === window.self;
    const SCRIPT_ID = 'uve_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const MESSAGE_PREFIX = 'UVE_';

    function waitForBody() {
        return new Promise((resolve) => {
            if (document.body) {
                resolve();
            } else {
                const observer = new MutationObserver(() => {
                    if (document.body) {
                        observer.disconnect();
                        resolve();
                    }
                });
                observer.observe(document.documentElement, { childList: true, subtree: true });
            }
        });
    }

    let host, shadow;

    function initShadowDOM() {
        host = document.createElement('div');
        host.id = 'uve-host-' + SCRIPT_ID;
        host.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:2147483647;pointer-events:none;overflow:visible;';
        document.documentElement.appendChild(host);

        shadow = host.attachShadow({mode: 'open'});

        const style = document.createElement('style');
        style.textContent = `
            :host {
                all: initial;
                display: block;
                width: 100%;
                height: 100%;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                font-size: 14px;
                line-height: 1.5;
            }

            #uve-panel {
                position: fixed !important;
                top: 20px;
                right: 20px;
                width: 320px !important;
                min-width: 320px !important;
                max-width: 320px !important;
                max-height: 90vh;
                background-color: rgb(17, 24, 39) !important;
                color: rgb(229, 231, 235) !important;
                border: 1px solid rgb(55, 65, 81) !important;
                border-radius: 12px !important;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9) !important;
                overflow-y: auto;
                overflow-x: hidden;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                display: flex;
                flex-direction: column;
            }

            .uve-panel-header {
                position: sticky;
                top: 0;
                background-color: rgb(31, 41, 55) !important;
                padding: 12px;
                border-bottom: 1px solid rgb(55, 65, 81) !important;
                border-radius: 12px 12px 0 0 !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                z-index: 10;
                cursor: move;
            }

            .uve-panel-title {
                font-weight: 700;
                font-size: 14px;
                color: white !important;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .uve-panel-body {
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .uve-control-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: rgb(31, 41, 55) !important;
                padding: 8px;
                border: 1px solid rgb(55, 65, 81) !important;
                border-radius: 8px !important;
                gap: 4px;
            }

            .uve-btn {
                background-color: rgb(55, 65, 81) !important;
                color: white !important;
                border: none;
                border-radius: 6px !important;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                transition: all 0.2s;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }

            .uve-btn:hover {
                background-color: rgb(75, 85, 99) !important;
                opacity: 0.9;
            }

            .uve-btn-sm {
                padding: 4px 8px;
                font-size: 11px;
            }

            .uve-btn-icon {
                width: 28px;
                height: 28px;
                padding: 0;
                border-radius: 6px !important;
            }

            .uve-btn-primary {
                background: linear-gradient(to right, rgb(99, 102, 241), rgb(124, 58, 237)) !important;
                color: white !important;
            }

            .uve-btn-primary:hover {
                background: linear-gradient(to right, rgb(79, 70, 229), rgb(109, 40, 217)) !important;
            }

            .uve-btn-danger {
                background: linear-gradient(to right, rgb(239, 68, 68), rgb(249, 115, 22)) !important;
                color: white !important;
            }

            .uve-btn-danger:hover {
                background: linear-gradient(to right, rgb(220, 38, 38), rgb(234, 88, 12)) !important;
            }

            .uve-btn-success {
                background-color: rgb(22, 163, 74) !important;
                color: white !important;
            }

            .uve-btn-success:hover {
                background-color: rgb(21, 128, 61) !important;
            }

            .uve-play-controls {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 4px;
            }

            .uve-seek-btn {
                background-color: transparent !important;
                color: rgb(209, 213, 219) !important;
                padding: 6px;
                font-size: 12px;
                border-radius: 6px !important;
                cursor: pointer;
                border: none;
                transition: all 0.2s;
            }

            .uve-seek-btn:hover {
                background-color: rgb(55, 65, 81) !important;
                color: white !important;
            }

            .uve-play-btn {
                background: linear-gradient(to right, rgb(99, 102, 241), rgb(124, 58, 237)) !important;
                color: white !important;
                padding: 6px 16px !important;
                font-weight: 700;
                font-size: 14px;
                border-radius: 6px !important;
                border: none;
                cursor: pointer;
            }

            .uve-speed-section {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .uve-speed-label {
                font-size: 10px;
                color: rgb(156, 163, 175) !important;
            }

            .uve-dropdown {
                position: relative;
                display: inline-block;
            }

            .uve-dropdown-btn {
                background: linear-gradient(to right, rgb(79, 70, 229), rgb(124, 58, 237)) !important;
                color: white !important;
                border: none;
                padding: 2px 8px;
                border-radius: 4px !important;
                cursor: pointer;
                font-size: 11px;
                font-weight: 700;
                display: flex;
                align-items: center;
                gap: 4px;
                height: 24px;
            }

            .uve-dropdown-content {
                display: none;
                position: absolute;
                background-color: rgb(31, 41, 55) !important;
                min-width: 80px;
                max-height: 200px;
                overflow-y: auto;
                box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.5);
                z-index: 2147483647 !important;
                border: 1px solid rgb(75, 85, 99) !important;
                border-radius: 6px !important;
                right: 0;
                top: 100%;
                margin-top: 4px;
            }

            .uve-dropdown-content.show {
                display: block;
            }

            .uve-speed-option {
                color: rgb(209, 213, 219) !important;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s;
            }

            .uve-speed-option:hover {
                background-color: rgb(55, 65, 81) !important;
                color: white !important;
            }

            .uve-speed-option.active {
                background-color: rgb(79, 70, 229) !important;
                color: white !important;
                font-weight: 700;
            }

            .uve-offset-section {
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .uve-offset-btn {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: rgb(55, 65, 81) !important;
                color: white !important;
                border: none;
                border-radius: 4px !important;
                cursor: pointer;
                font-weight: 700;
                font-size: 12px;
            }

            .uve-offset-btn:hover {
                background-color: rgb(75, 85, 99) !important;
            }

            .uve-offset-display {
                text-align: center;
                padding: 0 4px;
                min-width: 45px;
            }

            .uve-offset-label {
                font-size: 9px;
                color: rgb(156, 163, 175) !important;
            }

            .uve-offset-value {
                font-size: 10px;
                font-family: monospace !important;
                font-weight: 700;
                color: rgb(129, 140, 248) !important;
            }

            .uve-offset-reset {
                font-size: 9px;
                color: rgb(156, 163, 175) !important;
                background: none;
                border: none;
                cursor: pointer;
                padding: 2px 6px;
                border-radius: 4px !important;
                margin-left: 4px;
            }

            .uve-offset-reset:hover {
                color: white !important;
                background-color: rgb(55, 65, 81) !important;
            }

            .uve-search-row {
                display: flex;
                gap: 6px;
            }

            .uve-select {
                background-color: rgb(31, 41, 55) !important;
                color: white !important;
                border: 1px solid rgb(75, 85, 99) !important;
                border-radius: 6px !important;
                padding: 6px;
                font-size: 10px;
                outline: none;
                width: 64px;
                cursor: pointer;
            }

            .uve-select:focus {
                border-color: rgb(99, 102, 241) !important;
            }

            .uve-input {
				width: 68px;
                flex: 1;
                background-color: rgb(31, 41, 55) !important;
                color: white !important;
                border: 1px solid rgb(75, 85, 99) !important;
                border-radius: 6px !important;
                padding: 6px 8px;
                font-size: 12px;
                outline: none;
            }

            .uve-input::placeholder {
                color: rgb(107, 114, 128) !important;
            }

            .uve-input:focus {
                border-color: rgb(99, 102, 241) !important;
            }

            .uve-record-btn {
                width: 100%;
                padding: 10px;
                font-size: 12px;
                font-weight: 700;
                border-radius: 8px !important;
                border: none;
                cursor: pointer;
                transition: all 0.2s;
                background: linear-gradient(to right, rgb(239, 68, 68), rgb(249, 115, 22)) !important;
                color: white !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
            }

            .uve-record-btn:hover {
                background: linear-gradient(to right, rgb(220, 38, 38), rgb(234, 88, 12)) !important;
            }

            .uve-recording {
                background: rgb(220, 38, 38) !important;
            }

            .uve-resource-section {
                border-top: 1px solid rgb(55, 65, 81) !important;
                padding-top: 8px;
            }

            .uve-resource-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 4px;
                font-size: 10px;
                color: rgb(156, 163, 175) !important;
            }

            .uve-resource-count {
                color: rgb(129, 140, 248) !important;
                background-color: rgba(79, 70, 229, 0.3) !important;
                padding: 2px 6px;
                border-radius: 9999px !important;
                font-size: 9px;
            }

            .uve-resource-list {
                max-height: 176px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .uve-resource-item {
                background-color: rgb(31, 41, 55) !important;
                border: 1px solid rgb(55, 65, 81) !important;
                border-radius: 6px !important;
                padding: 8px;
                font-size: 11px;
                position: relative;
            }

            .uve-resource-info {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 6px;
            }

            .uve-resource-name {
                flex: 1;
                min-width: 0;
                margin-right: 4px;
            }

            .uve-resource-title {
                color: rgb(209, 213, 219) !important;
                font-weight: 500;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: flex;
                align-items: center;
                gap: 4px;
            }

            .uve-resource-meta {
                color: rgb(107, 114, 128) !important;
                font-size: 9px;
            }

            .uve-resource-badge {
                color: white !important;
                padding: 2px 6px;
                border-radius: 4px !important;
                font-size: 9px;
                white-space: nowrap;
            }

            .uve-badge-m3u8 { background-color: rgb(124, 58, 237) !important; }
            .uve-badge-video { background-color: rgb(22, 163, 74) !important; }
            .uve-badge-audio { background-color: rgb(37, 99, 235) !important; }

            .uve-resource-actions {
                display: flex;
                gap: 6px;
            }

            .uve-resource-btn {
                flex: 1;
                padding: 4px;
                font-size: 10px;
                border-radius: 4px !important;
                border: none;
                cursor: pointer;
                color: white !important;
                transition: all 0.2s;
            }

            .uve-btn-play { background-color: rgb(55, 65, 81) !important; position: relative; }
            .uve-btn-play:hover { background-color: rgb(75, 85, 99) !important; }

            .uve-btn-download { background-color: rgb(79, 70, 229) !important; }
            .uve-btn-download:hover { background-color: rgb(67, 56, 202) !important; }

            .uve-btn-cancel { background-color: rgb(220, 38, 38) !important; }
            .uve-btn-cancel:hover { background-color: rgb(185, 28, 28) !important; }

            .uve-progress-area {
                margin-top: 6px;
                display: none;
            }

            .uve-progress-area.show {
                display: block;
            }

            .uve-progress-bar-bg {
                height: 4px;
                background-color: rgb(55, 65, 81) !important;
                border-radius: 9999px !important;
                overflow: hidden;
            }

            .uve-progress-bar-fill {
                height: 100%;
                background-color: rgb(34, 197, 94) !important;
                transition: width 0.3s ease;
                width: 0%;
            }

            .uve-progress-text {
                font-size: 9px;
                color: rgb(156, 163, 175) !important;
                margin-top: 2px;
                display: flex;
                justify-content: space-between;
            }

            .uve-result-list {
                max-height: 112px;
                overflow-y: auto;
                background-color: rgb(31, 41, 55) !important;
                border: 1px solid rgb(55, 65, 81) !important;
                border-radius: 6px !important;
                font-size: 11px;
                display: none;
            }

            .uve-result-list.show {
                display: block;
            }

            .uve-result-item {
                padding: 8px;
                cursor: pointer;
                color: rgb(209, 213, 219) !important;
                border-bottom: 1px solid rgba(255,255,255,0.05) !important;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.2s;
            }

            .uve-result-item:last-child {
                border-bottom: none !important;
            }

            .uve-result-item:hover {
                background-color: rgba(79, 70, 229, 0.3) !important;
            }

            .uve-result-item.selected {
                background-color: rgba(79, 70, 229, 0.5) !important;
            }

            .uve-result-name {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .uve-result-source {
                font-size: 9px;
                color: rgb(107, 114, 128) !important;
            }

            .uve-result-item:hover .uve-result-source {
                color: rgb(165, 180, 252) !important;
            }

            #uve-restore-btn {
                position: fixed !important;
                right: 0 !important;
                left: auto !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
                width: 44px !important;
                height: 32px !important;
                background: linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(124, 58, 237, 0.95) 100%) !important;
                backdrop-filter: blur(10px) !important;
                border-radius: 8px 0 0 8px !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-right: none !important;
                box-shadow: -4px 0 20px rgba(0,0,0,0.4) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                font-size: 24px !important;
                color: white !important;
                writing-mode: vertical-rl !important;
                text-orientation: mixed !important;
                letter-spacing: 4px !important;
                user-select: none !important;
            }

            #uve-restore-btn:hover {
                width: 52px !important;
                background: linear-gradient(135deg, rgba(79, 70, 229, 1) 0%, rgba(124, 58, 237, 1) 100%) !important;
                box-shadow: -6px 0 30px rgba(79, 70, 229, 0.4) !important;
                text-shadow: 0 0 10px rgba(255,255,255,0.5) !important;
            }

            #uve-restore-btn.dragging {
                transition: none !important;
                opacity: 0.8 !important;
            }

            .uve-toast {
                position: fixed !important;
                bottom: 20px !important;
                right: 20px !important;
                background: rgba(17, 24, 39, 0.98) !important;
                color: white !important;
                padding: 12px 20px !important;
                border-radius: 8px !important;
                border: 1px solid rgba(75, 85, 99, 0.4) !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
                font-size: 14px !important;
                max-width: 300px !important;
                word-break: break-word !important;
                z-index: 2147483647 !important;
                pointer-events: auto !important;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .hidden {
                display: none !important;
            }

            ::-webkit-scrollbar {
                width: 1px;
                height: 1px;
            }

            ::-webkit-scrollbar-track {
                background: rgba(75, 85, 99, 0.3);
                border-radius: 1px;
            }

            ::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.6);
                border-radius: 1px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.8);
            }

            .uve-resource-preview {
                position: absolute;
                bottom: 35px;
                left: 8px;
                width: 160px;
                height: 90px;
                background: #000;
                border-radius: 6px;
                overflow: hidden;
                display: none;
                z-index: 2147483647;
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                border: 1px solid rgb(79, 70, 229);
            }

            .uve-resource-preview.show {
                display: block;
            }

            .uve-resource-preview video {
                width: 100%;
                height: 100%;
                object-fit: contain;
                background: #000;
            }

            .uve-preview-placeholder {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: rgb(156, 163, 175);
                font-size: 11px;
                background: rgb(31, 41, 55);
                z-index: 1;
            }

            .uve-resource-preview.loaded .uve-preview-placeholder {
                display: none;
            }

            .uve-resource-preview::after {
                content: '';
                position: absolute;
                bottom: -5px;
                left: 20px;
                width: 0;
                height: 0;
                border-left: 5px solid transparent;
                border-right: 5px solid transparent;
                border-top: 5px solid rgb(79, 70, 229);
            }
        `;
        shadow.appendChild(style);

        const subtitleStyle = document.createElement('style');
        subtitleStyle.textContent = `
            .uve-subtitle-overlay {
                position: absolute !important;
                bottom: 10% !important;
                left: 0 !important;
                width: 100% !important;
                text-align: center !important;
                z-index: 2147483646 !important;
                pointer-events: none !important;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.8) !important;
                display: none;
                font-size: 24px !important;
                font-weight: 700 !important;
                color: #fff !important;
                font-family: "Microsoft YaHei", -apple-system, sans-serif !important;
                line-height: 1.4 !important;
                padding: 0 20px !important;
                box-sizing: border-box !important;
                word-break: break-word !important;
                letter-spacing: 0.5px !important;
                background: transparent !important;
            }

            .uve-subtitle-overlay.show {
                display: block !important;
            }

            video[data-uve-selected="true"] {
                outline: 1px solid rgb(255, 255, 255) !important;
                outline-offset: -1px !important;
                cursor: pointer !important;
            }
        `;
        document.head.appendChild(subtitleStyle);
    }

    const state = {
        currentVideo: null,
        subtitleData: [],
        lastSubtitleIndex: -1,
        mediaRecorder: null,
        recordedChunks: [],
        isRecording: false,
        recordingTimer: null,
        recordingStartTime: 0,
        subtitleOffset: 0,
        urlSet: new Set(),
        mediaUrls: [],
        iframeVideoMap: new Map(),
        myVideoId: null,
        isIframeMode: !isTopWindow,
        sniffedResources: new Set(),
        videoCheckInterval: null,
        activeDownloads: new Map(),
        checkedVideos: new WeakMap(),
        eventListeners: new Map(),
        initialized: false,
        activeIframeVideo: null,
        videoSyncInterval: null,
        hasAutoSelected: false
    };

    const $ = (s, c = shadow) => c.querySelector(s);
    const $$ = (s, c = shadow) => Array.from(c.querySelectorAll(s));

    function generateId() {
        return 'uve_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    function showToast(msg, duration = 2000) {
        if (!shadow) return;
        const div = document.createElement('div');
        div.className = 'uve-toast';
        div.textContent = msg;
        shadow.appendChild(div);
        setTimeout(() => {
            div.style.opacity = '0';
            div.style.transform = 'translateY(10px)';
            div.style.transition = 'all 0.3s';
            setTimeout(() => div.remove(), 300);
        }, duration);
    }

    async function checkVideoRequirements(video) {
        if (state.checkedVideos.has(video)) {
            return state.checkedVideos.get(video);
        }
        if (!video.videoWidth || video.videoWidth === 0 || !video.duration) {
            return null;
        }
        const duration = video.duration || 0;
        const hasValidDuration = duration === Infinity || duration >= 10;
        const width = video.videoWidth || 0;
        const height = video.videoHeight || 0;
        const hasValidResolution = width >= 640 && height >= 360;
        const meetsRequirements = hasValidDuration && hasValidResolution;
        state.checkedVideos.set(video, meetsRequirements);
        return meetsRequirements;
    }

    function isValidVideo(video) {
        if (!video || video.tagName !== 'VIDEO') return false;
        return true;
    }

    function extractMediaName(url) {
        try {
            const urlObj = new URL(url);
            let name = decodeURIComponent(urlObj.pathname.split('/').pop() || 'unknown');
            name = name.replace(/\.(m3u8|mp4|webm|flv|mp3|aac|ts|mkv|mov)(\?.*)?$/i, '');
            if (name.length < 3 || /^[a-z0-9]{15,}$/i.test(name)) {
                const titleMatch = url.match(/[?&](title|name|filename)=([^&]+)/i);
                if (titleMatch) name = decodeURIComponent(titleMatch[2]);
            }
            if (name.length < 3 && document.title) {
                name = document.title.split(/[-|]/)[0].trim();
            }
            return name.replace(/[<>:"/\\|?*]/g, '_').substring(0, 60) || 'media_' + Date.now();
        } catch(e) {
            return 'media_' + Date.now();
        }
    }

    function setupSniffing() {
        if (window.PerformanceObserver) {
            const observer = new PerformanceObserver(list => {
                list.getEntries().forEach(entry => {
                    const url = entry.name;
                    if (isMediaUrl(url) && !state.sniffedResources.has(url)) {
                        state.sniffedResources.add(url);
                        addMediaResource(url, 'Network');
                    }
                });
            });
            try {
                observer.observe({entryTypes: ['resource']});
            } catch(e) {}
        }

        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            if (typeof url === 'string' && isMediaUrl(url) && !state.sniffedResources.has(url)) {
                state.sniffedResources.add(url);
                addMediaResource(url, 'Fetch');
            }
            return originalFetch.apply(this, args);
        };

        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (typeof url === 'string' && isMediaUrl(url) && !state.sniffedResources.has(url)) {
                state.sniffedResources.add(url);
                addMediaResource(url, 'XHR');
            }
            return originalOpen.call(this, method, url, ...rest);
        };

        let metadataTimeout;
        document.addEventListener('loadedmetadata', async e => {
            if (e.target.tagName === 'VIDEO') {
                const video = e.target;
                clearTimeout(metadataTimeout);
                metadataTimeout = setTimeout(async () => {
                    const meetsReqs = await checkVideoRequirements(video);
                    if (meetsReqs === true) {
                        if (video.currentSrc && !video.currentSrc.startsWith('blob:')) {
                            checkAndAddUrl(video.currentSrc, video.videoWidth, video.videoHeight);
                        }
                    }
                }, 100);
            }
        }, true);

        setInterval(() => {
            $$('video, audio', document).forEach(async media => {
                if (media.currentSrc) {
                    const width = media.videoWidth || 0;
                    const height = media.videoHeight || 0;
                    await checkAndAddUrl(media.currentSrc, width, height);
                }
                $$('source', media).forEach(async src => {
                    if (src.src) {
                        const width = media.videoWidth || 0;
                        const height = media.videoHeight || 0;
                        await checkAndAddUrl(src.src, width, height);
                    }
                });
            });
        }, 2000);
    }

    function isMediaUrl(url) {
        if (!url || typeof url !== 'string') return false;
        if (url.startsWith('blob:') || url.startsWith('data:')) return false;
        return /\.(m3u8|mp4|webm|flv|mp3|m4a|aac|wav|ts|mkv|mov)(\?|#|$)/i.test(url) ||
            /\/(video|audio|stream|hls|dash|vod)\//i.test(url);
    }

    async function checkAndAddUrl(url, width = 0, height = 0) {
        if (!state.sniffedResources.has(url)) {
            if (!/\.m3u8/i.test(url)) {
                if (width < 640 || height < 360) return;
            }
            state.sniffedResources.add(url);
            addMediaResource(url, 'DOM', width, height);
        }
    }

    async function addMediaResource(url, source, width = 0, height = 0) {
        if (state.urlSet.has(url)) return;
        state.urlSet.add(url);
        const isM3U8 = /\.m3u8/i.test(url);
        const addedItems = [];

        if (isM3U8) {
            try {
                const streams = await fetchM3U8Streams(url);
                if (streams.length > 0) {
                    streams.forEach((stream, index) => {
                        if (stream.width < 640 || stream.height < 360) return;
                        const baseName = extractMediaName(url);
                        const name = `${baseName}_${stream.height}p`;
                        const item = {
                            url: stream.url,
                            type: `M3U8 ${stream.height}p (${source})`,
                            category: 'm3u8',
                            name: name,
                            resolution: `${stream.width}x${stream.height}`,
                            bandwidth: stream.bandwidth,
                            id: generateId(),
                            timestamp: Date.now() + index,
                            parentUrl: url
                        };
                        state.mediaUrls.push(item);
                        addedItems.push(item);
                    });
                    updateResourceList();
                    if (streams.length > 0) showToast(`发现M3U8资源: ${streams.length}个清晰度`, 1500);
                }
            } catch(e) {
                console.error('M3U8 解析失败', e);
            }
        } else {
            let type = 'MP4', category = 'direct';
            if (/\.mp3/i.test(url)) { type = 'MP3'; category = 'audio'; }
            else if (/\.m4a/i.test(url)) { type = 'M4A'; category = 'audio'; }
            else if (/\.flv/i.test(url)) { type = 'FLV'; }
            else if (/\.webm/i.test(url)) { type = 'WebM'; }

            const name = extractMediaName(url);
            let resolution = width && height ? `${width}x${height}` : '';

            const item = {
                url,
                type: `${type} (${source})`,
                category,
                name,
                resolution,
                id: generateId(),
                timestamp: Date.now(),
                parentUrl: url
            };

            state.mediaUrls.push(item);
            addedItems.push(item);
            updateResourceList();
            showToast(`发现资源: ${name.substring(0, 20)}...`, 1500);
        }

        if (!isTopWindow && addedItems.length > 0) {
            addedItems.forEach(item => {
                if (item.category === 'm3u8' || (item.resolution && parseInt(item.resolution.split('x')[0]) >= 640)) {
                    safePostMessage(window.top, {
                        type: MESSAGE_PREFIX + 'MEDIA_FOUND',
                        data: item,
                        scriptId: SCRIPT_ID,
                        fromFrame: location.href
                    });
                }
            });
        }
    }

    async function fetchM3U8Streams(url) {
        try {
            const response = await fetch(url);
            const content = await response.text();
            const lines = content.split('\n');
            const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

            if (!content.includes('#EXT-X-STREAM-INF')) {
                return [{ url: url, width: 0, height: 0, bandwidth: 0 }];
            }

            const streams = [];
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('#EXT-X-STREAM-INF')) {
                    const resMatch = lines[i].match(/RESOLUTION=(\d+)x(\d+)/);
                    const bandwidthMatch = lines[i].match(/BANDWIDTH=(\d+)/);
                    const streamUrl = lines[i+1]?.trim();

                    if (streamUrl) {
                        const fullUrl = streamUrl.startsWith('http') ? streamUrl : baseUrl + streamUrl;
                        streams.push({
                            url: fullUrl,
                            width: resMatch ? parseInt(resMatch[1]) : 0,
                            height: resMatch ? parseInt(resMatch[2]) : 0,
                            bandwidth: bandwidthMatch ? parseInt(bandwidthMatch[1]) : 0
                        });
                    }
                }
            }
            return streams;
        } catch(e) {
            return [];
        }
    }

    function safePostMessage(target, msg) {
        try {
            if (target && target.postMessage) {
                target.postMessage(msg, '*');
            }
        } catch(e) {}
    }

    function broadcastToAllFrames(msg, win, visited = new Set()) {
        if (!win) win = window;
        if (visited.has(win)) return;
        visited.add(win);

        safePostMessage(win, msg);

        try {
            for (let i = 0; i < win.frames.length; i++) {
                broadcastToAllFrames(msg, win.frames[i], visited);
            }
        } catch(e) {}
    }

    function initVideoSelection() {
        scanVideos();
        state.videoCheckInterval = setInterval(scanVideos, 2000);

        const observer = new MutationObserver(mutations => {
            let hasNewVideo = false;
            mutations.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.tagName === 'VIDEO') hasNewVideo = true;
                    if (node.querySelectorAll && node.querySelectorAll('video').length > 0) hasNewVideo = true;
                });
            });
            if (hasNewVideo) setTimeout(scanVideos, 500);
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            waitForBody().then(() => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    async function scanVideos() {
        if (!document.body) return;

        const videos = Array.from(document.querySelectorAll('video')).filter(isValidVideo);
        const validVideos = [];

        for (const video of videos) {
            if (!video.dataset.uveClickAttached) {
                video.dataset.uveClickAttached = 'true';

                video.addEventListener('pointerdown', function(e) {
                    if (state.isRecording) {
                        showToast('录制中，请先停止录制');
                        return;
                    }
                    handleVideoSelect(video);
                }, {passive: true});

                video.addEventListener('mouseenter', function() {
                    if (!state.isRecording && video.dataset.uveSelected !== 'true') {
                        video.title = '点击接管视频控制';
                    }
                });
            }

            const meets = await checkVideoRequirements(video);
            if (meets === true) {
                validVideos.push(video);
            }
        }

        if (validVideos.length === 1 && !state.currentVideo && !state.hasAutoSelected) {
            state.hasAutoSelected = true;
            console.log('[视频助手] 自动接管单个视频:', validVideos[0].currentSrc || validVideos[0].src);
            setTimeout(() => handleVideoSelect(validVideos[0]), 500);
            showToast('已自动接管视频');
        }
    }

    function cleanupVideoListeners(video) {
        if (state.eventListeners.has(video)) {
            const listeners = state.eventListeners.get(video);
            listeners.forEach(({event, handler}) => {
                video.removeEventListener(event, handler);
            });
            state.eventListeners.delete(video);
        }
        video.dataset.uveSelected = 'false';
    }

    function handleVideoSelect(video) {
        console.log('[视频助手] 尝试接管视频:', video.currentSrc || video.src);

        if (!isTopWindow) {
            if (!video.dataset.uveId) {
                video.dataset.uveId = generateId();
            }
            state.myVideoId = video.dataset.uveId;

            state.activeIframeVideo = video;

            document.querySelectorAll('video').forEach(v => {
                if (v !== video) {
                    v.dataset.uveSelected = 'false';
                }
            });
            video.dataset.uveSelected = 'true';

            cleanupVideoListeners(video);
            const listeners = [];

            const syncState = () => {
                safePostMessage(window.top, {
                    type: MESSAGE_PREFIX + 'VIDEO_SYNC',
                    data: {
                        id: state.myVideoId,
                        currentTime: video.currentTime,
                        paused: video.paused,
                        duration: video.duration,
                        playbackRate: video.playbackRate,
                        volume: video.volume,
                        muted: video.muted,
                        readyState: video.readyState,
                        src: video.currentSrc || video.src
                    },
                    scriptId: SCRIPT_ID,
                    fromFrame: location.href
                });
                if (state.subtitleData.length > 0) {
                    updateSubtitleDisplay(video.currentTime);
                }
            };

            ['timeupdate', 'play', 'pause', 'ratechange', 'volumechange', 'seeked', 'loadedmetadata'].forEach(event => {
                const handler = () => syncState();
                video.addEventListener(event, handler);
                listeners.push({event, handler});
            });
            state.eventListeners.set(video, listeners);

            safePostMessage(window.top, {
                type: MESSAGE_PREFIX + 'VIDEO_SELECT',
                data: {
                    id: state.myVideoId,
                    src: video.currentSrc || video.src,
                    width: video.videoWidth,
                    height: video.videoHeight,
                    duration: video.duration,
                    title: document.title,
                    url: window.location.href,
                    hasSubtitle: state.subtitleData.length > 0,
                    isPaused: video.paused,
                    currentTime: video.currentTime
                },
                scriptId: SCRIPT_ID,
                fromFrame: location.href
            });

            if (state.videoSyncInterval) clearInterval(state.videoSyncInterval);
            state.videoSyncInterval = setInterval(syncState, 1000);

            if (state.subtitleData.length > 0) {
                createSubtitleOverlay(video);
            }

            showToast('已接管视频');
        } else {
            switchToVideo(video);
        }
    }

    function createSubtitleOverlay(video) {
        const old = document.querySelector('.uve-subtitle-overlay');
        if (old) old.remove();

        if (video._isIframe) return null;

        const overlay = document.createElement('div');
        overlay.className = 'uve-subtitle-overlay';

        let parent = video.parentElement;
        if (!parent) parent = document.body;
        const computedStyle = window.getComputedStyle(parent);
        if (computedStyle.position === 'static') {
            parent.style.position = 'relative';
        }

        parent.appendChild(overlay);
        return overlay;
    }

    function updateSubtitleDisplay(currentTime) {
        const overlay = document.querySelector('.uve-subtitle-overlay');
        if (!overlay || state.subtitleData.length === 0) return;

        const time = currentTime + state.subtitleOffset;
        const subtitle = state.subtitleData.find(s => time >= s.start && time <= s.end);

        if (subtitle) {
            if (state.lastSubtitleIndex !== subtitle.index) {
                overlay.textContent = subtitle.text;
                overlay.style.display = 'block';
                overlay.classList.add('show');
                state.lastSubtitleIndex = subtitle.index;
            }
        } else {
            overlay.style.display = 'none';
            overlay.classList.remove('show');
            state.lastSubtitleIndex = -1;
        }
    }

    function parseSubtitle(text) {
        if (!text || typeof text !== 'string') return [];

        const lines = text.trim().split(/\r?\n/);
        const subs = [];

        const isVTT = lines[0] && lines[0].trim() === 'WEBVTT';
        const isASS = lines[0] && lines[0].trim().startsWith('[Script Info]');

        if (isASS) {
            let inEvents = false;
            let formatParts = [];

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                if (line === '[Events]') {
                    inEvents = true;
                    continue;
                }
                if (inEvents) {
                    if (line.startsWith('Format:')) {
                        formatParts = line.replace('Format:', '').split(',').map(s => s.trim());
                    } else if (line.startsWith('Dialogue:')) {
                        const parts = line.replace('Dialogue:', '').split(',');
                        if (parts.length >= 3) {
                            const startTime = parseTime(parts[1]);
                            const endTime = parseTime(parts[2]);
                            const textStart = formatParts.indexOf('Text');
                            const text = textStart >= 0 ? parts.slice(textStart).join(',').replace(/\\N/g, '\n') : '';

                            if (!isNaN(startTime) && !isNaN(endTime) && text) {
                                subs.push({
                                    start: startTime,
                                    end: endTime,
                                    text: text.replace(/\{[^}]+\}/g, ''),
                                    index: subs.length
                                });
                            }
                        }
                    }
                }
            }
        } else {
            let i = isVTT ? 1 : 0;
            while (i < lines.length) {
                while (i < lines.length && !lines[i].trim()) i++;
                if (i >= lines.length) break;

                if (!isVTT && /^\d+$/.test(lines[i].trim())) {
                    i++;
                }

                const timeLine = lines[i];
                if (!timeLine) break;

                const timeMatch = timeLine.match(/(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/);

                if (!timeMatch) {
                    i++;
                    continue;
                }

                const start = parseInt(timeMatch[1]) * 3600 + parseInt(timeMatch[2]) * 60 + parseInt(timeMatch[3]) + parseInt(timeMatch[4]) / 1000;
                const end = parseInt(timeMatch[5]) * 3600 + parseInt(timeMatch[6]) * 60 + parseInt(timeMatch[7]) + parseInt(timeMatch[8]) / 1000;
                i++;

                const textLines = [];
                while (i < lines.length && lines[i].trim() && !lines[i].match(/^\d+$/) && !lines[i].match(/\d{2}:\d{2}:\d{2}[,.]\d{3}/)) {
                    let cleanLine = lines[i].trim();
                    if (isVTT) {
                        cleanLine = cleanLine.replace(/<[^>]+>/g, '');
                    }
                    if (cleanLine) textLines.push(cleanLine);
                    i++;
                }

                if (textLines.length > 0) {
                    subs.push({
                        start,
                        end,
                        text: textLines.join('\n'),
                        index: subs.length
                    });
                }
            }
        }

        return subs;
    }

    function parseTime(timeStr) {
        if (!timeStr) return NaN;
        const parts = timeStr.trim().split(':');
        if (parts.length === 3) {
            const h = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            const s = parseFloat(parts[2]);
            return h * 3600 + m * 60 + s;
        }
        return NaN;
    }

    function createPanel() {
        if (!shadow || $('#uve-panel', shadow)) return;

        let savedTop;
        try {
            savedTop = localStorage.getItem('uve-restore-btn-top');
        } catch(e) {
            savedTop = null;
        }

        const restoreBtn = document.createElement('div');
        restoreBtn.id = 'uve-restore-btn';
        restoreBtn.className = 'hidden';
        restoreBtn.innerHTML = '⚙️';
        restoreBtn.title = '显示视频助手';

        if (savedTop) {
            restoreBtn.style.top = savedTop;
            restoreBtn.style.transform = 'none';
        }

        restoreBtn.onclick = (e) => {
            if (!restoreBtn.isDragging) {
                $('#uve-panel', shadow).classList.remove('hidden');
                restoreBtn.classList.add('hidden');
                try {
                    localStorage.setItem('uve-panel-visible', 'true');
                } catch(e) {}
            }
        };

        let isDragging = false, startY = 0, startTop = 0, dragThreshold = 3, dragDistance = 0;
        restoreBtn.onmousedown = (e) => {
            isDragging = false;
            dragDistance = 0;
            startY = e.clientY;
            const rect = restoreBtn.getBoundingClientRect();
            startTop = rect.top;
            restoreBtn.isDragging = false;
            restoreBtn.classList.add('dragging');

            document.onmousemove = (e) => {
                dragDistance = Math.abs(e.clientY - startY);
                if (dragDistance > dragThreshold) {
                    isDragging = true;
                    restoreBtn.isDragging = true;
                }
                if (isDragging) {
                    const deltaY = e.clientY - startY;
                    let newTop = startTop + deltaY;
                    newTop = Math.max(0, Math.min(newTop, window.innerHeight - 120));
                    restoreBtn.style.top = newTop + 'px';
                    restoreBtn.style.transform = 'none';
                }
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
                restoreBtn.classList.remove('dragging');
                if (isDragging) {
                    try {
                        localStorage.setItem('uve-restore-btn-top', restoreBtn.style.top);
                    } catch(e) {}
                    setTimeout(() => { restoreBtn.isDragging = false; }, 100);
                }
            };
        };

        shadow.appendChild(restoreBtn);

        const panel = document.createElement('div');
        panel.id = 'uve-panel';
        panel.className = 'hidden';

        const speedOptions = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 3.0, 4.0, 6.0];
        const speedOptionsHtml = speedOptions.map(s =>
            `<div class="uve-speed-option ${s === 1.0 ? 'active' : ''}" data-speed="${s}">${s.toFixed(2)}x</div>`
        ).join('');

        panel.innerHTML = `
            <div class="uve-panel-header">
                <div class="uve-panel-title">🎬 字幕&视频录制下载助手 Pro</div>
                <button class="uve-btn uve-btn-icon" id="uve-minimize" title="最小化">−</button>
            </div>

            <div class="uve-panel-body">
                <div class="uve-control-row uve-play-controls">
                    <button class="uve-seek-btn" data-seek="-300" title="后退5分钟">⏮</button>
                    <button class="uve-seek-btn" data-seek="-60" title="后退1分钟">⏪</button>
                    <button class="uve-seek-btn" data-seek="-10" title="后退10秒钟">◀</button>
                    <button class="uve-play-btn" id="uve-play-btn" title="播放/暂停">▶</button>
                    <button class="uve-seek-btn" data-seek="10" title="前进10秒钟">▶</button>
                    <button class="uve-seek-btn" data-seek="60" title="前进1分钟">⏩</button>
                    <button class="uve-seek-btn" data-seek="300" title="前进5分钟">⏭</button>
                </div>

                <div class="uve-control-row">
                    <div class="uve-speed-section">
                        <span class="uve-speed-label">播放速度</span>
                        <div class="uve-dropdown">
                            <button class="uve-dropdown-btn" id="speed-dropdown-btn">
                                <span id="current-speed">1.00x</span>
                                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            <div class="uve-dropdown-content" id="speed-dropdown-content">
                                ${speedOptionsHtml}
                            </div>
                        </div>
                    </div>
                    <div class="uve-offset-section">
                        <button class="uve-offset-btn" id="uve-offset-minus">−</button>
                        <div class="uve-offset-display">
                            <div class="uve-offset-label">字幕时移</div>
                            <div class="uve-offset-value" id="uve-offset-value">0.0s</div>
                        </div>
                        <button class="uve-offset-btn" id="uve-offset-plus">+</button>
                        <button class="uve-offset-reset" id="uve-offset-reset">重置</button>
                    </div>
                </div>

                <div class="uve-search-row">
                    <select class="uve-select" id="uve-source-select">
                        <option value="xunlei">迅雷</option>
                        <option value="subtitlecat">Cat</option>
                    </select>
                    <input type="text" class="uve-input" id="uve-search-input" placeholder="输入番号搜索字幕">
                    <button class="uve-btn uve-btn-primary" id="uve-search-btn">🔍</button>
                    <button class="uve-btn uve-btn-success" id="uve-load-file-btn" title="加载本地字幕">📁</button>
                </div>
                <input type="file" id="uve-file-input" style="display:none" accept=".srt,.vtt,.ass">

                <div class="uve-result-list" id="uve-result-list"></div>

                <button class="uve-record-btn" id="uve-record-btn">🔴 录制视频</button>

                <div class="uve-resource-section">
                    <div class="uve-resource-header">
                        <span>嗅探到的资源</span>
                        <span class="uve-resource-count" id="resource-count">0</span>
                    </div>
                    <div class="uve-resource-list" id="uve-resource-list"></div>
                </div>
            </div>
        `;

        shadow.appendChild(panel);

        let isPanelDragging = false;
        let panelStartX = 0;
        let panelStartY = 0;
        let panelStartLeft = 0;
        let panelStartTop = 0;

        const panelHeader = $('.uve-panel-header', shadow);

        panelHeader.onmousedown = (e) => {
            if (e.target.closest('#uve-minimize')) return;

            isPanelDragging = true;
            panelStartX = e.clientX;
            panelStartY = e.clientY;
            const rect = panel.getBoundingClientRect();
            panelStartLeft = rect.left;
            panelStartTop = rect.top;

            panel.style.transition = 'none';
        };

        document.addEventListener('mousemove', (e) => {
            if (!isPanelDragging) return;

            const deltaX = e.clientX - panelStartX;
            const deltaY = e.clientY - panelStartY;

            let newLeft = panelStartLeft + deltaX;
            let newTop = panelStartTop + deltaY;

            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - panel.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - panel.offsetHeight));

            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (isPanelDragging) {
                isPanelDragging = false;
                panel.style.transition = '';
            }
        });

        $('#uve-minimize', shadow).onclick = () => {
            panel.classList.add('hidden');
            restoreBtn.classList.remove('hidden');
            try {
                localStorage.setItem('uve-panel-visible', 'false');
            } catch(e) {}
        };

        const dropdownBtn = $('#speed-dropdown-btn', shadow);
        const dropdownContent = $('#speed-dropdown-content', shadow);
        const currentSpeedSpan = $('#current-speed', shadow);

        dropdownBtn.onclick = (e) => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        };

        shadow.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });

        $$('.uve-speed-option', shadow).forEach(option => {
            option.onclick = () => {
                const speed = parseFloat(option.dataset.speed);
                if (state.currentVideo) {
                    if (state.currentVideo._isIframe) {
                        sendCommandToFrame(state.currentVideo._id, 'speed', speed);
                    } else {
                        state.currentVideo.playbackRate = speed;
                    }
                    currentSpeedSpan.textContent = speed.toFixed(2) + 'x';
                    $$('.uve-speed-option', shadow).forEach(o => o.classList.remove('active'));
                    option.classList.add('active');
                    showToast(`播放速度: ${speed.toFixed(2)}x`);
                } else {
                    showToast('未选择视频');
                }
                dropdownContent.classList.remove('show');
            };
        });

        $$('.uve-seek-btn', shadow).forEach(btn => {
            btn.onclick = () => {
                const sec = parseInt(btn.dataset.seek);
                if (!state.currentVideo) return showToast('未选择视频');
                if (state.currentVideo._isIframe) {
                    const newTime = state.currentVideo.currentTime + sec;
                    sendCommandToFrame(state.currentVideo._id, 'seek', newTime);
                } else {
                    state.currentVideo.currentTime += sec;
                }
                showToast(`${sec > 0 ? '前进' : '后退'} ${Math.abs(sec)}秒`);
            };
        });

        $('#uve-play-btn', shadow).onclick = () => {
            if (!state.currentVideo) return showToast('未选择视频');
            if (state.currentVideo._isIframe) {
                if (state.currentVideo.paused) {
                    sendCommandToFrame(state.currentVideo._id, 'play');
                } else {
                    sendCommandToFrame(state.currentVideo._id, 'pause');
                }
            } else {
                if (state.currentVideo.paused) {
                    state.currentVideo.play();
                } else {
                    state.currentVideo.pause();
                }
            }
        };

        $('#uve-search-btn', shadow).onclick = searchSubtitle;
        $('#uve-search-input', shadow).onkeypress = (e) => { if (e.key === 'Enter') searchSubtitle(); };
        $('#uve-load-file-btn', shadow).onclick = () => $('#uve-file-input', shadow).click();
        $('#uve-file-input', shadow).onchange = handleFileLoad;

        $('#uve-offset-minus', shadow).onclick = () => adjustOffset(-0.5);
        $('#uve-offset-plus', shadow).onclick = () => adjustOffset(0.5);
        $('#uve-offset-reset', shadow).onclick = () => adjustOffset(0, true);

        $('#uve-record-btn', shadow).onclick = toggleRecording;

        try {
            const wasVisible = localStorage.getItem('uve-panel-visible');
            if (wasVisible === 'false') {
                panel.classList.add('hidden');
                restoreBtn.classList.remove('hidden');
            } else {
                setTimeout(() => {
                    restoreBtn.classList.remove('hidden');
                }, 500);
            }
        } catch(e) {
            setTimeout(() => {
                restoreBtn.classList.remove('hidden');
            }, 500);
        }

        showToast('视频助手已加载，单个视频将自动接管');
    }

    function sendCommandToFrame(targetId, cmd, value) {
        broadcastToAllFrames({
            type: MESSAGE_PREFIX + 'CONTROL',
            targetId: targetId,
            cmd: cmd,
            value: value,
            scriptId: SCRIPT_ID,
            commandId: generateId(),
            timestamp: Date.now()
        });
    }

    function updatePlayBtn() {
        const btn = $('#uve-play-btn', shadow);
        if (btn && state.currentVideo) {
            btn.textContent = state.currentVideo.paused ? '▶' : '⏸';
        }
    }

    function adjustOffset(delta, reset = false) {
        if (reset) state.subtitleOffset = 0;
        else state.subtitleOffset += delta;
        const span = $('#uve-offset-value', shadow);
        if (span) {
            const sign = state.subtitleOffset > 0 ? '+' : '';
            span.textContent = `${sign}${state.subtitleOffset.toFixed(1)}s`;
        }
        if (state.currentVideo && state.subtitleData.length > 0) {
            updateSubtitleDisplay(state.currentVideo.currentTime);
        }
    }

    async function searchSubtitle() {
        const keyword = $('#uve-search-input', shadow)?.value.trim();
        if (!keyword) return showToast('请输入关键词');
        const resultDiv = $('#uve-result-list', shadow);
        resultDiv.innerHTML = '<div style="padding:8px;text-align:center;color:rgb(156,163,175)">搜索中...</div>';
        resultDiv.classList.add('show');
        try {
            const source = $('#uve-source-select', shadow).value;
            const results = source === 'xunlei' ? await searchXunlei(keyword) : await searchSubtitleCat(keyword);
            resultDiv.innerHTML = '';
            if (results.length === 0) {
                resultDiv.innerHTML = '<div style="padding:8px;text-align:center;color:rgb(107,114,128)">未找到字幕</div>';
                return;
            }
            results.forEach(item => {
                const div = document.createElement('div');
                div.className = 'uve-result-item';
                div.innerHTML = `
                    <span class="uve-result-name">${item.name}</span>
                    <span class="uve-result-source">${item.source}</span>
                `;
                div.onclick = () => {
                    $$('.uve-result-item', shadow).forEach(d => d.classList.remove('selected'));
                    div.classList.add('selected');
                    loadSubtitle(item);
                };
                resultDiv.appendChild(div);
            });
        } catch(e) {
            showToast('搜索失败');
            console.error(e);
        }
    }

    function searchXunlei(keyword) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api-shoulei-ssl.xunlei.com/oracle/subtitle?name=${encodeURIComponent(keyword)}`,
                timeout: 10000,
                onload: (res) => {
                    try {
                        const data = JSON.parse(res.responseText);
                        if (data.code === 0 && data.data) {
                            resolve(data.data.filter(i => i.url).map(i => ({
                                name: i.name,
                                url: i.url,
                                source: '迅雷'
                            })));
                        } else resolve([]);
                    } catch(e) { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

    function searchSubtitleCat(keyword) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://www.subtitlecat.com/index.php?search=${encodeURIComponent(keyword)}`,
                timeout: 10000,
                onload: (res) => {
                    try {
                        const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                        const links = doc.querySelectorAll('table tbody td a');
                        const list = [];
                        links.forEach(a => {
                            const name = a.textContent.trim();
                            if (name.toLowerCase().includes(keyword.toLowerCase())) {
                                list.push({
                                    name,
                                    url: new URL(a.getAttribute('href'), 'https://www.subtitlecat.com').href,
                                    source: 'Cat'
                                });
                            }
                        });
                        resolve(list);
                    } catch(e) { resolve([]); }
                },
                onerror: () => resolve([])
            });
        });
    }

    async function loadSubtitle(item) {
        try {
            showToast('正在加载字幕...');
            let url = item.url;
            if (item.source === 'Cat') {
                const res = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url: item.url,
                        onload: resolve,
                        onerror: reject
                    });
                });
                const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                let downloadLink = doc.querySelector('a[id="download_zh-CN"]') ||
                    doc.querySelector('a[id="download_zh"]') ||
                    doc.querySelector('a.green-link');
                if (!downloadLink) throw new Error('未找到下载链接');
                url = new URL(downloadLink.getAttribute('href'), 'https://www.subtitlecat.com').href;
            }
            const content = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: url,
                    onload: r => resolve(r.responseText),
                    onerror: reject
                });
            });
            const parsed = parseSubtitle(content);
            if (parsed.length === 0) throw new Error('字幕解析失败');
            state.subtitleData = parsed;
            state.lastSubtitleIndex = -1;

            if (state.currentVideo) {
                if (state.currentVideo._isIframe) {
                    broadcastToAllFrames({
                        type: MESSAGE_PREFIX + 'SUBTITLE_DATA',
                        targetId: state.currentVideo._id,
                        data: state.subtitleData,
                        scriptId: SCRIPT_ID
                    });
                    showToast(`字幕已发送至嵌套页面: ${parsed.length} 条`);
                } else {
                    createSubtitleOverlay(state.currentVideo);
                    showToast(`字幕加载成功: ${parsed.length} 条`);
                }
            } else {
                showToast(`字幕已加载: ${parsed.length} 条（请先选择视频）`);
            }
        } catch(e) {
            showToast('字幕加载失败: ' + e.message);
        }
    }

    function handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name.toLowerCase();
        let format = 'srt';
        if (fileName.endsWith('.vtt')) format = 'vtt';
        else if (fileName.endsWith('.ass') || fileName.endsWith('.ssa')) format = 'ass';

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const content = evt.target.result;
                if (!content || content.trim().length === 0) {
                    showToast('字幕文件为空');
                    return;
                }

                const parsed = parseSubtitle(content);

                if (parsed.length === 0) {
                    showToast('未能解析出字幕条目，请检查文件格式');
                    return;
                }

                state.subtitleData = parsed;
                state.lastSubtitleIndex = -1;

                if (state.currentVideo) {
                    if (state.currentVideo._isIframe) {
                        broadcastToAllFrames({
                            type: MESSAGE_PREFIX + 'SUBTITLE_DATA',
                            targetId: state.currentVideo._id,
                            data: state.subtitleData,
                            scriptId: SCRIPT_ID
                        });
                        showToast(`本地字幕已发送至嵌套页面: ${parsed.length} 条`);
                    } else {
                        createSubtitleOverlay(state.currentVideo);
                        showToast(`本地字幕加载: ${parsed.length} 条`);
                    }
                } else {
                    showToast(`字幕已加载: ${parsed.length} 条（请先选择视频）`);
                }
            } catch(err) {
                showToast('字幕解析失败: ' + err.message);
            }
        };

        reader.onerror = () => {
            showToast('文件读取失败');
        };

        reader.readAsText(file);
        e.target.value = '';
    }

    async function toggleRecording() {
        if (!state.currentVideo) {
            if (!isTopWindow && state.activeIframeVideo) {
                if (state.isRecording) {
                    stopRecording();
                } else {
                    if (state.activeIframeVideo.paused) {
                        await state.activeIframeVideo.play();
                    }
                    startRecording(state.activeIframeVideo);
                }
                return;
            }
            return showToast('未选择视频');
        }

        if (state.currentVideo._isIframe) {
            broadcastToAllFrames({
                type: MESSAGE_PREFIX + 'RECORD_COMMAND',
                targetId: state.currentVideo._id,
                action: state.isRecording ? 'stop' : 'start',
                scriptId: SCRIPT_ID
            });
            return;
        }

        if (state.isRecording) {
            stopRecording();
        } else {
            if (state.currentVideo.paused) {
                await state.currentVideo.play();
                updatePlayBtn();
            }
            startRecording(state.currentVideo);
        }
    }

    function getSupportedMimeType() {
        const types = [
            'video/mp4;codecs=h264,aac',
            'video/mp4;codecs=h264',
            'video/webm;codecs=h264',
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm'
        ];
        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) return type;
        }
        return 'video/webm';
    }

    async function startRecording(video) {
        try {
            if (!video) {
                video = state.currentVideo || state.activeIframeVideo;
            }
            if (!video) {
                throw new Error('未找到视频元素');
            }

            let stream;
            if (video.captureStream) {
                stream = video.captureStream();
            } else if (video.mozCaptureStream) {
                stream = video.mozCaptureStream();
            } else if (video.srcObject) {
                stream = video.srcObject;
            } else {
                throw new Error('该视频不支持录制');
            }

            const mimeType = getSupportedMimeType();

            const recorderOptions = {
                mimeType: mimeType,
                videoBitsPerSecond: 8000000,
                audioBitsPerSecond: 128000
            };

            try {
                state.mediaRecorder = new MediaRecorder(stream, recorderOptions);
            } catch (e) {
                state.mediaRecorder = new MediaRecorder(stream, { mimeType });
            }

            state.recordedChunks = [];

            state.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) state.recordedChunks.push(e.data);
            };

            state.mediaRecorder.onstop = () => {
                const blob = new Blob(state.recordedChunks, { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
                a.download = `录制_${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.${ext}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                showToast('录制完成');
            };

            state.mediaRecorder.start(1000);
            state.isRecording = true;

            if (!isTopWindow && state.myVideoId) {
                safePostMessage(window.top, {
                    type: MESSAGE_PREFIX + 'RECORD_STARTED',
                    scriptId: SCRIPT_ID,
                    data: {
                        videoId: state.myVideoId,
                        startTime: Date.now()
                    }
                });
            }

            updateRecordUI(true);
            showToast('开始高清录制...');

        } catch(e) {
            showToast('录制失败: ' + e.message);
            console.error('[视频助手] 录制错误:', e);
            state.isRecording = false;
        }
    }

    function stopRecording() {
        if (state.mediaRecorder && state.isRecording) {
            state.mediaRecorder.stop();
            state.isRecording = false;

            if (!isTopWindow && state.myVideoId) {
                safePostMessage(window.top, {
                    type: MESSAGE_PREFIX + 'RECORD_STOPPED',
                    scriptId: SCRIPT_ID,
                    data: {
                        videoId: state.myVideoId
                    }
                });
            }

            updateRecordUI(false);
        }
    }

    function updateRecordUI(recording) {
        const btn = $('#uve-record-btn', shadow);
        if (!btn) return;
        if (recording) {
            btn.className = 'uve-record-btn uve-recording';
            btn.innerHTML = '⏹ 停止录制 <span style="margin-left:8px;font-family:monospace">00:00</span>';
            state.recordingStartTime = Date.now();
            state.recordingTimer = setInterval(() => {
                const diff = Math.floor((Date.now() - state.recordingStartTime) / 1000);
                const min = String(Math.floor(diff/60)).padStart(2,'0');
                const sec = String(diff%60).padStart(2,'0');
                const timeSpan = btn.querySelector('span');
                if (timeSpan) timeSpan.textContent = `${min}:${sec}`;
            }, 1000);
        } else {
            btn.className = 'uve-record-btn';
            btn.innerHTML = '🔴 录制视频';
            clearInterval(state.recordingTimer);
        }
    }

    function updateResourceList() {
        const container = $('#uve-resource-list', shadow);
        const countSpan = $('#resource-count', shadow);
        if (!container) return;
        countSpan.textContent = state.mediaUrls.length;

        state.mediaUrls.forEach(item => {
            if (container.querySelector(`[data-id="${item.id}"]`)) return;
            const el = document.createElement('div');
            el.className = 'uve-resource-item';
            el.dataset.id = item.id;
            el.dataset.url = item.url;
            const isM3U8 = item.category === 'm3u8';
            const displayName = item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name;
            const resBadge = item.resolution ? `<span class="uve-resource-badge uve-badge-m3u8">${item.resolution}</span>` : '';

            let badgeClass = 'uve-badge-video';
            let badgeText = '视频';
            if (item.category === 'audio') { badgeClass = 'uve-badge-audio'; badgeText = '音频'; }
            else if (isM3U8) { badgeClass = 'uve-badge-m3u8'; badgeText = 'M3U8'; }

            el.innerHTML = `
                <div class="uve-resource-preview">
                    <video muted preload="metadata" playsinline></video>
                    <div class="uve-preview-placeholder">加载中...</div>
                </div>
                <div class="uve-resource-info">
                    <div class="uve-resource-name">
                        <div class="uve-resource-title" title="${item.name}">
                            ${displayName} ${resBadge}
                        </div>
                        <div class="uve-resource-meta">${item.type}</div>
                    </div>
                    <span class="uve-resource-badge ${badgeClass}">${badgeText}</span>
                </div>
                <div class="uve-resource-actions">
                    <button class="uve-resource-btn uve-btn-play">▶ 播放</button>
                    <button class="uve-resource-btn uve-btn-download">⬇ 下载</button>
                    <button class="uve-resource-btn uve-btn-cancel hidden">✕ 取消</button>
                </div>
                <div class="uve-progress-area">
                    <div class="uve-progress-bar-bg">
                        <div class="uve-progress-bar-fill" style="width:0%"></div>
                    </div>
                    <div class="uve-progress-text">
                        <span class="uve-status-text">准备...</span>
                        <span class="uve-speed-text"></span>
                    </div>
                </div>
            `;

            const previewContainer = el.querySelector('.uve-resource-preview');
            const video = previewContainer.querySelector('video');
            const placeholder = previewContainer.querySelector('.uve-preview-placeholder');
            const playBtn = el.querySelector('.uve-btn-play');

            playBtn.addEventListener('mouseenter', () => {
                if (item.category === 'audio') return;
                previewContainer.classList.add('show');
                if (!video.src && !isM3U8) {
                    video.src = item.url;
                    video.onloadeddata = () => {
                        previewContainer.classList.add('loaded');
                        video.currentTime = 0.1;
                    };
                    video.onerror = () => {
                        placeholder.textContent = '无法加载';
                    };
                } else if (isM3U8) {
                    placeholder.textContent = '不支持预览';
                }
            });

            playBtn.addEventListener('mouseleave', () => {
                previewContainer.classList.remove('show');
            });

            playBtn.onclick = () => GM_openInTab(item.url, {active: true});
            const dlBtn = el.querySelector('.uve-btn-download');
            const cancelBtn = el.querySelector('.uve-btn-cancel');
            dlBtn.onclick = () => {
                dlBtn.classList.add('hidden');
                cancelBtn.classList.remove('hidden');
                downloadFile(item, el);
            };
            cancelBtn.onclick = () => {
                const controller = state.activeDownloads.get(item.id);
                if (controller) {
                    controller.abort();
                    state.activeDownloads.delete(item.id);
                }
                resetDownloadUI(el);
                showToast('下载已取消');
            };
            container.prepend(el);
        });
    }

    function resetDownloadUI(element) {
        const progressArea = element.querySelector('.uve-progress-area');
        const dlBtn = element.querySelector('.uve-btn-download');
        const cancelBtn = element.querySelector('.uve-btn-cancel');
        const progressBar = element.querySelector('.uve-progress-bar-fill');
        const statusText = element.querySelector('.uve-status-text');
        progressArea.classList.remove('show');
        dlBtn.classList.remove('hidden');
        cancelBtn.classList.add('hidden');
        progressBar.style.width = '0%';
        statusText.textContent = '准备...';
    }

    async function downloadFile(item, element) {
        const progressArea = element.querySelector('.uve-progress-area');
        const progressBar = element.querySelector('.uve-progress-bar-fill');
        const statusText = element.querySelector('.uve-status-text');
        progressArea.classList.add('show');
        const controller = new AbortController();
        state.activeDownloads.set(item.id, controller);
        try {
            if (item.category === 'm3u8') {
                await downloadM3U8(item, element, controller.signal);
            } else {
                await downloadWithProgress(item, element, controller.signal);
            }
            statusText.textContent = '完成';
            showToast('下载完成');
            setTimeout(() => resetDownloadUI(element), 2000);
        } catch(e) {
            if (e.name === 'AbortError') {
                console.log('下载被取消');
            } else {
                statusText.textContent = '失败';
                showToast('下载失败');
                resetDownloadUI(element);
            }
        } finally {
            state.activeDownloads.delete(item.id);
        }
    }

    async function downloadWithProgress(item, element, signal) {
        const progressBar = element.querySelector('.uve-progress-bar-fill');
        const statusText = element.querySelector('.uve-status-text');
        const response = await fetch(item.url, { signal });
        const total = parseInt(response.headers.get('content-length')) || 0;
        const reader = response.body.getReader();
        let received = 0;
        const chunks = [];
        while(true) {
            const {done, value} = await reader.read();
            if (done) break;
            chunks.push(value);
            received += value.length;
            if (total) {
                const percent = (received / total * 100).toFixed(1);
                progressBar.style.width = percent + '%';
                statusText.textContent = `${percent}%`;
            } else {
                const downloaded = (received / 1024 / 1024).toFixed(1);
                statusText.textContent = `${downloaded} MB`;
            }
        }
        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        a.click();
        URL.revokeObjectURL(url);
    }

    async function downloadM3U8(item, element, signal) {
        const progressBar = element.querySelector('.uve-progress-bar-fill');
        const statusText = element.querySelector('.uve-status-text');
        statusText.textContent = '解析中...';
        const response = await fetch(item.url, { signal });
        const content = await response.text();
        const baseUrl = item.url.substring(0, item.url.lastIndexOf('/') + 1);
        const segments = [];
        const lines = content.split('\n');
        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                segments.push(trimmed.startsWith('http') ? trimmed : baseUrl + trimmed);
            }
        }
        if (segments.length === 0) throw new Error('无视频片段');
        const chunks = [];
        for (let i = 0; i < segments.length; i++) {
            if (signal.aborted) throw new Error('Aborted');
            const res = await fetch(segments[i], { signal });
            const buff = await res.arrayBuffer();
            chunks.push(buff);
            const percent = ((i + 1) / segments.length * 100).toFixed(1);
            progressBar.style.width = percent + '%';
            statusText.textContent = `${i + 1}/${segments.length}`;
        }
        const blob = new Blob(chunks, {type: 'video/mp2t'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name.endsWith('.ts') ? item.name : item.name + '.ts';
        a.click();
        URL.revokeObjectURL(url);
    }

    function switchToVideo(video) {
        if (state.currentVideo === video) return;

        if (state.currentVideo && !state.currentVideo._isIframe) {
            cleanupVideoListeners(state.currentVideo);
            const oldOverlay = document.querySelector('.uve-subtitle-overlay');
            if (oldOverlay) oldOverlay.remove();
        }

        state.currentVideo = video;

        if (video) {
            if (!video._isIframe) {
                document.querySelectorAll('video[data-uve-selected="true"]').forEach(v => {
                    if (v !== video) {
                        v.dataset.uveSelected = 'false';
                    }
                });
                video.dataset.uveSelected = 'true';

                const listeners = [];
                const updatePlay = () => updatePlayBtn();
                const updateTime = () => {
                    if (state.subtitleData.length > 0) updateSubtitleDisplay(video.currentTime);
                };
                const updateSpeed = () => {
                    const speedSpan = $('#current-speed', shadow);
                    if (speedSpan) speedSpan.textContent = video.playbackRate.toFixed(2) + 'x';
                    $$('.uve-speed-option', shadow).forEach(o => {
                        o.classList.toggle('active', parseFloat(o.dataset.speed) === video.playbackRate);
                    });
                };
                video.addEventListener('play', updatePlay);
                video.addEventListener('pause', updatePlay);
                video.addEventListener('timeupdate', updateTime);
                video.addEventListener('ratechange', updateSpeed);
                listeners.push({event: 'play', handler: updatePlay});
                listeners.push({event: 'pause', handler: updatePlay});
                listeners.push({event: 'timeupdate', handler: updateTime});
                listeners.push({event: 'ratechange', handler: updateSpeed});
                state.eventListeners.set(video, listeners);

                if (state.subtitleData.length > 0) createSubtitleOverlay(video);
            }
            updatePlayBtn();
            const currentSpeed = video.playbackRate || 1;
            const speedSpan = $('#current-speed', shadow);
            if (speedSpan) speedSpan.textContent = currentSpeed.toFixed(2) + 'x';
            $$('.uve-speed-option', shadow).forEach(o => {
                o.classList.toggle('active', parseFloat(o.dataset.speed) === currentSpeed);
            });
            showToast('已接管视频控制');
        }
    }

    function initMainPage() {
        try {
            initShadowDOM();
            createPanel();
            setupSniffing();
            initVideoSelection();

            window.addEventListener('message', (e) => {
                if (e.source === window || !e.data || !e.data.type) return;
                if (!e.data.type.startsWith(MESSAGE_PREFIX)) return;
                if (e.data.scriptId === SCRIPT_ID) return;

                switch(e.data.type) {
                    case MESSAGE_PREFIX + 'VIDEO_SELECT': {
                        const data = e.data.data;

                        const virtualVideo = {
                            _isIframe: true,
                            _id: data.id,
                            _sourceInfo: data,
                            _currentTime: data.currentTime || 0,
                            _playbackRate: data.playbackRate || 1,
                            paused: data.isPaused !== undefined ? data.isPaused : true,
                            duration: data.duration,
                            videoWidth: data.width,
                            videoHeight: data.height,
                            _isRecording: false,
                            play() {
                                this.paused = false;
                                sendCommandToFrame(this._id, 'play');
                            },
                            pause() {
                                this.paused = true;
                                sendCommandToFrame(this._id, 'pause');
                            },
                            set currentTime(v) {
                                if (Math.abs(this._currentTime - v) > 0.1) {
                                    this._currentTime = v;
                                    sendCommandToFrame(this._id, 'seek', v);
                                } else {
                                    this._currentTime = v;
                                }
                            },
                            get currentTime() { return this._currentTime; },
                            set playbackRate(v) {
                                if (this._playbackRate !== v) {
                                    this._playbackRate = v;
                                    sendCommandToFrame(this._id, 'speed', v);
                                }
                            },
                            get playbackRate() { return this._playbackRate; }
                        };

                        state.iframeVideoMap.set(data.id, virtualVideo);

                        if (!state.currentVideo || state.currentVideo._id !== data.id) {
                            switchToVideo(virtualVideo);
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'VIDEO_SYNC': {
                        const v = state.iframeVideoMap.get(e.data.data.id);
                        if (v) {
                            const newTime = e.data.data.currentTime;
                            if (Math.abs(v._currentTime - newTime) > 0.5 || v.paused !== e.data.data.paused) {
                                v._currentTime = newTime;
                                v.paused = e.data.data.paused;
                                v._playbackRate = e.data.data.playbackRate || 1;
                                v.duration = e.data.data.duration || v.duration;
                                if (state.currentVideo === v) updatePlayBtn();
                            }
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'MEDIA_FOUND': {
                        const item = e.data.data;
                        if (!state.urlSet.has(item.url)) {
                            if (item.resolution) {
                                const [w, h] = item.resolution.split('x').map(Number);
                                if (w < 640 || h < 360) return;
                            }
                            state.urlSet.add(item.url);
                            state.mediaUrls.push(item);
                            updateResourceList();
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'RECORD_STARTED': {
                        const { videoId, startTime } = e.data.data;
                        const virtualVideo = state.iframeVideoMap.get(videoId);
                        if (virtualVideo) {
                            virtualVideo._isRecording = true;
                            if (state.currentVideo === virtualVideo) {
                                state.isRecording = true;
                                state.recordingStartTime = startTime;
                                updateRecordUI(true);
                            }
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'RECORD_STOPPED': {
                        const { videoId } = e.data.data;
                        const virtualVideo = state.iframeVideoMap.get(videoId);
                        if (virtualVideo) {
                            virtualVideo._isRecording = false;
                            if (state.currentVideo === virtualVideo) {
                                state.isRecording = false;
                                updateRecordUI(false);
                            }
                        }
                        break;
                    }
                }
            });

            state.initialized = true;
            console.log('[视频助手] 主页面初始化完成，ScriptID:', SCRIPT_ID);
        } catch (e) {
            console.error('[视频助手] 初始化失败:', e);
        }
    }

    function initIframe() {
        try {
            initShadowDOM();
            setupSniffing();
            initVideoSelection();

            window.addEventListener('message', (e) => {
                if (!e.data || !e.data.type) return;
                if (!e.data.type.startsWith(MESSAGE_PREFIX)) return;
                if (e.data.scriptId === SCRIPT_ID) return;

                switch(e.data.type) {
                    case MESSAGE_PREFIX + 'CONTROL': {
                        let video = document.querySelector(`video[data-uve-id="${e.data.targetId}"]`);

                        if (video) {
                            state.activeIframeVideo = video;
                            state.myVideoId = e.data.targetId;

                            const executeCommand = async () => {
                                try {
                                    switch(e.data.cmd) {
                                        case 'play':
                                            await video.play();
                                            break;
                                        case 'pause':
                                            video.pause();
                                            break;
                                        case 'seek':
                                            if (e.data.value !== undefined) {
                                                video.currentTime = e.data.value;
                                            }
                                            break;
                                        case 'speed':
                                            if (e.data.value !== undefined) {
                                                video.playbackRate = e.data.value;
                                            }
                                            break;
                                    }
                                } catch(err) {
                                    console.error('[视频助手] 控制执行失败:', err);
                                }

                                setTimeout(() => {
                                    safePostMessage(window.top, {
                                        type: MESSAGE_PREFIX + 'VIDEO_SYNC',
                                        data: {
                                            id: state.myVideoId,
                                            currentTime: video.currentTime,
                                            paused: video.paused,
                                            duration: video.duration,
                                            playbackRate: video.playbackRate,
                                            volume: video.volume,
                                            muted: video.muted
                                        },
                                        scriptId: SCRIPT_ID
                                    });
                                }, 50);
                            };

                            executeCommand();
                        } else {
                            for (let i = 0; i < window.frames.length; i++) {
                                try {
                                    window.frames[i].postMessage(e.data, '*');
                                } catch(e) {}
                            }
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'RECORD_COMMAND': {
                        const video = state.activeIframeVideo || document.querySelector(`video[data-uve-id="${e.data.targetId}"]`);
                        if (!video) {
                            showToast('未找到视频');
                            return;
                        }

                        if (e.data.action === 'start') {
                            if (video.paused) video.play();
                            setTimeout(() => {
                                if (!state.isRecording) startRecording(video);
                            }, 100);
                        } else if (e.data.action === 'stop') {
                            if (state.isRecording) stopRecording();
                        }
                        break;
                    }
                    case MESSAGE_PREFIX + 'SUBTITLE_DATA': {
                        state.subtitleData = e.data.data;
                        state.lastSubtitleIndex = -1;

                        const video = state.activeIframeVideo || document.querySelector(`video[data-uve-id="${e.data.targetId}"]`);
                        if (video) {
                            const oldOverlay = document.querySelector('.uve-subtitle-overlay');
                            if (oldOverlay) oldOverlay.remove();
                            createSubtitleOverlay(video);
                            showToast(`接收到字幕: ${state.subtitleData.length} 条`);
                            updateSubtitleDisplay(video.currentTime);
                        } else {
                            showToast(`接收到字幕: ${state.subtitleData.length} 条（视频未就绪）`);
                        }
                        break;
                    }
                }
            });

            state.initialized = true;
            console.log('[视频助手] iframe 初始化完成，ScriptID:', SCRIPT_ID);
        } catch (e) {
            console.error('[视频助手] iframe 初始化失败:', e);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (isTopWindow) initMainPage();
            else initIframe();
        });
    } else {
        if (isTopWindow) initMainPage();
        else initIframe();
    }
})();