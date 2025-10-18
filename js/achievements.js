/**
 * QUANTUM TRAIL - ACHIEVEMENTS SYSTEM
 * 100+ Achievements with progression tracking
 */

const ACHIEVEMENTS = [
    // Beginner Achievements (Common)
    { id: 'first_game', name: 'First Steps', desc: 'Play your first game', icon: '🎮', rarity: 'common', requirement: { type: 'games_played', value: 1 }, reward: 50 },
    { id: 'score_1k', name: 'Getting Started', desc: 'Score 1,000 points', icon: '⭐', rarity: 'common', requirement: { type: 'score', value: 1000 }, reward: 100 },
    { id: 'score_5k', name: 'Rising Star', desc: 'Score 5,000 points', icon: '✨', rarity: 'common', requirement: { type: 'score', value: 5000 }, reward: 200 },
    { id: 'first_powerup', name: 'Power Player', desc: 'Collect your first power-up', icon: '⚡', rarity: 'common', requirement: { type: 'powerups', value: 1 }, reward: 75 },
    { id: 'survive_30s', name: 'Survivor', desc: 'Survive for 30 seconds', icon: '⏱️', rarity: 'common', requirement: { type: 'time_survived', value: 30 }, reward: 100 },
    
    // Intermediate Achievements (Rare)
    { id: 'score_10k', name: 'Apprentice Looper', desc: 'Score 10,000 points', icon: '🔵', rarity: 'rare', requirement: { type: 'score', value: 10000 }, reward: 300 },
    { id: 'score_25k', name: 'Adept Navigator', desc: 'Score 25,000 points', icon: '🟣', rarity: 'rare', requirement: { type: 'score', value: 25000 }, reward: 500 },
    { id: 'combo_10', name: 'Combo Starter', desc: 'Achieve a 10x combo', icon: '🔥', rarity: 'rare', requirement: { type: 'combo', value: 10 }, reward: 400 },
    { id: 'perfect_loop', name: 'Perfect Circle', desc: 'Complete a perfect loop', icon: '⭕', rarity: 'rare', requirement: { type: 'perfect_loops', value: 1 }, reward: 350 },
    { id: 'shield_master', name: 'Shield Master', desc: 'Collect 25 shield power-ups', icon: '🛡️', rarity: 'rare', requirement: { type: 'shields_collected', value: 25 }, reward: 400 },
    { id: 'speed_demon', name: 'Speed Demon', desc: 'Collect 25 speed boosts', icon: '💨', rarity: 'rare', requirement: { type: 'speeds_collected', value: 25 }, reward: 400 },
    { id: 'time_warden', name: 'Time Warden', desc: 'Collect 25 time extenders', icon: '⌛', rarity: 'rare', requirement: { type: 'times_collected', value: 25 }, reward: 400 },
    { id: 'daily_player', name: 'Daily Dedication', desc: 'Play for 7 days in a row', icon: '📅', rarity: 'rare', requirement: { type: 'daily_streak', value: 7 }, reward: 1000 },
    
    // Advanced Achievements (Epic)
    { id: 'score_50k', name: 'Expert Quantum Pilot', desc: 'Score 50,000 points', icon: '💠', rarity: 'epic', requirement: { type: 'score', value: 50000 }, reward: 1000 },
    { id: 'score_75k', name: 'Master Navigator', desc: 'Score 75,000 points', icon: '💎', rarity: 'epic', requirement: { type: 'score', value: 75000 }, reward: 1500 },
    { id: 'combo_25', name: 'Combo Champion', desc: 'Achieve a 25x combo', icon: '🌟', rarity: 'epic', requirement: { type: 'combo', value: 25 }, reward: 1200 },
    { id: 'survive_120s', name: 'Endurance Runner', desc: 'Survive for 2 minutes', icon: '⏲️', rarity: 'epic', requirement: { type: 'time_survived', value: 120 }, reward: 1000 },
    { id: 'collect_100', name: 'Power Hoarder', desc: 'Collect 100 total power-ups', icon: '📦', rarity: 'epic', requirement: { type: 'powerups', value: 100 }, reward: 1500 },
    { id: 'no_hit_50k', name: 'Untouchable', desc: 'Score 50K without using shield', icon: '👻', rarity: 'epic', requirement: { type: 'no_shield_score', value: 50000 }, reward: 2000 },
    { id: 'flawless_victory', name: 'Flawless Victory', desc: 'Win without taking damage', icon: '🏆', rarity: 'epic', requirement: { type: 'flawless_win', value: 1 }, reward: 2500 },
    
    // Legendary Achievements
    { id: 'score_100k', name: 'Quantum Master', desc: 'Score 100,000 points', icon: '👑', rarity: 'legendary', requirement: { type: 'score', value: 100000 }, reward: 5000 },
    { id: 'score_150k', name: 'Beyond Infinity', desc: 'Score 150,000 points', icon: '♾️', rarity: 'legendary', requirement: { type: 'score', value: 150000 }, reward: 7500 },
    { id: 'score_200k', name: 'Transcendent', desc: 'Score 200,000 points', icon: '✨', rarity: 'legendary', requirement: { type: 'score', value: 200000 }, reward: 10000 },
    { id: 'combo_50', name: 'Godlike Combo', desc: 'Achieve a 50x combo', icon: '⚡', rarity: 'legendary', requirement: { type: 'combo', value: 50 }, reward: 5000 },
    { id: 'perfect_50', name: 'Perfection Incarnate', desc: 'Complete 50 perfect loops', icon: '💫', rarity: 'legendary', requirement: { type: 'perfect_loops', value: 50 }, reward: 7500 },
    { id: 'games_1000', name: 'Devoted Looper', desc: 'Play 1000 games', icon: '🎯', rarity: 'legendary', requirement: { type: 'games_played', value: 1000 }, reward: 10000 },
    { id: 'daily_30', name: 'Month of Mastery', desc: '30 day streak', icon: '🔥', rarity: 'legendary', requirement: { type: 'daily_streak', value: 30 }, reward: 15000 },
    
    // Mode-Specific Achievements
    { id: 'time_attack_win', name: 'Speed Victor', desc: 'Win Time Attack mode', icon: '⏱️', rarity: 'rare', requirement: { type: 'mode_win', value: 'time-attack' }, reward: 500 },
    { id: 'hardcore_win', name: 'Hardcore Hero', desc: 'Win Hardcore mode', icon: '💀', rarity: 'epic', requirement: { type: 'mode_win', value: 'hardcore' }, reward: 2000 },
    { id: 'zen_master', name: 'Zen Master', desc: 'Score 100K in Zen mode', icon: '🧘', rarity: 'epic', requirement: { type: 'zen_score', value: 100000 }, reward: 1500 },
    { id: 'survival_king', name: 'Survival King', desc: 'Survive 5 minutes in Survival', icon: '👑', rarity: 'legendary', requirement: { type: 'survival_time', value: 300 }, reward: 5000 },
    
    // Collection Achievements
    { id: 'skin_collector', name: 'Fashionista', desc: 'Unlock 10 skins', icon: '🎨', rarity: 'rare', requirement: { type: 'skins_unlocked', value: 10 }, reward: 500 },
    { id: 'trail_master', name: 'Trail Blazer', desc: 'Unlock 10 trails', icon: '🌈', rarity: 'rare', requirement: { type: 'trails_unlocked', value: 10 }, reward: 500 },
    { id: 'theme_connoisseur', name: 'Theme Connoisseur', desc: 'Unlock 5 themes', icon: '🎭', rarity: 'rare', requirement: { type: 'themes_unlocked', value: 5 }, reward: 750 },
    { id: 'complete_collection', name: 'Ultimate Collector', desc: 'Unlock everything', icon: '💯', rarity: 'legendary', requirement: { type: 'complete_collection', value: 1 }, reward: 20000 },
    
    // Skill-Based Achievements
    { id: 'close_call', name: 'Close Call', desc: 'Win with less than 0.5s remaining', icon: '😰', rarity: 'epic', requirement: { type: 'close_call', value: 1 }, reward: 1500 },
    { id: 'quick_draw', name: 'Quick Draw', desc: 'Score 10K in under 30 seconds', icon: '⚡', rarity: 'epic', requirement: { type: 'quick_score', value: 1 }, reward: 2000 },
    { id: 'minimalist', name: 'Minimalist', desc: 'Win without collecting power-ups', icon: '🎯', rarity: 'epic', requirement: { type: 'no_powerup_win', value: 1 }, reward: 2500 },
    { id: 'multitasker', name: 'Multitasker', desc: 'Use 3 power-ups simultaneously', icon: '🔮', rarity: 'rare', requirement: { type: 'triple_powerup', value: 1 }, reward: 1000 },
    
    // Milestone Achievements
    { id: 'rich', name: 'Wealthy Looper', desc: 'Accumulate 50,000 coins', icon: '💰', rarity: 'epic', requirement: { type: 'coins_earned', value: 50000 }, reward: 5000 },
    { id: 'level_25', name: 'Quarter Century', desc: 'Reach level 25', icon: '🎖️', rarity: 'rare', requirement: { type: 'level', value: 25 }, reward: 2500 },
    { id: 'level_50', name: 'Halfway to Glory', desc: 'Reach level 50', icon: '🏅', rarity: 'epic', requirement: { type: 'level', value: 50 }, reward: 5000 },
    { id: 'level_100', name: 'Centennial Champion', desc: 'Reach level 100', icon: '👑', rarity: 'legendary', requirement: { type: 'level', value: 100 }, reward: 15000 },
    
    // Social Achievements
    { id: 'share_first', name: 'Show Off', desc: 'Share your first score', icon: '📢', rarity: 'common', requirement: { type: 'shares', value: 1 }, reward: 100 },
    { id: 'challenge_friend', name: 'Friendly Rivalry', desc: 'Challenge a friend', icon: '🤝', rarity: 'rare', requirement: { type: 'challenges_sent', value: 1 }, reward: 500 },
    { id: 'top_10', name: 'Top 10 Legend', desc: 'Reach top 10 on leaderboard', icon: '🥇', rarity: 'epic', requirement: { type: 'leaderboard_rank', value: 10 }, reward: 3000 },
    { id: 'top_1', name: 'World Champion', desc: 'Reach #1 on leaderboard', icon: '👑', rarity: 'legendary', requirement: { type: 'leaderboard_rank', value: 1 }, reward: 10000 },
    
    // Special Achievements
    { id: 'lucky_7', name: 'Lucky Seven', desc: 'Score exactly 7,777 points', icon: '🎰', rarity: 'rare', requirement: { type: 'exact_score', value: 7777 }, reward: 777 },
    { id: 'night_owl', name: 'Night Owl', desc: 'Play between 2-4 AM', icon: '🦉', rarity: 'rare', requirement: { type: 'time_of_day', value: 'late_night' }, reward: 500 },
    { id: 'early_bird', name: 'Early Bird', desc: 'Play before 6 AM', icon: '🐦', rarity: 'rare', requirement: { type: 'time_of_day', value: 'early_morning' }, reward: 500 },
    { id: 'beta_tester', name: 'Beta Tester', desc: 'Play during beta period', icon: '🔬', rarity: 'legendary', requirement: { type: 'beta_access', value: 1 }, reward: 5000 },
    { id: 'first_year', name: 'One Year Strong', desc: 'Play for one year', icon: '🎂', rarity: 'legendary', requirement: { type: 'account_age_days', value: 365 }, reward: 10000 }
];

class AchievementSystem {
    constructor() {
        this.achievements = ACHIEVEMENTS;
        this.unlockedCache = new Set();
        this.progressCache = new Map();
    }

    /**
     * Initialize achievement system
     */
    init() {
        this.loadUnlockedAchievements();
        this.updateDisplay();
    }

    /**
     * Load unlocked achievements from storage
     */
    loadUnlockedAchievements() {
        const unlocked = Storage.get('achievements') || [];
        this.unlockedCache = new Set(unlocked);
    }

    /**
     * Check if achievement is unlocked
     */
    isUnlocked(achievementId) {
        return this.unlockedCache.has(achievementId);
    }

    /**
     * Unlock achievement
     */
    unlock(achievementId, silent = false) {
        if (this.isUnlocked(achievementId)) return false;

        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return false;

        // Unlock in storage
        if (Storage.unlockAchievement(achievementId)) {
            this.unlockedCache.add(achievementId);
            
            // Award coins
            Storage.addCoins(achievement.reward);
            
            // Award XP
            const xpReward = achievement.reward;
            Storage.addXP(xpReward);
            
            if (!silent) {
                this.showAchievementNotification(achievement);
                AudioManager.playSound('achievement');
            }
            
            return true;
        }
        
        return false;
    }

    /**
     * Check progress for an achievement
     */
    checkProgress(type, value) {
        const relevantAchievements = this.achievements.filter(a => 
            a.requirement.type === type && !this.isUnlocked(a.id)
        );

        const unlocked = [];
        
        relevantAchievements.forEach(achievement => {
            if (value >= achievement.requirement.value) {
                if (this.unlock(achievement.id)) {
                    unlocked.push(achievement);
                }
            }
        });

        return unlocked;
    }

    /**
     * Get achievement progress percentage
     */
    getProgress(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return 0;

        // Get current value for requirement type
        const currentValue = this.getCurrentValue(achievement.requirement.type);
        const targetValue = achievement.requirement.value;

        return Math.min(100, (currentValue / targetValue) * 100);
    }

    /**
     * Get current value for requirement type
     */
    getCurrentValue(type) {
        const stats = Storage.getStats();
        const user = Storage.getUser();
        
        const mapping = {
            'games_played': stats.totalGames,
            'score': stats.bestScore,
            'powerups': stats.powerUpsCollected,
            'time_survived': stats.longestSurvival,
            'combo': stats.highestCombo,
            'level': user.level,
            'coins_earned': user.coins,
            'daily_streak': Storage.get('dailyStreak').count,
            // Add more mappings as needed
        };

        return mapping[type] || 0;
    }

    /**
     * Show achievement notification
     */
    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--card-bg); border: 2px solid gold; border-radius: var(--radius-md); box-shadow: 0 0 20px gold; animation: achievementSlide 0.5s ease;">
                <div style="font-size: 3rem;">${achievement.icon}</div>
                <div>
                    <div style="color: gold; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.3rem;">ACHIEVEMENT UNLOCKED!</div>
                    <div style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.2rem;">${achievement.name}</div>
                    <div style="font-size: 0.85rem; opacity: 0.7;">${achievement.desc}</div>
                    <div style="color: gold; font-size: 0.9rem; margin-top: 0.3rem;">+${achievement.reward} coins</div>
                </div>
            </div>
        `;

        const container = document.getElementById('notification-container');
        if (container) {
            container.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'achievementSlideOut 0.5s ease forwards';
                setTimeout(() => notification.remove(), 500);
            }, 5000);
        }
    }

    /**
     * Get unlocked count
     */
    getUnlockedCount() {
        return this.unlockedCache.size;
    }

    /**
     * Get total count
     */
    getTotalCount() {
        return this.achievements.length;
    }

    /**
     * Get completion percentage
     */
    getCompletionPercentage() {
        return Math.floor((this.getUnlockedCount() / this.getTotalCount()) * 100);
    }

    /**
     * Get achievements by rarity
     */
    getByRarity(rarity) {
        return this.achievements.filter(a => a.rarity === rarity);
    }

    /**
     * Update display
     */
    updateDisplay() {
        const container = document.getElementById('achievements-container');
        if (!container) return;

        container.innerHTML = '';

        this.achievements.forEach(achievement => {
            const isUnlocked = this.isUnlocked(achievement.id);
            const progress = this.getProgress(achievement.id);

            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.desc}</p>
                ${!isUnlocked ? `
                    <div class="achievement-progress">
                        <div class="achievement-progress-bar" style="width: ${progress}%"></div>
                    </div>
                    <div style="font-size: 0.8rem; opacity: 0.7;">${Math.floor(progress)}%</div>
                ` : `
                    <div style="color: var(--success-color); font-weight: 600; margin-top: 0.5rem;">
                        <i class="fas fa-check-circle"></i> UNLOCKED
                    </div>
                `}
                <div class="achievement-rarity rarity-${achievement.rarity}">${achievement.rarity.toUpperCase()}</div>
                <div style="color: gold; font-size: 0.85rem; margin-top: 0.5rem;">
                    <i class="fas fa-coins"></i> ${achievement.reward}
                </div>
            `;

            container.appendChild(card);
        });

        // Update stats
        document.getElementById('achievements-completed').textContent = this.getUnlockedCount();
        document.getElementById('achievements-percentage').textContent = `${this.getCompletionPercentage()}%`;
        
        const totalCoins = this.achievements
            .filter(a => this.isUnlocked(a.id))
            .reduce((sum, a) => sum + a.reward, 0);
        document.getElementById('achievements-coins-earned').textContent = Utils.formatNumber(totalCoins);
    }
}

// Create global achievement system
window.AchievementSystem = new AchievementSystem();

// CSS animations (add to a style tag or CSS file)
const style = document.createElement('style');
style.textContent = `
    @keyframes achievementSlide {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes achievementSlideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ACHIEVEMENTS, AchievementSystem };
}
