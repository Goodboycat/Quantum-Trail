/**
 * QUANTUM TRAIL - CORE GAME ENGINE
 * Main game loop and state management
 */

class GameCore {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.running = false;
        this.paused = false;
        this.mode = 'classic';
        this.config = CONFIG;
        
        // Game components
        this.player = null;
        this.particles = null;
        this.obstacles = [];
        this.powerUps = [];
        
        // Game state
        this.time = 8.0;
        this.startTime = 0;
        this.lastFrameTime = 0;
        
        // Input
        this.keys = new Set();
        
        // Timers
        this.obstacleTimer = null;
        this.powerUpTimer = null;
    }

    /**
     * Initialize game
     */
    init(canvas, mode = 'classic') {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mode = mode;
        
        // Create components
        this.player = new PlayerController(this.config);
        this.particles = new ParticleSystem(this.config);
        
        // Setup input
        this.setupInput();
        
        // Reset state
        this.reset();
    }

    /**
     * Setup input handlers
     */
    setupInput() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
                e.preventDefault();
                this.keys.add(e.key.toLowerCase());
            }
            if (e.key === 'Escape' && this.running) {
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (e) => {
            this.keys.delete(e.key.toLowerCase());
        });
    }

    /**
     * Reset game state
     */
    reset() {
        this.player.reset(this.config);
        this.particles.clear();
        this.obstacles = [];
        this.powerUps = [];
        this.time = this.mode === 'time-attack' ? 120 : 8.0;
        this.startTime = Date.now();
        this.lastFrameTime = Date.now();
    }

    /**
     * Start game
     */
    start() {
        this.running = true;
        this.paused = false;
        this.startTimers();
        this.gameLoop();
    }

    /**
     * Game loop
     */
    gameLoop() {
        if (!this.running) return;

        const now = Date.now();
        const deltaTime = Math.min(now - this.lastFrameTime, this.config.performance.maxDeltaTime);
        this.lastFrameTime = now;

        if (!this.paused) {
            this.update(deltaTime);
            this.render();
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game state
     */
    update(deltaTime) {
        // Update player
        this.player.update(this.keys);
        this.player.updatePowerUps();

        // Check if scoring
        if (this.player.isLookingAtTrail()) {
            this.player.addScore(this.config.gameplay.scoringRate);
            this.time = Math.min(
                this.mode === 'time-attack' ? 120 : 8,
                this.time + 0.1
            );
            
            // Create trail particles occasionally
            if (Math.random() < 0.3) {
                this.particles.createTrailParticles(this.player.x, this.player.y);
            }
        }

        // Update particles
        this.particles.update();

        // Update obstacles
        this.updateObstacles();

        // Update power-ups
        this.updatePowerUps();

        // Update timer
        if (this.mode !== 'zen') {
            this.time -= deltaTime / 1000;
            if (this.time <= 0) {
                this.gameOver();
            }
        }

        // Check collisions
        this.checkCollisions();

        // Update HUD
        this.updateHUD();
    }

    /**
     * Update obstacles
     */
    updateObstacles() {
        const centerX = this.config.canvas.width / 2;
        const centerY = this.config.canvas.height / 2;

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            
            const angle = Math.atan2(centerY - obs.y, centerX - obs.x);
            obs.x += Math.cos(angle) * obs.speed;
            obs.y += Math.sin(angle) * obs.speed;

            // Remove if off screen
            if (obs.x < -50 || obs.x > this.config.canvas.width + 50 ||
                obs.y < -50 || obs.y > this.config.canvas.height + 50) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    /**
     * Update power-ups
     */
    updatePowerUps() {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const pu = this.powerUps[i];
            
            if (Utils.distance(this.player.x, this.player.y, pu.x, pu.y) < 25) {
                this.collectPowerUp(pu);
                this.powerUps.splice(i, 1);
            }
        }
    }

    /**
     * Collect power-up
     */
    collectPowerUp(powerUp) {
        AudioManager.playSound('collect');
        
        const durations = {
            'shield': this.config.powerUps.shieldDuration,
            'speed': this.config.powerUps.speedDuration,
            'magnet': this.config.powerUps.magnetDuration
        };

        if (powerUp.type === 'time') {
            this.time = Math.min(
                this.mode === 'time-attack' ? 120 : 8,
                this.time + this.config.powerUps.timeBonus
            );
        } else {
            this.player.activatePowerUp(powerUp.type, durations[powerUp.type]);
        }

        this.particles.createCollectEffect(powerUp.x, powerUp.y, powerUp.color);
    }

    /**
     * Check collisions
     */
    checkCollisions() {
        // Wall collision
        if (this.player.checkWallCollision(this.config.canvas.width, this.config.canvas.height)) {
            this.gameOver();
            return;
        }

        // Self collision
        if (this.player.checkSelfCollision()) {
            this.gameOver();
            return;
        }

        // Obstacle collision
        if (!this.player.isInvincible) {
            for (const obs of this.obstacles) {
                if (Utils.distance(this.player.x, this.player.y, obs.x, obs.y) < 
                    this.player.radius + obs.radius) {
                    this.gameOver();
                    return;
                }
            }
        }
    }

    /**
     * Update HUD
     */
    updateHUD() {
        const state = this.player.getState();
        
        const scoreEl = document.getElementById('hud-score');
        const timeEl = document.getElementById('hud-time');
        const comboEl = document.getElementById('hud-combo');

        if (scoreEl) scoreEl.textContent = Utils.formatNumber(state.score);
        if (timeEl) timeEl.textContent = this.time.toFixed(1);
        if (comboEl) comboEl.textContent = `x${state.combo}`;
    }

    /**
     * Render game
     */
    render() {
        const ctx = this.ctx;
        const w = this.config.canvas.width;
        const h = this.config.canvas.height;

        // Clear canvas
        ctx.fillStyle = this.config.canvas.defaultBgColor;
        ctx.fillRect(0, 0, w, h);

        // Render grid
        this.renderGrid();

        // Render particles
        this.particles.render(ctx);

        // Render obstacles
        this.obstacles.forEach(obs => {
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y, obs.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Render power-ups
        this.powerUps.forEach(pu => {
            ctx.fillStyle = pu.color;
            ctx.beginPath();
            ctx.arc(pu.x, pu.y, 15, 0, Math.PI * 2);
            ctx.fill();
        });

        // Render player
        this.player.render(ctx);
    }

    /**
     * Render grid
     */
    renderGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = `rgba(138, 43, 226, ${this.config.visual.gridOpacity})`;
        ctx.lineWidth = 1;

        for (let x = 0; x < this.config.canvas.width; x += this.config.visual.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.config.canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < this.config.canvas.height; y += this.config.visual.gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.config.canvas.width, y);
            ctx.stroke();
        }
    }

    /**
     * Start spawn timers
     */
    startTimers() {
        this.obstacleTimer = setInterval(() => this.spawnObstacle(), this.config.spawning.obstacleRate);
        this.powerUpTimer = setInterval(() => this.spawnPowerUp(), this.config.spawning.powerUpRate);
    }

    /**
     * Stop spawn timers
     */
    stopTimers() {
        if (this.obstacleTimer) clearInterval(this.obstacleTimer);
        if (this.powerUpTimer) clearInterval(this.powerUpTimer);
    }

    /**
     * Spawn obstacle
     */
    spawnObstacle() {
        if (!this.running || this.paused) return;
        if (this.obstacles.length >= this.config.spawning.maxObstacles) return;

        const side = Math.floor(Math.random() * 4);
        let x, y;

        switch (side) {
            case 0: x = Math.random() * this.config.canvas.width; y = -30; break;
            case 1: x = this.config.canvas.width + 30; y = Math.random() * this.config.canvas.height; break;
            case 2: x = Math.random() * this.config.canvas.width; y = this.config.canvas.height + 30; break;
            case 3: x = -30; y = Math.random() * this.config.canvas.height; break;
        }

        this.obstacles.push({ x, y, radius: 20, speed: 2 });
    }

    /**
     * Spawn power-up
     */
    spawnPowerUp() {
        if (!this.running || this.paused) return;
        if (this.powerUps.length >= this.config.spawning.maxPowerUps) return;

        const types = ['shield', 'speed', 'time', 'magnet'];
        const colors = ['#00ffaa', '#ffff00', '#00ffff', '#ff00ff'];
        const type = Utils.randomElement(types);

        this.powerUps.push({
            x: Utils.random(50, this.config.canvas.width - 50),
            y: Utils.random(50, this.config.canvas.height - 50),
            type,
            color: colors[types.indexOf(type)]
        });
    }

    /**
     * Toggle pause
     */
    togglePause() {
        this.paused = !this.paused;
        const pauseMenu = document.getElementById('pause-menu');
        if (pauseMenu) {
            pauseMenu.classList.toggle('active', this.paused);
        }
    }

    /**
     * Game over
     */
    gameOver() {
        this.running = false;
        this.stopTimers();

        AudioManager.playSound('explosion');
        this.particles.createExplosion(this.player.x, this.player.y, '#ff0055', 30);

        // Save result
        const state = this.player.getState();
        const result = Storage.saveGameResult({
            mode: this.mode,
            score: state.score,
            time: Math.floor((Date.now() - this.startTime) / 1000),
            powerUpsCollected: 0,
            combo: state.combo,
            rank: this.getRank(state.score)
        });

        // Record in global stats
        StatsTracker.recordGame(state.score);

        // Show game over screen
        setTimeout(() => this.showGameOver(result, state), 500);
    }

    /**
     * Show game over screen
     */
    showGameOver(result, state) {
        const screen = document.getElementById('game-over-screen');
        if (screen) {
            screen.classList.add('active');
            
            document.getElementById('final-score').textContent = Utils.formatNumber(state.score);
            document.getElementById('final-rank').textContent = this.getRank(state.score);
            document.getElementById('final-combo').textContent = `x${state.combo}`;
        }
    }

    /**
     * Get rank based on score
     */
    getRank(score) {
        if (score >= 200000) return 'Transcendent';
        if (score >= 100000) return 'Quantum Master';
        if (score >= 50000) return 'Expert Pilot';
        if (score >= 10000) return 'Apprentice';
        return 'Novice';
    }

    /**
     * Stop game
     */
    stop() {
        this.running = false;
        this.stopTimers();
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameCore;
}
