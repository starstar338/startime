// 星体类
class Star {
    constructor(x, y, size, brightness) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.brightness = brightness;
        this.rotation = 0;
    }

    update(deltaTime, rotationSpeed) {
        this.rotation += rotationSpeed * deltaTime;
        if (this.rotation >= Math.PI * 2) {
            this.rotation -= Math.PI * 2;
        }
    }
}

// 对象池
class StarPool {
    constructor(maxSize) {
        this.pool = [];
        this.maxSize = maxSize;
    }

    get() {
        if (this.pool.length > 0) {
            return this.pool.pop();
        }
        return new Star(0, 0, 0, 0);
    }

    release(star) {
        if (this.pool.length < this.maxSize) {
            this.pool.push(star);
        }
    }
}

// 主应用类
class CosmicBackground {
    constructor() {
        this.canvas = document.getElementById('cosmic-canvas');
        this.renderer = Renderer.create(this.canvas);
        this.scene = new Scene();
        this.starPool = new StarPool(2000);
        this.stars = [];
        this.lastFpsUpdate = 0;
        this.fps = 0;
        this.frameCount = 0;
        
        this._init();
    }

    _init() {
        this._resizeCanvas();
        window.addEventListener('resize', () => this._resizeCanvas());
        
        // 初始化场景
        this._updateScene();
        
        // 启动动画循环
        this._animate();
    }

    _resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    _updateScene() {
        const sceneData = this.scene.getInterpolatedScene();
        
        // 更新背景颜色
        document.body.style.backgroundColor = sceneData.color;
        
        // 更新星星数量
        this._updateStars(sceneData.stars);
        
        // 更新其他场景属性
        this.rotationSpeed = sceneData.rotationSpeed;
    }

    _updateStars(targetCount) {
        // 添加星星
        while (this.stars.length < targetCount) {
            const star = this.starPool.get();
            star.x = Math.random() * this.canvas.width;
            star.y = Math.random() * this.canvas.height;
            star.size = 0.5 + Math.random() * 1.5;
            star.brightness = 0.5 + Math.random() * 0.5;
            this.stars.push(star);
        }
        
        // 移除多余星星
        while (this.stars.length > targetCount) {
            const star = this.stars.pop();
            this.starPool.release(star);
        }
    }

    // 将时间更新移入动画循环，确保实时性
    _updateTimeDisplay() {
        const info = Astronomy.getAstronomyInfo();
        document.querySelector('.time').textContent = info.time;
        document.querySelector('.astronomy').textContent = `${info.zodiac} · 月相: ${info.moonPhase}%`;
    }

    _animate() {
        // 1. 请求下一帧
        requestAnimationFrame(() => this._animate());
        
        // 2. 更新场景逻辑（含时间过渡）
        const deltaTime = this.scene.update();
        
        // 3. 强制更新天文信息（每帧更新，确保秒级准确）
        this._updateTimeDisplay();

        // 4. 处理场景变化（仅当场景参数变化时更新DOM）
        if (this.scene.hasChanged()) {
            this._updateScene();
        }
        
        // 5. 更新星体位置
        this.stars.forEach(star => {
            star.update(deltaTime, this.rotationSpeed);
        });
        
        // 6. 渲染
        this.renderer.clear();
        this.renderer.drawStars(this.stars);
        
        // 7. FPS计算（可选）
        this.frameCount++;
        const now = Date.now();
        if (now - this.lastFpsUpdate > 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdate = now;
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    new CosmicBackground();
});
