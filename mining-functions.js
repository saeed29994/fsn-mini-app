// mining-functions.js
class MiningSystem {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('flysky_user') || '{}');
        this.packageConfigs = {
            'economy': {
                mining_reward: 10,
                max_ads_daily: 15,
                cooldown_hours: 12
            },
            'business': {
                mining_reward: 50,
                max_ads_daily: 100,
                cooldown_hours: 12
            },
            'first': {
                mining_reward: 100,
                max_ads_daily: 500,
                cooldown_hours: 12
            }
        };
        this.updateUserData();
    }
    
    updateUserData() {
        // Initialize or update user data
        if (!this.user.daily_stats) {
            this.user.daily_stats = {
                ads_watched: 0,
                ads_watched_date: new Date().toDateString(),
                mining_today: 0,
                mining_date: new Date().toDateString()
            };
        }
        
        // Reset if new day
        const today = new Date().toDateString();
        if (this.user.daily_stats.ads_watched_date !== today) {
            this.user.daily_stats.ads_watched = 0;
            this.user.daily_stats.ads_watched_date = today;
        }
        
        if (this.user.daily_stats.mining_date !== today) {
            this.user.daily_stats.mining_today = 0;
            this.user.daily_stats.mining_date = today;
        }
        
        localStorage.setItem('flysky_user', JSON.stringify(this.user));
        return this.user;
    }
    
    canMine() {
        if (!this.user.last_mining_time || this.user.last_mining_time === 0) {
            return { canMine: true, remaining: null };
        }
        
        const now = Date.now();
        const config = this.packageConfigs[this.user.current_package || 'economy'];
        const cooldownMs = config.cooldown_hours * 60 * 60 * 1000;
        const elapsed = now - this.user.last_mining_time;
        const remaining = cooldownMs - elapsed;
        
        if (remaining <= 0) {
            return { canMine: true, remaining: null };
        }
        
        return {
            canMine: false,
            remaining: this.formatRemainingTime(remaining)
        };
    }
    
    canWatchAd() {
        this.updateUserData();
        const config = this.packageConfigs[this.user.current_package || 'economy'];
        const adsWatched = this.user.daily_stats.ads_watched || 0;
        
        if (adsWatched >= config.max_ads_daily) {
            return {
                canWatch: false,
                message: "You have reached your daily ad limit"
            };
        }
        
        return {
            canWatch: true,
            remaining: config.max_ads_daily - adsWatched,
            watched: adsWatched,
            limit: config.max_ads_daily
        };
    }
    
    formatRemainingTime(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        
        return { 
            hours: hours, 
            minutes: minutes, 
            seconds: seconds 
        };
    }
    
    startMining() {
        const miningCheck = this.canMine();
        
        if (!miningCheck.canMine) {
            const remaining = miningCheck.remaining;
            return {
                success: false,
                message: "Wait " + remaining.hours + "h " + remaining.minutes + "m " + remaining.seconds + "s before mining again"
            };
        }
        
        const config = this.packageConfigs[this.user.current_package || 'economy'];
        const reward = config.mining_reward;
        
        // Update user balance
        this.user.fsn_balance = (this.user.fsn_balance || 0) + reward;
        this.user.last_mining_time = Date.now();
        
        // Update daily statistics
        if (this.user.daily_stats.mining_date === new Date().toDateString()) {
            this.user.daily_stats.mining_today += 1;
        } else {
            this.user.daily_stats.mining_today = 1;
            this.user.daily_stats.mining_date = new Date().toDateString();
        }
        
        localStorage.setItem('flysky_user', JSON.stringify(this.user));
        
        return {
            success: true,
            reward: reward,
            balance: this.user.fsn_balance,
            nextMining: Date.now() + (config.cooldown_hours * 60 * 60 * 1000)
        };
    }
    
    watchAd() {
        const adCheck = this.canWatchAd();
        
        if (!adCheck.canWatch) {
            return {
                success: false,
                message: adCheck.message
            };
        }
        
        // Reward is always 1 FSN per ad
        const reward = 1;
        this.user.fsn_balance = (this.user.fsn_balance || 0) + reward;
        this.user.daily_stats.ads_watched += 1;
        
        localStorage.setItem('flysky_user', JSON.stringify(this.user));
        
        return {
            success: true,
            reward: reward,
            balance: this.user.fsn_balance,
            ads_watched: this.user.daily_stats.ads_watched,
            ads_remaining: adCheck.limit - this.user.daily_stats.ads_watched
        };
    }
    
    getMiningStatus() {
        const miningCheck = this.canMine();
        
        if (miningCheck.canMine) {
            const config = this.packageConfigs[this.user.current_package || 'economy'];
            return "Ready to mine " + config.mining_reward + " FSN";
        } else {
            const remaining = miningCheck.remaining;
            return "Next mining in " + remaining.hours + "h " + remaining.minutes + "m " + remaining.seconds + "s";
        }
    }
    
    getAdStatus() {
        const adCheck = this.canWatchAd();
        return (adCheck.watched || 0) + "/" + (adCheck.limit || 15) + " ads today";
    }
}

// Global mining system instance
window.miningSystem = new MiningSystem();
