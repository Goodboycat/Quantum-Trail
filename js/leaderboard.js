/**
 * QUANTUM TRAIL - LEADERBOARD SYSTEM
 * Global and friend leaderboards with filtering
 */

class LeaderboardSystem {
    constructor() {
        this.currentMode = 'classic';
        this.currentFilter = 'all-time';
        this.mockData = this.generateMockData();
    }

    /**
     * Initialize leaderboard
     */
    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.currentTarget.dataset.filter;
                this.setFilter(filter);
            });
        });

        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setMode(mode);
            });
        });
    }

    /**
     * Set filter
     */
    setFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        
        this.updateDisplay();
    }

    /**
     * Set mode
     */
    setMode(mode) {
        this.currentMode = mode;
        
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.mode === mode);
        });
        
        this.updateDisplay();
    }

    /**
     * Update display
     */
    updateDisplay() {
        const data = this.getLeaderboardData();
        this.renderTopThree(data.slice(0, 3));
        this.renderList(data.slice(3, 100));
    }

    /**
     * Get leaderboard data
     */
    getLeaderboardData() {
        // Get local scores
        const localScores = Storage.get('leaderboard')[this.currentMode] || [];
        
        // Combine with mock global data
        const allScores = [...localScores, ...this.mockData[this.currentMode]];
        
        // Sort by score descending
        allScores.sort((a, b) => b.score - a.score);
        
        // Apply filter
        const filtered = this.applyFilter(allScores);
        
        // Add player info and rank
        return filtered.map((score, index) => ({
            ...score,
            rank: index + 1,
            player: score.player || this.generatePlayerName(index),
            isYou: score.isLocal || false
        }));
    }

    /**
     * Apply time filter
     */
    applyFilter(scores) {
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        
        switch (this.currentFilter) {
            case 'daily':
                return scores.filter(s => now - s.date < day);
            case 'weekly':
                return scores.filter(s => now - s.date < day * 7);
            case 'friends':
                // TODO: Implement friend system
                return scores.filter(s => s.isFriend);
            default:
                return scores;
        }
    }

    /**
     * Render top three
     */
    renderTopThree(topThree) {
        if (topThree.length === 0) return;

        // Update first place
        if (topThree[0]) {
            document.querySelector('.podium-place.first .player-name').textContent = topThree[0].player;
            document.querySelector('.podium-place.first .player-score').textContent = Utils.formatNumber(topThree[0].score);
        }

        // Update second place
        if (topThree[1]) {
            document.querySelector('.podium-place.second .player-name').textContent = topThree[1].player;
            document.querySelector('.podium-place.second .player-score').textContent = Utils.formatNumber(topThree[1].score);
        }

        // Update third place
        if (topThree[2]) {
            document.querySelector('.podium-place.third .player-name').textContent = topThree[2].player;
            document.querySelector('.podium-place.third .player-score').textContent = Utils.formatNumber(topThree[2].score);
        }
    }

    /**
     * Render leaderboard list
     */
    renderList(scores) {
        const tbody = document.getElementById('leaderboard-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        scores.forEach(score => {
            const row = document.createElement('tr');
            if (score.isYou) {
                row.style.background = 'rgba(138, 43, 226, 0.2)';
                row.style.fontWeight = '600';
            }
            
            row.innerHTML = `
                <td>#${score.rank}</td>
                <td>${score.player}${score.isYou ? ' <span style="color: var(--secondary-color);">(You)</span>' : ''}</td>
                <td style="color: var(--secondary-color); font-weight: 700;">${Utils.formatNumber(score.score)}</td>
                <td>${this.formatDate(score.date)}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    /**
     * Format date
     */
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (hours < 48) return 'Yesterday';
        return date.toLocaleDateString();
    }

    /**
     * Generate mock data
     */
    generateMockData() {
        const modes = ['classic', 'time-attack', 'hardcore', 'survival'];
        const data = {};
        
        modes.forEach(mode => {
            data[mode] = [];
            
            // Generate 50 scores for each mode
            for (let i = 0; i < 50; i++) {
                const baseScore = mode === 'time-attack' ? 50000 : mode === 'hardcore' ? 75000 : 100000;
                const variance = baseScore * 0.5;
                const score = Math.floor(baseScore - (i * (variance / 50)) + (Math.random() * 10000));
                
                data[mode].push({
                    score: Math.max(1000, score),
                    player: this.generatePlayerName(i),
                    date: Date.now() - (Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                    rank: null,
                    isLocal: false
                });
            }
        });
        
        return data;
    }

    /**
     * Generate player name
     */
    generatePlayerName(index) {
        const prefixes = ['Quantum', 'Cosmic', 'Neon', 'Cyber', 'Shadow', 'Phantom', 'Nova', 'Stellar', 'Plasma', 'Lunar'];
        const suffixes = ['Master', 'Warrior', 'Ninja', 'Legend', 'Hero', 'Pilot', 'Ace', 'Pro', 'Elite', 'Champion'];
        
        const prefix = prefixes[index % prefixes.length];
        const suffix = suffixes[Math.floor(index / prefixes.length) % suffixes.length];
        const number = Math.floor(Math.random() * 999);
        
        return `${prefix}${suffix}${number}`;
    }

    /**
     * Submit score
     */
    submitScore(mode, score) {
        // This would submit to a real backend
        const leaderboard = Storage.get('leaderboard');
        
        leaderboard[mode] = leaderboard[mode] || [];
        leaderboard[mode].push({
            score,
            date: Date.now(),
            player: Storage.getUser().username,
            isLocal: true
        });
        
        // Sort and keep top 100
        leaderboard[mode].sort((a, b) => b.score - a.score);
        leaderboard[mode] = leaderboard[mode].slice(0, 100);
        
        Storage.set('leaderboard', leaderboard);
        
        // Check if made top 10
        const rank = leaderboard[mode].findIndex(s => s.isLocal && s.score === score) + 1;
        if (rank <= 10) {
            AchievementSystem.checkProgress('leaderboard_rank', rank);
        }
    }
}

// Create global leaderboard system
window.Leaderboard = new LeaderboardSystem();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeaderboardSystem;
}
