// ==UserScript==
// @name         上海第二工业大学教师评教自动填写
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  自动填写教师评教表单 - 专为上海第二工业大学定制，支持实验课评教
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
        setTimeout(() => {
            addAutoFillButton();
        }, 2000); // 延迟2秒确保页面完全加载
    });

    function addAutoFillButton() {
        // 避免重复添加按钮
        if (document.getElementById('auto-fill-btn')) {
            return;
        }

        const button = document.createElement('button');
        button.id = 'auto-fill-btn';
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
            font-weight: bold;
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
        console.log('开始自动填写评教表单...');

        // 检查是否为上海第二工业大学评教页面
        const isSSPUEvaluation = window.location.href.includes('jx.sspu.edu.cn') &&
                                (window.location.href.includes('evaluateStd') ||
                                 document.querySelector('.gridtable') ||
                                 document.querySelector('#evaluateTB') ||
                                 document.title.includes('评教') ||
                                 document.body.innerHTML.includes('学生评教'));

        if (!isSSPUEvaluation) {
            alert('❌ 当前页面不是上海第二工业大学评教页面');
            return;
        }

        // 新的评教表单映射（基于提供的HTML结构）
        const scoreMapping = {
            // 问题1-12: 选择"非常符合" (value="174")
            'select213': '174', // 备课充分，内容熟练，指导耐心，安排合理
            'select216': '174', // 教师能将每堂课的实验目标和实验要求清晰的告知我们
            'select235': '174', // 教态端正，言行得体，教风严谨
            'select236': '174', // 教师能够告知我们实验可能发生的危险以及需采取的预防措施
            'select241': '174', // 教师善于结合实验内容提出启发性的问题
            'select242': '174', // 教师有较强的课堂组织和管理能力
            'select243': '174', // 实践学习任务的指导清晰而具体
            'select244': '174', // 内容融入课程思政要素，体现协同育人
            'select237': '174', // 教师提前进场准备教学设备、仪器和材料等
            'select238': '174', // 教师普通话（外语）标准流利，语言表达清晰、流畅
            'select239': '174', // 教师在实验过程中对基本概念、原理、过程步骤、注意事项讲解透彻
            'select240': '174', // 对实践环节的正确操作规程（工作流程）贯彻始终
            'select245': '174', // 教师使用多种手段和教学方法促使我们掌握实验方法与操作技能
            'select246': '174', // 教师对我们的实验报告批改认真
            'select247': '174', // 恰当运用现代化教学手段，有效利用实验设备、仪器和材料等

            // 问题13-15, 20: 选择"非常同意" (value="169")
            'select249': '169', // 通过这门课程学习，我掌握了实验方法
            'select250': '169', // 通过这门课的学习，提高了我参与实验和实践的意识和兴趣
            'select251': '169', // 通过本课程的学习，我的分析能力以及综合运用能力也得到了提高
            'select248': '169', // 本课程教学调动了我的学习热情和主动性

            // 问题16: 选择"非常愿意" (value="179")
            'select252': '179'  // 我愿意推荐其他同学学习该教师教授的本门课程
        };

        let successCount = 0;
        let totalQuestions = Object.keys(scoreMapping).length;

        // 遍历所有需要填写的问题
        for (let [name, value] of Object.entries(scoreMapping)) {
            const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
                successCount++;
                console.log(`✅ 已填写: ${name} = ${value}`);

                // 触发change事件，确保表单状态更新
                const event = new Event('change', { bubbles: true });
                radio.dispatchEvent(event);
            } else {
                console.log(`❌ 未找到: ${name} = ${value}`);
            }
        }

        // 显示结果
        if (successCount > 0) {
            const message = `✅ 评教填写完成！\n成功填写: ${successCount}/${totalQuestions} 个问题\n\n所有问题均已选择最高评价：\n• 教学相关问题：非常符合\n• 学习效果问题：非常同意\n• 推荐意愿：非常愿意`;
            alert(message);

            // 滚动到页面底部，方便用户查看提交按钮
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
            });
        } else {
            alert('❌ 未找到匹配的评教表单\n请确认：\n1. 页面是否完全加载\n2. 是否为正确的评教页面\n3. 表单结构是否发生变化');
        }

        // 检查是否还有未填写的问题
        const allRadios = document.querySelectorAll('input[type="radio"]');
        const radioGroups = {};

        allRadios.forEach(radio => {
            const name = radio.name;
            if (name.startsWith('select')) {
                if (!radioGroups[name]) {
                    radioGroups[name] = [];
                }
                radioGroups[name].push(radio);
            }
        });

        let unfilledCount = 0;
        for (let [groupName, radios] of Object.entries(radioGroups)) {
            const isChecked = radios.some(radio => radio.checked);
            if (!isChecked) {
                unfilledCount++;
                console.log(`⚠️ 未填写的问题组: ${groupName}`);
            }
        }

        if (unfilledCount > 0) {
            console.log(`⚠️ 还有 ${unfilledCount} 个问题组未填写`);
        }
    }

    // 页面变化监听，用于动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 检查是否有新的评教表格加载
                const hasEvalTable = document.querySelector('.gridtable') || document.querySelector('#evaluateTB');
                if (hasEvalTable && !document.getElementById('auto-fill-btn')) {
                    setTimeout(addAutoFillButton, 1000);
                }
            }
        });
    });

    // 开始观察页面变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('🤖 上海第二工业大学评教自动填写脚本已加载');
})();