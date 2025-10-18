/**
 * QUANTUM TRAIL - STORAGE SYSTEM
 * Handles all data persistence (LocalStorage + Cloud ready)
 */

class StorageSystem {
    constructor() {
        this.prefix = 'qt_';
        this.cloudEnabled = false;
        this.syncInterval = null;
    }

    /**
     * Initialize storage system
     */
    init() {
        this.migrateOldData();
        this.setupDefaultData();
        this.startAutoSave();
    }

    /**
     * Setup default data if not exists
     */
    setupDefaultData() {
        const defaults = {
            user: {
                id: Utils.generateId(),
                username: 'Player',
                avatar: 'default',
                title: 'Novice Explorer',
                level: 1,
                xp: 0,
                coins: 0,
                gems: 0,
                createdAt: Date.now()
            },
            stats: {
                totalGames: 0,
                totalScore: 0,
                bestScore: 0,
                totalPlaytime: 0,
                gamesWon: 0,
                perfectRuns: 0,
                highestCombo: 0,
                longestSurvival: 0,
                powerUpsCollected: 0,
                achievementsUnlocked: 0
            },
            achievements: [],
            unlocks: {
                skins: ['default'],
                trails: ['default'],
                themes: ['default'],
                effects: []
            },
            settings: {
                musicVolume: 0.5,
                sfxVolume: 0.7,
                showFPS: false,
                particles: true,
                screenShake: true,
                difficulty: 'normal'
            },
            dailyStreak: {
                count: 0,
                lastPlayed: null
            },
            gameHistory: [],
            leaderboard: {
                classic: [],
                timeAttack: [],
                hardcore: [],
                survival: []
            }
        };

        // Initialize defaults if not exist
        Object.keys(defaults).forEach(key => {
            if (!this.get(key)) {
                this.set(key, defaults[key]);
            }
        });
    }

    /**
     * Get data from storage
     */
    get(key) {
        try {
            const data = localStorage.getItem(this.prefix + key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage get error:', e);
            return null;
        }
    }

    /**
     * Set data to storage
     */
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }

    /**
     * Remove data from storage
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }

    /**
     * Clear all data
     */
    clearAll() {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }

    /**
     * Get user data
     */
    getUser() {
        return this.get('user');
    }

    /**
     * Update user data
     */
    updateUser(data) {
        const user = this.getUser();
        this.set('user', { ...user, ...data });
    }

    /**
     * Get stats
     */
    getStats() {
        return this.get('stats');
    }

    /**
     * Update stats
     */
    updateStats(data) {
        const stats = this.getStats();
        this.set('stats', { ...stats, ...data });
    }

    /**
     * Add coins
     */
    addCoins(amount) {
        const user = this.getUser();
        user.coins += amount;
        this.set('user', user);
        return user.coins;
    }

    /**
     * Spend coins
     */
    spendCoins(amount) {
        const user = this.getUser();
        if (user.coins >= amount) {
            user.coins -= amount;
            this.set('user', user);
            return true;
        }
        return false;
    }

    /**
     * Add XP and handle leveling
     */
    addXP(amount) {
        const user = this.getUser();
        user.xp += amount;
        
        // Check for level up
        const xpNeeded = this.getXPForLevel(user.level + 1);
        if (user.xp >= xpNeeded) {
            user.level++;
            user.xp = user.xp - xpNeeded;
            
            // Award level up rewards
            const coins = user.level * 100;
            user.coins += coins;
            
            this.set('user', user);
            return { leveledUp: true, newLevel: user.level, coinsEarned: coins };
        }
        
        this.set('user', user);
        return { leveledUp: false };
    }

    /**
     * Get XP needed for level
     */
    getXPForLevel(level) {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }

    /**
     * Save game result
     */
    saveGameResult(result) {
        const { mode, score, time, powerUpsCollected, combo, rank } = result;
        
        // Update stats
        const stats = this.getStats();
        stats.totalGames++;
        stats.totalScore += score;
        stats.bestScore = Math.max(stats.bestScore, score);
        stats.highestCombo = Math.max(stats.highestCombo, combo);
        stats.powerUpsCollected += powerUpsCollected;
        
        if (score >= 100000) {
            stats.gamesWon++;
        }
        
        this.set('stats', stats);
        
        // Add to game history
        const history = this.get('gameHistory') || [];
        history.unshift({
            id: Utils.generateId(),
            mode,
            score,
            time,
            powerUpsCollected,
            combo,
            rank,
            date: Date.now()
        });
        
        // Keep only last 50 games
        if (history.length > 50) {
            history.pop();
        }
        
        this.set('gameHistory', history);
        
        // Update leaderboard
        this.updateLeaderboard(mode, score, rank);
        
        // Award coins and XP
        const coins = Math.floor(score / 100);
        const xp = Math.floor(score / 50);
        
        this.addCoins(coins);
        const levelResult = this.addXP(xp);
        
        // Update daily streak
        this.updateDailyStreak();
        
        return {
            coinsEarned: coins,
            xpEarned: xp,
            ...levelResult
        };
    }

    /**
     * Update leaderboard
     */
    updateLeaderboard(mode, score, rank) {
        const leaderboard = this.get('leaderboard');
        const modeLeaderboard = leaderboard[mode] || [];
        
        // Add new score
        modeLeaderboard.push({
            score,
            rank,
            date: Date.now()
        });
        
        // Sort by score descending
        modeLeaderboard.sort((a, b) => b.score - a.score);
        
        // Keep only top 100
        leaderboard[mode] = modeLeaderboard.slice(0, 100);
        
        this.set('leaderboard', leaderboard);
    }

    /**
     * Update daily streak
     */
    updateDailyStreak() {
        const streak = this.get('dailyStreak');
        const today = new Date().setHours(0, 0, 0, 0);
        const lastPlayed = streak.lastPlayed ? new Date(streak.lastPlayed).setHours(0, 0, 0, 0) : null;
        
        if (!lastPlayed) {
            // First time playing
            streak.count = 1;
            streak.lastPlayed = Date.now();
        } else if (lastPlayed === today) {
            // Already played today, no change
            return;
        } else if (lastPlayed === today - 86400000) {
            // Played yesterday, increment streak
            streak.count++;
            streak.lastPlayed = Date.now();
        } else {
            // Streak broken, reset
            streak.count = 1;
            streak.lastPlayed = Date.now();
        }
        
        this.set('dailyStreak', streak);
        
        // Award streak bonus
        if (streak.count > 1) {
            const bonus = streak.count * 50;
            this.addCoins(bonus);
            Utils.notify(`Daily Streak Bonus: ${bonus} coins! (${streak.count} days)`, 'success');
        }
    }

    /**
     * Unlock achievement
     */
    unlockAchievement(achievementId) {
        const achievements = this.get('achievements') || [];
        
        if (!achievements.includes(achievementId)) {
            achievements.push(achievementId);
            this.set('achievements', achievements);
            
            // Update stats
            const stats = this.getStats();
            stats.achievementsUnlocked++;
            this.set('stats', stats);
            
            return true;
        }
        
        return false;
    }

    /**
     * Check if achievement is unlocked
     */
    hasAchievement(achievementId) {
        const achievements = this.get('achievements') || [];
        return achievements.includes(achievementId);
    }

    /**
     * Unlock item (skin, trail, theme, effect)
     */
    unlockItem(category, itemId) {
        const unlocks = this.get('unlocks');
        
        if (!unlocks[category]) {
            unlocks[category] = [];
        }
        
        if (!unlocks[category].includes(itemId)) {
            unlocks[category].push(itemId);
            this.set('unlocks', unlocks);
            return true;
        }
        
        return false;
    }

    /**
     * Check if item is unlocked
     */
    hasItem(category, itemId) {
        const unlocks = this.get('unlocks');
        return unlocks[category] && unlocks[category].includes(itemId);
    }

    /**
     * Get current equipped items
     */
    getEquipped() {
        return this.get('equipped') || {
            skin: 'default',
            trail: 'default',
            theme: 'default',
            effects: []
        };
    }

    /**
     * Equip item
     */
    equipItem(category, itemId) {
        const equipped = this.getEquipped();
        
        if (category === 'effects') {
            if (!equipped.effects.includes(itemId)) {
                equipped.effects.push(itemId);
            }
        } else {
            equipped[category] = itemId;
        }
        
        this.set('equipped', equipped);
    }

    /**
     * Get game history
     */
    getGameHistory(limit = 10) {
        const history = this.get('gameHistory') || [];
        return history.slice(0, limit);
    }

    /**
     * Export all data
     */
    exportData() {
        const data = {};
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith(this.prefix)) {
                const cleanKey = key.replace(this.prefix, '');
                data[cleanKey] = this.get(cleanKey);
            }
        });
        return data;
    }

    /**
     * Import data
     */
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    /**
     * Migrate old data (if needed)
     */
    migrateOldData() {
        // Check for old version data and migrate
        // This is for future compatibility
    }

    /**
     * Start auto-save
     */
    startAutoSave() {
        // Save every 30 seconds
        this.syncInterval = setInterval(() => {
            // In future: sync with cloud
            console.log('Auto-save triggered');
        }, 30000);
    }

    /**
     * Stop auto-save
     */
    stopAutoSave() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }
    }
}

// Create global storage instance
window.Storage = new StorageSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StorageSystem;
}
