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
        
        this._updateScene();
        this._updateTimeDisplay();
        
        setInterval(() => this._updateTimeDisplay(), 1000);
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

    _updateTimeDisplay() {
        const info = Astronomy.getAstronomyInfo();
        document.querySelector('.time').textContent = info.time;
        document.querySelector('.astronomy').textContent = `${info.zodiac} · 月相: ${info.moonPhase}%`;
    }

    _animate() {
        requestAnimationFrame(() => this._animate());
        
        const deltaTime = this.scene.update();
        this._updateScene();
        
        // 更新星星
        this.stars.forEach(star => {
            star.update(deltaTime, this.rotationSpeed);
        });
        
        // 渲染
        this.renderer.clear();
        this.renderer.drawStars(this.stars);
        
        // FPS计算
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
