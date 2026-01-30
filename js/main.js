/**
 * 主控制逻辑
 */
const App = {
    universe: null,
    usedIndices: [],
    currentPoem: null,
    
    init() {
        // 初始化宇宙
        this.universe = new Universe('universe-canvas');
        this.universe.init();
        this.universe.animate();

        // 绑定事件
        this.bindEvents();
        
        // 移除加载器
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1500);
    },

    bindEvents() {
        // 进入按钮点击
        const enterBtn = document.getElementById('enter-btn');
        enterBtn.addEventListener('click', () => {
            this.enterUniverse();
        });

        // 画布点击（点击星星）
        const canvas = document.getElementById('universe-canvas');
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const star = this.universe.getStarAtPosition(x, y);
            if (star) {
                this.showPoem();
                // 视觉反馈
                this.createClickEffect(e.clientX, e.clientY);
            }
        });

        // 键盘事件（ESC关闭）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePoem();
            }
        });
    },

    enterUniverse() {
        // 激活曲速效果
        this.universe.activateWarp();
        
        // 切换页面
        const landing = document.getElementById('landing-page');
        const main = document.getElementById('main-universe');
        
        landing.style.opacity = '0';
        setTimeout(() => {
            landing.classList.remove('active');
            main.classList.add('active');
        }, 1000);
    },

    showPoem() {
        const content = PoemDatabase.getRandomUnique(this.usedIndices);
        this.currentPoem = content;
        
        const modal = document.getElementById('poem-modal');
        const textEl = document.getElementById('poem-text');
        const authorEl = document.getElementById('poem-author');
        const titleEl = document.getElementById('poem-title');
        
        // 显示模态框
        modal.classList.remove('hidden');
        
        // 文字解码动画
        this.scrambleText(textEl, content.text);
        
        // 延迟显示作者和标题
        authorEl.style.opacity = '0';
        titleEl.style.opacity = '0';
        
        setTimeout(() => {
            authorEl.textContent = `—— ${content.author}`;
            titleEl.textContent = content.title;
            authorEl.style.transition = 'opacity 0.5s';
            titleEl.style.transition = 'opacity 0.5s';
            authorEl.style.opacity = '1';
            titleEl.style.opacity = '1';
        }, 1000);
    },

    closePoem() {
        const modal = document.getElementById('poem-modal');
        modal.classList.add('hidden');
    },

    // 文字解码特效
    scrambleText(element, finalText) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let iteration = 0;
        const maxIterations = 20;
        
        element.classList.add('scrambling');
        
        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((char, index) => {
                    if (index < iteration / 2) {
                        return finalText[index];
                    }
                    if (char === ' ' || char === '，' || char === '。' || char === '？' || char === '！') {
                        return char;
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            iteration++;
            
            if (iteration > maxIterations + finalText.length * 2) {
                clearInterval(interval);
                element.textContent = finalText;
                element.classList.remove('scrambling');
            }
        }, 50);
    },

    // 点击视觉效果
    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 100px;
            height: 100px;
            border: 2px solid #00f0ff;
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 0 20px #00f0ff, inset 0 0 20px #00f0ff;
        `;
        
        document.body.appendChild(effect);
        
        const animation = effect.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: 'translate(-50%, -50%) scale(2)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        animation.onfinish = () => effect.remove();
    }
};

// 页面加载完成后初始化
window.addEventListener('load', () => {
    App.init();
});

// 全局函数供HTML调用
function closePoem() {
    App.closePoem();
}
