// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const initialScreen = document.getElementById('initial-screen');
    const resultScreen = document.getElementById('result-screen');
    const viewBtn = document.getElementById('view-btn');
    const resetBtn = document.getElementById('reset-btn');
    const timerText = document.querySelector('.timer-text');
    const timerFill = document.querySelector('.timer-fill');
    const wastedTimeElement = document.getElementById('wasted-time');
    const mainText = document.querySelectorAll('.main-text');
    const body = document.querySelector('body');
    
    // 全局变量
    let timerInterval;
    let secondsLeft = 60;
    let totalWastedTime = 0;
    let isFirstClick = true;
    
    // 点击"查看"按钮
    viewBtn.addEventListener('click', function() {
        // 添加按钮点击效果
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
        
        // 切换屏幕显示 - 添加淡出淡入效果
        initialScreen.style.animation = 'fadeIn 0.5s ease-out reverse';
        
        setTimeout(() => {
            initialScreen.classList.remove('active');
            initialScreen.style.animation = '';
            resultScreen.classList.add('active');
            
            // 重置计时器
            secondsLeft = 60;
            timerText.textContent = secondsLeft;
            timerFill.style.background = `conic-gradient(#FF416C 0%, transparent 0%)`;
            
            // 如果是第一次点击，添加特殊效果
            if (isFirstClick) {
                isFirstClick = false;
                createConfetti();
            }
            
            // 启动计时器
            startTimer();
            
            // 添加动画效果到文本
            mainText.forEach(text => {
                text.style.animation = 'colorChange 3s infinite';
            });
            
            // 改变背景颜色以表示状态变化
            body.style.background = 'linear-gradient(-45deg, #ff0080, #8000ff, #0080ff, #00ff80)';
            body.style.backgroundSize = '400% 400%';
        }, 500);
    });
    
    // 点击"再来一次"按钮
    resetBtn.addEventListener('click', function() {
        // 添加按钮点击效果
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 300);
        
        // 切换屏幕显示
        resultScreen.style.animation = 'fadeIn 0.5s ease-out reverse';
        
        setTimeout(() => {
            resultScreen.classList.remove('active');
            resultScreen.style.animation = '';
            initialScreen.classList.add('active');
            
            // 停止计时器
            clearInterval(timerInterval);
            
            // 更新总浪费的时间
            totalWastedTime += (60 - secondsLeft);
            wastedTimeElement.textContent = totalWastedTime;
            
            // 移除文本动画
            mainText.forEach(text => {
                text.style.animation = '';
            });
            
            // 恢复原始背景
            body.style.background = 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)';
            body.style.backgroundSize = '400% 400%';
        }, 500);
    });
    
    // 启动计时器函数
    function startTimer() {
        clearInterval(timerInterval);
        
        timerInterval = setInterval(function() {
            secondsLeft--;
            timerText.textContent = secondsLeft;
            
            // 更新圆形进度条
            const percentage = ((60 - secondsLeft) / 60) * 100;
            timerFill.style.background = `conic-gradient(#FF416C ${percentage}%, transparent ${percentage}%)`;
            
            // 添加计时器跳动效果
            timerText.style.transform = 'translate(-50%, -50%) scale(1.1)';
            setTimeout(() => {
                timerText.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 200);
            
            // 当计时器结束时
            if (secondsLeft <= 0) {
                clearInterval(timerInterval);
                timerText.textContent = "0";
                
                // 显示完成消息
                const timerLabel = document.querySelector('.timer-label');
                timerLabel.textContent = "你的1分钟已被完全浪费！";
                timerLabel.style.color = "#FF416C";
                timerLabel.style.fontWeight = "bold";
                timerLabel.style.textShadow = "0 0 10px rgba(255, 65, 108, 0.7)";
                
                // 更新总浪费的时间
                totalWastedTime += 60;
                wastedTimeElement.textContent = totalWastedTime;
                
                // 结束时添加特效
                createEndingEffect();
            }
        }, 1000);
    }
    
    // 创建庆祝彩花效果
    function createConfetti() {
        const colors = ['#FF416C', '#FF4B2B', '#FFD700', '#23a6d5', '#23d5ab'];
        const confettiCount = 150;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-20px';
            confetti.style.opacity = '0.8';
            confetti.style.zIndex = '9999';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            // 动画
            const animation = confetti.animate([
                { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: Math.random() * 3000 + 2000,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            });
            
            animation.onfinish = () => {
                confetti.remove();
            };
        }
    }
    
    // 创建结束特效
    function createEndingEffect() {
        const endingText = document.createElement('div');
        endingText.textContent = '时间到！';
        endingText.style.position = 'fixed';
        endingText.style.top = '50%';
        endingText.style.left = '50%';
        endingText.style.transform = 'translate(-50%, -50%) scale(0)';
        endingText.style.fontSize = '5rem';
        endingText.style.fontWeight = 'bold';
        endingText.style.color = '#FF416C';
        endingText.style.zIndex = '10000';
        endingText.style.textShadow = '0 0 20px rgba(255, 65, 108, 0.8)';
        endingText.style.pointerEvents = 'none';
        endingText.style.fontFamily = "'Ma Shan Zheng', cursive";
        
        document.body.appendChild(endingText);
        
        // 动画效果
        const animation = endingText.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
            { transform: 'translate(-50%, -50%) scale(1.2)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 0 }
        ], {
            duration: 3000,
            easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        });
        
        animation.onfinish = () => {
            endingText.remove();
        };
    }
    
    // 添加一些额外的交互效果
    // 鼠标悬停效果
    viewBtn.addEventListener('mouseenter', function() {
        this.querySelector('i').style.transform = 'translateX(8px)';
        this.style.letterSpacing = '2px';
    });
    
    viewBtn.addEventListener('mouseleave', function() {
        this.querySelector('i').style.transform = 'translateX(0)';
        this.style.letterSpacing = '1px';
    });
    
    resetBtn.addEventListener('mouseenter', function() {
        this.querySelector('i').style.transform = 'rotate(180deg) scale(1.2)';
        this.style.letterSpacing = '2px';
    });
    
    resetBtn.addEventListener('mouseleave', function() {
        this.querySelector('i').style.transform = 'rotate(0) scale(1)';
        this.style.letterSpacing = '1px';
    });
    
    // 添加键盘支持
    document.addEventListener('keydown', function(event) {
        // 按空格键或回车键触发"查看"按钮
        if ((event.code === 'Space' || event.code === 'Enter') && initialScreen.classList.contains('active')) {
            event.preventDefault();
            viewBtn.click();
        }
        
        // 按R键重置
        if (event.code === 'KeyR' && resultScreen.classList.contains('active')) {
            event.preventDefault();
            resetBtn.click();
        }
    });
    
    // 添加页面加载时的动画
    setTimeout(function() {
        document.body.style.opacity = 1;
        initialScreen.style.transform = 'scale(1)';
    }, 100);
    
    // 动态改变背景
    setInterval(() => {
        const hue = (Date.now() / 20000) % 360;
        document.documentElement.style.setProperty('--hue', hue);
    }, 50);
});