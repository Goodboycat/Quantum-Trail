/**
 * QUANTUM TRAIL - GAME ENGINE
 * Core game logic and rendering
 */

class GameEngine {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.running = false;
        this.paused = false;
        this.mode = 'classic';
        
        // Game state
        this.state = {
            player: {
                x: 400,
                y: 400,
                radius: 12,
                speed: 4,
                direction: { x: 1, y: 0 },
                trail: [],
                score: 0,
                combo: 1,
                powerUps: [],
                isInvincible: false
            },
            obstacles: [],
            powerUps: [],
            particles: [],
            time: 8.0,
            startTime: Date.now()
        };
        
        // Configuration
        this.config = {
            canvasWidth: 800,
            canvasHeight: 800,
            trailLength: 60,
            maxObstacles: 10,
            maxPowerUps: 3,
            obstacleSpawnRate: 3000,
            powerUpSpawnRate: 5000
        };
        
        // Input
        this.keys = new Set();
        this.lastDirection = null;
    }

    /**
     * Start game with specific mode
     */
    startMode(mode) {
        this.mode = mode;
        this.init();
        this.start();
    }

    /**
     * Initialize game
     */
    init() {
        // Show game area
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('game-area').style.display = 'flex';
        
        // Get canvas
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Reset state
        this.resetState();
        
        // Setup input
        this.setupInput();
        
        // Setup HUD
        this.updateHUD();
        
        // Initialize audio
        AudioManager.init();
    }

    /**
     * Reset game state
     */
    resetState() {
        this.state = {
            player: {
                x: this.config.canvasWidth / 2,
                y: this.config.canvasHeight / 2,
                radius: 12,
                speed: 4,
                direction: { x: 1, y: 0 },
                trail: [],
                score: 0,
                combo: 1,
                powerUps: [],
                isInvincible: false
            },
            obstacles: [],
            powerUps: [],
            particles: [],
            time: this.mode === 'time-attack' ? 120 : 8.0,
            startTime: Date.now()
        };
    }

    /**
     * Setup input handlers
     */
    setupInput() {
        // Remove old listeners
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
        
        // Add new listeners
        this.handleKeyDown = (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
                e.preventDefault();
                this.keys.add(e.key.toLowerCase());
            }
            if (e.key === 'Escape' && this.running) {
                this.pause();
            }
        };
        
        this.handleKeyUp = (e) => {
            this.keys.delete(e.key.toLowerCase());
        };
        
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    /**
     * Start game loop
     */
    start() {
        this.running = true;
        this.paused = false;
        
        // Start timers
        this.startTimers();
        
        // Start game loop
        this.gameLoop();
    }

    /**
     * Game loop
     */
    gameLoop() {
        if (!this.running) return;
        
        if (!this.paused) {
            this.update();
            this.render();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Update game logic
     */
    update() {
        this.updatePlayer();
        this.updateTrail();
        this.updateObstacles();
        this.updatePowerUps();
        this.updateParticles();
        this.checkCollisions();
        this.updateTimer();
        this.updateHUD();
    }

    /**
     * Update player
     */
    updatePlayer() {
        const player = this.state.player;
        
        // Handle input
        if (this.keys.has('arrowup') || this.keys.has('w')) {
            player.direction = { x: 0, y: -1 };
            this.lastDirection = 'up';
        } else if (this.keys.has('arrowdown') || this.keys.has('s')) {
            player.direction = { x: 0, y: 1 };
            this.lastDirection = 'down';
        } else if (this.keys.has('arrowleft') || this.keys.has('a')) {
            player.direction = { x: -1, y: 0 };
            this.lastDirection = 'left';
        } else if (this.keys.has('arrowright') || this.keys.has('d')) {
            player.direction = { x: 1, y: 0 };
            this.lastDirection = 'right';
        }
        
        // Update position
        player.x += player.direction.x * player.speed;
        player.y += player.direction.y * player.speed;
        
        // Add trail
        if (player.trail.length === 0 || 
            Utils.distance(player.x, player.y, 
                player.trail[player.trail.length - 1].x,
                player.trail[player.trail.length - 1].y) > 10) {
            player.trail.push({ x: player.x, y: player.y });
            
            if (player.trail.length > this.config.trailLength) {
                player.trail.shift();
            }
        }
    }

    /**
     * Update trail (scoring logic)
     */
    updateTrail() {
        const player = this.state.player;
        
        // Check if looking at trail (scoring)
        if (player.trail.length > 10) {
            const isScoring = this.checkTrailIntersection();
            
            if (isScoring) {
                player.score += 25 * player.combo;
                this.state.time = Math.min(this.mode === 'time-attack' ? 120 : 8, this.state.time + 0.1);
                
                // Increase combo
                if (player.combo < 50) {
                    player.combo += 0.1;
                }
            }
        }
    }

    /**
     * Check trail intersection
     */
    checkTrailIntersection() {
        const player = this.state.player;
        const lookAhead = 100;
        const lookX = player.x + player.direction.x * lookAhead;
        const lookY = player.y + player.direction.y * lookAhead;
        
        for (let i = 0; i < player.trail.length - 20; i++) {
            const segment = player.trail[i];
            if (Utils.distance(lookX, lookY, segment.x, segment.y) < 30) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Update obstacles
     */
    updateObstacles() {
        this.state.obstacles.forEach((obstacle, index) => {
            // Move toward center
            const centerX = this.config.canvasWidth / 2;
            const centerY = this.config.canvasHeight / 2;
            const angle = Math.atan2(centerY - obstacle.y, centerX - obstacle.x);
            
            obstacle.x += Math.cos(angle) * obstacle.speed;
            obstacle.y += Math.sin(angle) * obstacle.speed;
            
            // Remove if off screen or at center
            if (obstacle.x < -50 || obstacle.x > this.config.canvasWidth + 50 ||
                obstacle.y < -50 || obstacle.y > this.config.canvasHeight + 50) {
                this.state.obstacles.splice(index, 1);
            }
        });
    }

    /**
     * Update power-ups
     */
    updatePowerUps() {
        const player = this.state.player;
        
        this.state.powerUps.forEach((powerUp, index) => {
            // Check collection
            if (Utils.distance(player.x, player.y, powerUp.x, powerUp.y) < 25) {
                this.collectPowerUp(powerUp);
                this.state.powerUps.splice(index, 1);
            }
        });
    }

    /**
     * Update particles
     */
    updateParticles() {
        this.state.particles.forEach((particle, index) => {
            particle.life--;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha = particle.life / particle.maxLife;
            
            if (particle.life <= 0) {
                this.state.particles.splice(index, 1);
            }
        });
    }

    /**
     * Check collisions
     */
    checkCollisions() {
        const player = this.state.player;
        
        // Wall collision
        if (player.x < player.radius || player.x > this.config.canvasWidth - player.radius ||
            player.y < player.radius || player.y > this.config.canvasHeight - player.radius) {
            if (!player.isInvincible) {
                this.gameOver();
            }
        }
        
        // Self collision
        for (let i = 0; i < player.trail.length - 10; i++) {
            if (Utils.distance(player.x, player.y, player.trail[i].x, player.trail[i].y) < player.radius) {
                if (!player.isInvincible) {
                    this.gameOver();
                }
            }
        }
        
        // Obstacle collision
        this.state.obstacles.forEach(obstacle => {
            if (Utils.distance(player.x, player.y, obstacle.x, obstacle.y) < player.radius + obstacle.radius) {
                if (!player.isInvincible) {
                    this.gameOver();
                }
            }
        });
    }

    /**
     * Update timer
     */
    updateTimer() {
        if (this.mode !== 'zen') {
            this.state.time -= 0.016; // ~60fps
            
            if (this.state.time <= 0) {
                this.gameOver();
            }
        }
    }

    /**
     * Update HUD
     */
    updateHUD() {
        const player = this.state.player;
        
        document.getElementById('hud-score').textContent = Utils.formatNumber(Math.floor(player.score));
        document.getElementById('hud-time').textContent = this.state.time.toFixed(1);
        document.getElementById('hud-combo').textContent = `x${Math.floor(player.combo)}`;
    }

    /**
     * Collect power-up
     */
    collectPowerUp(powerUp) {
        AudioManager.playSound('collect');
        
        // Apply power-up effect
        switch (powerUp.type) {
            case 'shield':
                this.state.player.isInvincible = true;
                setTimeout(() => this.state.player.isInvincible = false, 10000);
                break;
            case 'speed':
                this.state.player.speed = 7;
                setTimeout(() => this.state.player.speed = 4, 10000);
                break;
            case 'time':
                this.state.time = Math.min(this.mode === 'time-attack' ? 120 : 8, this.state.time + 2);
                break;
            case 'magnet':
                // TODO: Implement magnet effect
                break;
        }
        
        // Create particles
        this.createParticles(powerUp.x, powerUp.y, 10, powerUp.color);
    }

    /**
     * Create particles
     */
    createParticles(x, y, count, color) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.random(2, 5);
            
            this.state.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 30,
                maxLife: 30,
                alpha: 1
            });
        }
    }

    /**
     * Spawn obstacle
     */
    spawnObstacle() {
        if (!this.running || this.paused) return;
        if (this.state.obstacles.length >= this.config.maxObstacles) return;
        
        // Random spawn position on edge
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch (side) {
            case 0: x = Math.random() * this.config.canvasWidth; y = -30; break;
            case 1: x = this.config.canvasWidth + 30; y = Math.random() * this.config.canvasHeight; break;
            case 2: x = Math.random() * this.config.canvasWidth; y = this.config.canvasHeight + 30; break;
            case 3: x = -30; y = Math.random() * this.config.canvasHeight; break;
        }
        
        this.state.obstacles.push({
            x, y,
            radius: 20,
            speed: 2,
            type: Utils.randomElement(['pulse', 'spin', 'bounce'])
        });
    }

    /**
     * Spawn power-up
     */
    spawnPowerUp() {
        if (!this.running || this.paused) return;
        if (this.state.powerUps.length >= this.config.maxPowerUps) return;
        
        const types = ['shield', 'speed', 'time', 'magnet'];
        const colors = ['#00ffaa', '#ffff00', '#00ffff', '#ff00ff'];
        const type = Utils.randomElement(types);
        
        this.state.powerUps.push({
            x: Utils.random(50, this.config.canvasWidth - 50),
            y: Utils.random(50, this.config.canvasHeight - 50),
            type,
            color: colors[types.indexOf(type)],
            radius: 15
        });
    }

    /**
     * Start timers
     */
    startTimers() {
        // Obstacle spawning
        this.obstacleTimer = setInterval(() => this.spawnObstacle(), this.config.obstacleSpawnRate);
        
        // Power-up spawning
        this.powerUpTimer = setInterval(() => this.spawnPowerUp(), this.config.powerUpSpawnRate);
    }

    /**
     * Stop timers
     */
    stopTimers() {
        clearInterval(this.obstacleTimer);
        clearInterval(this.powerUpTimer);
    }

    /**
     * Pause game
     */
    pause() {
        this.paused = true;
        document.getElementById('pause-menu').classList.add('active');
    }

    /**
     * Resume game
     */
    resume() {
        this.paused = false;
        document.getElementById('pause-menu').classList.remove('active');
    }

    /**
     * Restart game
     */
    restart() {
        this.stop();
        this.init();
        this.start();
    }

    /**
     * Quit to menu
     */
    quit() {
        this.stop();
        document.getElementById('game-area').style.display = 'none';
        document.getElementById('mode-selection').style.display = 'block';
        App.navigateTo('play');
    }

    /**
     * Game over
     */
    gameOver() {
        this.running = false;
        this.stopTimers();
        
        AudioManager.playSound('explosion');
        
        // Save result
        const result = Storage.saveGameResult({
            mode: this.mode,
            score: Math.floor(this.state.player.score),
            time: Math.floor((Date.now() - this.state.startTime) / 1000),
            powerUpsCollected: 0, // TODO: Track this
            combo: Math.floor(this.state.player.combo),
            rank: this.getRank(this.state.player.score)
        });
        
        // Show game over screen
        this.showGameOverScreen(result);
        
        // Check achievements
        AchievementSystem.checkProgress('score', Math.floor(this.state.player.score));
        AchievementSystem.checkProgress('games_played', Storage.getStats().totalGames);
        AchievementSystem.checkProgress('combo', Math.floor(this.state.player.combo));
    }

    /**
     * Show game over screen
     */
    showGameOverScreen(result) {
        const screen = document.getElementById('game-over-screen');
        screen.classList.add('active');
        
        document.getElementById('final-score').textContent = Utils.formatNumber(Math.floor(this.state.player.score));
        document.getElementById('final-rank').textContent = this.getRank(this.state.player.score);
        document.getElementById('final-combo').textContent = `x${Math.floor(this.state.player.combo)}`;
        
        if (result.leveledUp) {
            Utils.notify(`Level Up! Now level ${result.newLevel}! +${result.coinsEarned} coins`, 'success');
        }
    }

    /**
     * Get rank based on score
     */
    getRank(score) {
        if (score >= 200000) return 'Transcendent';
        if (score >= 150000) return 'Beyond Infinity';
        if (score >= 100000) return 'Quantum Master';
        if (score >= 75000) return 'Master Navigator';
        if (score >= 50000) return 'Expert Pilot';
        if (score >= 25000) return 'Adept Navigator';
        if (score >= 10000) return 'Apprentice Looper';
        if (score >= 5000) return 'Rising Star';
        return 'Novice';
    }

    /**
     * Stop game
     */
    stop() {
        this.running = false;
        this.stopTimers();
        
        // Hide screens
        document.getElementById('pause-menu').classList.remove('active');
        document.getElementById('game-over-screen').classList.remove('active');
    }

    /**
     * Render game
     */
    render() {
        const ctx = this.ctx;
        const width = this.config.canvasWidth;
        const height = this.config.canvasHeight;
        
        // Clear canvas
        ctx.fillStyle = '#050a1a';
        ctx.fillRect(0, 0, width, height);
        
        // Render grid
        this.renderGrid();
        
        // Render trail
        this.renderTrail();
        
        // Render obstacles
        this.renderObstacles();
        
        // Render power-ups
        this.renderPowerUps();
        
        // Render player
        this.renderPlayer();
        
        // Render particles
        this.renderParticles();
    }

    /**
     * Render grid
     */
    renderGrid() {
        const ctx = this.ctx;
        ctx.strokeStyle = 'rgba(138, 43, 226, 0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < this.config.canvasWidth; x += 50) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.config.canvasHeight);
            ctx.stroke();
        }
        
        for (let y = 0; y < this.config.canvasHeight; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.config.canvasWidth, y);
            ctx.stroke();
        }
    }

    /**
     * Render trail
     */
    renderTrail() {
        const ctx = this.ctx;
        const trail = this.state.player.trail;
        
        trail.forEach((point, i) => {
            const alpha = (i / trail.length) * 0.8;
            const size = 8 + (i / trail.length) * 8;
            
            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Render obstacles
     */
    renderObstacles() {
        const ctx = this.ctx;
        
        this.state.obstacles.forEach(obstacle => {
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = '#ff0055';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    /**
     * Render power-ups
     */
    renderPowerUps() {
        const ctx = this.ctx;
        
        this.state.powerUps.forEach(powerUp => {
            ctx.fillStyle = powerUp.color;
            ctx.beginPath();
            ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.strokeStyle = powerUp.color;
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    /**
     * Render player
     */
    renderPlayer() {
        const ctx = this.ctx;
        const player = this.state.player;
        
        ctx.fillStyle = player.isInvincible ? '#ff5555' : '#00ffff';
        ctx.beginPath();
        ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = player.isInvincible ? '#ff5555' : '#00ffff';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    /**
     * Render particles
     */
    renderParticles() {
        const ctx = this.ctx;
        
        this.state.particles.forEach(particle => {
            ctx.fillStyle = particle.color + Math.floor(particle.alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

// Create global game engine
window.Game = new GameEngine();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameEngine;
}
