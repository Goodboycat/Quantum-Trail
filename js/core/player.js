/**
 * QUANTUM TRAIL - PLAYER CONTROLLER
 * Handles player movement, state, and rendering
 */

class PlayerController {
    constructor(config) {
        this.x = config.player.startX;
        this.y = config.player.startY;
        this.radius = config.player.radius;
        this.speed = config.player.defaultSpeed;
        this.direction = { x: 1, y: 0 };
        this.trail = [];
        this.score = 0;
        this.combo = 1;
        this.powerUps = new Map();
        this.isInvincible = false;
        this.config = config;
    }

    /**
     * Update player position
     */
    update(keys) {
        // Handle input
        if (keys.has('arrowup') || keys.has('w')) {
            this.direction = { x: 0, y: -1 };
        } else if (keys.has('arrowdown') || keys.has('s')) {
            this.direction = { x: 0, y: 1 };
        } else if (keys.has('arrowleft') || keys.has('a')) {
            this.direction = { x: -1, y: 0 };
        } else if (keys.has('arrowright') || keys.has('d')) {
            this.direction = { x: 1, y: 0 };
        }

        // Apply speed boost if active
        const currentSpeed = this.powerUps.has('speed') ? 
            this.config.player.boostedSpeed : 
            this.config.player.defaultSpeed;

        // Update position
        this.x += this.direction.x * currentSpeed;
        this.y += this.direction.y * currentSpeed;

        // Update trail
        this.updateTrail();
    }

    /**
     * Update trail
     */
    updateTrail() {
        const lastPoint = this.trail[this.trail.length - 1];
        const minDistance = this.config.trail.minDistance;

        if (!lastPoint || 
            Utils.distance(this.x, this.y, lastPoint.x, lastPoint.y) > minDistance) {
            this.trail.push({ x: this.x, y: this.y });

            if (this.trail.length > this.config.trail.length) {
                this.trail.shift();
            }
        }
    }

    /**
     * Activate power-up
     */
    activatePowerUp(type, duration) {
        this.powerUps.set(type, Date.now() + duration);

        // Apply immediate effects
        switch (type) {
            case 'shield':
                this.isInvincible = true;
                break;
            case 'speed':
                // Speed handled in update
                break;
            case 'time':
                // Time handled by game engine
                break;
            case 'magnet':
                // Magnet handled by game engine
                break;
        }
    }

    /**
     * Update power-ups (check expiration)
     */
    updatePowerUps() {
        const now = Date.now();
        const expired = [];

        this.powerUps.forEach((expireTime, type) => {
            if (now >= expireTime) {
                expired.push(type);
            }
        });

        expired.forEach(type => {
            this.powerUps.delete(type);
            
            if (type === 'shield') {
                this.isInvincible = false;
            }
        });
    }

    /**
     * Check if looking at trail (for scoring)
     */
    isLookingAtTrail() {
        if (this.trail.length < 20) return false;

        const lookAhead = 100;
        const lookX = this.x + this.direction.x * lookAhead;
        const lookY = this.y + this.direction.y * lookAhead;

        for (let i = 0; i < this.trail.length - 20; i++) {
            const segment = this.trail[i];
            if (Utils.distance(lookX, lookY, segment.x, segment.y) < 30) {
                return true;
            }
        }

        return false;
    }

    /**
     * Add score
     */
    addScore(amount) {
        this.score += amount * this.combo;
        
        // Increase combo
        if (this.combo < this.config.gameplay.maxCombo) {
            this.combo += this.config.gameplay.comboIncrement;
        }
    }

    /**
     * Reset combo
     */
    resetCombo() {
        this.combo = 1;
    }

    /**
     * Check collision with trail
     */
    checkSelfCollision() {
        if (this.trail.length < 10) return false;
        if (this.isInvincible) return false;

        for (let i = 0; i < this.trail.length - 10; i++) {
            const segment = this.trail[i];
            if (Utils.distance(this.x, this.y, segment.x, segment.y) < this.radius) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check collision with walls
     */
    checkWallCollision(width, height) {
        if (this.isInvincible) return false;

        return this.x < this.radius || 
               this.x > width - this.radius ||
               this.y < this.radius || 
               this.y > height - this.radius;
    }

    /**
     * Render player
     */
    render(ctx) {
        // Render trail first
        this.renderTrail(ctx);

        // Render player
        ctx.fillStyle = this.isInvincible ? '#ff5555' : '#00ffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = this.isInvincible ? '#ff5555' : '#00ffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Render shield effect if active
        if (this.powerUps.has('shield')) {
            ctx.strokeStyle = '#00ffaa';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    /**
     * Render trail
     */
    renderTrail(ctx) {
        this.trail.forEach((point, i) => {
            const alpha = (i / this.trail.length) * this.config.trail.maxOpacity;
            const size = this.config.trail.minSize + 
                        (i / this.trail.length) * 
                        (this.config.trail.maxSize - this.config.trail.minSize);

            ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    /**
     * Reset player
     */
    reset(config) {
        this.x = config.player.startX;
        this.y = config.player.startY;
        this.direction = { x: 1, y: 0 };
        this.trail = [];
        this.score = 0;
        this.combo = 1;
        this.powerUps.clear();
        this.isInvincible = false;
    }

    /**
     * Get state for serialization
     */
    getState() {
        return {
            x: this.x,
            y: this.y,
            score: Math.floor(this.score),
            combo: Math.floor(this.combo),
            powerUps: Array.from(this.powerUps.entries()),
            trailLength: this.trail.length
        };
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlayerController;
}
