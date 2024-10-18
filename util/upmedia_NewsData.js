// ==UserScript==
// @name        每分钟自动获取 ‘上报 up media’ 新闻数据
// @namespace   http://tampermonkey.net/
// @match       *://*.upmedia*.mg/*
// @match       *://*.upmedia.*/*
// @grant       none
// @version     1.0.1
// @author      slowFever
// @description 自动获取 ‘上报 up media’ 新闻数据, 并保存到浏览器本地localStorage中。
// @icon        https://www.upmedia.mg/images/favicon.png
// @license     MIT
// ==/UserScript==

(function () {
    'use strict';
    // 保存 setInterval 的 ID
    let intervalId;

    function getNewsData() {
        // 定义对象来存储数据
        let newsData = {
            data: []
        };

        // 获取所有的 <li> 元素
        let items = document.querySelectorAll('#marquee ul li');

        if (items.length > 0) {
            // 遍历每个 <li> 元素并提取数据
            items.forEach(item => {
                let textElement = item.querySelector('a');
                let timeElement = item.querySelector('.time');

                if (textElement && timeElement) {
                    let newsItem = {
                        text: textElement.textContent.trim(),
                        time: timeElement.textContent.trim()
                    };
                    newsData.data.push(newsItem);
                }
            });

            if (newsData.data.length > 0) localStorage.setItem('newsData', JSON.stringify(newsData));
            // 输出结果
            console.log(JSON.parse(localStorage.getItem('newsData')));
        } else {
            console.error('error: No news items found.');

            // 在 newsData 中存入错误信息
            newsData.data.push(null);
            newsData.errors = {
                errorInfo: 'No news items found.',
                errorTime: new Date().toLocaleString()
            };

            console.log(JSON.parse(localStorage.getItem('newsData')));

            setTimeout(() => {
                // 清除定时任务
                clearInterval(intervalId);
                console.log('定时任务已结束');
            }, 50)
        }
    }

    // 定义一个要执行的任务函数
    function myTask() {
        const now = new Date();
        // 执行任务
        getNewsData();
        console.log(`任务在 ${now.toLocaleTimeString()} 被执行`);
    }

    // 定义一个工具函数来启动定时器
    function startTaskEveryMinute() {
        // 首先执行一次任务
        myTask();

        // 计算当前时间到下一分钟的剩余时间
        const now = new Date();
        const millisecondsUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // 设置一个一次性的定时器，在下一个完整的分钟执行任务
        setTimeout(() => {
            // 每分钟执行一次任务
            intervalId = setInterval(myTask, 60000);
            // 每分钟刷新一次页面
            setInterval(() => {
                location.reload();
            }, 60000); // 60000 毫秒 = 1 分钟
        }, millisecondsUntilNextMinute);
    }

    // 启动定时任务
    startTaskEveryMinute();
})();
