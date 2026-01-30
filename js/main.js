const App = {
    universe: null,
    usedIndices: [],
    currentPoem: null,
    isLocked: false,
    
    init() {
        this.universe = new Universe('universe-canvas');
        this.universe.init();
        this.universe.animate();

        this.bindEvents();
        
        // 更新时间戳
        this.updateTimestamp();
        
        setTimeout(() => {
            document.getElementById('loader').classList.add('hidden');
        }, 1500);
    },

    bindEvents() {
        // 进入按钮
        const enterBtn = document.getElementById('enter-btn');
        enterBtn.addEventListener('click', () => {
            this.enterUniverse();
        });

        // 锁定按钮点击
        const lockBtn = document.getElementById('lockButton');
        lockBtn.addEventListener('click', () => {
            if (!this.isLocked) {
                this.performLock();
            }
        });

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePoem();
            }
            if (e.key === ' ' || e.key === 'Enter') {
                // 空格或回车也能触发锁定
                if (document.getElementById('main-universe').classList.contains('active')) {
                    this.performLock();
                }
            }
        });
    },

    updateTimestamp() {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.');
        const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);
        document.getElementById('timestamp').textContent = `${dateStr} ${timeStr}`;
    },

    enterUniverse() {
        this.universe.activateWarp();
        
        const landing = document.getElementById('landing-page');
        const main = document.getElementById('main-universe');
        
        landing.style.opacity = '0';
        setTimeout(() => {
            landing.classList.remove('active');
            main.classList.add('active');
        }, 1000);
    },

    performLock() {
        this.isLocked = true;
        
        // 显示扫描动画
        const scanOverlay = document.getElementById('scanOverlay');
        scanOverlay.classList.remove('hidden');
        
        // 播放锁定音效（如果有的话）
        // this.playLockSound();
        
        // 1.5秒后显示诗句
        setTimeout(() => {
            scanOverlay.classList.add('hidden');
            this.showPoem();
            
            // 重置锁定状态（允许再次点击）
            setTimeout(() => {
                this.isLocked = false;
            }, 500);
        }, 1500);
    },

    showPoem() {
        const content = PoemDatabase.getRandomUnique(this.usedIndices);
        this.currentPoem = content;
        
        const panel = document.getElementById('poem-panel');
        const textEl = document.getElementById('poem-text');
        const authorEl = document.getElementById('poem-author');
        const titleEl = document.getElementById('poem-title');
        
        // 显示面板
        panel.classList.remove('hidden');
        // 强制重绘以触发过渡动画
        void panel.offsetWidth;
        panel.classList.add('show');
        
        // 清空之前的内容
        authorEl.textContent = '';
        titleEl.textContent = '';
        
        // 文字解码动画
        this.scrambleText(textEl, content.text, () => {
            // 动画完成后显示作者和标题
            authorEl.textContent = content.author;
            titleEl.textContent = content.title;
        });
        
        // 更新时间戳
        this.updateTimestamp();
    },

    closePoem() {
        const panel = document.getElementById('poem-panel');
        panel.classList.remove('show');
        
        setTimeout(() => {
            panel.classList.add('hidden');
        }, 500);
    },

    scrambleText(element, finalText, callback) {
        const chars = '!@#$%^&*()01ABCDXYZ';
        let iteration = 0;
        const maxIterations = 25;
        
        element.classList.add('scrambling');
        element.style.opacity = '1';
        
        const interval = setInterval(() => {
            element.textContent = finalText
                .split('')
                .map((char, index) => {
                    if (char === ' ' || /[，。！？、；：""''（）【】]/.test(char)) {
                        return char;
                    }
                    if (index < iteration / 2) {
                        return finalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            iteration++;
            
            if (iteration > maxIterations) {
                clearInterval(interval);
                element.textContent = finalText;
                element.classList.remove('scrambling');
                if (callback) callback();
            }
        }, 40);
    }
};

// 页面加载完成后初始化
window.addEventListener('load', () => {
    App.init();
});
