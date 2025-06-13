// ==UserScript==
// @name         上海第二工业大学教师评教自动填写
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填写教师评教表单 - 专为上海第二工业大学定制
// @author       Assistant
// @match        https://jx.sspu.edu.cn/eams/evaluateStd*
// @match        https://jx.sspu.edu.cn/eams/*
// @include      https://jx.sspu.edu.cn/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 添加自动填写按钮
        addAutoFillButton();
    });

    function addAutoFillButton() {
        const button = document.createElement('button');
        button.textContent = '🤖 一键好评';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.onmouseover = () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 8px 25px rgba(0,0,0,0.3)';
        };

        button.onmouseout = () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        };

        button.onclick = autoFillEvaluation;
        document.body.appendChild(button);
    }

    function autoFillEvaluation() {
        // 检查是否为上海第二工业大学评教页面
        const isSSPUEvaluation = window.location.href.includes('jx.sspu.edu.cn') &&
                                (window.location.href.includes('evaluateStd') ||
                                 document.querySelector('input[name^="select2"]') ||
                                 document.querySelector('.gridtable') ||
                                 document.querySelector('table[class*="grid"]') ||
                                 document.title.includes('评教') ||
                                 document.title.includes('evaluation') ||
                                 document.body.innerHTML.includes('学生评教'));

        if (!isSSPUEvaluation) {
            console.log('当前页面不是上海第二工业大学评教页面，跳过自动填写');
            return;
        }

        console.log('检测到上海第二工业大学评教页面，开始自动填写...');

        const scoreMapping = {
            'select211': '174', 'select212': '174', 'select219': '174', 'select220': '174',
            'select214': '174', 'select215': '174', 'select225': '174', 'select226': '174',
            'select227': '174', 'select228': '174', 'select221': '174', 'select222': '174',
            'select223': '174', 'select224': '174', 'select229': '174',
            'select233': '169', 'select230': '169', 'select231': '169', 'select232': '169',
            'select234': '179'
        };

        let successCount = 0;
        for (let [name, value] of Object.entries(scoreMapping)) {
            const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
                successCount++;
            }
        }

        if (successCount > 0) {
            alert(`✅ 已自动填写 ${successCount} 个问题！`);
        } else {
            alert('❌ 未找到匹配的评教表单，请检查页面是否正确');
        }
    }
})();