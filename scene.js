 // 场景配置
const SCENE_CONFIG = [
    { time: 0, name: '午夜深空', stars: 1200, color: '#0a0a2a', rotationSpeed: 0.001 },
    { time: 6, name: '黎明星云', stars: 800, color: '#3a1a5a', rotationSpeed: 0.0015 },
    { time: 12, name: '正午银河', stars: 1500, color: '#1a2a7a', rotationSpeed: 0.0008 },
    { time: 18, name: '黄昏星海', stars: 1000, color: '#2a0a4a', rotationSpeed: 0.0012 }
];

// 场景管理类
class Scene {
    constructor() {
        this.currentScene = 0; // 当前场景索引
        this.transitionProgress = 0;
        this.lastHour = new Date().getHours();
    }

    update() {
        const now = new Date();
        const currentHour = now.getHours();
        
        // 检测小时变化，触发场景切换
        if (currentHour !== this.lastHour) {
            this.lastHour = currentHour;
            this.currentScene = (this.currentScene + 1) % SCENE_CONFIG.length;
            this.transitionProgress = 0; // 重置过渡
        }

        // 平滑过渡（模拟一小时内逐渐变化）
        // 这里简化处理，实际可根据分钟数计算
        const minute = now.getMinutes();
        this.transitionProgress = minute / 60;

        return 16; // 模拟 deltaTime (60fps 约 16ms)
    }

    getInterpolatedScene() {
        const currentConfig = SCENE_CONFIG[this.currentScene];
        const nextConfig = SCENE_CONFIG[(this.currentScene + 1) % SCENE_CONFIG.length];

        return {
            name: currentConfig.name,
            stars: Math.floor(this._lerp(currentConfig.stars, nextConfig.stars, this.transitionProgress)),
            color: this._lerpColor(currentConfig.color, nextConfig.color, this.transitionProgress),
            rotationSpeed: this._lerp(currentConfig.rotationSpeed, nextConfig.rotationSpeed, this.transitionProgress)
        };
    }

    hasChanged() {
        // 简单标记，实际可根据 transitionProgress 变化判断
        return true;
    }

    _lerp(start, end, t) {
        return start + (end - start) * t;
    }

    _lerpColor(start, end, t) {
        // 这里简化返回，实际应解析 HEX 并插值
        return start;
    }
}
