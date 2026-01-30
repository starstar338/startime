// 天文信息计算模块
class Astronomy {
    static getZodiacSign(date) {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        
        if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return '白羊座';
        if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return '金牛座';
        if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return '双子座';
        if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return '巨蟹座';
        if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return '狮子座';
        if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return '处女座';
        if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return '天秤座';
        if ((month === 10 && day >= 24) || (month === 11 && day <= 21)) return '天蝎座';
        if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return '射手座';
        if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return '摩羯座';
        if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return '水瓶座';
        if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return '双鱼座';
        
        return '未知星座';
    }

    static calculateMoonPhase(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        
        // 简化版月相计算
        const century = Math.floor(year / 100);
        const yearInCentury = year % 100;
        const goldenNumber = (year % 19) + 1;
        const epact = (11 * goldenNumber + 18 - century + Math.floor(century / 4) + Math.floor((8 * century + 5) / 25)) % 30;
        const age = (day + epact) % 30;
        
        return Math.round((age / 29.5) * 100);
    }

    static getAstronomyInfo() {
        const date = new Date();
        return {
            time: date.toLocaleTimeString(),
            zodiac: this.getZodiacSign(date),
            moonPhase: this.calculateMoonPhase(date)
        };
    }
}
