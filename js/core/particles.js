/**
 * QUANTUM TRAIL - PARTICLE SYSTEM
 * Handles all particle effects
 */

class ParticleSystem {
    constructor(config) {
        this.particles = [];
        this.config = config;
    }

    /**
     * Create explosion particles
     */
    createExplosion(x, y, color = '#00ffff', count = null) {
        const particleCount = count || this.config.visual.particleCount;

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Utils.random(
                this.config.visual.particleSpeed.min,
                this.config.visual.particleSpeed.max
            );

            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: this.config.visual.particleLife,
                maxLife: this.config.visual.particleLife,
                alpha: 1,
                radius: 4
            });
        }
    }

    /**
     * Create trail particles
     */
    createTrailParticles(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x + Utils.random(-5, 5),
                y: y + Utils.random(-5, 5),
                vx: Utils.random(-1, 1),
                vy: Utils.random(-1, 1),
                color: '#00ffff',
                life: 20,
                maxLife: 20,
                alpha: 0.6,
                radius: 3
            });
        }
    }

    /**
     * Create collect particles
     */
    createCollectEffect(x, y, color) {
        for (let i = 0; i < 15; i++) {
            const angle = Utils.random(0, Math.PI * 2);
            const speed = Utils.random(1, 4);

            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 25,
                maxLife: 25,
                alpha: 1,
                radius: 5
            });
        }
    }

    /**
     * Create score popup
     */
    createScorePopup(x, y, score) {
        this.particles.push({
            x, y,
            vx: 0,
            vy: -2,
            text: `+${Utils.formatNumber(score)}`,
            color: '#ffff00',
            life: 30,
            maxLife: 30,
            alpha: 1,
            isText: true
        });
    }

    /**
     * Update all particles
     */
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.life--;
            p.x += p.vx;
            p.y += p.vy;
            p.alpha = p.life / p.maxLife;

            // Apply gravity for some particles
            if (!p.isText) {
                p.vy += 0.1;
            }

            // Remove dead particles
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Render all particles
     */
    render(ctx) {
        this.particles.forEach(p => {
            if (p.isText) {
                // Render text particle
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.font = 'bold 24px Orbitron';
                ctx.textAlign = 'center';
                ctx.fillText(p.text, p.x, p.y);
                ctx.restore();
            } else {
                // Render circle particle
                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        });
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }

    /**
     * Get particle count
     */
    getCount() {
        return this.particles.length;
    }
}

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ParticleSystem;
}
