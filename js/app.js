/**
 * QUANTUM TRAIL - MAIN APPLICATION CONTROLLER
 * Manages navigation, initialization, and global state
 */

class Application {
    constructor() {
        this.currentPage = 'home';
        this.initialized = false;
    }

    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Initializing Quantum Trail Ultimate Edition...');
        
        // Show loading screen
        this.showLoading();
        
        try {
            // Initialize systems
            await this.initSystems();
            
            // Setup navigation
            this.setupNavigation();
            
            // Setup hero animation
            this.setupHeroAnimation();
            
            // Load initial page
            this.navigateTo('home');
            
            // Hide loading screen
            this.hideLoading();
            
            // Welcome message
            this.showWelcome();
            
            this.initialized = true;
            console.log('✅ Quantum Trail initialized successfully!');
            
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.hideLoading();
            Utils.notify('Failed to initialize app', 'error');
        }
    }

    /**
     * Initialize all systems
     */
    async initSystems() {
        // Initialize storage
        Storage.init();
        
        // Initialize audio
        AudioManager.init();
        
        // Initialize stats tracker (real online numbers)
        StatsTracker.init();
        
        // Initialize achievement system
        AchievementSystem.init();
        
        // Initialize shop
        Shop.init();
        
        // Initialize leaderboard
        Leaderboard.init();
        
        // Initialize profile
        Profile.init();
        
        // Initialize game engine
        window.GameEngine = new GameCore();
        
        // Update global stats
        this.updateGlobalStats();
        
        // Check daily streak
        this.checkDailyStreak();
    }

    /**
     * Setup navigation
     */
    setupNavigation() {
        // Nav link click handlers
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.dataset.page;
                this.navigateTo(page);
                AudioManager.playSound('click');
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.navigateTo(e.state.page, false);
            }
        });
    }

    /**
     * Navigate to page
     */
    navigateTo(pageName, updateHistory = true) {
        if (this.currentPage === pageName) return;
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
            
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === pageName);
            });
            
            // Update browser history
            if (updateHistory) {
                history.pushState({ page: pageName }, '', `#${pageName}`);
            }
            
            // Page-specific initialization
            this.onPageLoad(pageName);
        }
    }

    /**
     * On page load handler
     */
    onPageLoad(pageName) {
        switch (pageName) {
            case 'home':
                this.updateHomeStats();
                break;
            case 'achievements':
                AchievementSystem.updateDisplay();
                break;
            case 'shop':
                Shop.updateCurrency();
                break;
            case 'leaderboard':
                Leaderboard.updateDisplay();
                break;
            case 'profile':
                Profile.updateDisplay();
                break;
        }
    }

    /**
     * Update home page stats
     */
    updateHomeStats() {
        const stats = Storage.getStats();
        const streak = Storage.get('dailyStreak');
        
        document.getElementById('daily-streak').textContent = streak.count;
        
        // Animate numbers
        this.animateNumber('total-players', 1234567, 2000);
        this.animateNumber('games-played', 10456789, 2000);
    }

    /**
     * Animate number
     */
    animateNumber(elementId, target, duration) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const start = 0;
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (target - start) * Utils.easeOutQuad(progress));
            element.textContent = Utils.formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
    }

    /**
     * Setup hero animation
     */
    setupHeroAnimation() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        
        // Create particles
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 3 + 1
            });
        }
        
        // Animate
        const animate = () => {
            ctx.fillStyle = 'rgba(5, 10, 26, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.fillStyle = 'rgba(138, 43, 226, 0.5)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    /**
     * Show loading screen
     */
    showLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
        }
    }

    /**
     * Hide loading screen
     */
    hideLoading() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
            }, 1000);
        }
    }

    /**
     * Show welcome message
     */
    showWelcome() {
        const user = Storage.getUser();
        const stats = Storage.getStats();
        
        if (stats.totalGames === 0) {
            // First time player
            setTimeout(() => {
                Utils.notify('Welcome to Quantum Trail Ultimate Edition! 🎮', 'success', 5000);
                setTimeout(() => {
                    Utils.notify('Complete the tutorial to get started!', 'info', 5000);
                }, 2000);
            }, 1500);
        } else {
            // Returning player
            setTimeout(() => {
                Utils.notify(`Welcome back, ${user.username}! 👋`, 'success');
            }, 1500);
        }
    }

    /**
     * Show tutorial
     */
    showTutorial() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: var(--card-bg); border: 3px solid var(--primary-color); border-radius: var(--radius-lg); padding: 3rem; max-width: 600px; text-align: center;">
                <h2 style="font-size: 2rem; margin-bottom: 2rem; color: var(--secondary-color);">HOW TO PLAY</h2>
                
                <div style="text-align: left; margin-bottom: 2rem; line-height: 1.8;">
                    <p style="margin-bottom: 1rem;"><strong>🎮 Controls:</strong> Use Arrow Keys or WASD to move</p>
                    <p style="margin-bottom: 1rem;"><strong>🎯 Objective:</strong> Create loops by looking at your trail to score points</p>
                    <p style="margin-bottom: 1rem;"><strong>⏱️ Time:</strong> Reset your timer by scoring. Don't let it run out!</p>
                    <p style="margin-bottom: 1rem;"><strong>⚡ Power-ups:</strong> Collect shields, speed boosts, and more</p>
                    <p style="margin-bottom: 1rem;"><strong>💀 Obstacles:</strong> Avoid obstacles and don't hit walls or your trail</p>
                    <p style="margin-bottom: 1rem;"><strong>🔥 Combo:</strong> Keep scoring to build your combo multiplier</p>
                </div>
                
                <button class="btn btn-primary btn-large" onclick="this.closest('div').remove()">
                    <i class="fas fa-check"></i> GOT IT!
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    /**
     * Start daily challenge
     */
    startDailyChallenge() {
        Utils.notify('Daily challenges coming soon!', 'info');
        // TODO: Implement daily challenges
    }

    /**
     * Update global stats
     */
    updateGlobalStats() {
        // Update coin display
        const user = Storage.getUser();
        document.getElementById('user-coins').textContent = Utils.formatNumber(user.coins);
    }

    /**
     * Check daily streak
     */
    checkDailyStreak() {
        const streak = Storage.get('dailyStreak');
        const lastPlayed = streak.lastPlayed;
        const today = new Date().setHours(0, 0, 0, 0);
        
        if (lastPlayed) {
            const lastDate = new Date(lastPlayed).setHours(0, 0, 0, 0);
            const daysSince = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (daysSince > 1) {
                // Streak broken
                if (streak.count > 0) {
                    Utils.notify(`Your ${streak.count} day streak was broken! Start a new one today.`, 'warning');
                }
            }
        }
    }

    /**
     * Show settings
     */
    showSettings() {
        Utils.notify('Settings coming soon!', 'info');
        // TODO: Implement settings
    }

    /**
     * Export data
     */
    exportData() {
        Profile.exportData();
    }

    /**
     * Import data
     */
    importData() {
        Profile.importData();
    }
}

// Create global app instance
window.App = new Application();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    // DOM is already ready
    App.init();
}

// Handle page visibility (pause when tab hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (Game.running && !Game.paused) {
            Game.pause();
        }
    }
});

// Prevent accidental navigation
window.addEventListener('beforeunload', (e) => {
    if (Game.running && !Game.paused) {
        e.preventDefault();
        e.returnValue = 'Game in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Application;
}
