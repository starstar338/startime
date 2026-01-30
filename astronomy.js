// 天文信息计算模块
class Astronomy {
    static getZodiacSign(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1; // 月份从0开始
        
        const signs = [
            { name: '摩羯座', start: , end:  },
            { name: '水瓶座', start: , end:  },
            { name: '双鱼座', start: , end:  },
            { name: '白羊座', start: , end:  },
            { name: '金牛座', start: , end:  },
            { name: '双子座', start: , end:  },
            { name: '巨蟹座', start: , end:  },
            { name: '狮子座', start: , end:  },
            { name: '处女座', start: , end:  },
            { name: '天秤座', start: , end:  },
            { name: '天蝎座', start: , end:  },
            { name: '射手座', start: , end:  }
        ];

        for (let sign of signs) {
            if (month === sign.start && day >= sign.start) return sign.name;
            if (month === sign.end && day <= sign.end) return sign.name;
        }
        return '未知星座';
    }

    // 修正后的月相计算算法
    static calculateMoonPhase(date) {
        // 简化的月相计算，基于农历初一为0%，十五为100%
        // 获取当前时间的时间戳（毫秒）
        const now = date.getTime();
        
        // 计算与参考点（2023-01-01，假设为农历初一附近）的时间差
        // 一个朔望月约为 29.53059 天
        const synodicMonth = 29.53059 * 24 * 60 * 60 * 1000; // 毫秒
        
        // 计算从参考点到现在的月相周期数
        // 这里使用一个近似参考点，实际应用中可能需要更复杂的历法库
        const referenceNewMoon = new Date('2023-01-22').getTime(); // 这是一个近似的新月日期
        
        const daysSinceReference = (now - referenceNewMoon) / (24 * 60 * 60 * 1000);
        const phase = (daysSinceReference % 29.53059) / 29.53059;
        
        // 返回 0-100 的百分比
        return Math.round(phase * 100);
    }

    static getAstronomyInfo() {
        const date = new Date();
        return {
            time: date.toLocaleTimeString('zh-CN', { 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            }),
            zodiac: this.getZodiacSign(date),
            moonPhase: this.calculateMoonPhase(date)
        };
    }
}

// 暴露接口供外部检查（可选）
window.AstronomyDebug = Astronomy;
