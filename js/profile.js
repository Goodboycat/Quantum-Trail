/**
 * QUANTUM TRAIL - PROFILE SYSTEM
 * User profile, stats, and history
 */

class ProfileSystem {
    constructor() {
        this.user = null;
        this.stats = null;
    }

    /**
     * Initialize profile
     */
    init() {
        this.loadData();
        this.updateDisplay();
    }

    /**
     * Load user data
     */
    loadData() {
        this.user = Storage.getUser();
        this.stats = Storage.getStats();
    }

    /**
     * Update display
     */
    updateDisplay() {
        if (!this.user || !this.stats) return;

        // Update profile header
        document.getElementById('profile-username').textContent = this.user.username;
        document.getElementById('profile-title').textContent = this.user.title;
        document.getElementById('profile-level').textContent = this.user.level;
        
        // Update level progress
        const currentXP = this.user.xp;
        const nextLevelXP = Storage.getXPForLevel(this.user.level + 1);
        const progress = (currentXP / nextLevelXP) * 100;
        
        document.getElementById('profile-level-bar').style.width = `${progress}%`;
        document.getElementById('profile-xp').textContent = `${currentXP} / ${nextLevelXP} XP`;

        // Update stats
        document.getElementById('total-games').textContent = Utils.formatNumber(this.stats.totalGames);
        document.getElementById('total-wins').textContent = Utils.formatNumber(this.stats.gamesWon);
        document.getElementById('total-playtime').textContent = Utils.formatPlaytime(this.stats.totalPlaytime);
        document.getElementById('best-score').textContent = Utils.formatNumber(this.stats.bestScore);

        // Update recent games
        this.renderRecentGames();
        
        // Update stats chart
        this.renderStatsChart();
    }

    /**
     * Render recent games
     */
    renderRecentGames() {
        const container = document.getElementById('recent-games');
        if (!container) return;

        const history = Storage.getGameHistory(10);
        
        if (history.length === 0) {
            container.innerHTML = '<p style="opacity: 0.7; text-align: center; padding: 2rem;">No games played yet</p>';
            return;
        }

        container.innerHTML = '';

        history.forEach(game => {
            const item = document.createElement('div');
            item.className = 'recent-game-item';
            
            const modeIcons = {
                'classic': '♾️',
                'time-attack': '⏱️',
                'zen': '🧘',
                'hardcore': '💀',
                'survival': '❤️',
                'puzzle': '🧩'
            };
            
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="font-size: 2rem;">${modeIcons[game.mode] || '🎮'}</div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 0.3rem;">${this.getModeName(game.mode)}</div>
                        <div style="font-size: 0.85rem; opacity: 0.7;">${this.formatDate(game.date)}</div>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 1.3rem; font-weight: 700; color: var(--secondary-color);">${Utils.formatNumber(game.score)}</div>
                    <div style="font-size: 0.85rem; opacity: 0.7;">${game.rank}</div>
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    /**
     * Render stats chart
     */
    renderStatsChart() {
        const canvas = document.getElementById('stats-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get game history
        const history = Storage.getGameHistory(20).reverse();
        
        if (history.length === 0) return;

        // Draw chart
        const padding = 40;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;

        // Find max score for scaling
        const maxScore = Math.max(...history.map(g => g.score));
        const minScore = 0;

        // Draw grid lines
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw line graph
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 2;
        ctx.beginPath();

        history.forEach((game, index) => {
            const x = padding + (chartWidth / (history.length - 1)) * index;
            const scoreRatio = (game.score - minScore) / (maxScore - minScore);
            const y = padding + chartHeight - (scoreRatio * chartHeight);

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#00ffff';
        history.forEach((game, index) => {
            const x = padding + (chartWidth / (history.length - 1)) * index;
            const scoreRatio = (game.score - minScore) / (maxScore - minScore);
            const y = padding + chartHeight - (scoreRatio * chartHeight);

            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        // Draw labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px Rajdhani';
        ctx.textAlign = 'right';
        
        for (let i = 0; i <= 5; i++) {
            const value = maxScore - (maxScore / 5) * i;
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(Utils.formatNumber(Math.floor(value)), padding - 10, y + 4);
        }
    }

    /**
     * Get mode name
     */
    getModeName(mode) {
        const names = {
            'classic': 'Classic Mode',
            'time-attack': 'Time Attack',
            'zen': 'Zen Mode',
            'hardcore': 'Hardcore',
            'survival': 'Survival',
            'puzzle': 'Puzzle Mode'
        };
        return names[mode] || mode;
    }

    /**
     * Format date
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    /**
     * Edit profile
     */
    editProfile() {
        const username = prompt('Enter new username:', this.user.username);
        
        if (username && username.trim() !== '') {
            Storage.updateUser({ username: username.trim() });
            this.loadData();
            this.updateDisplay();
            Utils.notify('Profile updated!', 'success');
        }
    }

    /**
     * Export profile data
     */
    exportData() {
        const data = Storage.exportData();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `quantum-trail-profile-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        Utils.notify('Profile data exported!', 'success');
    }

    /**
     * Import profile data
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (confirm('This will overwrite your current data. Continue?')) {
                        if (Storage.importData(data)) {
                            this.loadData();
                            this.updateDisplay();
                            Utils.notify('Profile data imported!', 'success');
                            
                            // Refresh all systems
                            App.init();
                        } else {
                            Utils.notify('Import failed!', 'error');
                        }
                    }
                } catch (err) {
                    Utils.notify('Invalid file format!', 'error');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    }

    /**
     * Reset profile
     */
    resetProfile() {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone!')) {
            if (confirm('Last chance! Really delete everything?')) {
                Storage.clearAll();
                Storage.setupDefaultData();
                
                this.loadData();
                this.updateDisplay();
                
                Utils.notify('Profile reset complete', 'success');
                
                // Refresh all systems
                App.init();
            }
        }
    }
}

// Create global profile system
window.Profile = new ProfileSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfileSystem;
}
